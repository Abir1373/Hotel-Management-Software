import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../../hooks/useAxios";
import { Link } from "react-router";
import { RiHome3Line } from "react-icons/ri";

const PastEmployees = () => {
  const axiosInstance = useAxios();

  const {
    data: employees = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["activeEmployees"],
    queryFn: async () => {
      const res = await axiosInstance.get("/employees/inactive");
      return res.data;
    },
  });

  if (isLoading) {
    return <div className="p-6">Loading employees...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-red-600">
        Failed to load employees: {error?.message}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex flex-row justify-between">
          <h2 className="text-lg font-bold text-rose-800">Current Employees</h2>
          <Link to="/dashboard/employees">
            <button className="btn btn-outline btn-secondary">
              <RiHome3Line className="text-2xl" />
            </button>
          </Link>
        </div>
        <p className="text-gray-500">List of all currently active employees</p>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="table table-zebra">
          {/* Head */}
          <thead className="text-black text-center">
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Name</th>
              <th>Employee ID</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Employment Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-10">
                  No active employees found.
                </td>
              </tr>
            ) : (
              employees.map((employee, index) => (
                <tr key={employee._id} className="bg-white text-center">
                  <th>{index + 1}</th>

                  {/* Image */}
                  <td>
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img
                          src={
                            employee.Image ||
                            "https://i.ibb.co/MBtjqXQ/no-avatar.gif"
                          }
                          alt={employee.FullName}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="font-medium">{employee.FullName}</td>

                  <td>{employee.EmployeeID}</td>

                  <td>{employee.Email}</td>

                  <td>{employee.Phone}</td>

                  {/* Employment Status */}
                  <td>
                    <span
                      className={`badge text-white p-5 ${
                        employee.EmploymentStatus === "Active"
                          ? "badge-success"
                          : employee.EmploymentStatus === "On Leave"
                            ? "badge-warning"
                            : employee.EmploymentStatus === "Resigned"
                              ? "badge-error"
                              : employee.EmploymentStatus === "Terminated"
                                ? "badge-error"
                                : "badge-ghost"
                      }`}
                    >
                      {employee.EmploymentStatus}
                    </span>
                  </td>

                  <td>
                    <div className="flex gap-2">
                      <Link
                        to={`/dashboard/employees/edit/${employee._id}`}
                        className="btn btn-sm btn-secondary text-white"
                      >
                        View / Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PastEmployees;
