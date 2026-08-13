import React from "react";
import { useForm } from "react-hook-form";
import { Link, useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../../../hooks/useAxios";
import Swal from "sweetalert2";
import { FaBackward } from "react-icons/fa";

const EditMaintenanceHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosInstance = useAxios();

  const {
    data: history,
    isLoading,
    isError,
    error,
  } = useQuery({
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
      roomStatus: history?.roomStatus || "Available",
      workBegins: history?.workBegins || "",
      workEnds: history?.workEnds || "",
      assignedPerson: history?.assignedPerson || "",
      assignedPersonNumber: history?.assignedPersonNumber || "",
      maintenanceCost: history?.maintenanceCost ?? "",
      correctives: history?.correctives || "",
    },
  });

  const onSubmit = async (data) => {
    const res = await axiosInstance.patch(
      `/change-maintenance-history/${id}`,
      data,
    );

    if (res.data.result?.modifiedCount > 0) {
      await Swal.fire({
        title: "Updated Successfully!",
        icon: "success",
        confirmButtonColor: "#BF1E2E",
      });

      navigate("/dashboard/rooms/maintenance_history");
    } else {
      await Swal.fire({
        title: "No Changes Made",
        text: "The maintenance record was not changed.",
        icon: "info",
        confirmButtonColor: "#BF1E2E",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-rose-800"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="alert alert-error max-w-2xl mx-auto mt-10">
        <span>{error?.message || "Failed to load maintenance history."}</span>
      </div>
    );
  }

  if (!history) {
    return (
      <div className="text-center py-20 text-gray-500">History not found.</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-lg font-bold text-rose-800">
            Edit Maintenance History
          </h1>

          <p className="text-gray-500 mt-1">Update maintenance record</p>
        </div>

        <Link to="/dashboard/rooms/maintenance_history">
          <button
            type="button"
            className="btn btn-outline border-rose-800 text-rose-800 hover:bg-rose-800 hover:text-white"
          >
            <FaBackward className="text-sm" />
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
              {...register("roomStatus", {
                required: "Status is required",
              })}
              className="select select-bordered w-full bg-white"
            >
              <option value="Available">Available</option>
              <option value="Maintenance">Maintenance</option>
              <option value="In Progress">In Progress</option>
            </select>

            {errors.roomStatus && (
              <p className="text-error text-sm mt-1">
                {errors.roomStatus.message}
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
              {...register("workBegins", {
                required: "Work begins is required",
              })}
              className="input input-bordered w-full bg-white"
            />

            {errors.workBegins && (
              <p className="text-error text-sm mt-1">
                {errors.workBegins.message}
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
              {...register("workEnds", {
                required: "Work ends is required",
              })}
              className="input input-bordered w-full bg-white"
            />

            {errors.workEnds && (
              <p className="text-error text-sm mt-1">
                {errors.workEnds.message}
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
              placeholder="Enter assigned person's name"
              {...register("assignedPerson", {
                required: "Assigned person is required",
              })}
              className="input input-bordered w-full bg-white"
            />

            {errors.assignedPerson && (
              <p className="text-error text-sm mt-1">
                {errors.assignedPerson.message}
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
              placeholder="Enter phone number"
              {...register("assignedPersonNumber", {
                required: "Phone number is required",
              })}
              className="input input-bordered w-full bg-white"
            />

            {errors.assignedPersonNumber && (
              <p className="text-error text-sm mt-1">
                {errors.assignedPersonNumber.message}
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
              {...register("maintenanceCost", {
                required: "Cost is required",
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: "Cost cannot be negative",
                },
              })}
              className="input input-bordered w-full bg-white"
            />

            {errors.maintenanceCost && (
              <p className="text-error text-sm mt-1">
                {errors.maintenanceCost.message}
              </p>
            )}
          </div>

          {/* Correctives */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Correctives</span>
            </label>

            <input
              type="text"
              placeholder="Enter corrective action"
              {...register("correctives")}
              className="input input-bordered w-full bg-white"
            />

            {errors.correctives && (
              <p className="text-error text-sm mt-1">
                {errors.correctives.message}
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
