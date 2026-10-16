import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { MdRestaurantMenu, MdWorkHistory } from "react-icons/md";
import { RiHome3Line } from "react-icons/ri";
import { FaPlus, FaTrash } from "react-icons/fa";
import { IoFastFoodSharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router";
import useAxios from "../../../../hooks/useAxios";
import Swal from "sweetalert2";
import useUserStatus from "../../../../hooks/useUserStatus";

const RestaurantOrders = () => {
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const { hotelEmail, statusLoading } = useUserStatus();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const [foodItems, setFoodItems] = useState([
    { itemName: "", quantity: 1, price: 0 },
  ]);
  const [selectedCheckIn, setSelectedCheckIn] = useState(null);

  // Get current check-in guests for the current hotel account.
  const {
    data: checkIns = [],
    isLoading: checkInsLoading,
    isError: checkInsError,
  } = useQuery({
    queryKey: ["check-ins", hotelEmail],
    queryFn: async () => {
      const res = await axiosInstance.get("/check-in", {
        params: { hotelEmail },
      });
      return res.data;
    },
    enabled: Boolean(hotelEmail) && !statusLoading,
  });

  // Fetch the food menu for the current hotel account.
  const {
    data: menuItems = [],
    isLoading: menuLoading,
    isError: menuError,
  } = useQuery({
    queryKey: ["food-menu", hotelEmail],
    queryFn: async () => {
      const res = await axiosInstance.get("/food-menu", {
        params: { hotelEmail },
      });
      return res.data;
    },
    enabled: Boolean(hotelEmail) && !statusLoading,
  });

  const handleRoomChange = (e) => {
    const roomNo = e.target.value;
    setValue("roomNumber", roomNo);

    const foundCheckIn = checkIns.find(
      (checkIn) => String(checkIn.roomNumber) === String(roomNo),
    );

    if (foundCheckIn) {
      setSelectedCheckIn(foundCheckIn);
      setValue("guestName", foundCheckIn.guestName || "");
    } else {
      setSelectedCheckIn(null);
      setValue("guestName", "");
    }
  };

  const handleAddFoodItem = () => {
    setFoodItems((current) => [
      ...current,
      { itemName: "", quantity: 1, price: 0 },
    ]);
  };

  const handleRemoveFoodItem = (index) => {
    setFoodItems((current) => {
      if (current.length === 1) return current;
      return current.filter((_, i) => i !== index);
    });
  };

  const handleFoodChange = (index, field, value) => {
    setFoodItems((current) =>
      current.map((item, i) => {
        if (i !== index) return item;

        if (field === "itemName") {
          const selected = menuItems.find((menu) => menu.itemName === value);
          return {
            ...item,
            itemName: value,
            price: selected ? Number(selected.price) || 0 : 0,
          };
        }

        return {
          ...item,
          [field]:
            field === "quantity" ? Math.max(1, Number(value) || 1) : value,
        };
      }),
    );
  };

  const totalAmount = foodItems.reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.price || 0),
    0,
  );

  const onSubmit = async (data) => {
    if (!hotelEmail || statusLoading) {
      await Swal.fire({
        title: "Account not ready",
        text: "Your hotel account information is not available yet. Please try again.",
        icon: "warning",
        confirmButtonColor: "#BF1E2E",
      });
      return;
    }

    try {
      const orderData = {
        ...data,
        foodItems,
        totalAmount,
        checkInInfo: selectedCheckIn || null,
        hotelEmail,
      };

      const res = await axiosInstance.post("/restaurant-orders", orderData);

      if (res.data.insertedId) {
        await Swal.fire({
          title: "Success!",
          text: "Restaurant order submitted successfully.",
          icon: "success",
          confirmButtonColor: "#BF1E2E",
        });
        navigate("/dashboard/services");
      }
    } catch (error) {
      await Swal.fire({
        title: "Order failed",
        text:
          error?.response?.data?.message ||
          "Could not submit the restaurant order. Please try again.",
        icon: "error",
        confirmButtonColor: "#BF1E2E",
      });
    }
  };

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
        <MdRestaurantMenu className="mx-auto mb-3 text-4xl text-rose-900" />
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
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-900 shadow-md">
            <MdRestaurantMenu className="text-xl text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-rose-900">
              Restaurant Order
            </h1>
            <p className="text-sm text-gray-500">
              Create a new restaurant food order.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/dashboard/services/restaurant_orders/food_menu">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-rose-900 text-rose-900 transition-colors hover:bg-rose-900 hover:text-white"
              title="Food Menu"
            >
              <IoFastFoodSharp className="text-xl" />
            </button>
          </Link>
          <Link to="/dashboard/services/restaurant_orders/restaurant_orders_history">
            <button
              type="button"
              title="Order History"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-rose-900 text-rose-900 transition-colors hover:bg-rose-900 hover:text-white"
            >
              <MdWorkHistory className="text-xl" />
            </button>
          </Link>
          <Link to="/dashboard/services">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-rose-900 text-rose-900 transition-colors hover:bg-rose-900 hover:text-white"
              title="Back to Services"
            >
              <RiHome3Line className="text-xl" />
            </button>
          </Link>
        </div>
      </div>

      {checkInsError && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          Could not load check-in rooms. You can still enter the guest name
          manually.
        </p>
      )}
      {menuError && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          Could not load the food menu. Please refresh or check your connection.
        </p>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-2xl bg-white p-5 shadow-lg sm:p-8"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Room Number (Optional) */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Room Number</span>
            </label>
            <select
              {...register("roomNumber")}
              onChange={handleRoomChange}
              className="select select-bordered w-full bg-white"
              defaultValue=""
              disabled={checkInsLoading}
            >
              <option value="">
                {checkInsLoading
                  ? "Loading rooms..."
                  : "Select room (optional)"}
              </option>
              {checkIns.map((checkIn) => (
                <option key={checkIn._id} value={checkIn.roomNumber}>
                  Room {checkIn.roomNumber}
                </option>
              ))}
            </select>
          </div>

          {/* Guest Name (Editable) */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Guest Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter guest name"
              {...register("guestName", { required: "Guest name is required" })}
              className="input input-bordered w-full bg-white"
            />
            {errors.guestName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.guestName.message}
              </p>
            )}
          </div>

          {/* Order Date */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Order Date</span>
            </label>
            <input
              type="date"
              {...register("orderDate", { required: "Order date is required" })}
              className="input input-bordered w-full bg-white"
            />
            {errors.orderDate && (
              <p className="mt-1 text-sm text-red-500">
                {errors.orderDate.message}
              </p>
            )}
          </div>

          {/* Order Time */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Order Time</span>
            </label>
            <input
              type="time"
              {...register("orderTime", { required: "Order time is required" })}
              className="input input-bordered w-full bg-white"
            />
            {errors.orderTime && (
              <p className="mt-1 text-sm text-red-500">
                {errors.orderTime.message}
              </p>
            )}
          </div>

          {/* Assigned Waiter */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Assigned Waiter</span>
            </label>
            <input
              type="text"
              placeholder="Enter waiter name"
              {...register("assignedWaiter")}
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Payment Method</span>
            </label>
            <select
              {...register("paymentMethod", {
                required: "Payment method is required",
              })}
              className="select select-bordered w-full bg-white"
              defaultValue=""
            >
              <option value="" disabled>
                Select payment method
              </option>
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Online Payment">Online Payment</option>
              <option value="Room Charge">Room Charge</option>
            </select>
            {errors.paymentMethod && (
              <p className="mt-1 text-sm text-red-500">
                {errors.paymentMethod.message}
              </p>
            )}
          </div>

          {/* Payment Status */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Payment Status</span>
            </label>
            <select
              {...register("paymentStatus", {
                required: "Payment status is required",
              })}
              className="select select-bordered w-full bg-white"
              defaultValue=""
            >
              <option value="" disabled>
                Select status
              </option>
              <option value="Due">Due</option>
              <option value="Paid">Paid</option>
            </select>
            {errors.paymentStatus && (
              <p className="mt-1 text-sm text-red-500">
                {errors.paymentStatus.message}
              </p>
            )}
          </div>

          {/* Active Status */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Active Status</span>
            </label>
            <select
              {...register("active_status", {
                required: "Active status is required",
              })}
              className="select select-bordered w-full bg-white"
              defaultValue="active"
            >
              <option value="" disabled>
                Select status
              </option>
              <option value="active">Active</option>
              <option value="left">Left</option>
            </select>
            {errors.active_status && (
              <p className="mt-1 text-sm text-red-500">
                {errors.active_status.message}
              </p>
            )}
          </div>
        </div>

        {/* Food Items Section */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-rose-900">
              Food Items
            </h3>
            <button
              type="button"
              onClick={handleAddFoodItem}
              className="btn btn-sm gap-2 border-none bg-rose-900 text-white hover:bg-rose-800"
            >
              <FaPlus /> Add Food Item
            </button>
          </div>

          <div className="space-y-4">
            {foodItems.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 items-end gap-4 rounded-xl border border-rose-100 bg-rose-50 p-4 md:grid-cols-12"
              >
                <div className="md:col-span-5">
                  <label className="label">
                    <span className="label-text font-medium">Item Name</span>
                  </label>
                  <select
                    value={item.itemName}
                    onChange={(e) =>
                      handleFoodChange(index, "itemName", e.target.value)
                    }
                    className="select select-bordered w-full bg-white"
                    disabled={menuLoading}
                  >
                    <option value="">
                      {menuLoading ? "Loading menu..." : "Select food item"}
                    </option>
                    {menuItems.map((menu) => (
                      <option key={menu._id} value={menu.itemName}>
                        {menu.itemName} — ৳{menu.price}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="label">
                    <span className="label-text font-medium">Quantity</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleFoodChange(index, "quantity", e.target.value)
                    }
                    className="input input-bordered w-full bg-white"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="label">
                    <span className="label-text font-medium">Price (৳)</span>
                  </label>
                  <input
                    type="number"
                    value={item.price}
                    readOnly
                    className="input input-bordered w-full bg-gray-100"
                  />
                </div>

                <div className="flex justify-end md:col-span-2">
                  <button
                    type="button"
                    onClick={() => handleRemoveFoodItem(index)}
                    disabled={foodItems.length === 1}
                    className="btn btn-sm btn-outline border-red-500 text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-40"
                    title="Remove food item"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total Amount */}
        <div className="mt-6 flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 p-5">
          <span className="text-lg font-semibold text-gray-700">
            Total Amount
          </span>
          <span className="text-2xl font-bold text-rose-900">
            ৳{totalAmount.toLocaleString()}
          </span>
        </div>

        {/* Special Instruction */}
        <div className="mt-6">
          <label className="label">
            <span className="label-text font-medium">Special Instruction</span>
          </label>
          <textarea
            rows="4"
            placeholder="Enter any special requests..."
            {...register("specialInstruction")}
            className="textarea textarea-bordered w-full bg-white"
          />
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => {
              reset();
              setFoodItems([{ itemName: "", quantity: 1, price: 0 }]);
              setSelectedCheckIn(null);
            }}
            className="btn btn-outline border-[#BF1E2E] text-[#BF1E2E] hover:bg-[#BF1E2E] hover:text-white"
          >
            Reset
          </button>
          <button
            type="submit"
            className="btn border-none bg-[#BF1E2E] px-8 text-white hover:bg-red-800"
          >
            Submit Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default RestaurantOrders;
