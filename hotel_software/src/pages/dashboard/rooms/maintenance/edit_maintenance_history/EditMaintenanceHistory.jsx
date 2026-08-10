import React from "react";
import { useForm } from "react-hook-form";
import { Link, useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../../../hooks/useAxios";
import { RiHome3Line } from "react-icons/ri";
import Swal from "sweetalert2";

const EditMaintenanceHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosInstance = useAxios();

  const { data: history, isLoading } = useQuery({
    queryKey: ["maintenance-history", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/maintenance-history/${id}`);
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
      RoomStatus: history?.RoomStatus || "Available",
      WorkBegins: history?.WorkBegins || "",
      WorkEnds: history?.WorkEnds || "",
      AssignedPerson: history?.AssignedPerson || "",
      AssignedPersonNumber: history?.AssignedPersonNumber || "",
      MaintenanceCost: history?.MaintenanceCost || "",
    },
  });

  const onSubmit = async (data) => {
    const res = await axiosInstance.patch(
      `/edit-maintenance-history/${id}`,
      data,
    );

    if (res.data.modifiedCount > 0) {
      Swal.fire({
        title: "Updated Successfully!",
        icon: "success",
        confirmButtonColor: "#BF1E2E",
      });
      navigate("/dashboard/rooms/maintenance_history");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-rose-800"></span>
      </div>
    );
  }

  if (!history) {
    return (
      <div className="text-center py-20 text-gray-500">History not found.</div>
    );
  }

  return (
    <div className="mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-rose-800">
            Edit Maintenance History
          </h1>
          <p className="text-gray-500 mt-1">Update maintenance record</p>
        </div>
        <Link to="/dashboard/rooms/maintenance_history">
          <button className="btn btn-outline border-rose-800 text-rose-800 hover:bg-rose-800 hover:text-white">
            <RiHome3Line className="text-2xl" />
          </button>
        </Link>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card bg-white shadow-xl"
      >
        <div className="card-body space-y-5">
          {/* Room Status */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Room Status *</span>
            </label>
            <select
              {...register("RoomStatus", { required: "Status is required" })}
              className="select select-bordered w-full bg-white"
            >
              <option value="Available">Available</option>
              <option value="Maintenance">Maintenance</option>
              <option value="In Progress">In Progress</option>
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
              {...register("WorkEnds", { required: "Work ends is required" })}
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

          {/* Person Number */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Person Number *</span>
            </label>
            <input
              type="tel"
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
              {...register("MaintenanceCost", {
                required: "Cost is required",
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
            <button
              type="submit"
              className="btn bg-rose-800 hover:bg-rose-900 text-white border-none px-10"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditMaintenanceHistory;
