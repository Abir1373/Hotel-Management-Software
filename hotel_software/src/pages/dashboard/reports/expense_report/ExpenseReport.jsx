import { Link } from "react-router";
import {
  FaListAlt,
  FaChartPie,
  FaPlusCircle,
  FaArrowLeft,
} from "react-icons/fa";
import { MdAssessment } from "react-icons/md";

const ExpenseReport = () => {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
            <MdAssessment className="text-xl text-white" />
          </div>
          <h1 className="text-lg font-bold text-rose-700">Expense Report</h1>
        </div>

        {/* Back Button */}
        <Link
          to="/dashboard/reports"
          className="btn btn-circle bg-rose-700 hover:bg-[#BF1E2E] text-white border-none"
          title="Back"
        >
          <FaArrowLeft />
        </Link>
      </div>

      <p className="text-gray-500 mb-10">
        Manage and view expense entries, total expenses, and expense categories.
      </p>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {/* Entry Report */}
        <Link
          to="/dashboard/reports/expenses/entry-report"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaListAlt className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-700 mb-3">Entry Report</h2>

          <p className="text-gray-600 text-sm">
            View detailed list of all expense entries with date and category.
          </p>
        </Link>

        {/* Total Expense */}
        <Link
          to="/dashboard/reports/expenses/total-expense"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaChartPie className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-700 mb-3">
            Total Expense
          </h2>

          <p className="text-gray-600 text-sm">
            See total expenses summary by category and date range.
          </p>
        </Link>

        {/* Add Expense Category */}
        <Link
          to="/dashboard/reports/expenses/add-category"
          className="group bg-white rounded-2xl shadow-md border border-gray-100 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#BF1E2E]"
        >
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-[#BF1E2E]">
            <FaPlusCircle className="text-xl text-[#BF1E2E] transition-all duration-300 group-hover:text-white group-hover:scale-110" />
          </div>

          <h2 className="text-lg font-bold text-rose-700 mb-3">
            Add Expense Category
          </h2>

          <p className="text-gray-600 text-sm">
            Create and manage expense categories for better tracking.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default ExpenseReport;
