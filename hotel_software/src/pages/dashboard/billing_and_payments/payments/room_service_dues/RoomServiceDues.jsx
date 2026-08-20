import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { MdRoomService } from "react-icons/md";
import { RiHome3Line } from "react-icons/ri";
import { Link } from "react-router";
import useAxios from "../../../../../hooks/useAxios";

const RoomServiceDues = () => {
  const axiosInstance = useAxios();

  const { register, watch } = useForm({
    defaultValues: {
      roomNumber: "",
    },
  });

  const searchRoom = watch("roomNumber");

  // Fetch all room service dues
  const { data: dues = [], isLoading } = useQuery({
    queryKey: ["room-service-dues"],
    queryFn: async () => {
      const res = await axiosInstance.get("/room-service");
      return res.data;
    },
  });

  // Only show data after a room number is entered
  const filteredDues = searchRoom
    ? dues.filter((item) =>
        item.roomNumber
          ?.toString()
          .toLowerCase()
          .includes(searchRoom.toString().toLowerCase()),
      )
    : [];

  // Total due amount (only for filtered results)
  const totalDue = filteredDues.reduce(
    (sum, item) => sum + (Number(item.totalCharge) || 0),
    0,
  );

  return (
    <div className="mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between mb-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
              <MdRoomService className="text-xl text-white" />
            </div>
            <h1 className="text-lg font-bold text-rose-700">
              Room Service Dues
            </h1>
          </div>
          <p className="text-gray-500 ml-12">
            Enter a room number to view its service dues.
          </p>
        </div>

        <div className="flex flex-row gap-3">
          <Link to="/dashboard/services">
            <button
              type="button"
              className="flex items-center justify-center w-9 h-9 border border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white rounded-lg transition-colors"
            >
              <RiHome3Line className="text-xl" />
            </button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
        <div className="max-w-md">
          <label className="label">
            <span className="label-text font-medium">Room Number</span>
          </label>
          <input
            type="text"
            placeholder="Enter room number..."
            {...register("roomNumber")}
            className="input input-bordered w-full bg-white"
          />
        </div>
      </div>

      {/* Table - only visible after room is entered */}
      {searchRoom ? (
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-rose-50">
                <tr className="text-rose-800">
                  <th>Room</th>
                  <th>Service</th>
                  <th>Date & Time</th>
                  <th>Ordered By</th>
                  <th>Staff</th>
                  <th>Room Type</th>
                  <th className="text-right">Charge (৳)</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-500">
                      Loading room service dues...
                    </td>
                  </tr>
                ) : filteredDues.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-500">
                      No dues found for room "{searchRoom}"
                    </td>
                  </tr>
                ) : (
                  filteredDues.map((item) => (
                    <tr key={item._id} className="hover:bg-rose-50/50">
                      <td>
                        <span className="badge badge-outline border-rose-600 text-rose-700 font-semibold">
                          {item.roomNumber}
                        </span>
                      </td>
                      <td>
                        <div className="font-medium">
                          {item.serviceRequested}
                        </div>
                        {item.specialInstructions &&
                          item.specialInstructions !== "None" && (
                            <div className="text-xs text-gray-500 mt-0.5">
                              Note: {item.specialInstructions}
                            </div>
                          )}
                      </td>
                      <td>
                        <div>{item.serviceDate}</div>
                        <div className="text-xs text-gray-400">
                          {item.serviceTime}
                        </div>
                      </td>
                      <td>{item.orderedBy}</td>
                      <td>{item.assignedStaff}</td>
                      <td>{item.roomVariantName}</td>
                      <td className="text-right font-semibold">
                        ৳{Number(item.totalCharge || 0).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Total Due Footer */}
          <div className="bg-rose-50 border-t border-rose-100 px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredDues.length}
              </span>{" "}
              {filteredDues.length === 1 ? "record" : "records"} for room{" "}
              <span className="font-semibold">"{searchRoom}"</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-base font-medium text-gray-700">
                Total Due Amount:
              </span>
              <span className="text-2xl font-bold text-rose-700">
                ৳{totalDue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-2xl p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-50 flex items-center justify-center">
            <MdRoomService className="text-3xl text-rose-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">
            Enter a Room Number
          </h3>
          <p className="text-gray-500">
            Type a room number above to view its service dues and total amount.
          </p>
        </div>
      )}
    </div>
  );
};

export default RoomServiceDues;
