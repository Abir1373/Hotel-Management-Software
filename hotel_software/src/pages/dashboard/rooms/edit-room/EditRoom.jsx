import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { FaArrowLeft, FaSave, FaEdit } from "react-icons/fa";
import { RiHome3Line } from "react-icons/ri";
import Swal from "sweetalert2";
import useAxios from "../../../../hooks/useAxios";
import { useQueryClient } from "@tanstack/react-query";

const EditRoom = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();

  const room = location.state?.room;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      variantName: room?.variantName || "",
      baseRoomType: room?.baseRoomType || "",
      price: room?.price || "",
      maxOccupancy: room?.maxOccupancy || "",
      bedType: room?.bedType || "",
      amenities: room?.amenities || "",
      description: room?.description || "",
      roomStatus: room?.roomStatus || "Available",
      roomNo: room?.roomNo || "",
      assignedPerson: room?.assignedPerson || "",
      assignedPersonNumber: room?.assignedPersonNumber || "",
      maintenanceCost: room?.maintenanceCost || "",
      correctives: room?.correctives || "",
      workBegins: room?.workBegins || "",
      workEnds: room?.workEnds || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await axiosInstance.patch(`/rooms/${id}`, {
        ...data,
        price: Number(data.price),
        maxOccupancy: Number(data.maxOccupancy),
        maintenanceCost: data.maintenanceCost
          ? Number(data.maintenanceCost)
          : "",
      });

      if (res.data.modifiedCount > 0 || res.data.message) {
        queryClient.invalidateQueries({ queryKey: ["rooms"] });
        queryClient.invalidateQueries({ queryKey: ["maintenance-rooms"] });

        await Swal.fire({
          title: "Success!",
          text: "Room updated successfully.",
          icon: "success",
          confirmButtonColor: "#9f1239",
        });

        navigate(-1);
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: "Failed to update room.",
        icon: "error",
        confirmButtonColor: "#9f1239",
      });
    }
  };

  if (!room) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-red-500 text-lg mb-4">
          Room data not found. Please go back and try again.
        </p>
        <Link to="/dashboard/rooms">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-rose-900 text-white rounded-lg">
            <FaArrowLeft /> Go Back
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-rose-900 flex items-center justify-center">
              <FaEdit className="text-xl text-white" />
            </div>
            <h1 className="text-lg font-bold text-rose-900">Edit Room</h1>
          </div>

          <Link to="/dashboard/rooms">
            <button
              type="button"
              className="flex items-center justify-center w-11 h-11 border border-rose-900 text-rose-900 hover:bg-rose-900 hover:text-white rounded-lg transition-colors"
            >
              <RiHome3Line className="text-xl" />
            </button>
          </Link>
        </div>
        <p className="text-gray-500 ml-9">Update all room information.</p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Variant Name <span className="text-rose-900">*</span>
              </label>
              <input
                type="text"
                {...register("variantName", {
                  required: "Variant name is required",
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-900 focus:border-transparent"
              />
              {errors.variantName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.variantName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Room Type <span className="text-rose-900">*</span>
              </label>
              <input
                type="text"
                {...register("baseRoomType", {
                  required: "Base room type is required",
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-900 focus:border-transparent"
              />
              {errors.baseRoomType && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.baseRoomType.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (per night) <span className="text-rose-900">*</span>
              </label>
              <input
                type="number"
                {...register("price", { required: "Price is required" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-900 focus:border-transparent"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Occupancy <span className="text-rose-900">*</span>
              </label>
              <input
                type="number"
                {...register("maxOccupancy", {
                  required: "Max occupancy is required",
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-900 focus:border-transparent"
              />
              {errors.maxOccupancy && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.maxOccupancy.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bed Type
              </label>
              <input
                type="text"
                {...register("bedType")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-900 focus:border-transparent"
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Number
              </label>
              <input
                type="text"
                {...register("roomNo")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-900 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Status
              </label>
              <select
                {...register("roomStatus")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-900 focus:border-transparent"
              >
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
                <option value="In Progress">In Progress</option>
              </select>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amenities
            </label>
            <input
              type="text"
              placeholder="e.g. WiFi, AC, Mini Bar"
              {...register("amenities")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-900 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={3}
              {...register("description")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-900 focus:border-transparent resize-none"
            />
          </div>

          {/* Assignment Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned Person
              </label>
              <input
                type="text"
                {...register("assignedPerson")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-900 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned Person Number
              </label>
              <input
                type="text"
                {...register("assignedPersonNumber")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-900 focus:border-transparent"
              />
            </div>
          </div>

          {/* Maintenance Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maintenance Cost
              </label>
              <input
                type="number"
                {...register("maintenanceCost")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-900 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Begins
              </label>
              <input
                type="date"
                {...register("workBegins")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-900 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Ends
              </label>
              <input
                type="date"
                {...register("workEnds")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-900 focus:border-transparent"
              />
            </div>
          </div>

          {/* Correctives */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correctives
            </label>
            <textarea
              rows={3}
              placeholder="Write corrective actions..."
              {...register("correctives")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-900 focus:border-transparent resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Link
              to="/dashboard/rooms"
              className="flex items-center gap-2 px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <FaArrowLeft className="text-sm" />
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-rose-900 hover:bg-rose-800 text-white rounded-lg transition-colors border-none"
            >
              {isSubmitting ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <FaSave className="text-sm" />
              )}
              Update Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRoom;
