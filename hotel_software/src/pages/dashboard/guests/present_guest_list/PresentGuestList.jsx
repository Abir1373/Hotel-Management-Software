import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import useAxios from "../../../../hooks/useAxios";
import { MdOutlinePlaylistAddCheckCircle, MdSearch } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import useUserStatus from "../../../../hooks/useUserStatus";
import { RiHome3Line } from "react-icons/ri";

const PresentGuestList = () => {
  const axiosInstance = useAxios();
  const { hotelEmail, statusLoading } = useUserStatus();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: checkIns = [],
    isLoading,
    isError,
    refetch,
    error,
  } = useQuery({
    queryKey: ["check-ins", hotelEmail],
    queryFn: async () => {
      const res = await axiosInstance.get("/check-in", {
        params: {
          hotelEmail,
        },
      });
      return res.data;
    },
    enabled: !!hotelEmail && !statusLoading,
  });

  // Simple filter by name, contact, or room number
  const term = searchTerm.toLowerCase().trim();
  const filteredCheckIns = term
    ? checkIns.filter((checkIn) => {
        const guestName = (checkIn.guestName || "").toLowerCase();
        const contactNumber = String(checkIn.contactNumber || "").toLowerCase();
        const roomNumber = String(checkIn.roomNumber || "").toLowerCase();

        return (
          guestName.includes(term) ||
          contactNumber.includes(term) ||
          roomNumber.includes(term)
        );
      })
    : checkIns;

  const Guest_Status_Change = async (checkInId, status, checkIn) => {
    if (status === "Normal") {
      const res = await axiosInstance.delete(`/banned-guests/${checkInId}`);

      if (res.data.deletedCount > 0) {
        Swal.fire({
          title: "Guest Status Updated!",
          text: "Guest has been removed from the banned guest list.",
          icon: "success",
          confirmButtonColor: "#BF1E2E",
        });
      }
      refetch();
    } else {
      const bannedGuest = {
        hotelEmail: checkIn.hotelEmail,
        checkinId: checkIn._id,
        designation: checkIn.designation,
        guestName: checkIn.guestName,
        guestAddress: checkIn.guestAddress,
        nidNumber: checkIn.nidNumber,
        contactNumber: checkIn.contactNumber,
      };

      // Check whether NID already exists
      const checkNid = await axiosInstance.get(
        `/banned-guests/check/${checkIn.nidNumber}`,
      );

      if (checkNid.data.exists) {
        Swal.fire({
          title: "Already Blacklisted!",
          text: `${checkIn.guestName} is already in the blacklisted guest list.`,
          icon: "warning",
          confirmButtonColor: "#BF1E2E",
        });

        return;
      }

      // NID doesn't exist, so insert guest
      const res = await axiosInstance.post("/banned-guests", bannedGuest);

      if (res.data.insertedId) {
        Swal.fire({
          title: "Guest Banned!",
          text: `${checkIn.guestName} has been added to the banned guest list.`,
          icon: "success",
          confirmButtonColor: "#BF1E2E",
        });
      }
      refetch();
    }
  };

  if (statusLoading) {
    return <span className="loading loading-spinner text-error"></span>;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <span className="loading loading-spinner loading-lg text-rose-900"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-error py-10">
        <p>Failed to load guests.</p>
        <p className="text-sm">{error?.message}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-rose-900 flex items-center justify-center shadow-md">
              <MdOutlinePlaylistAddCheckCircle className="text-xl text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-rose-900">
                Present Guest List
              </h1>
              <p className="text-sm text-gray-500">
                Manage all currently checked-in guests.
              </p>
            </div>
          </div>
        </div>

        <Link to="/dashboard/guests">
          <button
            type="button"
            className="flex items-center justify-center w-9 h-9 border border-rose-900 text-rose-900 hover:bg-rose-900 hover:text-white rounded-lg transition-colors"
          >
            <RiHome3Line className="text-xl" />
          </button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Search by name, contact or room number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-900/30 focus:border-rose-900 text-sm"
          />
        </div>
        {term && (
          <p className="text-xs text-gray-500 mt-1.5">
            Showing {filteredCheckIns.length} of {checkIns.length} results
          </p>
        )}
      </div>

      {/* Table Card */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        {filteredCheckIns.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            {term ? "No matching guests found." : "No check-in records found."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-rose-50 text-rose-900 text-sm">
                  <th className="font-semibold">Guest Name</th>
                  <th className="font-semibold">Guest Id</th>
                  <th className="font-semibold">Contact</th>
                  <th className="font-semibold">Room</th>
                  <th className="font-semibold">Variant</th>
                  <th className="font-semibold">Check In</th>
                  <th className="font-semibold">Check Out</th>
                  <th className="font-semibold">Nights</th>
                  <th className="font-semibold">Guests</th>
                  <th className="font-semibold text-right">Total</th>
                  <th className="font-semibold text-right">Advance</th>
                  <th className="font-semibold text-right">Due</th>
                  <th className="font-semibold text-center">Status</th>
                  <th className="font-semibold text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredCheckIns.map((checkIn) => (
                  <tr
                    key={checkIn._id}
                    className="hover:bg-rose-50/50 border-b border-gray-100"
                  >
                    <td>
                      <div className="font-semibold">{checkIn.guestName}</div>
                      <div className="text-xs text-gray-500">
                        {checkIn.designation || "—"}
                      </div>
                    </td>

                    <td className="text-sm text-gray-600">
                      {checkIn._id || "—"}
                    </td>

                    <td className="text-sm">{checkIn.contactNumber || "—"}</td>

                    <td className="font-semibold text-gray-800">
                      Room {checkIn.roomNumber}
                    </td>

                    <td className="text-sm text-gray-600">
                      {checkIn.roomVariantName || "—"}
                    </td>

                    <td className="text-sm text-gray-600">
                      <div>
                        {checkIn.checkInDate
                          ? new Date(checkIn.checkInDate).toLocaleDateString()
                          : "—"}
                      </div>
                      <div className="text-xs text-gray-400">
                        {checkIn.checkInTime || ""}
                      </div>
                    </td>

                    <td className="text-sm text-gray-600">
                      {checkIn.checkOutDate
                        ? new Date(checkIn.checkOutDate).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="text-sm">{checkIn.numberOfNights || 0}</td>

                    <td className="text-sm">{checkIn.numberOfGuests || 1}</td>

                    <td className="text-right font-medium">
                      ৳{Number(checkIn.totalAmount || 0).toLocaleString()}
                    </td>

                    <td className="text-right text-green-600 font-medium">
                      ৳{Number(checkIn.advancePayment || 0).toLocaleString()}
                    </td>

                    <td className="text-right text-orange-600 font-medium">
                      ৳{Number(checkIn.dueAmount || 0).toLocaleString()}
                    </td>

                    <td className="text-center">
                      <select
                        defaultValue={checkIn.status}
                        onChange={(e) =>
                          Guest_Status_Change(
                            checkIn._id,
                            e.target.value,
                            checkIn,
                          )
                        }
                        className={`select select-sm w-32 font-semibold text-white border-none outline-none ${
                          checkIn.status === "Ban"
                            ? "bg-black hover:bg-gray-900"
                            : "bg-emerald-600 hover:bg-emerald-700"
                        }`}
                      >
                        <option value="Normal" className="bg-white text-black">
                          Normal
                        </option>
                        <option value="Ban" className="bg-white text-black">
                          Ban
                        </option>
                      </select>
                    </td>

                    <td className="text-center">
                      <Link
                        to={`/dashboard/guests/edit_guest_info/${checkIn._id}`}
                      >
                        <button
                          type="button"
                          className="btn btn-sm btn-outline border-rose-900 text-rose-900 hover:bg-rose-900 hover:text-white"
                          title="Edit Guest"
                        >
                          <FaUserEdit />
                        </button>
                      </Link>
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

export default PresentGuestList;
