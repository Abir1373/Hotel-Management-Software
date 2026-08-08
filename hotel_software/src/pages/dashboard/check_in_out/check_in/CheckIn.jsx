const CheckIn = () => {
  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8">
      <h1 className="text-3xl font-bold text-[#BF1E2E] mb-8">Guest Check In</h1>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          {/* Reservation ID */}
          <div>
            <label className="label">
              <span className="label-text">Reservation ID</span>
            </label>
            <input
              type="text"
              placeholder="RES-1001"
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

          {/* Room Type */}
          <div>
            <label className="label">
              <span className="label-text">Room Type</span>
            </label>
            <select className="select select-bordered w-full bg-white">
              <option>Single</option>
              <option>Double</option>
              <option>Deluxe</option>
              <option>Suite</option>
              <option>Family</option>
            </select>
          </div>

          {/* Check In Date */}
          <div>
            <label className="label">
              <span className="label-text">Check In Date</span>
            </label>
            <input
              type="date"
              className="bg-white input input-bordered w-full"
            />
          </div>

          {/* Check In Time */}
          <div>
            <label className="label">
              <span className="label-text">Check In Time</span>
            </label>
            <input
              type="time"
              className="bg-white input input-bordered w-full"
            />
          </div>

          {/* Number of Guests */}
          <div>
            <label className="label">
              <span className="label-text">Number of Guests</span>
            </label>
            <input
              type="number"
              placeholder="2"
              className="bg-white input input-bordered w-full"
            />
          </div>

          {/* NID Number */}
          <div>
            <label className="label">
              <span className="label-text">NID Number</span>
            </label>
            <input
              type="text"
              placeholder="Enter National ID Number"
              className="bg-white input input-bordered w-full"
            />
          </div>

          {/* Contact Number */}
          <div>
            <label className="label">
              <span className="label-text">Contact Number</span>
            </label>
            <input
              type="tel"
              placeholder="+1 234 567 890"
              className="bg-white input input-bordered w-full"
            />
          </div>
        </div>

        {/* Special Requests */}
        <div>
          <label className="label">
            <span className="label-text">Special Requests</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full h-32 bg-white"
            placeholder="Any special requests from the guest..."
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
            Check In Guest
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckIn;
