const NewReservation = () => {
  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8">
      <h1 className="text-3xl font-bold text-[#BF1E2E] mb-8">
        New Reservation
      </h1>

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
              className="input input-bordered w-full bg-white"
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
              placeholder="guest@email.com"
              className="input input-bordered w-full bg-white"
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

          {/* Number of Rooms */}
          <div>
            <label className="label">
              <span className="label-text">Number of Rooms</span>
            </label>
            <input
              type="number"
              placeholder="1"
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Check In Date */}
          <div>
            <label className="label">
              <span className="label-text">Check In Date</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Check Out Date */}
          <div>
            <label className="label">
              <span className="label-text">Check Out Date</span>
            </label>
            <input
              type="date"
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
              placeholder="2"
              className="input input-bordered w-full bg-white"
            />
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

          {/* Reservation Status */}
          <div>
            <label className="label">
              <span className="label-text">Reservation Status</span>
            </label>
            <select className="select select-bordered w-full bg-white">
              <option>Confirmed</option>
              <option>Pending</option>
              <option>Cancelled</option>
            </select>
          </div>

          {/* Reserved By */}
          <div>
            <label className="label">
              <span className="label-text">Reserved By</span>
            </label>
            <input
              type="text"
              placeholder="Receptionist / Online / Agent"
              className="input input-bordered w-full bg-white"
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
            Create Reservation
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewReservation;
