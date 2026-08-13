import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../../../hooks/useAxios";
import { RiHome3Line } from "react-icons/ri";
import Swal from "sweetalert2";

const EditMaintenance = () => {
  const { id } = useParams();
  const axiosInstance = useAxios();
  const navigate = useNavigate();

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
      roomStatus: room?.roomStatus || "Maintenance",
      workBegins: room?.workBegins || "",
      workEnds: room?.workEnds || "",
      assignedPerson: room?.assignedPerson || "",
      assignedPersonNumber: room?.assignedPersonNumber || "",
      maintenanceCost: room?.maintenanceCost ?? "",
      correctives: room?.correctives || "",
    },
  });

  const onSubmit = async (data) => {
    const res = await axiosInstance.patch(
      `/edit-maintenance-history/${id}`,
      data,
    );

    if (res.data.room_res?.modifiedCount > 0) {
      await Swal.fire({
        title: "Updated Successfully!",
        icon: "success",
        confirmButtonColor: "#BF1E2E",
      });

      navigate("/dashboard/rooms");
    } else {
      Swal.fire({
        title: "No Changes Made",
        text: "The room information was not changed.",
        icon: "info",
        confirmButtonColor: "#BF1E2E",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
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
            Room #{room.roomNo} — {room.variantName}
          </p>
        </div>

        <Link to="/dashboard/rooms">
          <button type="button" className="btn btn-outline btn-secondary">
            <RiHome3Line className="text-2xl" />
          </button>
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Room Image */}
        <div className="card bg-white shadow-xl mb-6">
          <div className="card-body">
            <img
              src={room.image}
              alt={room.variantName}
              className="w-full h-72 object-cover rounded-xl"
            />
          </div>
        </div>

        {/* Form Fields */}
        <div className="card bg-white shadow-xl">
          <div className="card-body space-y-5">
            {/* Room Status */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Room Status *</span>
              </label>

              <select
                {...register("roomStatus", {
                  required: "Room status is required",
                })}
                className="select select-bordered w-full bg-white"
              >
                <option value="Maintenance">Maintenance</option>
                <option value="In Progress">In Progress</option>
                <option value="Available">Available</option>
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
                placeholder="Enter name"
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
                  required: "Maintenance cost is required",
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
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <button type="submit" className="btn btn-secondary px-10">
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
