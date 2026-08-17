import { MdRestaurantMenu } from "react-icons/md";
import { RiHome3Line } from "react-icons/ri";
import { Link } from "react-router";

const RestaurantOrders = () => {
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

        <Link to="/dashboard/services">
          <button
            type="button"
            className="flex items-center justify-center w-11 h-11 border border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white rounded-lg transition-colors"
          >
            <RiHome3Line className="text-xl" />
          </button>
        </Link>
      </div>

      {/* Form */}
      <form className="bg-white shadow-lg rounded-2xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Room Number */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Room Number</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 01"
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
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Food Item */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Food Item</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Chicken Biryani"
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Quantity</span>
            </label>
            <input
              type="number"
              placeholder="1"
              min="1"
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
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Total Amount */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Total Amount</span>
            </label>
            <input
              type="number"
              placeholder="Enter total amount"
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
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Payment Method</span>
            </label>
            <select className="select select-bordered w-full bg-white">
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
            <select className="select select-bordered w-full bg-white">
              <option value="">Select status</option>
              <option value="Due">Due</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>

        {/* Special Instruction */}
        <div className="mt-6">
          <label className="label">
            <span className="label-text font-medium">Special Instruction</span>
          </label>
          <textarea
            rows="4"
            placeholder="Enter any special requests..."
            className="textarea textarea-bordered w-full bg-white"
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="reset"
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
