import { useForm } from "react-hook-form";
import useAxios from "../../../../hooks/useAxios";
import Swal from "sweetalert2";
import { Link } from "react-router";
import { RiHome3Line } from "react-icons/ri";

const AddRoom = () => {
  const axiosInstance = useAxios();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axiosInstance.post("/rooms", data);

      if (res.data.insertedId || res.status === 201) {
        Swal.fire({
          title: "Room Added!",
          text: "The room has been successfully added.",
          icon: "success",
          confirmButtonColor: "#BF1E2E",
        });
        reset();
      }
    } catch (error) {
      console.error(error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to add room. Please try again.";

      Swal.fire({
        title: "Error!",
        text: message,
        icon: "error",
        confirmButtonColor: "#BF1E2E",
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#BF1E2E]">Add New Room</h1>
        <Link to="/dashboard/rooms">
          <button className="btn btn-outline btn-secondary">
            <RiHome3Line className="text-2xl" />
          </button>
        </Link>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Room Number - Required */}
          <div>
            <label className="label">
              <span className="label-text">Room Number *</span>
            </label>
            <input
              {...register("RoomNumber", {
                required: "Room number is required",
              })}
              type="text"
              placeholder="e.g. 101"
              className="bg-white input input-bordered w-full"
            />
            {errors.RoomNumber && (
              <p className="text-error text-sm mt-1">
                {errors.RoomNumber.message}
              </p>
            )}
          </div>

          {/* Room Name - Required */}
          <div>
            <label className="label">
              <span className="label-text">Room Name *</span>
            </label>
            <input
              {...register("RoomName", {
                required: "Room name is required",
              })}
              type="text"
              placeholder="Deluxe Suite"
              className="bg-white input input-bordered w-full"
            />
            {errors.RoomName && (
              <p className="text-error text-sm mt-1">
                {errors.RoomName.message}
              </p>
            )}
          </div>

          {/* Room Type - Required */}
          <div>
            <label className="label">
              <span className="label-text">Room Type *</span>
            </label>
            <input
              {...register("RoomType", {
                required: "Room type is required",
              })}
              type="text"
              placeholder="Enter room type"
              className="input input-bordered w-full bg-white"
            />
            {errors.RoomType && (
              <p className="text-error text-sm mt-1">
                {errors.RoomType.message}
              </p>
            )}
          </div>

          {/* Floor */}
          <div>
            <label className="label">
              <span className="label-text">Floor</span>
            </label>
            <input
              {...register("Floor")}
              type="number"
              placeholder="Floor Number"
              className="bg-white input input-bordered w-full"
            />
          </div>

          {/* Bed Type - Required */}
          <div>
            <label className="label">
              <span className="label-text">Bed Type *</span>
            </label>
            <input
              {...register("BedType", {
                required: "Bed type is required",
              })}
              type="text"
              placeholder="Enter bed type"
              className="input input-bordered w-full bg-white"
            />
            {errors.BedType && (
              <p className="text-error text-sm mt-1">
                {errors.BedType.message}
              </p>
            )}
          </div>

          {/* Capacity */}
          <div>
            <label className="label">
              <span className="label-text">Room Capacity</span>
            </label>
            <input
              {...register("Capacity")}
              type="number"
              placeholder="Number of Guests"
              className="bg-white input input-bordered w-full"
            />
          </div>

          {/* Price Per Night - Required */}
          <div>
            <label className="label">
              <span className="label-text">Price Per Night *</span>
            </label>
            <input
              {...register("PricePerNight", {
                required: "Price per night is required",
                min: { value: 0, message: "Price cannot be negative" },
              })}
              type="number"
              placeholder="100"
              className="bg-white input input-bordered w-full"
            />
            {errors.PricePerNight && (
              <p className="text-error text-sm mt-1">
                {errors.PricePerNight.message}
              </p>
            )}
          </div>

          {/* Room Size */}
          <div>
            <label className="label">
              <span className="label-text">Room Size</span>
            </label>
            <input
              {...register("RoomSize")}
              type="text"
              placeholder="350 sq ft"
              className="bg-white input input-bordered w-full"
            />
          </div>

          {/* Room Status - Required */}
          <div>
            <label className="label">
              <span className="label-text">Room Status *</span>
            </label>
            <select
              {...register("RoomStatus", {
                required: "Room status is required",
              })}
              className="select select-bordered w-full bg-white"
            >
              <option value="">Select Status</option>
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Reserved">Reserved</option>
              <option value="Maintenance">Maintenance</option>
            </select>
            {errors.RoomStatus && (
              <p className="text-error text-sm mt-1">
                {errors.RoomStatus.message}
              </p>
            )}
          </div>

          {/* Reserved By */}
          <div>
            <label className="label">
              <span className="label-text">Reserved By</span>
            </label>
            <input
              {...register("ReservedBy")}
              type="text"
              placeholder="Guest Name / Booking ID"
              className="bg-white input input-bordered w-full"
            />
          </div>
        </div>

        {/* Room Description */}
        <div>
          <label className="label">
            <span className="label-text">Room Description</span>
          </label>
          <textarea
            {...register("Description")}
            className="textarea textarea-bordered w-full h-32 bg-white"
            placeholder="Describe the room..."
          ></textarea>
        </div>

        {/* Room Image URL */}
        <div>
          <label className="label">
            <span className="label-text">Room Image URL</span>
          </label>
          <input
            {...register("Image")}
            type="url"
            placeholder="https://example.com/room-image.jpg"
            className="input input-bordered w-full bg-white"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => reset()}
            className="btn btn-outline border-[#BF1E2E] text-[#BF1E2E] hover:bg-rose-800 hover:text-white"
          >
            Reset
          </button>

          <button
            type="submit"
            className="btn bg-[#BF1E2E] text-white hover:bg-red-800 border-none"
          >
            Save Room
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRoom;
