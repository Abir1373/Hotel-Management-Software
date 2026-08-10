import React from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../../../hooks/useAxios";
import { RiHome3Line } from "react-icons/ri";
import Swal from "sweetalert2";

const EditMaintenance = () => {
  const { id } = useParams();
  const axiosInstance = useAxios();

  const {
    data: room,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["maintenance-room", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/rooms/maintenance/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    values: {
      RoomStatus: room?.RoomStatus || "Maintenance",
      WorkBegins: room?.WorkBegins || "",
      WorkEnds: room?.WorkEnds || "",
      AssignedPerson: room?.AssignedPerson || "",
      AssignedPersonNumber: room?.AssignedPersonNumber || "",
      MaintenanceCost: room?.MaintenanceCost || "",
    },
  });

  const onSubmit = async (data) => {
    if (data.RoomStatus === "Available") {
      const management_res = await axiosInstance.post("/maintenance-history", {
        ...data,
        roomID: { id },
      });

      if (management_res.data.acknowledged) {
        const room_res = await axiosInstance.patch(`/rooms/${id}`, {
          RoomStatus: "Available",
          WorkBegins: null,
          WorkEnds: null,
          AssignedPerson: null,
          AssignedPersonNumber: null,
          MaintenanceCost: null,
        });

        if (room_res.data.modifiedCount > 0) {
          Swal.fire({
            title: "Updated Successfully!",
            icon: "success",
            confirmButtonColor: "#BF1E2E",
          });
        }
      }
    } else {
      const res = await axiosInstance.patch(`/rooms/${id}`, data);

      if (res.data.modifiedCount > 0) {
        Swal.fire({
          title: "Updated Successfully!",
          icon: "success",
          confirmButtonColor: "#BF1E2E",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="alert alert-error max-w-2xl mx-auto mt-10">
        <span>{error?.message || "Failed to load room."}</span>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="alert alert-warning max-w-2xl mx-auto mt-10">
        <span>Room not found.</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-lg font-bold text-[#BF1E2E]">
            Edit Room Maintenance
          </h1>
          <p className="text-gray-500 mt-1">
            Room #{room.RoomNumber} — {room.RoomName}
          </p>
        </div>
        <Link to="/dashboard/rooms">
          <button className="btn btn-outline btn-secondary">
            <RiHome3Line className="text-2xl" />
          </button>
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Room Image */}
        <div className="card shadow-xl mb-6">
          <div className="card-body">
            <img
              src={room.Image}
              alt={room.RoomName}
              className="w-full h-72 object-cover rounded-xl"
            />
          </div>
        </div>

        {/* Form Fields */}
        <div className="card shadow-xl">
          <div className="card-body space-y-5">
            {/* Room Status */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Room Status *</span>
              </label>
              <select
                {...register("RoomStatus", {
                  required: "Room status is required",
                })}
                className="select select-bordered w-full bg-white"
              >
                <option value="Maintenance">Maintenance</option>
                <option value="In Progress">In Progress</option>
                <option value="Available">Available</option>
              </select>
              {errors.RoomStatus && (
                <p className="text-error text-sm mt-1">
                  {errors.RoomStatus.message}
                </p>
              )}
            </div>

            {/* Work Begins */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Work Begins *</span>
              </label>
              <input
                type="datetime-local"
                {...register("WorkBegins", {
                  required: "Work begins is required",
                })}
                className="input input-bordered w-full bg-white"
              />
              {errors.WorkBegins && (
                <p className="text-error text-sm mt-1">
                  {errors.WorkBegins.message}
                </p>
              )}
            </div>

            {/* Work Ends */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Work Ends *</span>
              </label>
              <input
                type="datetime-local"
                {...register("WorkEnds", {
                  required: "Work ends is required",
                })}
                className="input input-bordered w-full bg-white"
              />
              {errors.WorkEnds && (
                <p className="text-error text-sm mt-1">
                  {errors.WorkEnds.message}
                </p>
              )}
            </div>

            {/* Assigned Person */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Assigned Person *
                </span>
              </label>
              <input
                type="text"
                placeholder="Enter name"
                {...register("AssignedPerson", {
                  required: "Assigned person is required",
                })}
                className="input input-bordered w-full bg-white"
              />
              {errors.AssignedPerson && (
                <p className="text-error text-sm mt-1">
                  {errors.AssignedPerson.message}
                </p>
              )}
            </div>

            {/* Assigned Person Number */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Assigned Person Number *
                </span>
              </label>
              <input
                type="tel"
                placeholder="Enter phone number"
                {...register("AssignedPersonNumber", {
                  required: "Phone number is required",
                })}
                className="input input-bordered w-full bg-white"
              />
              {errors.AssignedPersonNumber && (
                <p className="text-error text-sm mt-1">
                  {errors.AssignedPersonNumber.message}
                </p>
              )}
            </div>

            {/* Maintenance Cost */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Maintenance Cost *
                </span>
              </label>
              <input
                type="number"
                placeholder="Enter cost"
                {...register("MaintenanceCost", {
                  required: "Maintenance cost is required",
                  min: { value: 0, message: "Cost cannot be negative" },
                })}
                className="input input-bordered w-full bg-white"
              />
              {errors.MaintenanceCost && (
                <p className="text-error text-sm mt-1">
                  {errors.MaintenanceCost.message}
                </p>
              )}
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <button type="submit" className="btn btn-primary px-10">
                Save
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditMaintenance;
