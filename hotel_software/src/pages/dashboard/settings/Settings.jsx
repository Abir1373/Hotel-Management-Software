import { Link } from "react-router";
import { FaHotel, FaUserShield, FaLock, FaCog } from "react-icons/fa";
import { RiSettings5Line } from "react-icons/ri";

const Settings = () => {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
          <RiSettings5Line className="text-2xl text-rose-700" />
        </div>

        <h1 className="text-xl font-bold text-rose-700">Settings</h1>
      </div>

      <p className="text-gray-500 mb-10">
        Configure your hotel management system and account preferences.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {/* Hotel Information */}
        <Link
          to="/dashboard/settings/hotel"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-rose-700"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-rose-700">
            <FaHotel className="text-xl text-rose-700 transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-xl font-bold text-rose-700 mb-3">
            Hotel Information
          </h2>

          <p className="text-gray-600 text-sm">
            Update hotel name, address, contact details, and branding.
          </p>
        </Link>

        {/* User Roles */}
        <Link
          to="/dashboard/settings/users"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-rose-700"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-rose-700">
            <FaUserShield className="text-xl text-rose-700 transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-xl font-bold text-rose-700 mb-3">User Roles</h2>

          <p className="text-gray-600 text-sm">
            Manage staff accounts, permissions, and access levels.
          </p>
        </Link>

        {/* Security */}
        <Link
          to="/dashboard/settings/security"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-rose-700"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-rose-700">
            <FaLock className="text-xl text-rose-700 transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-xl font-bold text-rose-700 mb-3">Security</h2>

          <p className="text-gray-600 text-sm">
            Change passwords, configure authentication, and manage security
            settings.
          </p>
        </Link>

        {/* System Preferences */}
        <Link
          to="/dashboard/settings/preferences"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-rose-700"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-rose-700">
            <FaCog className="text-xl text-rose-700 transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-xl font-bold text-rose-700 mb-3">
            System Preferences
          </h2>

          <p className="text-gray-600 text-sm">
            Customize notifications, currency, language, and other system
            options.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Settings;
