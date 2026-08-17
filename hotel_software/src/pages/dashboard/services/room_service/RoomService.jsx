import { MdRoomService } from "react-icons/md";
import { RiHome3Line } from "react-icons/ri";
import { Link } from "react-router";

const RoomService = () => {
  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}

      <div className="flex justify-between mb-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
              <MdRoomService className="text-xl text-white" />
            </div>

            <h1 className="text-lg font-bold text-rose-700">
              Room Service Request
            </h1>
          </div>

          <p className="text-gray-500 ml-12">
            Create a new room service request.
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

          {/* Room Variant Name */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Room Variant Name</span>
            </label>

            <input
              type="text"
              placeholder="e.g. Couple Room Suite"
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Ordered By */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Ordered By</span>
            </label>

            <input
              type="text"
              placeholder="Enter guest NID"
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Service Requested */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Service Requested</span>
            </label>

            <select className="select select-bordered w-full bg-white">
              <option value="">Select service</option>
              <option value="Housekeeping">Housekeeping</option>
              <option value="Room Cleaning">Room Cleaning</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Service Date */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Service Date</span>
            </label>

            <input
              type="date"
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Service Time */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Service Time</span>
            </label>

            <input
              type="time"
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Assigned Staff */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Assigned Staff</span>
            </label>

            <input
              type="text"
              placeholder="Enter staff name"
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Total Charge */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Total Charge</span>
            </label>

            <input
              type="number"
              placeholder="Enter service charge"
              className="input input-bordered w-full bg-white"
            />
          </div>
        </div>

        {/* Special Instructions */}
        <div className="mt-6">
          <label className="label">
            <span className="label-text font-medium">Special Instructions</span>
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
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoomService;
