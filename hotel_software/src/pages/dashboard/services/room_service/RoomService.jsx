const RoomService = () => {
  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8">
      <h1 className="text-3xl font-bold text-[#BF1E2E] mb-8">
        Room Service Request
      </h1>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Room Number */}
          <div>
            <label className="label">
              <span className="label-text">Room Number</span>
            </label>
            <input
              type="text"
              placeholder="e.g. 101"
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

          {/* Service Requested */}
          <div>
            <label className="label">
              <span className="label-text">Service Requested</span>
            </label>
            <select className="select select-bordered w-full bg-white">
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Dinner</option>
              <option>Beverages</option>
              <option>Housekeeping</option>
              <option>Other</option>
            </select>
          </div>

          {/* Assigned Staff */}
          <div>
            <label className="label">
              <span className="label-text">Assigned Staff</span>
            </label>
            <input
              type="text"
              placeholder="Staff Name"
              className="bg-white input input-bordered w-full"
            />
          </div>

          {/* Order Status */}
          <div>
            <label className="label">
              <span className="label-text">Order Status</span>
            </label>
            <select className="select select-bordered w-full bg-white">
              <option>Pending</option>
              <option>Preparing</option>
              <option>Delivered</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>

          {/* Total Charge */}
          <div>
            <label className="label">
              <span className="label-text">Total Charge ($)</span>
            </label>
            <input
              type="number"
              placeholder="0.00"
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
            placeholder="Any special requests..."
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
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoomService;
