import { FaCar } from "react-icons/fa";
import { RiHome3Line } from "react-icons/ri";
import { Link } from "react-router";

const TransportService = () => {
  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between mb-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
              <FaCar className="text-xl text-white" />
            </div>

            <h1 className="text-lg font-bold text-rose-700">
              Transport Service
            </h1>
          </div>

          <p className="text-gray-500 ml-12">
            Create a new transport service booking.
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

          {/* Contact Number */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Contact Number</span>
            </label>
            <input
              type="tel"
              placeholder="e.g. 017XXXXXXXX"
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Pickup Location */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Pickup Location</span>
            </label>
            <input
              type="text"
              placeholder="Enter pickup location"
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Destination */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Destination</span>
            </label>
            <input
              type="text"
              placeholder="Enter destination"
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Pickup Date */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Pickup Date</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Pickup Time */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Pickup Time</span>
            </label>
            <input
              type="time"
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Vehicle Type */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Vehicle Type</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Sedan, SUV, Microbus"
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Driver Number */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Driver Number</span>
            </label>
            <input
              type="tel"
              placeholder="Enter driver contact number"
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Fare ($) */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Fare ($)</span>
            </label>
            <input
              type="number"
              placeholder="Enter fare amount"
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Booking Status */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Booking Status</span>
            </label>
            <select className="select select-bordered w-full bg-white">
              <option value="">Select status</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>
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
            Submit Booking
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransportService;
