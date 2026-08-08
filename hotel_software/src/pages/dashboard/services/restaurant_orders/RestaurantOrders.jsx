const RestaurantOrders = () => {
  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8">
      <h1 className="text-3xl font-bold text-[#BF1E2E] mb-8">
        Restaurant Order
      </h1>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order ID */}
          <div>
            <label className="label">
              <span className="label-text">Order ID</span>
            </label>
            <input
              type="text"
              placeholder="ORD-1001"
              className="bg-white input input-bordered w-full"
            />
          </div>

          {/* Guest Name */}
          <div>
            <label className="label">
              <span className="label-text">Guest Name</span>
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="bg-white input input-bordered w-full"
            />
          </div>

          {/* Room Number */}
          <div>
            <label className="label">
              <span className="label-text">Room Number</span>
            </label>
            <input
              type="text"
              placeholder="101"
              className="bg-white input input-bordered w-full"
            />
          </div>

          {/* Table Number */}
          <div>
            <label className="label">
              <span className="label-text">Table Number</span>
            </label>
            <input
              type="text"
              placeholder="Optional"
              className="bg-white input input-bordered w-full"
            />
          </div>

          {/* Food Item */}
          <div>
            <label className="label">
              <span className="label-text">Food Item</span>
            </label>
            <input
              type="text"
              placeholder="Burger, Pasta..."
              className="bg-white input input-bordered w-full"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="label">
              <span className="label-text">Quantity</span>
            </label>
            <input
              type="number"
              placeholder="1"
              className="bg-white input input-bordered w-full"
            />
          </div>

          {/* Order Date */}
          <div>
            <label className="label">
              <span className="label-text">Order Date</span>
            </label>
            <input
              type="date"
              className="bg-white input input-bordered w-full"
            />
          </div>

          {/* Order Time */}
          <div>
            <label className="label">
              <span className="label-text">Order Time</span>
            </label>
            <input
              type="time"
              className="bg-white input input-bordered w-full"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="label">
              <span className="label-text">Payment Method</span>
            </label>
            <select className="select select-bordered w-full bg-white">
              <option>Cash</option>
              <option>Credit Card</option>
              <option>Debit Card</option>
              <option>Online Payment</option>
              <option>Room Charge</option>
            </select>
          </div>

          {/* Order Status */}
          <div>
            <label className="label">
              <span className="label-text">Order Status</span>
            </label>
            <select className="select select-bordered w-full bg-white">
              <option>Pending</option>
              <option>Preparing</option>
              <option>Ready</option>
              <option>Served</option>
              <option>Cancelled</option>
            </select>
          </div>

          {/* Total Amount */}
          <div>
            <label className="label">
              <span className="label-text">Total Amount ($)</span>
            </label>
            <input
              type="number"
              placeholder="0.00"
              className="bg-white input input-bordered w-full"
            />
          </div>

          {/* Assigned Waiter */}
          <div>
            <label className="label">
              <span className="label-text">Assigned Waiter</span>
            </label>
            <input
              type="text"
              placeholder="Staff Name"
              className="bg-white input input-bordered w-full"
            />
          </div>
        </div>

        {/* Special Instructions */}
        <div>
          <label className="label">
            <span className="label-text">Special Instructions</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full h-32 bg-white"
            placeholder="Extra cheese, no onions..."
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="reset"
            className="btn btn-outline border-[#BF1E2E] text-[#BF1E2E] hover:bg-[#BF1E2E] hover:text-white"
          >
            Reset
          </button>

          <button
            type="submit"
            className="btn bg-[#BF1E2E] text-white hover:bg-red-800 border-none"
          >
            Save Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default RestaurantOrders;
