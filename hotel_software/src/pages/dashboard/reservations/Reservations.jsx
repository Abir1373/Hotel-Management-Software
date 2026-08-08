import { Link } from "react-router";
import { FaCalendarPlus, FaUsers } from "react-icons/fa";
import { LuBookImage } from "react-icons/lu";
const Reservations = () => {
  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
          <LuBookImage className="text-2xl text-[#BF1E2E]" />
        </div>

        <h1 className="text-xl font-bold text-[#BF1E2E]">Reservations</h1>
      </div>

      <p className="text-gray-500 mb-8">
        Manage all hotel reservations from one place.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* New Reservation */}
        <Link to="/dashboard/reservations/new_reservation" className="group">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 p-8">
            <div className="w-16 h-16 rounded-full bg-[#FDECEC] flex items-center justify-center mb-5 group-hover:bg-[#BF1E2E] transition">
              <FaCalendarPlus className="text-3xl text-[#BF1E2E] group-hover:text-white transition" />
            </div>

            <h2 className="text-xl font-bold text-[#BF1E2E] mb-2">
              New Reservation
            </h2>

            <p className="text-gray-600 text-sm">
              Create a new reservation quickly and efficiently for your guests.
            </p>
          </div>
        </Link>

        {/* Group Bookings */}
        <Link to="/dashboard/reservations/group_bookings" className="group">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 p-8">
            <div className="w-16 h-16 rounded-full bg-[#FDECEC] flex items-center justify-center mb-5 group-hover:bg-[#BF1E2E] transition">
              <FaUsers className="text-3xl text-[#BF1E2E] group-hover:text-white transition" />
            </div>

            <h2 className="text-xl font-bold text-[#BF1E2E] mb-2">
              Group Bookings
            </h2>

            <p className="text-gray-600 text-sm">
              Manage corporate events, tours, and other group reservations.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Reservations;
