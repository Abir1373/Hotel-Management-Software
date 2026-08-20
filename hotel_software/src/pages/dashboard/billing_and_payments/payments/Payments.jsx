import { Link } from "react-router-dom";
import {
  FaHandsWash,
  FaUtensils,
  FaConciergeBell,
  FaBus,
} from "react-icons/fa";
import { RiCoinsFill, RiHome3Line } from "react-icons/ri";
import { IoArrowBackCircleSharp } from "react-icons/io5";

const Payments = () => {
  return (
    <div className="p-6">
      {/* Header */}

      <div className="mb-8">
        <div className="flex justify-between">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
              <RiCoinsFill className="text-xl text-white" />
            </div>

            <h1 className="text-lg font-bold text-rose-700">
              <h1 className="text-lg font-bold text-rose-700">Payments</h1>
            </h1>
          </div>

          <Link to="/dashboard/billing_and_payments">
            <button
              type="button"
              className="flex items-center justify-center w-9 h-9 border border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white rounded-lg transition-colors"
            >
              <IoArrowBackCircleSharp className="text-2xl" />
            </button>
          </Link>
        </div>{" "}
      </div>

      <p className="text-gray-500 mb-10">
        Manage and settle dues for all guest services.
      </p>

      {/* Payment Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {/* Laundry Service Dues */}
        <Link
          to="/dashboard/billing_and_payments/payments/laundry_service_dues"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaHandsWash className="text-2xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-700 mb-3">
            Laundry Service Dues
          </h2>

          <p className="text-gray-600 text-sm">
            View and manage payment dues for laundry services.
          </p>
        </Link>

        {/* Restaurant Dues */}
        <Link
          to="/dashboard/billing_and_payments/payments/restaurant_dues"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaUtensils className="text-2xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-700 mb-3">
            Restaurant Dues
          </h2>

          <p className="text-gray-600 text-sm">
            Track and settle dues for restaurant bills and dining.
          </p>
        </Link>

        {/* Room Service Dues */}
        <Link
          to="/dashboard/billing_and_payments/payments/room_service_dues"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaConciergeBell className="text-2xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-700 mb-3">
            Room Service Dues
          </h2>

          <p className="text-gray-600 text-sm">
            Manage payment dues for in-room services.
          </p>
        </Link>

        {/* Transport Service Dues */}
        <Link
          to="/dashboard/billing_and_payments/payments/transport_service_dues"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaBus className="text-2xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-700 mb-3">
            Transport Service Dues
          </h2>

          <p className="text-gray-600 text-sm">
            Handle dues for guest transport and shuttle services.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Payments;
