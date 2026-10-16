import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FaPhone,
  FaIdCard,
  FaCalendarAlt,
  FaBed,
  FaMoneyBillWave,
  FaArrowLeft,
  FaPrint,
} from "react-icons/fa";
import { MdPeople, MdSearch } from "react-icons/md";
import useAxios from "../../../../hooks/useAxios";
import { Link } from "react-router";
import useUserStatus from "../../../../hooks/useUserStatus";
import CheckoutInvoice from "../../../../components/CheckoutInvoice";
import Swal from "sweetalert2";
import { RiHome3Line } from "react-icons/ri";

const GuestHistory = () => {
  const axiosInstance = useAxios();
  const { hotelEmail, statusLoading } = useUserStatus();
  const [selectedCheckout, setSelectedCheckout] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Unique guests
  const {
    data: guests = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["unique-guests", hotelEmail],
    queryFn: async () => {
      const res = await axiosInstance.get("/unique-guests", {
        params: { hotelEmail },
      });
      return res.data;
    },
    enabled: !!hotelEmail && !statusLoading,
  });

  // Hotel info
  const { data: hotelInfo } = useQuery({
    queryKey: ["hotel-info", hotelEmail],
    queryFn: async () => {
      const res = await axiosInstance.get("/hotels/by-email", {
        params: { email: hotelEmail },
      });
      return res.data;
    },
    enabled: !!hotelEmail && !statusLoading,
  });

  // Filter by name, contact, or NID
  const term = searchTerm.toLowerCase().trim();
  const filteredGuests = term
    ? guests.filter((guest) => {
        const guestName = (guest.guestName || "").toLowerCase();
        const contactNumber = String(guest.contactNumber || "").toLowerCase();
        const nidNumber = String(guest.nidNumber || "").toLowerCase();

        return (
          guestName.includes(term) ||
          contactNumber.includes(term) ||
          nidNumber.includes(term)
        );
      })
    : guests;

  // Load all stays of a guest and let user choose an invoice
  const handlePrintInvoice = async (guest) => {
    try {
      const res = await axiosInstance.get("/check-out/guest", {
        params: {
          hotelEmail,
          contactNumber: guest.contactNumber,
          nidNumber: guest.nidNumber || "",
        },
      });

      const guestCheckouts = res.data;

      if (!guestCheckouts?.length) {
        Swal.fire({
          icon: "info",
          title: "No Invoice Found",
          text: "No full checkout record found for this guest",
        });
        return;
      }

      if (guestCheckouts.length === 1) {
        setSelectedCheckout(guestCheckouts[0]);
        setShowInvoice(true);
        return;
      }

      const options = {};
      guestCheckouts.forEach((checkout, index) => {
        const date =
          checkout.actualCheckoutDate ||
          checkout.checkOutDate ||
          "Unknown Date";
        const room = checkout.roomNumber || "—";
        const amount = Number(
          checkout.finalAmount || checkout.totalCharges || 0,
        ).toLocaleString();

        options[index] = `${date} | Room ${room} | ৳${amount}`;
      });

      const { value: selectedIndex } = await Swal.fire({
        title: `${guest.guestName} - Select Stay`,
        text: "This guest stayed multiple times. Choose which invoice to print:",
        input: "select",
        inputOptions: options,
        inputPlaceholder: "Select a stay",
        showCancelButton: true,
        confirmButtonText: "Print This Invoice",
        confirmButtonColor: "#be123c",
        cancelButtonColor: "#6b7280",
      });

      if (selectedIndex !== undefined && selectedIndex !== null) {
        setSelectedCheckout(guestCheckouts[Number(selectedIndex)]);
        setShowInvoice(true);
      }
    } catch (error) {
      console.error("Failed to load guest invoice:", error);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.response?.data?.message || "Could not load invoice data",
      });
    }
  };

  if (statusLoading || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-rose-900" />
      </div>
    );
  }

  if (!hotelEmail) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center text-amber-800">
          Hotel account information is unavailable. Please refresh or sign in
          again.
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-800">
          <p className="font-semibold">Failed to load guest history.</p>
          <p className="mt-1 text-sm">
            {error?.message || "Please try again."}
          </p>
        </div>
      </div>
    );
  }

  // Show both invoices
  if (showInvoice && selectedCheckout) {
    return (
      <div className="mx-auto max-w-7xl p-4 sm:p-6">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center print:hidden">
          <div>
            <h1 className="text-2xl font-bold text-rose-900">Guest Invoices</h1>
            <p className="mt-1 text-sm text-gray-500">
              Print the guest and hotel copies of the checkout invoice.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="btn gap-2 border-none bg-rose-900 text-white hover:bg-rose-800"
            >
              <FaPrint /> Print Both Invoices
            </button>

            <button
              type="button"
              onClick={() => {
                setShowInvoice(false);
                setSelectedCheckout(null);
              }}
              className="btn gap-2 border-rose-900 text-rose-900 btn-outline"
            >
              <FaArrowLeft /> Back to Guest List
            </button>
          </div>
        </div>

        <div className="print-area">
          <CheckoutInvoice
            checkoutData={selectedCheckout}
            hotelInfo={hotelInfo}
            variant="guest"
          />
          <CheckoutInvoice
            checkoutData={selectedCheckout}
            hotelInfo={hotelInfo}
            variant="hotel"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-900 shadow-md shadow-rose-900/20">
            <MdPeople className="text-2xl text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-rose-900">Guest History</h1>
            <p className="text-sm text-gray-500">
              All unique guests who have stayed at your hotel.
            </p>
          </div>
        </div>

        <Link
          to="/dashboard/guests"
          aria-label="Back to guests"
          className="flex h-10 w-10 items-center justify-center self-start rounded-xl border border-rose-200 text-rose-900 transition hover:bg-rose-900 hover:text-white sm:self-auto"
        >
          <RiHome3Line className="text-xl" />
        </Link>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Total Unique Guests
          </p>
          <p className="mt-2 text-3xl font-bold text-rose-900">
            {guests.length}
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Matching Guests</p>
          <p className="mt-2 text-3xl font-bold text-emerald-700">
            {filteredGuests.length}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <label className="relative block max-w-xl">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-400" />
          <input
            type="text"
            placeholder="Search by guest name, contact, or NID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-rose-900 focus:ring-2 focus:ring-rose-900/10"
          />
        </label>
        {term && (
          <p className="mt-2 text-xs text-gray-500">
            Showing {filteredGuests.length} of {guests.length} guests
          </p>
        )}
      </div>

      {/* Guest table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg shadow-gray-200/50">
        <div className="flex flex-col gap-1 border-b border-rose-100 bg-rose-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-bold text-rose-900">Guest Records</h2>
          <span className="text-sm text-rose-800">
            {filteredGuests.length}{" "}
            {filteredGuests.length === 1 ? "guest" : "guests"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr className="bg-white text-xs uppercase tracking-wide text-gray-500">
                <th className="font-semibold">Guest</th>
                <th className="font-semibold">Contact</th>
                <th className="font-semibold">NID</th>
                <th className="font-semibold">Total Stays</th>
                <th className="font-semibold">Last Stay</th>
                <th className="font-semibold">Last Room</th>
                <th className="text-right font-semibold">Total Spent</th>
                <th className="text-center font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-gray-400">
                    {term ? "No matching guests found." : "No guests found."}
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => (
                  <tr
                    key={guest._id}
                    className="border-t border-gray-100 transition hover:bg-rose-50/40"
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-rose-100 ring-offset-1">
                          {guest.personImage ? (
                            <img
                              src={`${import.meta.env.VITE_API_URL || "http://localhost:3000"}${guest.personImage}`}
                              alt={guest.guestName || "Guest"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-rose-100 text-lg font-bold text-rose-900">
                              {guest.guestName?.charAt(0)?.toUpperCase() || "G"}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {guest.guestName || "—"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {guest.designation || "Guest"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <FaPhone className="text-xs text-rose-600" />
                        {guest.contactNumber || "—"}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <FaIdCard className="text-xs text-rose-600" />
                        {guest.nidNumber || "—"}
                      </div>
                    </td>
                    <td>
                      <span className="inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-900">
                        {guest.totalStays || 0}{" "}
                        {(guest.totalStays || 0) === 1 ? "stay" : "stays"}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaCalendarAlt className="shrink-0 text-rose-600" />
                        {guest.lastCheckoutDate
                          ? new Date(guest.lastCheckoutDate).toLocaleDateString(
                              "en-GB",
                            )
                          : "—"}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <FaBed className="shrink-0 text-rose-600" />
                        {guest.lastRoomNumber || "—"}
                      </div>
                      <p className="pl-5 text-xs text-gray-500">
                        {guest.lastRoomVariant || ""}
                      </p>
                    </td>
                    <td className="text-right">
                      <div className="inline-flex items-center justify-end gap-1 font-bold text-rose-900">
                        <FaMoneyBillWave className="text-xs" />৳
                        {Number(guest.totalSpent || 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="text-center">
                      <button
                        type="button"
                        onClick={() => handlePrintInvoice(guest)}
                        className="btn btn-sm gap-2 border-none bg-rose-900 text-white hover:bg-rose-800"
                        title="Print Invoice"
                      >
                        <FaPrint /> Print
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GuestHistory;
