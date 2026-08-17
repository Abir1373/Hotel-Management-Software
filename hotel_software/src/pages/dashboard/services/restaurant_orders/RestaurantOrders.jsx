import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { MdRestaurantMenu } from "react-icons/md";
import { RiHome3Line } from "react-icons/ri";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Link } from "react-router";
import useAxios from "../../../../hooks/useAxios";

const RestaurantOrders = () => {
  const axiosInstance = useAxios();
  const { register, handleSubmit, reset } = useForm();

  const [foodItems, setFoodItems] = useState([
    { itemName: "", quantity: 1, price: 0 },
  ]);

  // Fetch food menu
  const { data: menuItems = [] } = useQuery({
    queryKey: ["food-menu"],
    queryFn: async () => {
      const res = await axiosInstance.get("/food-menu");
      return res.data;
    },
  });

  const handleAddFoodItem = () => {
    setFoodItems([...foodItems, { itemName: "", quantity: 1, price: 0 }]);
  };

  const handleRemoveFoodItem = (index) => {
    if (foodItems.length === 1) return;
    const updated = foodItems.filter((_, i) => i !== index);
    setFoodItems(updated);
  };

  const handleFoodChange = (index, field, value) => {
    const updated = [...foodItems];

    if (field === "itemName") {
      const selected = menuItems.find((item) => item.itemName === value);
      updated[index].itemName = value;
      updated[index].price = selected ? selected.price : 0;
    } else {
      updated[index][field] = value;
    }

    setFoodItems(updated);
  };

  const totalAmount = foodItems.reduce((sum, item) => {
    return sum + Number(item.quantity || 0) * Number(item.price || 0);
  }, 0);

  const onSubmit = (data) => {
    const orderData = {
      ...data,
      foodItems,
      totalAmount,
    };
    console.log(orderData);
    // Later: axiosInstance.post("/restaurant-orders", orderData)
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between mb-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
              <MdRestaurantMenu className="text-xl text-white" />
            </div>

            <h1 className="text-lg font-bold text-rose-700">
              Restaurant Order
            </h1>
          </div>

          <p className="text-gray-500 ml-12">
            Create a new restaurant food order.
          </p>
        </div>

        <div className="flex flex-row gap-7">
          <Link to="/dashboard/services/restaurant_orders/food_menu">
            <button className="btn btn-outline btn-secondary hover:bg-rose-700">
              Food Menu
            </button>
          </Link>

          <Link to="/dashboard/services">
            <button
              type="button"
              className="flex items-center justify-center w-10 h-10 border border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white rounded-lg transition-colors"
            >
              <RiHome3Line className="text-xl" />
            </button>
          </Link>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-lg rounded-2xl p-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Room Number */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Room Number</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 01"
              {...register("roomNumber")}
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Guest Name */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Guest Name</span>
            </label>
            <input
              type="text"
              placeholder="Enter guest name"
              {...register("guestName")}
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Order Date */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Order Date</span>
            </label>
            <input
              type="date"
              {...register("orderDate")}
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Order Time */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Order Time</span>
            </label>
            <input
              type="time"
              {...register("orderTime")}
              className="input input-bordered w-full bg-white"
            />
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
              {...register("paymentMethod")}
              className="select select-bordered w-full bg-white"
            >
              <option value="">Select payment method</option>
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Online Payment">Online Payment</option>
              <option value="Room Charge">Room Charge</option>
            </select>
          </div>

          {/* Payment Status */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Payment Status</span>
            </label>
            <select
              {...register("paymentStatus")}
              className="select select-bordered w-full bg-white"
            >
              <option value="">Select status</option>
              <option value="Due">Due</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>

        {/* ========== Food Items Section ========== */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-rose-700">
              Food Items
            </h3>

            <button
              type="button"
              onClick={handleAddFoodItem}
              className="btn btn-sm bg-rose-700 text-white hover:bg-rose-800 border-none gap-2"
            >
              <FaPlus /> Add Food Item
            </button>
          </div>

          <div className="space-y-4">
            {foodItems.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-rose-50 border border-rose-100 rounded-xl p-4"
              >
                {/* Item Name */}
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
                  >
                    <option value="">Select food item</option>
                    {menuItems.map((menu) => (
                      <option key={menu._id} value={menu.itemName}>
                        {menu.itemName} — ৳{menu.price}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
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

                {/* Price */}
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

                {/* Remove */}
                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveFoodItem(index)}
                    disabled={foodItems.length === 1}
                    className="btn btn-sm btn-outline border-red-500 text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-40"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total Amount */}
        <div className="mt-6 bg-rose-50 border border-rose-200 rounded-xl p-5 flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-700">
            Total Amount
          </span>
          <span className="text-2xl font-bold text-rose-700">
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
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => {
              reset();
              setFoodItems([{ itemName: "", quantity: 1, price: 0 }]);
            }}
            className="btn btn-outline border-[#BF1E2E] text-[#BF1E2E] hover:bg-[#BF1E2E] hover:text-white"
          >
            Reset
          </button>

          <button
            type="submit"
            className="btn bg-[#BF1E2E] text-white hover:bg-red-800 border-none px-8"
          >
            Submit Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default RestaurantOrders;
