import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams, useLocation, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxios from "../../../hooks/useAxios";
import useUserStatus from "../../../hooks/useUserStatus";
import { LuBookImage } from "react-icons/lu";
import { RiHome3Line } from "react-icons/ri";
import { MdCheckCircle, MdCancel } from "react-icons/md";

const MainReserve = () => {
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { hotelEmail, statusLoading } = useUserStatus();

  const room = location.state?.room || null;
  const selectedDate = searchParams.get("date") || location.state?.date || "";
  const imageBaseURL = "http://localhost:3000";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      guestName: "",
      contactNumber: "",
      month: selectedDate
        ? selectedDate.slice(0, 7)
        : new Date().toISOString().slice(0, 7),
      arrivingDate: selectedDate || "",
      departureDate: "",
    },
  });

  const arrivingDate = watch("arrivingDate");
  const departureDate = watch("departureDate");

  const {
    data: availability,
    isFetching,
    isError: availabilityError,
  } = useQuery({
    queryKey: [
      "check-availability",
      hotelEmail,
      arrivingDate,
      departureDate,
      room?._id,
    ],
    queryFn: async () => {
      const res = await axiosInstance.get("/rooms/available", {
        params: {
          arriving: arrivingDate,
          departure: departureDate,
          hotelEmail,
        },
      });
      return res.data;
    },
    enabled:
      !!hotelEmail &&
      !statusLoading &&
      !!arrivingDate &&
      !!departureDate &&
      departureDate > arrivingDate &&
      !!room,
  });

  const isRoomAvailable = () => {
    if (!availability || !room) return true;
    const allAvailableRooms =
      availability.variants?.flatMap((variant) => variant.rooms || []) || [];
    return allAvailableRooms.some(
      (availableRoom) =>
        availableRoom._id === room._id || availableRoom.roomNo === room.roomNo,
    );
  };

  const onSubmit = async (data) => {
    if (!hotelEmail) {
      Swal.fire(
        "Account unavailable",
        "Hotel account information could not be loaded. Please refresh and try again.",
        "warning",
      );
      return;
    }

    if (!room) {
      Swal.fire("Error", "No room selected", "error");
      return;
    }

    if (data.departureDate <= data.arrivingDate) {
      Swal.fire({
        title: "Invalid Dates",
        text: "Departure date must be after arriving date",
        icon: "warning",
        confirmButtonColor: "#881337",
      });
      return;
    }

    if (!isRoomAvailable()) {
      Swal.fire({
        title: "Room Not Available",
        text: "This room is already reserved or occupied for the selected dates.",
        icon: "error",
        confirmButtonColor: "#881337",
      });
      return;
    }

    const reservationData = {
      hotelEmail,
      guestName: data.guestName,
      contactNumber: data.contactNumber,
      arrivingDate: data.arrivingDate,
      departureDate: data.departureDate,
      room: {
        _id: room._id,
        roomNo: room.roomNo,
        variantName: room.variantName,
        baseRoomType: room.baseRoomType,
        price: room.price,
        maxOccupancy: room.maxOccupancy,
        bedType: room.bedType,
        amenities: room.amenities,
        image: room.image,
        roomStatus: "Reserved",
      },
      status: "Reserved",
    };

    try {
      const res = await axiosInstance.post("/reservations", reservationData);

      if (res.data.insertedId) {
        Swal.fire({
          title: "Reservation Confirmed",
          text: `Room ${room.roomNo} reserved for ${data.guestName}`,
          icon: "success",
          confirmButtonColor: "#881337",
        }).then(() => {
          navigate("/dashboard/reservations");
        });
      } else {
        Swal.fire({
          title: "Reservation Not Confirmed",
          text: "The reservation could not be confirmed. Please try again.",
          icon: "warning",
          confirmButtonColor: "#881337",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Reservation Failed",
        text: error.response?.data?.message || "Could not create reservation",
        icon: "error",
        confirmButtonColor: "#881337",
      });
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return "https://images.unsplash.com/photo-1566665797739-1674de7a421a";
    }
    if (imagePath.startsWith("http")) return imagePath;
    return `${imageBaseURL}${imagePath}`;
  };

  const amenitiesList = Array.isArray(room?.amenities)
    ? room.amenities
    : typeof room?.amenities === "string"
      ? room.amenities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

  if (statusLoading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <span className="loading loading-spinner loading-lg text-rose-900" />
      </div>
    );
  }

  if (!hotelEmail) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="rounded-2xl border border-rose-100 bg-white p-8 text-center shadow-lg">
          <h2 className="text-lg font-bold text-rose-900">
            Hotel Account Unavailable
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            We couldn't identify the hotel account. Please refresh the page or
            sign in again.
          </p>
          <button
            type="button"
            onClick={() => navigate("/dashboard/reservations")}
            className="mt-5 rounded-xl bg-rose-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-800"
          >
            Back to Reservations
          </button>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50">
            <LuBookImage className="text-2xl text-rose-900" />
          </div>
          <p className="mb-4 text-lg font-semibold text-gray-700">
            No room selected.
          </p>
          <button
            type="button"
            onClick={() => navigate("/dashboard/reservations")}
            className="rounded-xl bg-rose-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-800"
          >
            Back to Calendar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-900 shadow-md">
            <LuBookImage className="text-xl text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-rose-900 sm:text-2xl">
              Complete Reservation
            </h1>
            <p className="mt-0.5 text-sm text-gray-500">
              Enter guest details and confirm the room booking.
            </p>
          </div>
        </div>

        <Link
          to="/dashboard/reservations"
          aria-label="Back to Reservations"
          title="Back to Reservations"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-900 text-rose-900 transition-colors hover:bg-rose-900 hover:text-white"
        >
          <RiHome3Line className="text-xl" />
        </Link>
      </div>

      {/* Selected room */}
      <section className="mb-6 overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-lg">
        <div className="border-b border-rose-100 bg-rose-50/70 px-5 py-3">
          <h2 className="font-semibold text-rose-900">Selected Room</h2>
        </div>
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
          <img
            src={getImageUrl(room.image)}
            alt={room.variantName || "Room"}
            className="h-48 w-full rounded-xl border border-rose-100 object-cover shadow-sm sm:h-32 sm:w-40"
            onError={(event) => {
              event.currentTarget.src =
                "https://images.unsplash.com/photo-1566665797739-1674de7a421a";
            }}
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  {room.variantName || room.baseRoomType || "Room"}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Room {room.roomNo} {room.bedType ? `• ${room.bedType}` : ""}
                  {room.maxOccupancy
                    ? ` • Max ${room.maxOccupancy} guests`
                    : ""}
                </p>
              </div>
              <span className="rounded-full border border-rose-100 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-800">
                Reserved on confirmation
              </span>
            </div>

            {amenitiesList.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {amenitiesList.slice(0, 5).map((item, index) => (
                  <span
                    key={index}
                    className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-600"
                  >
                    {typeof item === "string"
                      ? item
                      : item?.name || String(item)}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-3 text-xl font-bold text-rose-900">
              ৳{Number(room.price || 0).toLocaleString()}
              <span className="ml-1 text-sm font-medium text-gray-500">
                / night
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Reservation form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-lg sm:p-8"
      >
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-lg font-bold text-gray-800">
            Guest & Stay Details
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Fields marked with * are required.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="form-control">
            <label className="label pb-1">
              <span className="label-text font-medium text-gray-700">
                Guest Name *
              </span>
            </label>
            <input
              type="text"
              placeholder="Enter full name"
              className={`input input-bordered w-full bg-white focus:border-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-900/20 ${errors.guestName ? "border-red-400" : ""}`}
              {...register("guestName", {
                required: "Guest name is required",
                minLength: {
                  value: 2,
                  message: "Please enter at least 2 characters",
                },
              })}
            />
            {errors.guestName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.guestName.message}
              </p>
            )}
          </div>

          <div className="form-control">
            <label className="label pb-1">
              <span className="label-text font-medium text-gray-700">
                Contact Number *
              </span>
            </label>
            <input
              type="tel"
              placeholder="01XXXXXXXXX"
              className={`input input-bordered w-full bg-white focus:border-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-900/20 ${errors.contactNumber ? "border-red-400" : ""}`}
              {...register("contactNumber", {
                required: "Contact number is required",
                pattern: {
                  value: /^[0-9+()\-\s]{7,20}$/,
                  message: "Enter a valid contact number",
                },
              })}
            />
            {errors.contactNumber && (
              <p className="mt-1 text-sm text-red-600">
                {errors.contactNumber.message}
              </p>
            )}
          </div>

          <div className="form-control">
            <label className="label pb-1">
              <span className="label-text font-medium text-gray-700">
                Month
              </span>
            </label>
            <input
              type="month"
              className="input input-bordered w-full bg-white focus:border-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-900/20"
              {...register("month")}
            />
          </div>

          <div className="form-control">
            <label className="label pb-1">
              <span className="label-text font-medium text-gray-700">
                Arriving Date *
              </span>
            </label>
            <input
              type="date"
              min={new Date().toISOString().slice(0, 10)}
              className={`input input-bordered w-full bg-white focus:border-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-900/20 ${errors.arrivingDate ? "border-red-400" : ""}`}
              {...register("arrivingDate", {
                required: "Arriving date is required",
              })}
            />
            {errors.arrivingDate && (
              <p className="mt-1 text-sm text-red-600">
                {errors.arrivingDate.message}
              </p>
            )}
          </div>

          <div className="form-control md:col-span-2">
            <label className="label pb-1">
              <span className="label-text font-medium text-gray-700">
                Departure Date *
              </span>
            </label>
            <input
              type="date"
              min={arrivingDate || new Date().toISOString().slice(0, 10)}
              className={`input input-bordered w-full bg-white focus:border-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-900/20 ${errors.departureDate ? "border-red-400" : ""}`}
              {...register("departureDate", {
                required: "Departure date is required",
                validate: (value) =>
                  !arrivingDate ||
                  value > arrivingDate ||
                  "Departure date must be after arriving date",
              })}
            />
            {errors.departureDate && (
              <p className="mt-1 text-sm text-red-600">
                {errors.departureDate.message}
              </p>
            )}
          </div>
        </div>

        {/* Availability */}
        {arrivingDate && departureDate && departureDate > arrivingDate && (
          <div
            className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm font-medium ${
              isFetching
                ? "border-gray-200 bg-gray-50 text-gray-600"
                : availabilityError
                  ? "border-amber-200 bg-amber-50 text-amber-800"
                  : isRoomAvailable()
                    ? "border-green-100 bg-green-50 text-green-700"
                    : "border-red-100 bg-red-50 text-red-700"
            }`}
          >
            {isFetching ? (
              <>
                <span className="loading loading-spinner loading-sm mt-0.5" />
                Checking room availability...
              </>
            ) : availabilityError ? (
              <>
                <MdCancel className="mt-0.5 shrink-0 text-lg" />
                Couldn't check availability. Please try changing the dates or
                submit again later.
              </>
            ) : isRoomAvailable() ? (
              <>
                <MdCheckCircle className="mt-0.5 shrink-0 text-lg" />
                Room appears to be available for these dates.
              </>
            ) : (
              <>
                <MdCancel className="mt-0.5 shrink-0 text-lg" />
                This room is already reserved for the selected period.
              </>
            )}
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl border border-rose-900 px-5 py-2.5 text-sm font-semibold text-rose-900 transition hover:bg-rose-50"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={
              isSubmitting ||
              statusLoading ||
              !hotelEmail ||
              (arrivingDate &&
                departureDate &&
                departureDate > arrivingDate &&
                (isFetching || availabilityError || !isRoomAvailable()))
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Processing...
              </>
            ) : (
              "Confirm Reservation"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MainReserve;
