import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MdRestaurantMenu } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { FaRegPenToSquare } from "react-icons/fa6";
import { Link } from "react-router";
import Swal from "sweetalert2";
import useAxios from "../../../../../hooks/useAxios";
import { IoCaretBackOutline } from "react-icons/io5";
import useUserStatus from "../../../../../hooks/useUserStatus";

const FoodMenu = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();
  const { hotelEmail, statusLoading } = useUserStatus();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const {
    data: items = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["food-menu", hotelEmail],
    queryFn: async () => {
      const res = await axiosInstance.get("/food-menu", {
        params: { hotelEmail },
      });
      return res.data;
    },
    enabled: Boolean(hotelEmail) && !statusLoading,
  });

  const onSubmit = async (data) => {
    if (!hotelEmail || statusLoading) {
      await Swal.fire({
        title: "Account not ready",
        text: "Your hotel account information is not available yet. Please try again.",
        icon: "warning",
        confirmButtonColor: "#9f1239",
      });
      return;
    }

    const payload = {
      itemName: data.itemName,
      itemDescription: data.itemDescription || "",
      price: Number(data.price),
      hotelEmail,
    };

    try {
      if (data.editId) {
        await axiosInstance.patch(`/food-menu/${data.editId}`, payload);
        await Swal.fire({
          title: "Updated!",
          text: "Food item updated successfully.",
          icon: "success",
          confirmButtonColor: "#9f1239",
        });
      } else {
        await axiosInstance.post("/food-menu", payload);
        await Swal.fire({
          title: "Success!",
          text: "Food item added successfully.",
          icon: "success",
          confirmButtonColor: "#9f1239",
        });
      }

      reset();
      queryClient.invalidateQueries({ queryKey: ["food-menu", hotelEmail] });
    } catch (error) {
      await Swal.fire({
        title: "Save failed",
        text:
          error?.response?.data?.message ||
          "Could not save this food item. Please try again.",
        icon: "error",
        confirmButtonColor: "#9f1239",
      });
    }
  };

  const handleUpdate = (item) => {
    setValue("itemName", item.itemName || "");
    setValue("itemDescription", item.itemDescription || "");
    setValue("price", item.price ?? "");
    setValue("editId", item._id);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This food item will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#9f1239",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosInstance.delete(`/food-menu/${id}`);
      await queryClient.invalidateQueries({
        queryKey: ["food-menu", hotelEmail],
      });
      await Swal.fire({
        title: "Deleted!",
        text: "Food item removed.",
        icon: "success",
        confirmButtonColor: "#9f1239",
      });
    } catch (error) {
      await Swal.fire({
        title: "Delete failed",
        text:
          error?.response?.data?.message ||
          "Could not delete this food item. Please try again.",
        icon: "error",
        confirmButtonColor: "#9f1239",
      });
    }
  };

  if (statusLoading) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        <span className="loading loading-spinner text-error" />
      </div>
    );
  }

  if (!hotelEmail) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-rose-100 bg-white p-8 text-center shadow-lg">
        <MdRestaurantMenu className="mx-auto mb-3 text-4xl text-rose-900" />
        <h2 className="text-lg font-bold text-rose-900">
          Hotel account unavailable
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          We couldn't identify your hotel account. Please sign in again or
          refresh the page.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="btn mt-4 border-none bg-rose-900 text-white hover:bg-rose-800"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto p-4 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-900">
              <MdRestaurantMenu className="text-xl text-white" />
            </div>
            <h1 className="text-lg font-bold text-rose-900">Food Menu</h1>
          </div>
          <p className="ml-12 text-sm text-gray-500">
            Add and manage restaurant food items.
          </p>
        </div>

        <Link
          to="/dashboard/services/restaurant_orders"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-rose-900 text-rose-900 transition-colors hover:bg-rose-900 hover:text-white"
          title="Back to Restaurant Orders"
        >
          <IoCaretBackOutline className="text-xl" />
        </Link>
      </div>

      <div className="mb-6 rounded-2xl bg-white p-4 shadow-lg sm:p-6">
        <h2 className="mb-4 text-base font-semibold text-rose-900">
          All Food Items
        </h2>

        {isLoading ? (
          <p className="py-8 text-center text-gray-400">
            Loading food items...
          </p>
        ) : isError ? (
          <p className="py-8 text-center font-medium text-red-500">
            Failed to load food items. Please refresh and try again.
          </p>
        ) : items.length === 0 ? (
          <p className="py-8 text-center text-gray-400">
            No food items added yet.
          </p>
        ) : (
          <>
            <div className="hidden grid-cols-12 gap-4 rounded-lg bg-rose-50 px-4 py-2 text-sm font-semibold text-gray-600 md:grid">
              <div className="col-span-3">Item Name</div>
              <div className="col-span-5">Description</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-2 text-center">Action</div>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="grid grid-cols-1 items-center gap-3 rounded-lg border border-gray-100 p-4 transition hover:bg-gray-50 md:grid-cols-12 md:gap-4"
                >
                  <div className="md:col-span-3">
                    <span className="mb-1 block text-xs text-gray-400 md:hidden">
                      Item Name
                    </span>
                    <span className="font-medium text-gray-800">
                      {item.itemName}
                    </span>
                  </div>
                  <div className="md:col-span-5">
                    <span className="mb-1 block text-xs text-gray-400 md:hidden">
                      Description
                    </span>
                    <span className="text-sm text-gray-600">
                      {item.itemDescription || "—"}
                    </span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="mb-1 block text-xs text-gray-400 md:hidden">
                      Price
                    </span>
                    <span className="font-semibold text-rose-900">
                      ৳{Number(item.price || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-start gap-3 md:col-span-2 md:justify-center">
                    <button
                      type="button"
                      onClick={() => handleUpdate(item)}
                      className="btn btn-sm btn-outline border-cyan-500 text-cyan-600 hover:bg-cyan-700 hover:text-white"
                      title="Edit food item"
                    >
                      <FaRegPenToSquare />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item._id)}
                      className="btn btn-sm btn-outline border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      title="Delete food item"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-2xl bg-white p-5 shadow-lg sm:p-8"
      >
        <h2 className="mb-5 text-base font-semibold text-rose-900">
          Add / Edit Food Item
        </h2>
        <input type="hidden" {...register("editId")} />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <label className="label">
              <span className="label-text font-medium">Item Name</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Chicken Biryani"
              {...register("itemName", { required: "Item name is required" })}
              className="input input-bordered w-full bg-white"
            />
            {errors.itemName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.itemName.message}
              </p>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium">Item Description</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Spicy rice with chicken"
              {...register("itemDescription")}
              className="input input-bordered w-full bg-white"
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium">Price (৳)</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 350"
              {...register("price", {
                required: "Price is required",
                min: { value: 0, message: "Price cannot be negative" },
                valueAsNumber: true,
              })}
              className="input input-bordered w-full bg-white"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-500">
                {errors.price.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-end gap-4">
          <button
            type="button"
            onClick={() =>
              reset({
                itemName: "",
                itemDescription: "",
                price: "",
                editId: "",
              })
            }
            className="btn btn-outline border-gray-400 text-gray-600"
          >
            Reset
          </button>
          <button
            type="submit"
            className="btn border-none bg-[#BF1E2E] px-8 text-white hover:bg-red-800"
          >
            Save Item
          </button>
        </div>
      </form>
    </div>
  );
};

export default FoodMenu;
