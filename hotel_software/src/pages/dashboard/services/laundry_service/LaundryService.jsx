import { MdLocalLaundryService } from "react-icons/md";
import { RiHome3Line } from "react-icons/ri";
import { Link } from "react-router";

const LaundryService = () => {
  return (
    <div className="mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between mb-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
              <MdLocalLaundryService className="text-xl text-white" />
            </div>

            <h1 className="text-lg font-bold text-rose-700">Laundry Service</h1>
          </div>

          <p className="text-gray-500 ml-12">
            Create a new laundry service request.
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

          {/* Cloth Name */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Cloth Name</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Shirt, Pant, Suit"
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

          {/* Laundry Type */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Laundry Type</span>
            </label>
            <select className="select select-bordered w-full bg-white">
              <option value="">Select laundry type</option>
              <option value="Wash">Wash</option>
              <option value="Dry Clean">Dry Clean</option>
              <option value="Iron">Iron</option>
              <option value="Wash & Iron">Wash & Iron</option>
            </select>
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

          {/* Delivery Date */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Delivery Date</span>
            </label>
            <input
              type="date"
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

          {/* Total Cost */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Total Cost</span>
            </label>
            <input
              type="number"
              placeholder="Enter total cost"
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Status */}
          <div>
            <label className="label">
              <span className="label-text font-medium">Status</span>
            </label>
            <select className="select select-bordered w-full bg-white">
              <option value="">Select status</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Ready">Ready</option>
              <option value="Delivered">Delivered</option>
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
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default LaundryService;
