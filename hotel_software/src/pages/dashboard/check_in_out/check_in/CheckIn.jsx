import { useForm, useWatch } from "react-hook-form";
import { MdOutlinePlaylistAddCheckCircle } from "react-icons/md";
import { RiHome3Line } from "react-icons/ri";
import { Link, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../../hooks/useAxios";
import Swal from "sweetalert2";

const CheckIn = () => {
  const axiosInstance = useAxios();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const selectedVariantId = useWatch({
    control,
    name: "roomVariant",
  });

  const { data: roomVariants = [], isLoading: variantsLoading } = useQuery({
    queryKey: ["room-variants"],
    queryFn: async () => {
      const res = await axiosInstance.get("/room-variants");
      return res.data;
    },
  });
  const { data: rooms = [], isLoading: roomsLoading } = useQuery({
    queryKey: ["rooms-by-variant", selectedVariantId],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/rooms/variant/${selectedVariantId}`,
      );
      return res.data;
    },
    enabled: !!selectedVariantId,
  });

  const onSubmit = async (data) => {
    const res = await axiosInstance.post("/check-in", data);

    if (res.data.insertedId) {
      await Swal.fire({
        title: "Success!",
        text: "Guest checked in successfully.",
        icon: "success",
        confirmButtonColor: "#9f1239",
      });

      // Optional: reset form or navigate
      navigate("/dashboard/check_in_out");
    }
  };

  return (
    <div className="mx-auto bg-white shadow-lg rounded-2xl p-5">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
                <MdOutlinePlaylistAddCheckCircle className="text-xl text-white" />
              </div>

              <h1 className="text-lg font-bold text-rose-700">
                Guest Check In
              </h1>
            </div>

            <p className="text-gray-500 ml-12">
              Manage guest check-ins, room assignments, and stay details.
            </p>
          </div>

          <Link to="/dashboard/check_in_out">
            <button
              type="button"
              className="flex items-center justify-center w-11 h-11 border border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white rounded-lg transition-colors"
            >
              <RiHome3Line className="text-xl" />
            </button>
          </Link>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Guest Name */}
          <div>
            <label className="label">
              <span className="label-text">Guest Name</span>
            </label>

            <input
              type="text"
              placeholder="John Doe"
              {...register("guestName", {
                required: "Guest name is required",
              })}
              className="bg-white input input-bordered w-full"
            />

            {errors.guestName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.guestName.message}
              </p>
            )}
          </div>

          {/* Guest Address */}
          <div>
            <label className="label">
              <span className="label-text">Guest Address</span>
            </label>

            <input
              type="text"
              placeholder="Enter guest address"
              {...register("guestAddress", {
                required: "Guest address is required",
              })}
              className="bg-white input input-bordered w-full"
            />

            {errors.guestAddress && (
              <p className="text-red-500 text-sm mt-1">
                {errors.guestAddress.message}
              </p>
            )}
          </div>

          {/* Contact Number */}
          <div>
            <label className="label">
              <span className="label-text">Contact Number</span>
            </label>

            <input
              type="tel"
              placeholder="017XXXXXXXX"
              {...register("contactNumber", {
                required: "Contact number is required",
              })}
              className="bg-white input input-bordered w-full"
            />

            {errors.contactNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.contactNumber.message}
              </p>
            )}
          </div>

          {/* Guest Designation */}
          <div>
            <label className="label">
              <span className="label-text">Guest Designation</span>
            </label>

            <input
              type="text"
              placeholder="e.g. Manager, Student, Businessman"
              {...register("designation", {
                required: "Designation is required",
              })}
              className="bg-white input input-bordered w-full"
            />

            {errors.designation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.designation.message}
              </p>
            )}
          </div>

          {/* NID Number */}
          <div>
            <label className="label">
              <span className="label-text">NID Number</span>
            </label>

            <input
              type="text"
              placeholder="Enter National ID Number"
              {...register("nidNumber")}
              className="bg-white input input-bordered w-full"
            />
          </div>

          {/* NID Image */}
          <div>
            <label className="label">
              <span className="label-text">NID Image</span>
            </label>

            <input
              type="file"
              accept="image/*"
              {...register("nidImage", {
                required: "NID image is required",
              })}
              className="file-input file-input-bordered w-full bg-white"
            />

            {errors.nidImage && (
              <p className="text-red-500 text-sm mt-1">
                {errors.nidImage.message}
              </p>
            )}
          </div>

          {/* Person Image */}
          <div>
            <label className="label">
              <span className="label-text">Person Image</span>
            </label>

            <input
              type="file"
              accept="image/*"
              {...register("personImage", {
                required: "Person image is required",
              })}
              className="file-input file-input-bordered w-full bg-white"
            />

            {errors.personImage && (
              <p className="text-red-500 text-sm mt-1">
                {errors.personImage.message}
              </p>
            )}
          </div>

          {/* Room Variant */}
          <div>
            <label className="label">
              <span className="label-text">Room Variant</span>
            </label>

            <select
              {...register("roomVariant", {
                required: "Room variant is required",
              })}
              className="select select-bordered w-full bg-white"
              defaultValue=""
            >
              <option value="" disabled>
                {variantsLoading
                  ? "Loading room variants..."
                  : "Select room variant"}
              </option>

              {roomVariants.map((variant) => (
                <option key={variant._id} value={variant._id}>
                  {variant.variantName}
                </option>
              ))}
            </select>

            {errors.roomVariant && (
              <p className="text-red-500 text-sm mt-1">
                {errors.roomVariant.message}
              </p>
            )}
          </div>

          {/* Room Number */}
          <div>
            <label className="label">
              <span className="label-text">Room Number</span>
            </label>

            <select
              {...register("roomNumber", {
                required: "Room number is required",
              })}
              className="select select-bordered w-full bg-white"
              defaultValue=""
              disabled={!selectedVariantId || roomsLoading}
            >
              <option value="" disabled>
                {!selectedVariantId
                  ? "Select room variant first"
                  : roomsLoading
                    ? "Loading rooms..."
                    : "Select room number"}
              </option>

              {rooms
                .filter((room) => room.roomStatus === "Available")
                .map((room) => (
                  <option key={room._id} value={room.roomNo}>
                    Room {room.roomNo}
                  </option>
                ))}
            </select>

            {errors.roomNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.roomNumber.message}
              </p>
            )}
          </div>

          {/* Check In Date */}
          <div>
            <label className="label">
              <span className="label-text">Check In Date</span>
            </label>

            <input
              type="date"
              {...register("checkInDate", {
                required: "Check in date is required",
              })}
              className="bg-white input input-bordered w-full"
            />

            {errors.checkInDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.checkInDate.message}
              </p>
            )}
          </div>

          {/* Check In Time */}
          <div>
            <label className="label">
              <span className="label-text">Check In Time</span>
            </label>

            <input
              type="time"
              {...register("checkInTime", {
                required: "Check in time is required",
              })}
              className="bg-white input input-bordered w-full"
            />

            {errors.checkInTime && (
              <p className="text-red-500 text-sm mt-1">
                {errors.checkInTime.message}
              </p>
            )}
          </div>

          {/* Number of Guests */}
          <div>
            <label className="label">
              <span className="label-text">Number of Guests</span>
            </label>

            <input
              type="number"
              placeholder="2"
              {...register("numberOfGuests", {
                required: "Number of guests is required",
                valueAsNumber: true,
                min: {
                  value: 1,
                  message: "At least 1 guest is required",
                },
              })}
              className="bg-white input input-bordered w-full"
            />

            {errors.numberOfGuests && (
              <p className="text-red-500 text-sm mt-1">
                {errors.numberOfGuests.message}
              </p>
            )}
          </div>
        </div>

        {/* Special Requests */}
        <div>
          <label className="label">
            <span className="label-text">Special Requests</span>
          </label>

          <textarea
            {...register("specialRequests")}
            className="textarea textarea-bordered w-full h-32 bg-white"
            placeholder="Any special requests from the guest..."
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="reset"
            className="btn btn-outline border-[#BF1E2E] text-[#BF1E2E] hover:bg-[#BF1E2E] hover:text-white"
          >
            Reset
          </button>

          <button
            type="submit"
            className="btn bg-[#BF1E2E] text-white hover:bg-red-800 border-none"
          >
            Check In Guest
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckIn;
