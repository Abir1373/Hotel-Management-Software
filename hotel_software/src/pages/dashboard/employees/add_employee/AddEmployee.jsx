import { useForm } from "react-hook-form";
import useAxios from "../../../../hooks/useAxios";
import Swal from "sweetalert2";
import { Link } from "react-router";
import { RiHome3Line } from "react-icons/ri";

const AddEmployee = () => {
  const axiosInstance = useAxios();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axiosInstance.post("/employees", data);

      if (res.data.insertedId || res.status === 201) {
        Swal.fire({
          title: "Employee Added!",
          text: "The employee has been successfully added.",
          icon: "success",
          confirmButtonColor: "#BF1E2E",
        });

        reset();
      }
    } catch (error) {
      console.error(error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to add employee. Please try again.";

      Swal.fire({
        title: "Error!",
        text: message,
        icon: "error",
        confirmButtonColor: "#BF1E2E",
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8">
      <div className="flex flex-row justify-between items-center mb-8">
        <h1 className="text-lg font-bold text-[#BF1E2E]">Add Employee</h1>
        <Link to="/dashboard/employees">
          <button className="btn btn-outline btn-secondary">
            <RiHome3Line className="text-2xl" />
          </button>
        </Link>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="label">
              <span className="label-text">Full Name</span>
            </label>
            <input
              {...register("FullName", { required: "Full name is required" })}
              type="text"
              placeholder="John Doe"
              className="bg-white input input-bordered w-full"
            />
            {errors.FullName && (
              <p className="text-error text-sm mt-1">
                {errors.FullName.message}
              </p>
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
              placeholder="EMP-1001"
              className="bg-white input input-bordered w-full"
            />
            {errors.EmployeeID && (
              <p className="text-error text-sm mt-1">
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
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email",
                },
              })}
              type="email"
              placeholder="employee@email.com"
              className="bg-white input input-bordered w-full"
            />
            {errors.Email && (
              <p className="text-error text-sm mt-1">{errors.Email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="label">
              <span className="label-text">Phone Number</span>
            </label>
            <input
              {...register("Phone", { required: "Phone number is required" })}
              type="tel"
              placeholder="+880 1234 567890"
              className="bg-white input input-bordered w-full"
            />
            {errors.Phone && (
              <p className="text-error text-sm mt-1">{errors.Phone.message}</p>
            )}
          </div>

          {/* NID */}
          <div>
            <label className="label">
              <span className="label-text">NID Number</span>
            </label>
            <input
              {...register("NID", { required: "NID number is required" })}
              type="text"
              placeholder="Enter NID Number"
              className="bg-white input input-bordered w-full"
            />
            {errors.NID && (
              <p className="text-error text-sm mt-1">{errors.NID.message}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="label">
              <span className="label-text">Gender</span>
            </label>
            <select
              {...register("Gender", { required: "Gender is required" })}
              className="select select-bordered w-full bg-white"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.Gender && (
              <p className="text-error text-sm mt-1">{errors.Gender.message}</p>
            )}
          </div>

          {/* Department */}
          <div>
            <label className="label">
              <span className="label-text">Department</span>
            </label>
            <select
              {...register("Department", {
                required: "Department is required",
              })}
              className="select select-bordered w-full bg-white"
            >
              <option value="">Select Department</option>
              <option value="Front Desk">Front Desk</option>
              <option value="Housekeeping">Housekeeping</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Security">Security</option>
              <option value="Accounts">Accounts</option>
              <option value="Management">Management</option>
            </select>
            {errors.Department && (
              <p className="text-error text-sm mt-1">
                {errors.Department.message}
              </p>
            )}
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
              placeholder="Receptionist"
              className="bg-white input input-bordered w-full"
            />
            {errors.Designation && (
              <p className="text-error text-sm mt-1">
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
              {...register("JoiningDate", {
                required: "Joining date is required",
              })}
              type="date"
              className="bg-white input input-bordered w-full"
            />
            {errors.JoiningDate && (
              <p className="text-error text-sm mt-1">
                {errors.JoiningDate.message}
              </p>
            )}
          </div>

          {/* Salary */}
          <div>
            <label className="label">
              <span className="label-text">Salary</span>
            </label>
            <input
              {...register("Salary", {
                required: "Salary is required",
                min: { value: 0, message: "Salary cannot be negative" },
              })}
              type="number"
              placeholder="30000"
              className="bg-white input input-bordered w-full"
            />
            {errors.Salary && (
              <p className="text-error text-sm mt-1">{errors.Salary.message}</p>
            )}
          </div>

          {/* Employment Status */}
          <div>
            <label className="label">
              <span className="label-text">Employment Status</span>
            </label>
            <select
              {...register("EmploymentStatus", {
                required: "Employment status is required",
              })}
              className="select select-bordered w-full bg-white"
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Resigned">Resigned</option>
              <option value="Terminated">Terminated</option>
            </select>
            {errors.EmploymentStatus && (
              <p className="text-error text-sm mt-1">
                {errors.EmploymentStatus.message}
              </p>
            )}
          </div>

          {/* Profile Photo URL */}
          <div>
            <label className="label">
              <span className="label-text">Profile Photo URL</span>
            </label>
            <input
              {...register("Image", {
                required: "Photo URL is required",
              })}
              type="url"
              placeholder="https://example.com/photo.jpg"
              className="bg-white input input-bordered w-full"
            />
            {errors.Image && (
              <p className="text-error text-sm mt-1">{errors.Image.message}</p>
            )}
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="label">
            <span className="label-text">Address</span>
          </label>
          <textarea
            {...register("Address", { required: "Address is required" })}
            className="textarea textarea-bordered w-full h-28 bg-white"
            placeholder="Enter employee address..."
          ></textarea>
          {errors.Address && (
            <p className="text-error text-sm mt-1">{errors.Address.message}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="reset"
            className="btn btn-outline border-[#BF1E2E] text-[#BF1E2E] hover:bg-[#BF1E2E] hover:text-white"
          >
            Reset
          </button>

          <button
            type="submit"
            className="btn bg-[#BF1E2E] text-white hover:bg-red-800 border-none"
          >
            Add Employee
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
