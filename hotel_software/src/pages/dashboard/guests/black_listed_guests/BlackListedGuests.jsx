import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import useAxios from "../../../../hooks/useAxios";
import { RiHome3Line } from "react-icons/ri";
import { MdBlock, MdSearch } from "react-icons/md";
import useUserStatus from "../../../../hooks/useUserStatus";

const BlackListedGuests = () => {
  const axiosInstance = useAxios();
  const { hotelEmail, statusLoading } = useUserStatus();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: bannedGuests = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["banned-guests", hotelEmail],
    queryFn: async () => {
      const res = await axiosInstance.get("/banned-guests", {
        params: { hotelEmail },
      });
      return res.data;
    },
    enabled: !!hotelEmail && !statusLoading,
  });

  const term = searchTerm.toLowerCase().trim();
  const filteredGuests = term
    ? bannedGuests.filter((guest) => {
        const guestName = (guest.guestName || "").toLowerCase();
        const nidNumber = String(guest.nidNumber || "").toLowerCase();
        const contactNumber = String(guest.contactNumber || "").toLowerCase();

        return (
          guestName.includes(term) ||
          nidNumber.includes(term) ||
          contactNumber.includes(term)
        );
      })
    : bannedGuests;

  if (statusLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <span className="loading loading-spinner loading-lg text-rose-900" />
      </div>
    );
  }

  if (!hotelEmail) {
    return (
      <div className="text-center text-gray-500 py-10">
        Hotel account information is unavailable. Please sign in again.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <span className="loading loading-spinner loading-lg text-rose-900" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-error py-10">
        <p>Failed to load blacklisted guests.</p>
        <p className="text-sm">{error?.message}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto p-6">
      <div className="flex justify-between items-start gap-4 mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-full bg-rose-900 flex items-center justify-center shadow-md shrink-0">
            <MdBlock className="text-xl text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-rose-900">
              Blacklisted Guests
            </h1>
            <p className="text-sm text-gray-500">
              Manage all guests currently added to the blacklist.
            </p>
          </div>
        </div>

        <Link
          to="/dashboard/guests"
          aria-label="Return to guests dashboard"
          className="flex items-center justify-center w-9 h-9 border border-rose-900 text-rose-900 hover:bg-rose-900 hover:text-white rounded-lg transition-colors shrink-0"
        >
          <RiHome3Line className="text-xl" />
        </Link>
      </div>

      <div className="mb-4">
        <div className="relative max-w-md">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Search by name, NID or contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-900/30 focus:border-rose-900 text-sm"
          />
        </div>
        {term && (
          <p className="text-xs text-gray-500 mt-1.5">
            Showing {filteredGuests.length} of {bannedGuests.length} results
          </p>
        )}
      </div>

      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        {filteredGuests.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            {term
              ? "No matching blacklisted guests found."
              : "No blacklisted guests found."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-rose-50 text-rose-900 text-sm">
                  <th className="font-semibold">Guest Name</th>
                  <th className="font-semibold">Guest ID</th>
                  <th className="font-semibold">Designation</th>
                  <th className="font-semibold">Address</th>
                  <th className="font-semibold">NID Number</th>
                  <th className="font-semibold">Contact Number</th>
                  <th className="font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredGuests.map((guest) => (
                  <tr
                    key={guest._id}
                    className="hover:bg-rose-50/50 border-b border-gray-100"
                  >
                    <td className="font-semibold">{guest.guestName || "—"}</td>
                    <td className="text-sm text-gray-600">
                      {guest.checkinId || "—"}
                    </td>
                    <td className="text-sm">{guest.designation || "—"}</td>
                    <td className="text-sm text-gray-600">
                      {guest.guestAddress || "—"}
                    </td>
                    <td className="text-sm">{guest.nidNumber || "—"}</td>
                    <td className="text-sm">{guest.contactNumber || "—"}</td>
                    <td className="text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-black text-white">
                        Blacklisted
                      </span>
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

export default BlackListedGuests;
