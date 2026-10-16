import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { MdCheckCircleOutline } from "react-icons/md";
import { RiHome3Line } from "react-icons/ri";

import PageHeader from "../../../../components/PageHeader";
import useAxios from "../../../../hooks/useAxios";
import useUserStatus from "../../../../hooks/useUserStatus";

const CheckOut = () => {
  const axiosInstance = useAxios();
  const { hotelEmail, statusLoading } = useUserStatus();

  const {
    data: checkIns = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["check-ins-for-checkout", hotelEmail],
    queryFn: async () => {
      const res = await axiosInstance.get("/check-in", {
        params: { hotelEmail },
      });

      return res.data;
    },
    enabled: !!hotelEmail && !statusLoading,
  });

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
            title="Guest Check Out"
            subtitle="Review currently checked-in guests and complete their checkout process."
            icon={<MdCheckCircleOutline className="text-xl text-white" />}
          />
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

      {/* ===== Summary Card ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-md border border-rose-100 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-rose-300">
          <p className="text-sm font-medium text-gray-500 mb-2">
            Currently Checked-In
          </p>
          <h2 className="text-2xl font-bold text-rose-900">
            {isLoading ? "—" : checkIns.length}
          </h2>
          <p className="text-xs text-gray-500 mt-2">
            Guests currently registered for checkout
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-orange-100 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-orange-300">
          <p className="text-sm font-medium text-gray-500 mb-2">
            Outstanding Room Dues
          </p>
          <h2 className="text-2xl font-bold text-orange-700">
            {isLoading || isError
              ? "—"
              : `৳${checkIns
                  .reduce((sum, guest) => sum + Number(guest.dueAmount || 0), 0)
                  .toLocaleString()}`}
          </h2>
          <p className="text-xs text-gray-500 mt-2">
            Total room dues for listed guests
          </p>
        </div>
      </div>

      {/* ===== Guest Table Card ===== */}
      <div className="bg-white rounded-2xl shadow-md border border-rose-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-rose-100">
          <h2 className="text-lg font-bold text-rose-900">
            Currently Checked-In Guests
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Select a guest to review their bill and complete checkout.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg text-rose-900" />
          </div>
        ) : isError ? (
          <div className="text-center py-20 px-4">
            <p className="font-semibold text-red-500">
              Failed to load check-in data.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Please try again later.
            </p>
          </div>
        ) : checkIns.length === 0 ? (
          <div className="text-center py-20 px-4">
            <MdCheckCircleOutline className="text-5xl text-gray-300 mx-auto mb-3" />
            <h3 className="font-bold text-gray-700">
              No Guests Currently Checked-In
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              There are no guest records available for checkout.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-rose-900">
                <tr>
                  <th className="text-white">#</th>
                  <th className="text-white">Guest Name</th>
                  <th className="text-white">Room</th>
                  <th className="text-white">Check-In</th>
                  <th className="text-white">Check-Out</th>
                  <th className="text-white text-center">Nights</th>
                  <th className="text-white text-right">Room Total</th>
                  <th className="text-white text-right">Advance</th>
                  <th className="text-white text-right">Due</th>
                  <th className="text-white text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {checkIns.map((guest, index) => (
                  <tr
                    key={guest._id}
                    className="hover:bg-rose-50 transition-colors duration-200"
                  >
                    <td className="text-gray-500">{index + 1}</td>

                    <td className="font-semibold text-gray-800">
                      {guest.guestName}
                    </td>

                    <td>
                      <span className="font-semibold text-rose-900">
                        {guest.roomVariantName}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        Room {guest.roomNumber}
                      </p>
                    </td>

                    <td className="whitespace-nowrap">
                      <p className="text-sm">{guest.checkInDate}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {guest.checkInTime}
                      </p>
                    </td>

                    <td className="whitespace-nowrap text-sm">
                      {guest.checkOutDate}
                    </td>

                    <td className="text-center">{guest.numberOfNights}</td>

                    <td className="text-right whitespace-nowrap">
                      ৳{Number(guest.totalAmount || 0).toLocaleString()}
                    </td>

                    <td className="text-right whitespace-nowrap font-medium text-emerald-700">
                      ৳{Number(guest.advancePayment || 0).toLocaleString()}
                    </td>

                    <td className="text-right whitespace-nowrap font-bold text-rose-900">
                      ৳{Number(guest.dueAmount || 0).toLocaleString()}
                    </td>

                    <td className="text-center">
                      <Link
                        to={`/dashboard/check_in_out/check_out/${guest._id}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-800 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-rose-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <MdCheckCircleOutline className="text-lg" />
                        Checkout
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr className="bg-rose-50 font-bold">
                  <td colSpan={6} className="text-right text-rose-900">
                    Total
                  </td>
                  <td className="text-right whitespace-nowrap">
                    ৳
                    {checkIns
                      .reduce(
                        (sum, guest) => sum + Number(guest.totalAmount || 0),
                        0,
                      )
                      .toLocaleString()}
                  </td>
                  <td className="text-right whitespace-nowrap text-emerald-700">
                    ৳
                    {checkIns
                      .reduce(
                        (sum, guest) => sum + Number(guest.advancePayment || 0),
                        0,
                      )
                      .toLocaleString()}
                  </td>
                  <td className="text-right whitespace-nowrap text-rose-900">
                    ৳
                    {checkIns
                      .reduce(
                        (sum, guest) => sum + Number(guest.dueAmount || 0),
                        0,
                      )
                      .toLocaleString()}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckOut;
