import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import useAxios from "../../../../hooks/useAxios";
import { RiHome3Line } from "react-icons/ri";
import { MdOutlinePlaylistAddCheckCircle } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import { IoMdTrash } from "react-icons/io";

const PresentGuestList = () => {
  const axiosInstance = useAxios();

  const {
    data: checkIns = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["check-ins"],
    queryFn: async () => {
      const res = await axiosInstance.get("/check-in");
      return res.data;
    },
  });

  const Guest_Status_Change = (checkInId, status) => {
    if (status === "Normal") {
      console.log("first");
    } else {
      console.log("second");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <span className="loading loading-spinner loading-lg text-rose-700"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-error py-10">
        <p>Failed to load guests.</p>
        <p className="text-sm">{error?.message}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center">
              <MdOutlinePlaylistAddCheckCircle className="text-xl text-white" />
            </div>
            <h1 className="text-lg font-bold text-rose-700">
              Present Guest/s List
            </h1>
          </div>
          <p className="text-gray-500">
            Manage all currently checked-in guests.
          </p>
        </div>

        <Link to="/dashboard/guests">
          <button className="flex items-center justify-center w-11 h-11 border border-rose-700 text-rose-700 hover:bg-rose-700 hover:text-white rounded-lg transition-colors">
            <RiHome3Line className="text-xl" />
          </button>
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-rose-700 text-white">
            <tr className="text-center">
              <th>Guest Name</th>
              <th>Guest Id</th>
              <th>Contact</th>
              <th>Room</th>
              <th>Variant</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Nights</th>
              <th>Guests</th>
              <th>Total</th>
              <th>Advance</th>
              <th>Due</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {checkIns.length === 0 ? (
              <tr>
                <td colSpan="12" className="text-center py-10 text-gray-500">
                  No check-in records found.
                </td>
              </tr>
            ) : (
              checkIns.map((checkIn) => (
                <tr key={checkIn._id} className="hover text-center bg-white">
                  <td>
                    <div className="font-semibold">{checkIn.guestName}</div>
                    <div className="text-xs text-gray-500">
                      {checkIn.designation || "-"}
                    </div>
                  </td>

                  <td>{checkIn._id || "-"}</td>

                  <td>{checkIn.contactNumber || "-"}</td>

                  <td className="font-semibold">Room {checkIn.roomNumber}</td>

                  <td>{checkIn.roomVariantName || "-"}</td>

                  <td>
                    <div>
                      {checkIn.checkInDate
                        ? new Date(checkIn.checkInDate).toLocaleDateString()
                        : "-"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {checkIn.checkInTime || ""}
                    </div>
                  </td>

                  <td>
                    {checkIn.checkOutDate
                      ? new Date(checkIn.checkOutDate).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>{checkIn.numberOfNights || 0}</td>

                  <td>{checkIn.numberOfGuests || 1}</td>

                  <td className="font-medium">
                    ৳{Number(checkIn.totalAmount || 0).toLocaleString()}
                  </td>

                  <td className="text-green-600 font-medium">
                    ৳{Number(checkIn.advancePayment || 0).toLocaleString()}
                  </td>

                  <td className="text-orange-600 font-medium">
                    ৳{Number(checkIn.dueAmount || 0).toLocaleString()}
                  </td>

                  <td className="p-3">
                    <select
                      defaultValue={checkIn.status}
                      onChange={(e) =>
                        Guest_Status_Change(checkIn._id, e.target.value)
                      }
                      className={`select select-sm w-32 font-semibold text-white border-none outline-none ${
                        checkIn.status === "Ban"
                          ? "bg-black hover:bg-gray-900"
                          : "bg-emerald-600 hover:bg-emerald-700"
                      }`}
                    >
                      <option value="Normal" className="bg-white text-black">
                        Normal
                      </option>

                      <option value="Ban" className="bg-white text-black">
                        Banned
                      </option>
                    </select>
                  </td>
                  <td>
                    <button className="btn btn-accent text-xl text-white m-2 rouded-2xl">
                      <FaUserEdit />
                    </button>
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

export default PresentGuestList;
