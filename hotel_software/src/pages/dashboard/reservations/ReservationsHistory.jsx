import { useQuery } from "@tanstack/react-query";
import { MdWorkHistory, MdDelete } from "react-icons/md";
import { Link } from "react-router";
import useAxios from "../../../hooks/useAxios";
import useUserStatus from "../../../hooks/useUserStatus";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import Swal from "sweetalert2";

const ReservationsHistory = () => {
  const axiosInstance = useAxios();
  const { hotelEmail, statusLoading } = useUserStatus();

  const {
    data: reservations = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["reservations-history", hotelEmail],
    queryFn: async () => {
      const res = await axiosInstance.get("/reservations", {
        params: { hotelEmail },
      });
      return res.data;
    },
    enabled: !!hotelEmail && !statusLoading,
  });

  const handleDelete = async (id, guestName) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete reservation of "${guestName || "this guest"}"? This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#881337",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosInstance.delete(`/reservations/${id}`);
      await refetch();

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Reservation has been deleted.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (deleteError) {
      console.error(deleteError);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text:
          deleteError.response?.data?.message ||
          "Could not delete reservation. Please try again.",
        confirmButtonColor: "#881337",
      });
    }
  };

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  const formatDateTime = (date) =>
    date
      ? new Date(date).toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  if (statusLoading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <span className="loading loading-spinner loading-lg text-rose-900" />
      </div>
    );
  }

  if (!hotelEmail) {
    return (
      <div className="mx-auto p-4 sm:p-6">
        <div className="rounded-2xl border border-rose-100 bg-white px-6 py-16 text-center shadow-lg">
          <h2 className="text-lg font-bold text-rose-900">
            Hotel Account Unavailable
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Hotel account information could not be loaded. Please refresh the
            page or sign in again.
          </p>
          <Link
            to="/dashboard/reservations"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-rose-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-800"
          >
            <IoArrowBackCircleSharp className="text-lg" />
            Back to Reservations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-900 shadow-md">
            <MdWorkHistory className="text-xl text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-rose-900 sm:text-2xl">
              Reservations History
            </h1>
            <p className="mt-0.5 text-sm text-gray-500">
              View and manage all room reservations.
            </p>
          </div>
        </div>

        <Link
          to="/dashboard/reservations"
          title="Back to Reservations"
          aria-label="Back to Reservations"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-900 text-rose-900 transition-colors hover:bg-rose-900 hover:text-white"
        >
          <IoArrowBackCircleSharp className="text-xl" />
        </Link>
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
        {isLoading ? (
          <div className="flex min-h-72 items-center justify-center">
            <span className="loading loading-spinner loading-lg text-rose-900" />
          </div>
        ) : isError ? (
          <div className="py-20 text-center">
            <p className="font-semibold text-red-600">
              Failed to load reservations.
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {error?.message || "Please try again."}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 rounded-xl bg-rose-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-800"
            >
              Try Again
            </button>
          </div>
        ) : reservations.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            <MdWorkHistory className="mx-auto mb-3 text-4xl text-rose-200" />
            <p className="font-medium">No reservations found.</p>
            <p className="mt-1 text-sm">New reservations will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-rose-50 text-sm text-rose-900">
                  <th className="py-4 font-semibold">#</th>
                  <th className="font-semibold">Guest Name</th>
                  <th className="font-semibold">Contact</th>
                  <th className="font-semibold">Room</th>
                  <th className="font-semibold">Room No</th>
                  <th className="font-semibold">Arrival</th>
                  <th className="font-semibold">Departure</th>
                  <th className="text-right font-semibold">Price</th>
                  <th className="text-center font-semibold">Status</th>
                  <th className="font-semibold">Booked At</th>
                  <th className="text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation, index) => (
                  <tr
                    key={reservation._id}
                    className="border-b border-gray-100 transition-colors hover:bg-rose-50/50"
                  >
                    <td className="font-medium text-gray-500">{index + 1}</td>
                    <td className="font-semibold text-gray-800">
                      {reservation.guestName || "—"}
                    </td>
                    <td className="text-sm text-gray-600">
                      {reservation.contactNumber || "—"}
                    </td>
                    <td>
                      <div className="flex min-w-36 flex-col">
                        <span className="font-semibold text-gray-800">
                          {reservation.room?.variantName || "—"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {[
                            reservation.room?.baseRoomType,
                            reservation.room?.bedType,
                          ]
                            .filter(Boolean)
                            .join(" • ") || "—"}
                        </span>
                      </div>
                    </td>
                    <td className="font-medium">
                      {reservation.room?.roomNo || "—"}
                    </td>
                    <td className="whitespace-nowrap text-sm text-gray-600">
                      {formatDate(reservation.arrivingDate)}
                    </td>
                    <td className="whitespace-nowrap text-sm text-gray-600">
                      {formatDate(reservation.departureDate)}
                    </td>
                    <td className="whitespace-nowrap text-right">
                      <span className="text-base font-bold text-rose-900">
                        ৳{Number(reservation.room?.price || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="text-center">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                          reservation.status === "Reserved"
                            ? "border-green-200 bg-green-100 text-green-700"
                            : reservation.status === "Cancelled"
                              ? "border-red-200 bg-red-100 text-red-700"
                              : reservation.status === "Checked-In"
                                ? "border-blue-200 bg-blue-100 text-blue-700"
                                : "border-amber-200 bg-amber-100 text-amber-700"
                        }`}
                      >
                        {reservation.status || "—"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap text-sm text-gray-600">
                      {formatDateTime(reservation.createdAt)}
                    </td>
                    <td>
                      <div className="flex items-center justify-center">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-rose-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-900/30"
                          title="Delete Reservation"
                          onClick={() =>
                            handleDelete(reservation._id, reservation.guestName)
                          }
                        >
                          <MdDelete className="text-base" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationsHistory;
