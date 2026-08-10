import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../../hooks/useAxios";
import { Link } from "react-router";
import { RiHome3Line, RiAddLine } from "react-icons/ri";
import Swal from "sweetalert2";
import { AiFillEdit } from "react-icons/ai";
import { FaHistory } from "react-icons/fa";

const Maintenance = () => {
  const axiosInstance = useAxios();

  const {
    data: rooms = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const res = await axiosInstance.get("/rooms/maintenance");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-[#BF1E2E]"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-error py-10">
        <p>Failed to load rooms.</p>
        <p className="text-sm">{error?.message}</p>
        <button onClick={() => refetch()} className="btn btn-sm mt-3">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-row sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex flex-col gap-5">
          <h1 className="text-lg font-bold text-[#BF1E2E]">Maintain Rooms</h1>
          <p className="text-gray-500">List of under maintenance room/s</p>
        </div>
        <div className="flex flex-row gap-3">
          <Link to="/dashboard/rooms/maintenance_history">
            <button className="btn btn-outline btn-secondary">
              <FaHistory className="text-2xl" />
            </button>
          </Link>
          <Link to="/dashboard/rooms">
            <button className="btn btn-outline btn-secondary">
              <RiHome3Line className="text-2xl" />
            </button>
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-[#BF1E2E] text-white">
            <tr className="text-center">
              <th>#</th>
              <th>Image</th>
              <th>Room No</th>
              <th>Name</th>
              <th>Type</th>
              <th>Floor</th>
              <th>Bed</th>
              <th>Capacity</th>
              <th>Price/Night</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {rooms.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center py-10 text-gray-500">
                  No rooms under maintenance.
                </td>
              </tr>
            ) : (
              rooms.map((room, index) => (
                <tr key={room._id} className="hover text-center bg-white">
                  <td>{index + 1}</td>

                  <td>
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img
                          src={
                            room.Image ||
                            "https://via.placeholder.com/150?text=No+Image"
                          }
                          alt={room.RoomName}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="font-semibold">{room.RoomNumber}</td>
                  <td>{room.RoomName}</td>
                  <td>{room.RoomType}</td>
                  <td>{room.Floor || "-"}</td>
                  <td>{room.BedType}</td>
                  <td>{room.Capacity || "-"}</td>
                  <td className="font-medium">${room.PricePerNight}</td>

                  <td>
                    <span className="badge badge-ghost bg-rose-800 text-white h-full">
                      {room.RoomStatus}
                    </span>
                  </td>

                  <td>
                    <div className="flex gap-2">
                      <Link
                        to={`/dashboard/rooms/edit_maintenance/${room._id}`}
                      >
                        <button className="btn btn-accent text-lg text-white rounded-lg bg-rose-800">
                          <AiFillEdit />
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Maintenance;
