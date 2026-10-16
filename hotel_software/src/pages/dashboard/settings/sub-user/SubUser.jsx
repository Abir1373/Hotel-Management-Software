import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import Swal from "sweetalert2";
import { FaUserPlus } from "react-icons/fa";
import { MdHotel } from "react-icons/md";
import useAuth from "../../../../hooks/useAuth";
import useAxios from "../../../../hooks/useAxios";
import { RiHome3Line } from "react-icons/ri";

const SubUser = () => {
  const { user, createUser } = useAuth();
  const axiosInstance = useAxios();

  // Get hotel info
  const { data: hotel, isLoading: hotelLoading } = useQuery({
    queryKey: ["hotel-by-email", user?.email],
    queryFn: async () => {
      const res = await axiosInstance.get("/hotels/by-email", {
        params: { email: user.email },
      });
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Get user document (contains email1, email2)
  const {
    data: userDoc,
    isLoading: userLoading,
    refetch,
  } = useQuery({
    queryKey: ["sub-users", user?.email],
    queryFn: async () => {
      const res = await axiosInstance.get("/users", {
        params: { hotelEmail: user.email },
      });
      // Support both single object and array response
      const data = res.data;
      if (Array.isArray(data)) {
        return (
          data.find(
            (u) =>
              u.hotelEmail === user.email ||
              u.email === user.email ||
              u.status === "Admin" ||
              u.status === "Approved",
          ) ||
          data[0] ||
          null
        );
      }
      return data || null;
    },
    enabled: !!user?.email,
  });

  // Form for Email 1
  const {
    register: register1,
    handleSubmit: handleSubmit1,
    reset: reset1,
    formState: { isSubmitting: isSubmitting1 },
  } = useForm({
    defaultValues: {
      email1: "",
      password1: "",
    },
  });

  // Form for Email 2
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    reset: reset2,
    formState: { isSubmitting: isSubmitting2 },
  } = useForm({
    defaultValues: {
      email2: "",
      password2: "",
    },
  });

  // Prefill Email 1 & Email 2 from users collection
  useEffect(() => {
    if (userDoc) {
      reset1({
        email1: userDoc.email1 || "",
        password1: "",
      });
      reset2({
        email2: userDoc.email2 || "",
        password2: "",
      });
    }
  }, [userDoc, reset1, reset2]);

  // ========== Submit Email 1 ==========
  const onSubmitEmail1 = async (data) => {
    if (!userDoc?._id) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "User record not found",
      });
      return;
    }

    try {
      await createUser(data.email1, data.password1);

      await axiosInstance.patch(`/users/${userDoc._id}`, {
        email1: data.email1,
        password1: data.password1,
      });

      await refetch();
      reset1({ email1: data.email1, password1: "" });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Sub User 1 created successfully",
        timer: 1600,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);

      let message = "Something went wrong";
      if (error.code === "auth/email-already-in-use") {
        message = "This email is already registered";
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }

      Swal.fire({
        icon: "error",
        title: "Failed",
        text: message,
      });
    }
  };

  // ========== Submit Email 2 ==========
  const onSubmitEmail2 = async (data) => {
    if (!userDoc?._id) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "User record not found",
      });
      return;
    }

    try {
      await createUser(data.email2, data.password2);

      await axiosInstance.patch(`/users/${userDoc._id}`, {
        email2: data.email2,
        password2: data.password2,
      });

      await refetch();
      reset2({ email2: data.email2, password2: "" });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Sub User 2 created successfully",
        timer: 1600,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);

      let message = "Something went wrong";
      if (error.code === "auth/email-already-in-use") {
        message = "This email is already registered";
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }

      Swal.fire({
        icon: "error",
        title: "Failed",
        text: message,
      });
    }
  };

  if (hotelLoading || userLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-rose-900"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-rose-900 flex items-center justify-center">
            <FaUserPlus className="text-xl text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-rose-900">Sub Users</h1>
            <p className="text-sm text-gray-500">
              Manage additional login emails for{" "}
              {hotel?.hotelName || userDoc?.hotelName}
            </p>
          </div>
        </div>

        <Link to="/dashboard/settings">
          <button
            type="button"
            className="flex items-center justify-center w-9 h-9 border border-rose-900 text-rose-900 hover:bg-rose-900 hover:text-white rounded-lg transition-colors"
          >
            <RiHome3Line className="text-xl" />
          </button>
        </Link>
      </div>

      {/* Hotel Summary */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center">
            <MdHotel className="text-2xl text-rose-900" />
          </div>
          <div>
            <h2 className="font-bold text-gray-800">
              {hotel?.hotelName || userDoc?.hotelName}
            </h2>
            <p className="text-sm text-gray-500">
              {hotel?.hotelEmail || hotel?.email || userDoc?.hotelEmail}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ========== Sub User 1 ========== */}
        <form
          onSubmit={handleSubmit1(onSubmitEmail1)}
          className="bg-white rounded-2xl shadow-md border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-rose-900">Sub User 1</h3>
            {userDoc?.email1 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700 border border-green-200 font-medium">
                Already set
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email 1</span>
              </label>
              <input
                type="email"
                placeholder="user1@example.com"
                className="input input-bordered w-full bg-white focus:outline-none focus:ring-2 focus:ring-rose-900/20 focus:border-rose-900"
                {...register1("email1", { required: true })}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password 1</span>
              </label>
              <input
                type="password"
                placeholder={
                  userDoc?.email1
                    ? "Enter new password to update"
                    : "Enter password"
                }
                className="input input-bordered w-full bg-white focus:outline-none focus:ring-2 focus:ring-rose-900/20 focus:border-rose-900"
                {...register1("password1", { required: true })}
              />
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={isSubmitting1}
              className="btn bg-rose-900 hover:bg-[#BF1E2E] text-white border-none"
            >
              {isSubmitting1
                ? "Saving..."
                : userDoc?.email1
                  ? "Update User 1"
                  : "Save User 1"}
            </button>
          </div>
        </form>

        {/* ========== Sub User 2 ========== */}
        <form
          onSubmit={handleSubmit2(onSubmitEmail2)}
          className="bg-white rounded-2xl shadow-md border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-rose-900">Sub User 2</h3>
            {userDoc?.email2 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700 border border-green-200 font-medium">
                Already set
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email 2</span>
              </label>
              <input
                type="email"
                placeholder="user2@example.com"
                className="input input-bordered w-full bg-white focus:outline-none focus:ring-2 focus:ring-rose-900/20 focus:border-rose-900"
                {...register2("email2", { required: true })}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password 2</span>
              </label>
              <input
                type="password"
                placeholder={
                  userDoc?.email2
                    ? "Enter new password to update"
                    : "Enter password"
                }
                className="input input-bordered w-full bg-white focus:outline-none focus:ring-2 focus:ring-rose-900/20 focus:border-rose-900"
                {...register2("password2", { required: true })}
              />
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={isSubmitting2}
              className="btn bg-rose-900 hover:bg-[#BF1E2E] text-white border-none"
            >
              {isSubmitting2
                ? "Saving..."
                : userDoc?.email2
                  ? "Update User 2"
                  : "Save User 2"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubUser;
