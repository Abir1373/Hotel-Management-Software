import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate, Link } from "react-router";

import {
  FaUser,
  FaBed,
  FaUtensils,
  FaTshirt,
  FaShuttleVan,
  FaMoneyBillWave,
  FaPhone,
  FaIdCard,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import { MdCheckCircleOutline } from "react-icons/md";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import Swal from "sweetalert2";
import useAxios from "../../../../../hooks/useAxios";

const MainCheckout = () => {
  const { id } = useParams();
  const axiosInstance = useAxios();
  const navigate = useNavigate();

  const {
    data: guest,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["check-in-details", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/check-in/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // ====================== HELPER: Get order payment status ======================
  const getOrderStatus = (order) => {
    if (order.paymentStatus) return order.paymentStatus;

    if (order.foodItems?.some((item) => item.paymentStatus === "Paid")) {
      return "Paid";
    }

    return "Due";
  };

  // ====================== CALCULATIONS (Only Due) ======================
  const roomDue = Number(guest?.dueAmount) || 0;

  const restaurantDue = (guest?.restaurantOrders || [])
    .filter((order) => getOrderStatus(order) !== "Paid")
    .reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);

  const laundryDue = (guest?.laundryOrders || [])
    .filter((order) => getOrderStatus(order) !== "Paid")
    .reduce((sum, order) => sum + (Number(order.totalCost) || 0), 0);

  const transportDue = (guest?.transportOrders || [])
    .filter((order) => getOrderStatus(order) !== "Paid")
    .reduce((sum, order) => sum + (Number(order.fare) || 0), 0);

  const totalDue = roomDue + restaurantDue + laundryDue + transportDue;
  const advance = Number(guest?.advancePayment) || 0;

  // ====================== CHECKOUT HANDLER ======================
  const handleCheckout = async () => {
    const result = await Swal.fire({
      title: "Confirm Checkout?",
      html: `
        <div class="text-left space-y-1">
          <p>Room Due: <b>৳${roomDue.toLocaleString()}</b></p>
          <p>Restaurant Due: <b>৳${restaurantDue.toLocaleString()}</b></p>
          <p>Laundry Due: <b>৳${laundryDue.toLocaleString()}</b></p>
          <p>Transport Due: <b>৳${transportDue.toLocaleString()}</b></p>
          <hr class="my-2"/>
          <p class="text-lg">Total Remaining Due: <b class="text-rose-700">৳${totalDue.toLocaleString()}</b></p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#be123c",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Complete Checkout",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosInstance.patch(`/check-in/${id}`, {
        status: "Checked-Out",
        checkedOutAt: new Date(),
        finalDueAmount: totalDue,
      });

      Swal.fire({
        icon: "success",
        title: "Checked Out!",
        text: "Guest has been successfully checked out.",
        confirmButtonColor: "#be123c",
      });

      navigate("/dashboard/check_in_out/check_out");
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to complete checkout",
        confirmButtonColor: "#be123c",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-rose-700"></span>
      </div>
    );
  }

  if (isError || !guest) {
    return (
      <div className="text-center py-32">
        <p className="text-red-500 font-medium text-lg">
          Failed to load guest data
        </p>
        <Link
          to="/dashboard/check_in_out/check_out"
          className="btn btn-sm mt-4 bg-rose-700 text-white"
        >
          Go Back
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto p-6 max-w-6xl">
      {/* ====================== HEADER ====================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-rose-700 flex items-center justify-center shadow-lg">
            <MdCheckCircleOutline className="text-2xl text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-rose-700">Guest Checkout</h1>
            <p className="text-sm text-gray-500">
              Review full bill & complete checkout
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCheckout}
            className="btn bg-rose-700 hover:bg-rose-800 text-white border-none gap-2 shadow-md"
          >
            <FaMoneyBillWave />
            Complete Checkout
          </button>

          <Link to="/dashboard/check_in_out/check_out">
            <button className="btn btn-outline border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white">
              <IoArrowBackCircleSharp className="text-2xl" />
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ====================== LEFT CONTENT ====================== */}
        <div className="lg:col-span-2 space-y-6">
          {/* ---------- Guest Profile Card ---------- */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-rose-700 to-rose-600 p-6 text-white">
              <div className="flex items-center gap-5">
                {/* Person Image */}
                <div className="w-20 h-20 rounded-full border-4 border-white/30 overflow-hidden bg-white/20 flex-shrink-0">
                  {guest.personImage ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL || "http://localhost:3000"}${guest.personImage}`}
                      alt={guest.guestName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-bold">
                      {guest.guestName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-2xl font-bold">{guest.guestName}</h2>
                  <p className="text-rose-100 text-sm mt-1">
                    {guest.designation || "Guest"} • Room {guest.roomNumber}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-rose-100">
                    <span className="flex items-center gap-1">
                      <FaPhone className="text-xs" /> {guest.contactNumber}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaIdCard className="text-xs" /> {guest.nidNumber || "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {/* ... rest of the info remains the same ... */}
            </div>
          </div>

          {/* ---------- Restaurant Orders ---------- */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center">
                  <FaUtensils className="text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  Restaurant Orders
                </h3>
              </div>
              <span className="text-lg font-bold text-rose-700">
                Due: ৳{restaurantDue.toLocaleString()}
              </span>
            </div>

            {guest.restaurantOrders?.length > 0 ? (
              <div className="space-y-4">
                {guest.restaurantOrders.map((order, idx) => {
                  const status = getOrderStatus(order);
                  return (
                    <div
                      key={idx}
                      className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-500">
                          Order #{idx + 1}
                        </span>
                        <span
                          className={`badge badge-sm ${
                            status === "Paid"
                              ? "badge-success"
                              : "badge-warning"
                          }`}
                        >
                          {status}
                        </span>
                      </div>

                      {order.foodItems?.map((item, i) => (
                        <div
                          key={i}
                          className="flex justify-between text-sm py-1.5 border-b border-dashed border-gray-100 last:border-0"
                        >
                          <span>
                            {item.itemName}{" "}
                            <span className="text-gray-400">
                              × {item.quantity}
                            </span>
                          </span>
                          <span className="font-medium">
                            ৳{item.totalPrice}
                          </span>
                        </div>
                      ))}

                      <div className="flex justify-between font-semibold mt-3 pt-2">
                        <span>Order Total</span>
                        <span
                          className={
                            status === "Paid"
                              ? "text-green-600"
                              : "text-rose-700"
                          }
                        >
                          ৳{order.totalAmount}
                          {status === "Paid" && " (Paid)"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-sm text-center py-6">
                No restaurant orders found
              </p>
            )}
          </div>

          {/* ---------- Laundry Orders ---------- */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaTshirt className="text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  Laundry Orders
                </h3>
              </div>
              <span className="text-lg font-bold text-rose-700">
                Due: ৳{laundryDue.toLocaleString()}
              </span>
            </div>

            {guest.laundryOrders?.length > 0 ? (
              <div className="space-y-4">
                {guest.laundryOrders.map((order, idx) => {
                  const status = getOrderStatus(order);
                  return (
                    <div
                      key={idx}
                      className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">
                            {order.laundryType}
                          </span>
                          <span className="text-gray-400 mx-2">•</span>
                          <span className="text-gray-500">
                            {order.assignedStaff || "Unassigned"}
                          </span>
                        </div>
                        <span
                          className={`badge badge-sm ${
                            status === "Paid"
                              ? "badge-success"
                              : "badge-warning"
                          }`}
                        >
                          {status}
                        </span>
                      </div>

                      {order.clothItems?.map((item, i) => (
                        <div
                          key={i}
                          className="flex justify-between text-sm py-1.5 border-b border-dashed border-gray-100 last:border-0"
                        >
                          <span>
                            {item.clothName}{" "}
                            <span className="text-gray-400">
                              × {item.quantity}
                            </span>
                          </span>
                          <span className="font-medium">
                            ৳{item.totalPrice}
                          </span>
                        </div>
                      ))}

                      <div className="flex justify-between font-semibold mt-3 pt-2">
                        <span>Order Total</span>
                        <span
                          className={
                            status === "Paid"
                              ? "text-green-600"
                              : "text-rose-700"
                          }
                        >
                          ৳{order.totalCost}
                          {status === "Paid" && " (Paid)"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-sm text-center py-6">
                No laundry orders found
              </p>
            )}
          </div>

          {/* ---------- Transport Orders ---------- */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                  <FaShuttleVan className="text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">
                  Transport Orders
                </h3>
              </div>
              <span className="text-lg font-bold text-rose-700">
                Due: ৳{transportDue.toLocaleString()}
              </span>
            </div>

            {guest.transportOrders?.length > 0 ? (
              <div className="space-y-4">
                {guest.transportOrders.map((order, idx) => {
                  const status = getOrderStatus(order);
                  return (
                    <div
                      key={idx}
                      className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-700">
                          {order.vehicleType} • {order.driverNumber}
                        </span>
                        <span
                          className={`badge badge-sm ${
                            status === "Paid"
                              ? "badge-success"
                              : "badge-warning"
                          }`}
                        >
                          {status}
                        </span>
                      </div>

                      <div className="text-sm space-y-1 text-gray-600">
                        <p>
                          <span className="text-gray-400">From:</span>{" "}
                          {order.pickupLocation}
                        </p>
                        <p>
                          <span className="text-gray-400">To:</span>{" "}
                          {order.destination}
                        </p>
                        <p>
                          <span className="text-gray-400">Date:</span>{" "}
                          {order.pickupDate} at {order.pickupTime}
                        </p>
                      </div>

                      <div className="flex justify-between font-semibold mt-3 pt-2 border-t">
                        <span>Fare</span>
                        <span
                          className={
                            status === "Paid"
                              ? "text-green-600"
                              : "text-rose-700"
                          }
                        >
                          ৳{order.fare}
                          {status === "Paid" && " (Paid)"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-sm text-center py-6">
                No transport orders found
              </p>
            )}
          </div>
        </div>

        {/* ====================== RIGHT SIDE - BILL SUMMARY ====================== */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 sticky top-6 overflow-hidden">
            <div className="bg-rose-700 text-white px-6 py-4">
              <h3 className="text-lg font-bold">Bill Summary</h3>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Room Due</span>
                <span className="font-medium">৳{roomDue.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Restaurant Due</span>
                <span className="font-medium">
                  ৳{restaurantDue.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Laundry Due</span>
                <span className="font-medium">
                  ৳{laundryDue.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Transport Due</span>
                <span className="font-medium">
                  ৳{transportDue.toLocaleString()}
                </span>
              </div>

              <div className="border-t border-dashed border-gray-200 my-2"></div>

              <div className="flex justify-between text-sm text-green-600">
                <span>Advance Paid</span>
                <span className="font-medium">৳{advance.toLocaleString()}</span>
              </div>

              <div className="border-t border-dashed border-gray-200 my-2"></div>

              <div className="bg-rose-50 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-rose-800">Total Due</span>
                  <span className="text-2xl font-bold text-rose-700">
                    ৳{totalDue.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="btn bg-rose-700 hover:bg-rose-800 text-white border-none w-full mt-4 gap-2"
              >
                <FaMoneyBillWave />
                Complete Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainCheckout;
