const LaundryService = () => {
  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8">
      <h1 className="text-3xl font-bold text-[#BF1E2E] mb-8">
        Laundry Service
      </h1>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Laundry ID */}
          <div>
            <label className="label">
              <span className="label-text">Laundry ID</span>
            </label>
            <input
              type="text"
              placeholder="LND-1001"
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

          {/* Clothing Type */}
          <div>
            <label className="label">
              <span className="label-text">Clothing Type</span>
            </label>
            <select className="select select-bordered w-full bg-white">
              <option>Shirt</option>
              <option>T-Shirt</option>
              <option>Trousers</option>
              <option>Suit</option>
              <option>Dress</option>
              <option>Bedsheet</option>
              <option>Towel</option>
              <option>Other</option>
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="label">
              <span className="label-text">Quantity</span>
            </label>
            <input
              type="number"
              placeholder="0"
              className="bg-white input input-bordered w-full"
            />
          </div>

          {/* Laundry Type */}
          <div>
            <label className="label">
              <span className="label-text">Laundry Type</span>
            </label>
            <select className="select select-bordered w-full bg-white">
              <option>Wash</option>
              <option>Dry Clean</option>
              <option>Iron</option>
              <option>Wash & Iron</option>
            </select>
          </div>

          {/* Pickup Date */}
          <div>
            <label className="label">
              <span className="label-text">Pickup Date</span>
            </label>
            <input
              type="date"
              className="bg-white input input-bordered w-full"
            />
          </div>

          {/* Delivery Date */}
          <div>
            <label className="label">
              <span className="label-text">Delivery Date</span>
            </label>
            <input
              type="date"
              className="bg-white input input-bordered w-full"
            />
          </div>

          {/* Express Service */}
          <div>
            <label className="label">
              <span className="label-text">Express Service</span>
            </label>
            <select className="select select-bordered w-full bg-white">
              <option>No</option>
              <option>Yes</option>
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

          {/* Total Cost */}
          <div>
            <label className="label">
              <span className="label-text">Total Cost ($)</span>
            </label>
            <input
              type="number"
              placeholder="0.00"
              className="bg-white input input-bordered w-full"
            />
          </div>

          {/* Status */}
          <div>
            <label className="label">
              <span className="label-text">Status</span>
            </label>
            <select className="select select-bordered w-full bg-white">
              <option>Pending</option>
              <option>Processing</option>
              <option>Ready</option>
              <option>Delivered</option>
            </select>
          </div>
        </div>

        {/* Special Instructions */}
        <div>
          <label className="label">
            <span className="label-text">Special Instructions</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full h-32 bg-white"
            placeholder="Any special washing instructions..."
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
            Save Laundry Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default LaundryService;
