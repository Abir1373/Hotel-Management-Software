import { Link } from "react-router";
import { FaBed, FaPlusCircle, FaDoorOpen, FaTools } from "react-icons/fa";
import { MdMeetingRoom } from "react-icons/md";

const Rooms = () => {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
          <MdMeetingRoom className="text-2xl text-[#BF1E2E]" />
        </div>

        <h1 className="text-xl font-bold text-[#BF1E2E]">Room Management</h1>
      </div>

      <p className="text-gray-500 mb-10 ml-[60px]">
        Manage hotel rooms, availability, and maintenance.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {/* Room List */}
        <Link
          to="/dashboard/rooms/list"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaBed className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-xl font-bold text-[#BF1E2E] mb-3">Room List</h2>

          <p className="text-gray-600 text-sm">
            View and manage all hotel rooms and their details.
          </p>
        </Link>

        {/* Add Room */}
        <Link
          to="/dashboard/rooms/add_room"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaPlusCircle className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-xl font-bold text-[#BF1E2E] mb-3">Add Room</h2>

          <p className="text-gray-600 text-sm">
            Add new rooms with room type, amenities, and pricing.
          </p>
        </Link>

        {/* Room Status */}
        <Link
          to="/dashboard/rooms/status"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaDoorOpen className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-xl font-bold text-[#BF1E2E] mb-3">Room Status</h2>

          <p className="text-gray-600 text-sm">
            Monitor available, occupied, reserved, and vacant rooms.
          </p>
        </Link>

        {/* Maintenance */}
        <Link
          to="/dashboard/rooms/maintenance"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaTools className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-xl font-bold text-[#BF1E2E] mb-3">Maintenance</h2>

          <p className="text-gray-600 text-sm">
            Track rooms under maintenance and schedule repairs.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Rooms;
