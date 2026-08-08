const TransportService = () => {
  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8">
      <h1 className="text-3xl font-bold text-[#BF1E2E] mb-8">
        Transport Service
      </h1>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Booking ID */}
          <div>
            <label className="label">
              <span className="label-text">Booking ID</span>
            </label>
            <input
              type="text"
              placeholder="TR-1001"
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

          {/* Pickup Location */}
          <div>
            <label className="label">
              <span className="label-text">Pickup Location</span>
            </label>
            <input
              type="text"
              placeholder="Airport / Hotel"
              className="bg-white input input-bordered w-full"
            />
          </div>

          {/* Destination */}
          <div>
            <label className="label">
              <span className="label-text">Destination</span>
            </label>
            <input
              type="text"
              placeholder="City Center"
              className="bg-white input input-bordered w-full"
            />
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

          {/* Pickup Time */}
          <div>
            <label className="label">
              <span className="label-text">Pickup Time</span>
            </label>
            <input
              type="time"
              className="bg-white input input-bordered w-full"
            />
          </div>

          {/* Vehicle Type */}
          <div>
            <label className="label">
              <span className="label-text">Vehicle Type</span>
            </label>
            <select className="select select-bordered w-full bg-white">
              <option>Sedan</option>
              <option>SUV</option>
              <option>Van</option>
              <option>Luxury Car</option>
              <option>Mini Bus</option>
            </select>
          </div>

          {/* Driver Name */}
          <div>
            <label className="label">
              <span className="label-text">Driver Name</span>
            </label>
            <input
              type="text"
              placeholder="Driver Name"
              className="bg-white input input-bordered w-full"
            />
          </div>

          {/* Fare */}
          <div>
            <label className="label">
              <span className="label-text">Fare ($)</span>
            </label>
            <input
              type="number"
              placeholder="0.00"
              className="bg-white input input-bordered w-full"
            />
          </div>

          {/* Booking Status */}
          <div>
            <label className="label">
              <span className="label-text">Booking Status</span>
            </label>
            <select className="select select-bordered w-full bg-white">
              <option>Pending</option>
              <option>Confirmed</option>
              <option>Completed</option>
              <option>Cancelled</option>
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
            placeholder="Enter any special transport requests..."
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
            Save Booking
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransportService;
