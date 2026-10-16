import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { RiHome3Line } from "react-icons/ri";
import { MdOutlineAddHomeWork } from "react-icons/md";
import useAxios from "../../../../../hooks/useAxios";
import useAuth from "../../../../../hooks/useAuth";

const AddRoom = () => {
  const axiosInstance = useAxios();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      roomStatus: "Available",
      roomNo: "",
      assignedPerson: "",
      assignedPersonNumber: "",
      maintenanceCost: "",
      correctives: "",
      workBegins: "",
      workEnds: "",
    },
  });

  // Get room variant
  const {
    data: variant = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["room-variant", id],
    qweryFn: async () => {
      const res = await axiosInstance.get(`/room-variants/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // ===== Parse room numbers (101,102 or 100-105) =====
  const parseRoomNumbers = (input) => {
    if (!input || !input.trim()) return [];

    const result = new Set();

    // Split by comma
    const parts = input
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    for (const part of parts) {
      if (part.includes("-")) {
        // Range: 100-105
        const [startStr, endStr] = part.split("-").map((s) => s.trim());
        const start = Number(startStr);
        const end = Number(endStr);

        if (isNaN(start) || isNaN(end) || start > end) {
          throw new Error(`Invalid range: ${part}`);
        }

        for (let i = start; i <= end; i++) {
          result.add(String(i));
        }
      } else {
        // Single number
        result.add(part);
      }
    }

    return Array.from(result);
  };

  const onSubmit = async (data) => {
    try {
      let roomNumbers = [];

      try {
        roomNumbers = parseRoomNumbers(data.roomNo);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Invalid Room Numbers",
          text: err.message,
          confirmButtonColor: "#9f1239",
        });
        return;
      }

      if (roomNumbers.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "No Room Numbers",
          text: "Please enter at least one room number.",
          confirmButtonColor: "#9f1239",
        });
        return;
      }

      // Create all rooms
      const promises = roomNumbers.map((roomNo) => {
        const roomData = {
          variantId: variant._id,
          variantName: variant.variantName,
          baseRoomType: variant.baseRoomType,
          price: variant.price,
          maxOccupancy: variant.maxOccupancy,
          bedType: variant.bedType,
          amenities: variant.amenities,
          description: variant.description,
          image: variant.image,
          hotelEmail: user.email,

          roomStatus: data.roomStatus,
          roomNo: roomNo,
          assignedPerson: data.assignedPerson || "",
          assignedPersonNumber: data.assignedPersonNumber || "",
          maintenanceCost: data.maintenanceCost || "",
          correctives: data.correctives || "",
          workBegins: data.workBegins || "",
          workEnds: data.workEnds || "",
        };

        return axiosInstance.post("/rooms", roomData);
      });

      await Promise.all(promises);

      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: `${roomNumbers.length} room(s) added successfully`,
        showConfirmButton: false,
        timer: 1800,
      });

      navigate("/dashboard/rooms");
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to add rooms",
        confirmButtonColor: "#9f1239",
      });
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-96 flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-rose-900"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="alert alert-error">
          <span>Failed to load room variant information.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* ================= HEADER ================= */}
      <div className="mb-8">
        <div className="flex justify-between gap-3 mb-2">
          <div className="flex flex-row gap-4 items-center">
            <MdOutlineAddHomeWork className="bg-rose-900 h-10 w-10 text-white p-2 rounded-full" />
            <h1 className="text-lg font-bold text-rose-900">Add Room</h1>
          </div>
          <Link to="/dashboard/rooms">
            <button className="flex items-center justify-center w-11 h-11 border border-rose-900 text-rose-900 hover:bg-rose-900 hover:text-white rounded-lg transition-colors">
              <RiHome3Line className="text-xl" />
            </button>
          </Link>
        </div>

        <p className="text-gray-500 mt-2">
          Add one or multiple rooms to this room variant.
        </p>
      </div>

      {/* ================================================= */}
      {/* SECTION 1 - ROOM VARIANT INFORMATION */}
      {/* ================================================= */}
      <div className="card shadow-xl mb-8">
        <div className="card-body">
          <h2 className="card-title text-xl text-rose-900 mb-5">
            Room Variant Information
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <img
                src={`${axiosInstance.defaults.baseURL}${variant.image}`}
                alt={variant.variantName}
                className="w-full h-72 md:h-80 object-cover rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <p className="text-sm text-gray-500">Variant Name</p>
                <p className="font-semibold text-lg">{variant.variantName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Base Room Type</p>
                <p className="font-semibold">{variant.baseRoomType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="font-semibold">৳{variant.price}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Max Occupancy</p>
                <p className="font-semibold">{variant.maxOccupancy} Persons</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bed Type</p>
                <p className="font-semibold">{variant.bedType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amenities</p>
                <p className="font-semibold">{variant.amenities}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-gray-500">Description</p>
                <p className="font-semibold">{variant.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* SECTION 2 - ROOM INFORMATION FORM */}
      {/* ================================================= */}
      <form onSubmit={handleSubmit(onSubmit)} className="card shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-xl text-rose-900 mb-6">
            Room Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Room Status */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Room Status</span>
              </label>
              <select
                className="select select-bordered w-full bg-white"
                {...register("roomStatus", {
                  required: "Room status is required",
                })}
              >
                <option value="" disabled>
                  Select room status
                </option>
                <option value="Available">Available</option>
                <option value="Maintenance">Maintenance</option>
                <option value="In Progress">In Progress</option>
                <option value="Occupied">Occupied</option>
                <option value="Reserved">Reserved</option>
              </select>
              {errors.roomStatus && (
                <p className="text-error text-sm mt-1">
                  {errors.roomStatus.message}
                </p>
              )}
            </div>

            {/* ========== MULTIPLE ROOM NUMBERS ========== */}
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text font-semibold">
                  Room Numbers <span className="text-rose-900">*</span>
                </span>
              </label>
              <input
                type="text"
                placeholder="Examples: 101,102,103   or   100-105   or   201, 205-210"
                className="input input-bordered w-full bg-white"
                {...register("roomNo", {
                  required: "Room number is required",
                })}
              />
              <p className="text-sm text-gray-500 mt-1">
                You can use comma separated values or range (e.g.{" "}
                <code>101,102,103</code> or <code>100-105</code>)
              </p>
              {errors.roomNo && (
                <p className="text-error text-sm mt-1">
                  {errors.roomNo.message}
                </p>
              )}
            </div>

            {/* Assigned Person */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Assigned Person
                </span>
              </label>
              <input
                type="text"
                placeholder="Enter assigned person's name"
                className="input input-bordered w-full bg-white"
                {...register("assignedPerson")}
              />
            </div>

            {/* Phone Number */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Assigned Person Number
                </span>
              </label>
              <input
                type="tel"
                placeholder="Enter phone number"
                className="input input-bordered w-full bg-white"
                {...register("assignedPersonNumber")}
              />
            </div>

            {/* Maintenance Cost */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Maintenance Cost
                </span>
              </label>
              <input
                type="number"
                min="0"
                placeholder="Enter maintenance cost"
                className="input input-bordered w-full bg-white"
                {...register("maintenanceCost", {
                  valueAsNumber: true,
                })}
              />
            </div>

            {/* Correctives */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Correctives</span>
              </label>
              <input
                type="text"
                placeholder="Enter corrective action"
                className="input input-bordered w-full bg-white"
                {...register("correctives")}
              />
            </div>

            {/* Work Begins */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Work Begins</span>
              </label>
              <input
                type="datetime-local"
                className="input input-bordered w-full bg-white"
                {...register("workBegins")}
              />
            </div>

            {/* Work Ends */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Work Ends</span>
              </label>
              <input
                type="datetime-local"
                className="input input-bordered w-full bg-white"
                {...register("workEnds")}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-outline"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn bg-rose-900 hover:bg-rose-900 text-white border-none"
            >
              Add Room(s)
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddRoom;
