import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { LuBookImage } from "react-icons/lu";
import useAxios from "../../../hooks/useAxios";

const Reservations = () => {
  const axiosInstance = useAxios();

  const { register, watch } = useForm({
    defaultValues: {
      month: new Date().toISOString().slice(0, 7),
      arrivingDate: "",
      departureDate: "",
    },
  });

  const selectedMonth = watch("month");
  const arrivingDate = watch("arrivingDate");
  const departureDate = watch("departureDate");

  const [year, month] = (selectedMonth || "").split("-").map(Number);
  const daysInMonth = year && month ? new Date(year, month, 0).getDate() : 0;

  // Highlight days inside arriving → departure
  const isInRange = (day) => {
    if (!arrivingDate || !departureDate) return false;
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return dateStr >= arrivingDate && dateStr < departureDate;
  };

  // Fetch available rooms only when both dates are set
  const {
    data: availability,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["available-rooms", arrivingDate, departureDate],
    queryFn: async () => {
      const res = await axiosInstance.get("/rooms/available", {
        params: {
          arriving: arrivingDate,
          departure: departureDate,
        },
      });
      return res.data;
    },
    enabled: !!arrivingDate && !!departureDate,
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
          <LuBookImage className="text-xl text-white" />
        </div>
        <h1 className="text-lg font-bold text-rose-700">Reservations</h1>
      </div>

      <p className="text-gray-500 mb-6">
        Select arriving & departure dates to see available rooms by variant.
      </p>

      {/* Date inputs */}
      <div className="bg-white shadow rounded-xl p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">
              <span className="label-text font-medium">Month</span>
            </label>
            <input
              type="month"
              {...register("month")}
              className="input input-bordered w-full bg-white"
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium">Arriving Date</span>
            </label>
            <input
              type="date"
              {...register("arrivingDate")}
              className="input input-bordered w-full bg-white"
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium">Departure Date</span>
            </label>
            <input
              type="date"
              {...register("departureDate")}
              className="input input-bordered w-full bg-white"
            />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-green-500"></span>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-blue-500"></span>
          <span>Selected range</span>
        </div>
      </div>

      {/* Day boxes for the month */}
      <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-3 mb-10">
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const selected = isInRange(day);

          return (
            <div
              key={day}
              className={`
                aspect-square rounded-xl flex flex-col items-center justify-center
                font-bold text-white shadow-sm
                ${selected ? "bg-blue-500" : "bg-green-500"}
              `}
            >
              <span className="text-lg">{day}</span>
            </div>
          );
        })}
      </div>

      {/* Available rooms by variant */}
      <h2 className="text-base font-semibold text-rose-700 mb-4">
        Available Rooms
      </h2>

      {!arrivingDate || !departureDate ? (
        <p className="text-gray-500">
          Please select arriving and departure dates.
        </p>
      ) : isLoading || isFetching ? (
        <p className="text-gray-500">Checking availability...</p>
      ) : !availability?.variants?.length ? (
        <p className="text-gray-500">
          No rooms available for {arrivingDate} → {departureDate}.
        </p>
      ) : (
        <div className="space-y-6">
          <p className="text-sm text-gray-600">
            {availability.totalAvailable} room(s) available from{" "}
            <span className="font-medium">{arrivingDate}</span> to{" "}
            <span className="font-medium">{departureDate}</span>
          </p>

          {availability.variants.map((variant) => (
            <div
              key={variant.variantName}
              className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-rose-700">
                    {variant.variantName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {variant.baseRoomType} • {variant.bedType} • Max{" "}
                    {variant.maxOccupancy} guests
                  </p>
                  <p className="text-sm text-gray-500">{variant.amenities}</p>
                </div>
                <p className="text-xl font-bold text-rose-700">
                  ৳{Number(variant.price || 0).toLocaleString()}
                  <span className="text-sm font-normal text-gray-500">
                    {" "}
                    / night
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {variant.rooms.map((room) => (
                  <span
                    key={room._id}
                    className="px-4 py-2 rounded-xl bg-green-100 text-green-800 font-semibold border border-green-200"
                  >
                    Room {room.roomNo}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reservations;
