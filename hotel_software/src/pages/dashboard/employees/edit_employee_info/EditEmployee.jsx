import { Link, useParams } from "react-router"; // or "react-router-dom" if you're still using that package
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useAxios from "../../../../hooks/useAxios";
import Swal from "sweetalert2";
import { RiHome3Line } from "react-icons/ri";

const EditEmployee = () => {
  const axiosInstance = useAxios();
  const { id } = useParams();

  // 1. Fetch employee data first
  const {
    data: employee,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["employee", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/employees/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // 2. Initialize form AFTER the query (using `values` – no useEffect needed)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    values: employee, // automatically populates the form when data arrives
  });

  const onSubmit = async (data) => {
    try {
      const res = await axiosInstance.patch(`/employees/${id}`, data);
      console.log(res.data);
      Swal.fire({
        title: "Updated Successfully!",
        icon: "success",
        draggable: true,
      });
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.message || "Failed to update employee");
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading employee...</div>;
  }

  if (isError) {
    return (
      <div className="alert alert-error m-6">
        {error?.message || "Failed to load employee"}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex flex-row justify-between">
          <h2 className="text-lg font-bold text-rose-800">Edit Employee</h2>
          <Link to="/dashboard/employees">
            <button className="btn btn-outline btn-secondary">
              <RiHome3Line className="text-2xl" />
            </button>
          </Link>
        </div>

        <p className="text-gray-500 mt-1">Update employee information</p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <input
              {...register("FullName", {
                required: "Full name is required",
              })}
              type="text"
              className="input input-bordered w-full bg-white"
            />
            {errors.FullName && (
              <p className="text-red-500 text-sm">{errors.FullName.message}</p>
            )}
          </div>

          {/* Employee ID */}
          <div>
            <label className="label">
              <span className="label-text">Employee ID</span>
            </label>
            <input
              {...register("EmployeeID", {
                required: "Employee ID is required",
              })}
              type="text"
              className="input input-bordered w-full bg-white"
            />
            {errors.EmployeeID && (
              <p className="text-red-500 text-sm">
                {errors.EmployeeID.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              {...register("Email", {
                required: "Email is required",
              })}
              type="email"
              className="input input-bordered w-full bg-white"
            />
            {errors.Email && (
              <p className="text-red-500 text-sm">{errors.Email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="label">
              <span className="label-text">Phone Number</span>
            </label>
            <input
              {...register("Phone", {
                required: "Phone number is required",
              })}
              type="tel"
              className="input input-bordered w-full bg-white"
            />
            {errors.Phone && (
              <p className="text-red-500 text-sm">{errors.Phone.message}</p>
            )}
          </div>

          {/* NID */}
          <div>
            <label className="label">
              <span className="label-text">NID Number</span>
            </label>
            <input
              {...register("NID", {
                required: "NID number is required",
              })}
              type="text"
              className="input input-bordered w-full bg-white"
            />
            {errors.NID && (
              <p className="text-red-500 text-sm">{errors.NID.message}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="label">
              <span className="label-text">Gender</span>
            </label>
            <select
              {...register("Gender")}
              className="select select-bordered w-full bg-white"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="label">
              <span className="label-text">Department</span>
            </label>
            <select
              {...register("Department")}
              className="select select-bordered w-full bg-white"
            >
              <option value="Front Desk">Front Desk</option>
              <option value="Housekeeping">Housekeeping</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Security">Security</option>
              <option value="Accounts">Accounts</option>
              <option value="Management">Management</option>
            </select>
          </div>

          {/* Designation */}
          <div>
            <label className="label">
              <span className="label-text">Designation</span>
            </label>
            <input
              {...register("Designation", {
                required: "Designation is required",
              })}
              type="text"
              className="input input-bordered w-full bg-white"
            />
            {errors.Designation && (
              <p className="text-red-500 text-sm">
                {errors.Designation.message}
              </p>
            )}
          </div>

          {/* Joining Date */}
          <div>
            <label className="label">
              <span className="label-text">Joining Date</span>
            </label>
            <input
              {...register("JoiningDate")}
              type="date"
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Salary */}
          <div>
            <label className="label">
              <span className="label-text">Salary</span>
            </label>
            <input
              {...register("Salary")}
              type="number"
              className="input input-bordered w-full bg-white"
            />
          </div>

          {/* Employment Status */}
          <div>
            <label className="label">
              <span className="label-text">Employment Status</span>
            </label>
            <select
              {...register("EmploymentStatus")}
              className="select select-bordered w-full bg-white"
            >
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Resigned">Resigned</option>
              <option value="Terminated">Terminated</option>
            </select>
          </div>
        </div>

        {/* Address */}
        <div className="mt-6">
          <label className="label">
            <span className="label-text">Address</span>
          </label>
          <textarea
            {...register("Address", {
              required: "Address is required",
            })}
            className="textarea textarea-bordered w-full h-28 bg-white"
          />
          {errors.Address && (
            <p className="text-red-500 text-sm">{errors.Address.message}</p>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            className="btn bg-[#BF1E2E] text-white hover:bg-red-800 border-none"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEmployee;
