import React from "react";
import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../../../hooks/useAxios";
import { RiEditLine } from "react-icons/ri";
import { IoMdSkipBackward } from "react-icons/io";
import Swal from "sweetalert2";
import { MdOutlineViewInAr } from "react-icons/md";

const ViewRooms = () => {
  const { id } = useParams();
  const axiosInstance = useAxios();

  const {
    data: rooms = [],
    isLoading,
    isError,
    refetch,
    error,
  } = useQuery({
    queryKey: ["variant-rooms", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/rooms/variant/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-rose-800"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-3xl mx-auto mt-10">
        <div className="alert alert-error">
          <span>{error?.message || "Failed to load rooms."}</span>
        </div>
      </div>
    );
  }

  const changeStatus = async (roomId, status) => {
    const res = await axiosInstance.patch(`/rooms/${roomId}`, {
      roomStatus: status,
    });

    if (res.data.modifiedCount > 0) {
      await Swal.fire({
        title: "Status Updated!",
        text: `Room status changed to ${status}.`,
        icon: "success",
        confirmButtonColor: "#BF1E2E",
      });

      refetch();
    } else {
      Swal.fire({
        title: "No Changes Made",
        text: "The room already has this status.",
        icon: "info",
        confirmButtonColor: "#BF1E2E",
      });
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-5 justify-center items-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <MdOutlineViewInAr className="text-2xl text-rose-400" />
            </div>
            <h1 className="text-xl font-bold text-rose-400">View Rooms</h1>
          </div>
          <Link to="/dashboard/rooms/room_status">
            <button className="flex items-center justify-center w-11 h-11 border border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white rounded-lg transition-colors">
              <IoMdSkipBackward className="text-xl" />
            </button>
          </Link>
        </div>

        <p className="text-gray-500 mt-1">
          Rooms belonging to this room variant
        </p>
      </div>

      {/* No Rooms */}
      {rooms.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-10 text-center">
          <p className="text-gray-500">No rooms found for this variant.</p>
        </div>
      ) : (
        /* Room Cards */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => {
            const status = room.roomStatus;

            let statusClass = "bg-gray-100 text-gray-700 border-gray-300";

            if (status === "Available") {
              statusClass = "bg-green-400 text-white border-green-200";
            } else if (status === "Maintenance") {
              statusClass = "bg-red-700 text-white border-red-200";
            } else if (status === "In Progress") {
              statusClass = "bg-violet-500 text-white border-yellow-200";
            } else if (status === "Occupied") {
              statusClass = "bg-orange-900 text-white border-blue-200";
            } else if (status === "Reserved") {
              statusClass = "bg-blue-900 text-white border-purple-200";
            }

            return (
              <div
                key={room._id}
                className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition duration-300"
              >
                {/* Image */}
                <img
                  src={room.image}
                  alt={room.variantName}
                  className="w-full h-52 object-cover"
                />

                {/* Content */}
                <div className="p-5">
                  {/* Room Number + Status */}
                  <div className="flex justify-between items-center gap-3 mb-5">
                    <h2 className="text-xl font-bold text-rose-800">
                      Room : {room.roomNo}
                    </h2>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold border whitespace-nowrap ${statusClass}`}
                    >
                      {status}
                    </span>
                  </div>

                  {/* Room Information */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Room Type</span>

                      <span className="font-semibold text-gray-800 text-right">
                        {room.variantName}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Base Type</span>

                      <span className="font-semibold text-gray-800">
                        {room.baseRoomType}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Bed</span>

                      <span className="font-semibold text-gray-800">
                        {room.bedType}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">Occupancy</span>

                      <span className="font-semibold text-gray-800">
                        {room.maxOccupancy} Persons
                      </span>
                    </div>
                  </div>

                  {/* Edit Button */}
                  <div className="flex justify-center mt-6">
                    <select
                      defaultValue={room.roomStatus}
                      onChange={(e) => changeStatus(room._id, e.target.value)}
                      className="select select-bordered bg-white"
                    >
                      <option value="Available">Available</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Occupied">Occupied</option>
                      <option value="Reserved">Reserved</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ViewRooms;
