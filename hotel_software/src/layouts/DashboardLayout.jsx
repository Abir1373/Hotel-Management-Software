import { NavLink, Outlet } from "react-router";
import { FaHome, FaBars, FaRegMoneyBillAlt } from "react-icons/fa";
import Logo from "../components/Logo";
import { MdDashboard, MdOutlineDesignServices } from "react-icons/md";
import { FaBuildingCircleCheck, FaPersonCircleCheck } from "react-icons/fa6";
import { BsPersonWorkspace } from "react-icons/bs";
import { TbReservedLine } from "react-icons/tb";
import { IoSettingsSharp } from "react-icons/io5";

const DashboardLayout = () => {
  return (
    <div className="drawer lg:drawer-open min-h-screen bg-gray-100">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main Content */}
      <div className="drawer-content flex flex-col">
        {/* Mobile Navbar */}
        <div className="navbar bg-white shadow-md lg:hidden">
          <div className="flex-none">
            <label htmlFor="dashboard-drawer" className="btn btn-square ">
              <FaBars size={10} />
            </label>
          </div>

          <div className="flex-1 justify-center">
            <h2 className="text-sm font-bold text-amber-800 ml-9">Dashboard</h2>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-50">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>

        <aside className="w-72 min-h-full bg-rose-700 text-white">
          <div className="p-6 border-b border-amber-700">
            <Logo />
          </div>

          <ul className="menu p-4 gap-2">
            <li>
              <NavLink to="/dashboard">
                <MdDashboard />
                Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink to="/dashboard/rooms">
                <FaHome />
                Rooms
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/services">
                <MdOutlineDesignServices />
                Services
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/billing_and_payments">
                <FaRegMoneyBillAlt />
                Billing & Payments
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/check_in_out">
                <FaBuildingCircleCheck />
                Check In & Out
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/employees">
                <BsPersonWorkspace />
                Employees
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/guests">
                <FaPersonCircleCheck />
                Guests
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/reservations">
                <TbReservedLine />
                Reservations
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard/settings">
                <IoSettingsSharp />
                Settings
              </NavLink>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default DashboardLayout;
