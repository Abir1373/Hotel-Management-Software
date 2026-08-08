import { Link } from "react-router";
import { FaMoneyCheckAlt, FaHistory } from "react-icons/fa";
import { MdOutlinePayments } from "react-icons/md";
import { RiHome3Line } from "react-icons/ri";

const Payroll = () => {
  return (
    <div className="p-6">
      {/* Header */}

      <div className="flex flex-row justify-between">
        <h2 className="text-lg font-bold text-rose-800">Payroll Management</h2>
        <Link to="/dashboard/employees">
          <button className="btn btn-outline btn-secondary">
            <RiHome3Line className="text-2xl" />
          </button>
        </Link>
      </div>

      <p className="text-gray-500 mb-10">
        Manage employee salaries, bonuses, and deductions by month.
      </p>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Current Month Payroll */}
        <Link
          to="/dashboard/payroll/current"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaMoneyCheckAlt className="text-3xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-xl font-bold text-[#BF1E2E] mb-3">
            Current Month Payroll
          </h2>

          <p className="text-gray-600 text-sm">
            View and manage salary, bonus, and deductions for the current month.
            Process payments and update employee payroll status.
          </p>
        </Link>

        {/* Previous Payroll */}
        <Link
          to="/dashboard/payroll/previous"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaHistory className="text-3xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-xl font-bold text-[#BF1E2E] mb-3">
            Previous Payroll
          </h2>

          <p className="text-gray-600 text-sm">
            Browse historical payroll records by selecting any previous month
            and year. Review past salaries, bonuses, and deductions.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Payroll;
