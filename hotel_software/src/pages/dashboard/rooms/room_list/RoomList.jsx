import { useQuery } from "@tanstack/react-query";
import { FaEdit, FaTrash, FaBed, FaTag } from "react-icons/fa";
import { RiHome3Line } from "react-icons/ri";
import { Link } from "react-router";
import Swal from "sweetalert2";
import useAxios from "../../../../hooks/useAxios";

const RoomList = () => {
  const axiosInstance = useAxios();

  const {
    data: rooms = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const res = await axiosInstance.get("/rooms");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="loading loading-spinner loading-lg text-[#BF1E2E]"></span>
      </div>
    );
  }

  const onDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axiosInstance.delete(`/room-delete/${id}`);

        if (res.data.deletedCount > 0) {
          Swal.fire({
            title: "Deleted!",
            text: "Room has been deleted.",
            icon: "success",
          });

          refetch();
        }
      }
    });
  };

  return (
    <div className="min-w-2xl m-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-lg font-bold text-[#BF1E2E]">Room List</h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage all rooms in the system
          </p>
        </div>

        <Link to="/dashboard/rooms">
          <button className="btn btn-outline border-[#BF1E2E] text-[#BF1E2E] hover:bg-[#BF1E2E] hover:text-white hover:border-[#BF1E2E] transition-all duration-300">
            <RiHome3Line className="text-2xl" />
          </button>
        </Link>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {rooms.map((room) => (
          <div
            key={room._id}
            className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
          >
            <div className="flex flex-col sm:flex-row h-full">
              {/* Image */}
              <div className="sm:w-2/5 h-52 sm:h-auto relative overflow-hidden">
                <img
                  src={room.Image}
                  alt={room.RoomName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 backdrop-blur-sm text-[#BF1E2E] text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                    {room.RoomType}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="sm:w-3/5 p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-[#BF1E2E] transition-colors">
                    {room.RoomName}
                  </h3>

                  <p className="text-gray-500 text-sm mt-2 line-clamp-2 leading-relaxed">
                    {room.Description || "No description available."}
                  </p>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaBed className="text-[#BF1E2E] opacity-80" />

                      <span>
                        Room No:{" "}
                        <span className="font-medium text-gray-800">
                          {room.RoomNumber}
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaTag className="text-[#BF1E2E] opacity-80" />

                      <span>
                        Price:{" "}
                        <span className="font-semibold text-[#BF1E2E]">
                          ৳{room.PricePerNight}
                        </span>
                        <span className="text-gray-400"> / night</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-5 pt-4 border-t border-gray-100">
                  <Link
                    to={`/dashboard/rooms/room_list/edit_room/${room._id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#BF1E2E] text-white text-sm font-medium hover:bg-[#a01925] transition-colors"
                  >
                    <FaEdit size={13} />
                    Edit
                  </Link>

                  <button
                    onClick={() => onDelete(room._id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors"
                  >
                    <FaTrash size={13} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {rooms.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-400 text-lg">No rooms found</p>
        </div>
      )}
    </div>
  );
};

export default RoomList;
