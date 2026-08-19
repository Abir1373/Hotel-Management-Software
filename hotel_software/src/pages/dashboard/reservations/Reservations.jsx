import { Link } from "react-router";
import { FaCalendarPlus, FaUsers } from "react-icons/fa";
import { LuBookImage } from "react-icons/lu";

const Reservations = () => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
          <LuBookImage className="text-xl text-white" />
        </div>

        <h1 className="text-lg font-bold text-rose-700">Reservations</h1>
      </div>

      <p className="text-gray-500 mb-10">
        Manage all hotel reservations from one place.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* New Reservation */}
        <Link
          to="/dashboard/reservations/new_reservation"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaCalendarPlus className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-700 mb-3">
            New Reservation
          </h2>

          <p className="text-gray-600 text-sm">
            Create a new reservation quickly and efficiently for your guests.
          </p>
        </Link>

        {/* Group Bookings */}
        <Link
          to="/dashboard/reservations/group_bookings"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaUsers className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-700 mb-3">
            Group Bookings
          </h2>

          <p className="text-gray-600 text-sm">
            Manage corporate events, tours, and other group reservations.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Reservations;
