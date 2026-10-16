import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useLocation } from "react-router";
import {
  MdOutlinePlaylistAddCheckCircle,
  MdPerson,
  MdMeetingRoom,
  MdPayments,
} from "react-icons/md";
import { RiHome3Line } from "react-icons/ri";
import { FaRegCalendarAlt } from "react-icons/fa";
import Swal from "sweetalert2";

import PageHeader from "../../../../components/PageHeader";
import useAxios from "../../../../hooks/useAxios";
import useUserStatus from "../../../../hooks/useUserStatus";

const CheckIn = () => {
  const axiosInstance = useAxios();
  const { hotelEmail, statusLoading } = useUserStatus();

  const navigate = useNavigate();
  const location = useLocation();

  const prefilledRoom = location.state?.room;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      advancePayment: 0,
      roomVariant: prefilledRoom?.variantId || "",
      roomNumber: prefilledRoom?.roomNo || "",
    },
  });

  const selectedVariantId = watch("roomVariant");
  const checkInDate = watch("checkInDate");
  const checkOutDate = watch("checkOutDate");
  const advancePayment = watch("advancePayment");

  // Fetch room variants for the current hotel
  const { data: roomVariants = [], isLoading: variantsLoading } = useQuery({
    queryKey: ["room-variants", hotelEmail],
    queryFn: async () => {
      const res = await axiosInstance.get("/room-variants", {
        params: { hotelEmail },
      });
      return res.data;
    },
    enabled: !!hotelEmail && !statusLoading,
  });

  // Fetch rooms for the selected variant
  const { data: rooms = [], isLoading: roomsLoading } = useQuery({
    queryKey: ["rooms-by-variant", selectedVariantId],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/rooms/variant/${selectedVariantId}`,
      );
      return res.data;
    },
    enabled: !!selectedVariantId && !statusLoading,
  });

  // Preselect room when navigating from the All Rooms page
  useEffect(() => {
    if (prefilledRoom) {
      setValue("roomVariant", prefilledRoom.variantId);
    }
  }, [prefilledRoom, setValue]);

  useEffect(() => {
    if (prefilledRoom && rooms.length > 0) {
      setValue("roomNumber", prefilledRoom.roomNo);
    }
  }, [prefilledRoom, rooms, setValue]);

  const selectedVariant = roomVariants.find(
    (variant) => variant._id === selectedVariantId,
  );

  // Calculate the number of nights
  let nights = 0;

  if (checkInDate && checkOutDate) {
    const inDate = new Date(checkInDate);
    const outDate = new Date(checkOutDate);
    const diffTime = outDate - inDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    nights = diffDays > 0 ? diffDays : 0;
  }

  const totalAmount =
    selectedVariant && nights > 0 ? selectedVariant.price * nights : 0;

  const advance = Number(advancePayment) || 0;
  const dueAmount = Math.max(totalAmount - advance, 0);

  const onSubmit = async (data) => {
    if (!hotelEmail) {
      Swal.fire({
        title: "Hotel Account Unavailable",
        text: "Unable to identify the current hotel. Please try again.",
        icon: "warning",
        confirmButtonColor: "#9f1239",
      });
      return;
    }

    const nidImageFile = data.nidImage?.[0];
    const personImageFile = data.personImage?.[0];

    if (!nidImageFile || !personImageFile) {
      Swal.fire({
        title: "Images Required",
        text: "Please upload both NID image and Person image.",
        icon: "warning",
        confirmButtonColor: "#9f1239",
      });
      return;
    }

    if (advance > totalAmount) {
      Swal.fire({
        title: "Invalid Advance Payment",
        text: "Advance payment cannot exceed the total amount.",
        icon: "warning",
        confirmButtonColor: "#9f1239",
      });
      return;
    }

    if (nights < 1) {
      Swal.fire({
        title: "Invalid Stay Dates",
        text: "Check-out date must be after the check-in date.",
        icon: "warning",
        confirmButtonColor: "#9f1239",
      });
      return;
    }

    const formData = new FormData();

    // Guest Information
    formData.append("guestName", data.guestName);
    formData.append("guestAddress", data.guestAddress);
    formData.append("contactNumber", data.contactNumber);
    formData.append("designation", data.designation);
    formData.append("nidNumber", data.nidNumber || "");

    // Guest Images
    formData.append("nidImage", nidImageFile);
    formData.append("personImage", personImageFile);

    // Room Information
    formData.append("roomVariantId", data.roomVariant);
    formData.append("roomVariantName", selectedVariant?.variantName || "");
    formData.append("roomNumber", data.roomNumber);
    formData.append("pricePerNight", selectedVariant?.price || 0);

    // Stay Information
    formData.append("checkInDate", data.checkInDate);
    formData.append("checkInTime", data.checkInTime);
    formData.append("checkOutDate", data.checkOutDate);
    formData.append("numberOfNights", nights);
    formData.append("numberOfGuests", data.numberOfGuests);

    // Payment Information
    formData.append("totalAmount", totalAmount);
    formData.append("advancePayment", advance);
    formData.append("dueAmount", dueAmount);

    formData.append("specialRequests", data.specialRequests || "");
    formData.append("status", "Normal");
    formData.append("hotelEmail", hotelEmail);

    try {
      const res = await axiosInstance.post("/check-in", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.insertedId) {
        await Swal.fire({
          title: "Success!",
          text: "Guest checked in successfully.",
          icon: "success",
          confirmButtonColor: "#9f1239",
        });

        navigate("/dashboard/check_in_out");
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error?.response?.data?.message || "Failed to check in guest.",
        icon: "error",
        confirmButtonColor: "#9f1239",
      });
    }
  };

  const inputClass =
    "input input-bordered w-full bg-white border-gray-200 rounded-xl focus:outline-none focus:border-rose-400";

  const selectClass =
    "select select-bordered w-full bg-white border-gray-200 rounded-xl focus:outline-none focus:border-rose-400";

  const labelClass = "block text-sm font-medium text-gray-700 mb-2";

  if (statusLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <span className="loading loading-spinner loading-lg text-rose-900" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* ===== Page Header ===== */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex-1">
          <PageHeader
            title="Guest Check In"
            subtitle="Register guests, assign available rooms, and manage stay and payment details."
            icon={
              <MdOutlinePlaylistAddCheckCircle className="text-xl text-white" />
            }
          />

          {prefilledRoom && (
            <p className="mt-3 text-sm font-medium text-rose-700">
              Booking → Room {prefilledRoom.roomNo} (
              {prefilledRoom.variantName || prefilledRoom.baseRoomType})
            </p>
          )}
        </div>

        <Link
          to="/dashboard/check_in_out"
          aria-label="Back to check-in and check-out"
          title="Back to check-in and check-out"
          className="mt-1 flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl border border-rose-200 bg-white text-rose-900 shadow-sm transition-all duration-300 hover:bg-rose-900 hover:text-white hover:shadow-md"
        >
          <RiHome3Line className="text-xl" />
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* ===== Guest Information ===== */}
        <section className="bg-white rounded-2xl shadow-md border border-rose-100 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-rose-100">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center shadow-md shadow-rose-200">
              <MdPerson className="text-2xl text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-rose-900">
                Guest Information
              </h2>
              <p className="text-sm text-gray-500">
                Enter the guest's personal details and identification.
              </p>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Guest Name</label>
              <input
                type="text"
                placeholder="Enter guest name"
                {...register("guestName", {
                  required: "Guest name is required",
                })}
                className={inputClass}
              />
              {errors.guestName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.guestName.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Guest Address</label>
              <input
                type="text"
                placeholder="Enter guest address"
                {...register("guestAddress", {
                  required: "Guest address is required",
                })}
                className={inputClass}
              />
              {errors.guestAddress && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.guestAddress.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Contact Number</label>
              <input
                type="tel"
                placeholder="017XXXXXXXX"
                {...register("contactNumber", {
                  required: "Contact number is required",
                })}
                className={inputClass}
              />
              {errors.contactNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.contactNumber.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Guest Designation</label>
              <input
                type="text"
                placeholder="e.g. Manager, Student, Businessman"
                {...register("designation", {
                  required: "Designation is required",
                })}
                className={inputClass}
              />
              {errors.designation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.designation.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>NID Number</label>
              <input
                type="text"
                placeholder="Enter National ID number"
                {...register("nidNumber")}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>NID Image</label>
              <input
                type="file"
                accept="image/*"
                {...register("nidImage", {
                  required: "NID image is required",
                })}
                className="file-input file-input-bordered w-full bg-white rounded-xl"
              />
              {errors.nidImage && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nidImage.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Person Image</label>
              <input
                type="file"
                accept="image/*"
                {...register("personImage", {
                  required: "Person image is required",
                })}
                className="file-input file-input-bordered w-full bg-white rounded-xl"
              />
              {errors.personImage && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.personImage.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ===== Room & Stay Information ===== */}
        <section className="bg-white rounded-2xl shadow-md border border-emerald-100 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-emerald-100">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md shadow-emerald-200">
              <MdMeetingRoom className="text-2xl text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-emerald-800">
                Room & Stay Details
              </h2>
              <p className="text-sm text-gray-500">
                Select a room and enter the guest's stay information.
              </p>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Room Variant</label>
              <select
                {...register("roomVariant", {
                  required: "Room variant is required",
                })}
                className={selectClass}
              >
                <option value="" disabled>
                  {variantsLoading
                    ? "Loading room variants..."
                    : "Select room variant"}
                </option>
                {roomVariants.map((variant) => (
                  <option key={variant._id} value={variant._id}>
                    {variant.variantName} — ৳{variant.price}/night
                  </option>
                ))}
              </select>
              {errors.roomVariant && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.roomVariant.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Room Number</label>
              <select
                {...register("roomNumber", {
                  required: "Room number is required",
                })}
                className={selectClass}
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

            <div>
              <label className={labelClass}>Check-In Date</label>
              <input
                type="date"
                {...register("checkInDate", {
                  required: "Check-in date is required",
                })}
                className={inputClass}
              />
              {errors.checkInDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.checkInDate.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Check-Out Date</label>
              <input
                type="date"
                {...register("checkOutDate", {
                  required: "Check-out date is required",
                  validate: (value) =>
                    !checkInDate ||
                    value > checkInDate ||
                    "Check-out must be after check-in",
                })}
                className={inputClass}
              />
              {errors.checkOutDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.checkOutDate.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Check-In Time</label>
              <input
                type="time"
                {...register("checkInTime", {
                  required: "Check-in time is required",
                })}
                className={inputClass}
              />
              {errors.checkInTime && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.checkInTime.message}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Number of Guests</label>
              <input
                type="number"
                min="1"
                placeholder="2"
                {...register("numberOfGuests", {
                  required: "Number of guests is required",
                  valueAsNumber: true,
                  min: {
                    value: 1,
                    message: "At least 1 guest is required",
                  },
                })}
                className={inputClass}
              />
              {errors.numberOfGuests && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.numberOfGuests.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ===== Payment Summary ===== */}
        <section className="bg-white rounded-2xl shadow-md border border-orange-100 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-orange-100">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-md shadow-orange-200">
              <MdPayments className="text-2xl text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-orange-800">
                Payment Summary
              </h2>
              <p className="text-sm text-gray-500">
                Review the room charges and advance payment.
              </p>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Price / Night</p>
                <p className="text-xl font-bold text-gray-800 mt-2">
                  ৳{(selectedVariant?.price || 0).toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Number of Nights</p>
                <p className="text-xl font-bold text-gray-800 mt-2">{nights}</p>
              </div>

              <div className="rounded-xl border border-rose-100 bg-rose-50 p-4">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-xl font-bold text-rose-900 mt-2">
                  ৳{totalAmount.toLocaleString()}
                </p>
              </div>

              <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
                <p className="text-sm text-gray-500">Due Amount</p>
                <p className="text-xl font-bold text-orange-700 mt-2">
                  ৳{dueAmount.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-6 max-w-md">
              <label className={labelClass}>Advance Payment (৳)</label>
              <input
                type="number"
                min="0"
                max={totalAmount}
                placeholder="Enter advance payment"
                {...register("advancePayment", {
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "Advance cannot be negative",
                  },
                  max: {
                    value: totalAmount,
                    message: "Advance cannot exceed the total amount",
                  },
                })}
                className={inputClass}
              />
              {errors.advancePayment && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.advancePayment.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ===== Special Requests ===== */}
        <section className="bg-white rounded-2xl shadow-md border border-sky-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center shadow-md shadow-sky-200">
              <FaRegCalendarAlt className="text-lg text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-sky-800">
                Special Requests
              </h2>
              <p className="text-sm text-gray-500">
                Add any additional guest requirements.
              </p>
            </div>
          </div>

          <textarea
            {...register("specialRequests")}
            className="textarea textarea-bordered w-full min-h-32 bg-white rounded-xl border-gray-200 focus:outline-none focus:border-sky-400"
            placeholder="Enter any special requests from the guest..."
          />
        </section>

        {/* ===== Form Actions ===== */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="btn bg-white border border-rose-200 text-rose-900 hover:bg-rose-50 rounded-xl"
          >
            Reset Form
          </button>

          <button
            type="submit"
            disabled={isSubmitting || !hotelEmail}
            className="btn bg-gradient-to-r from-rose-600 to-rose-800 text-white border-none rounded-xl shadow-md shadow-rose-200 hover:shadow-lg transition-all duration-300 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Processing...
              </>
            ) : (
              "Check In Guest"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckIn;
