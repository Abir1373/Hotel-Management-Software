import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  MdEdit,
  MdRestaurantMenu,
  MdWorkHistory,
  MdSearch,
} from "react-icons/md";
import { RiHome3Line } from "react-icons/ri";
import { Link } from "react-router";
import useAxios from "../../../../hooks/useAxios";
import { FaFileInvoiceDollar } from "react-icons/fa";
import useUserStatus from "../../../../hooks/useUserStatus";

const RestaurantOrdersHistory = () => {
  const axiosInstance = useAxios();
  const { hotelEmail, statusLoading } = useUserStatus();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: restaurantOrders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["restaurant-orders-history", hotelEmail],
    queryFn: async () => {
      const res = await axiosInstance.get("/restaurant-orders", {
        params: { hotelEmail },
      });
      return res.data;
    },
    enabled: Boolean(hotelEmail) && !statusLoading,
  });

  const term = searchTerm.toLowerCase().trim();
  const filteredOrders = term
    ? restaurantOrders.filter((order) => {
        const guestName = (order.guestName || "").toLowerCase();
        const roomNumber = String(order.roomNumber || "").toLowerCase();
        return guestName.includes(term) || roomNumber.includes(term);
      })
    : restaurantOrders;

  if (statusLoading) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        <span className="loading loading-spinner text-error" />
      </div>
    );
  }

  if (!hotelEmail) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-rose-100 bg-white p-8 text-center shadow-lg">
        <MdWorkHistory className="mx-auto mb-3 text-4xl text-rose-900" />
        <h2 className="text-lg font-bold text-rose-900">
          Hotel account unavailable
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          We couldn't identify your hotel account. Please sign in again or
          refresh the page.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="btn mt-4 border-none bg-rose-900 text-white hover:bg-rose-800"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto p-4 sm:p-6">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-900 shadow-md">
            <MdWorkHistory className="text-xl text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-rose-900">
              Restaurant Orders History
            </h1>
            <p className="text-sm text-gray-500">
              View all previous restaurant food orders.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/dashboard/services/restaurant_orders"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-rose-900 text-rose-900 transition-colors hover:bg-rose-900 hover:text-white"
            title="New Restaurant Order"
          >
            <MdRestaurantMenu className="text-xl" />
          </Link>
          <Link
            to="/dashboard/services"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-rose-900 text-rose-900 transition-colors hover:bg-rose-900 hover:text-white"
            title="Back to Services"
          >
            <RiHome3Line className="text-xl" />
          </Link>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative max-w-md">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-400" />
          <input
            type="text"
            placeholder="Search by guest name or room number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm focus:border-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-900/30"
          />
        </div>
        {searchTerm && (
          <p className="mt-1.5 text-xs text-gray-500">
            Showing {filteredOrders.length} of {restaurantOrders.length} results
          </p>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <span className="loading loading-spinner loading-lg text-rose-900" />
          </div>
        ) : isError ? (
          <div className="py-20 text-center font-medium text-red-500">
            Failed to load restaurant orders. Please try again.
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            {searchTerm
              ? "No matching restaurant orders found."
              : "No restaurant orders found."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-rose-50 text-sm text-rose-900">
                  <th className="py-4 font-semibold">#</th>
                  <th className="font-semibold">Room</th>
                  <th className="font-semibold">Guest Name</th>
                  <th className="font-semibold">Date & Time</th>
                  <th className="font-semibold">Waiter</th>
                  <th className="font-semibold">Items</th>
                  <th className="font-semibold">Payment Method</th>
                  <th className="text-right font-semibold">Total</th>
                  <th className="text-center font-semibold">Status</th>
                  <th className="text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-100 hover:bg-rose-50/50"
                  >
                    <td className="font-medium text-gray-500">{index + 1}</td>
                    <td>
                      <span className="font-semibold text-gray-800">
                        {order.roomNumber ? `Room ${order.roomNumber}` : "—"}
                      </span>
                    </td>
                    <td className="font-medium">{order.guestName || "—"}</td>
                    <td className="text-sm text-gray-600">
                      <div>{order.orderDate || "—"}</div>
                      <div className="text-xs text-gray-400">
                        {order.orderTime || ""}
                      </div>
                    </td>
                    <td className="text-sm">{order.assignedWaiter || "—"}</td>
                    <td>
                      <div className="space-y-1">
                        {order.foodItems?.length
                          ? order.foodItems.map((item, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-1 text-sm text-gray-700"
                              >
                                <span className="font-medium">
                                  {item.itemName}
                                </span>
                                <span className="text-gray-400">×</span>
                                <span className="text-gray-600">
                                  {item.quantity}
                                </span>
                              </div>
                            ))
                          : "—"}
                      </div>
                    </td>
                    <td className="text-sm">{order.paymentMethod || "—"}</td>
                    <td className="text-right">
                      <span className="text-base font-bold text-rose-900">
                        ৳{Number(order.totalAmount || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="text-center">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                          order.paymentStatus === "Paid"
                            ? "border-green-200 bg-green-100 text-green-700"
                            : "border-amber-200 bg-amber-100 text-amber-700"
                        }`}
                      >
                        {order.paymentStatus || "Due"}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/dashboard/services/restaurant_orders/invoice/${order._id}`}
                          className="btn btn-sm btn-outline gap-1 border-rose-900 text-rose-900 hover:bg-rose-900 hover:text-white"
                          title="Generate Invoice"
                        >
                          <FaFileInvoiceDollar />
                          Invoice
                        </Link>
                        <Link
                          to={`/dashboard/services/restaurant_orders/edit_restaurant_history/${order._id}`}
                          className="btn btn-sm gap-1 border-none bg-[#BF1E2E] text-white hover:bg-red-800"
                          title="Update Order"
                        >
                          <MdEdit />
                          Update
                        </Link>
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

export default RestaurantOrdersHistory;
