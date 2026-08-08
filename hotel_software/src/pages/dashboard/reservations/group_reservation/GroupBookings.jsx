const GroupBookings = () => {
  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8">
      <h1 className="text-3xl font-bold text-[#BF1E2E] mb-8">Group Booking</h1>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Group Name */}
          <div>
            <label className="label">
              <span className="label-text">Group Name</span>
            </label>
            <input
              type="text"
              placeholder="ABC Corporation"
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Booking ID */}
          <div>
            <label className="label">
              <span className="label-text">Booking ID</span>
            </label>
            <input
              type="text"
              placeholder="GRP-1001"
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Contact Person */}
          <div>
            <label className="label">
              <span className="label-text">Contact Person</span>
            </label>
            <input
              type="text"
              placeholder="John Smith"
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Contact Number */}
          <div>
            <label className="label">
              <span className="label-text">Contact Number</span>
            </label>
            <input
              type="tel"
              placeholder="+880 1234567890"
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Email */}
          <div>
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="group@email.com"
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Number of Guests */}
          <div>
            <label className="label">
              <span className="label-text">Number of Guests</span>
            </label>
            <input
              type="number"
              placeholder="25"
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Number of Rooms */}
          <div>
            <label className="label">
              <span className="label-text">Number of Rooms</span>
            </label>
            <input
              type="number"
              placeholder="10"
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Room Type */}
          <div>
            <label className="label">
              <span className="label-text">Preferred Room Type</span>
            </label>
            <select className="select select-bordered w-full bg-white">
              <option>Single</option>
              <option>Double</option>
              <option>Deluxe</option>
              <option>Suite</option>
              <option>Family</option>
            </select>
          </div>

          {/* Check In */}
          <div>
            <label className="label">
              <span className="label-text">Check In Date</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Check Out */}
          <div>
            <label className="label">
              <span className="label-text">Check Out Date</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Booking Status */}
          <div>
            <label className="label">
              <span className="label-text">Booking Status</span>
            </label>
            <select className="select select-bordered w-full bg-white">
              <option>Confirmed</option>
              <option>Pending</option>
              <option>Cancelled</option>
            </select>
          </div>

          {/* Payment Status */}
          <div>
            <label className="label">
              <span className="label-text">Payment Status</span>
            </label>
            <select className="select select-bordered w-full bg-white">
              <option>Pending</option>
              <option>Advance Paid</option>
              <option>Paid</option>
            </select>
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <label className="label">
            <span className="label-text">Additional Notes</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full h-32 bg-white"
            placeholder="Special requests, event details, meal preferences..."
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
            Create Group Booking
          </button>
        </div>
      </form>
    </div>
  );
};

export default GroupBookings;
