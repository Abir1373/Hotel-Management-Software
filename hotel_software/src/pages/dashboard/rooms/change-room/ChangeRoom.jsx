import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../../../hooks/useAxios";
import Swal from "sweetalert2";
import { MdSwapHoriz } from "react-icons/md";
import { Link } from "react-router";
import { RiHome3Line } from "react-icons/ri";
import useUserStatus from "../../../../hooks/useUserStatus";

const ChangeRoom = () => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();
  const { hotelEmail, statusLoading } = useUserStatus();

  const [selectedCheckInId, setSelectedCheckInId] = useState("");
  const [newRoomNumber, setNewRoomNumber] = useState("");
  const [daysStayed, setDaysStayed] = useState(0);

  // ========== Active Check-ins ==========
  const { data: checkIns = [], isLoading: checkInsLoading } = useQuery({
    queryKey: ["active-checkins", hotelEmail],
    enabled: !!hotelEmail,
    queryFn: async () => {
      const res = await axiosInstance.get("/check-in", {
        params: { hotelEmail },
      });
      return (res.data || []).filter((item) => item.status !== "Checked Out");
    },
  });

  // ========== Available Rooms ==========
  const { data: rooms = [], isLoading: roomsLoading } = useQuery({
    queryKey: ["available-rooms", hotelEmail],
    enabled: !!hotelEmail,
    queryFn: async () => {
      const res = await axiosInstance.get("/rooms", {
        params: { hotelEmail },
      });
      return (res.data || []).filter((room) => room.roomStatus === "Available");
    },
  });

  const selectedCheckIn = checkIns.find((c) => c._id === selectedCheckInId);
  const selectedNewRoom = rooms.find(
    (r) => String(r.roomNo) === String(newRoomNumber),
  );

  // Auto calculate days stayed
  const calculateDaysStayed = (checkIn) => {
    if (!checkIn?.checkInDate) return 0;

    const checkInDate = new Date(checkIn.checkInDate);
    const today = new Date();

    checkInDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = today - checkInDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
  };

  const handleGuestChange = (e) => {
    const id = e.target.value;
    setSelectedCheckInId(id);
    setNewRoomNumber("");

    const guest = checkIns.find((c) => c._id === id);
    if (guest) {
      setDaysStayed(calculateDaysStayed(guest));
    } else {
      setDaysStayed(0);
    }
  };

  const handleTransfer = async () => {
    if (!selectedCheckInId || !newRoomNumber) {
      return Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please select both current guest and new room",
        confirmButtonColor: "#9f1239",
      });
    }

    if (!selectedNewRoom) {
      return Swal.fire({
        icon: "error",
        title: "Invalid Room",
        text: "Selected new room is not available",
        confirmButtonColor: "#9f1239",
      });
    }

    const stayed = Number(daysStayed) || 0;
    const totalNights = Number(selectedCheckIn.numberOfNights) || 0;
    const remainingNights = Math.max(totalNights - stayed, 0);
    const costSoFar = stayed * (Number(selectedCheckIn.pricePerNight) || 0);

    const confirm = await Swal.fire({
      title: "Confirm Room Transfer?",
      html: `
        <div class="text-left text-sm space-y-1">
          <p><b>Guest:</b> ${selectedCheckIn.guestName}</p>
          <p><b>From:</b> Room ${selectedCheckIn.roomNumber} (${selectedCheckIn.roomVariantName})</p>
          <p><b>To:</b> Room ${newRoomNumber} (${selectedNewRoom.variantName})</p>
          <p><b>Days Stayed:</b> ${stayed} days</p>
          <p><b>Cost so far:</b> ৳${costSoFar}</p>
          <p><b>Remaining Nights:</b> ${remainingNights}</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#9f1239",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Transfer",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosInstance.post("/change-room", {
        checkInId: selectedCheckInId,
        newRoomNumber: String(newRoomNumber),
        newRoomVariantId: selectedNewRoom.variantId || selectedNewRoom._id,
        newRoomVariantName: selectedNewRoom.variantName,
        newPricePerNight: Number(selectedNewRoom.price) || 0,
        daysStayed: stayed,
        remainingNights,
      });

      if (res.data.success) {
        await Swal.fire({
          title: "Success!",
          text: "Room transferred successfully",
          icon: "success",
          confirmButtonColor: "#9f1239",
        });

        queryClient.invalidateQueries(["active-checkins"]);
        queryClient.invalidateQueries(["available-rooms"]);
        queryClient.invalidateQueries(["all-rooms"]);

        setSelectedCheckInId("");
        setNewRoomNumber("");
        setDaysStayed(0);
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Transfer Failed",
        text: error?.response?.data?.message || "Failed to transfer room",
        confirmButtonColor: "#9f1239",
      });
    }
  };

  if (statusLoading) {
    return (
      <div className="min-h-96 flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-rose-900"></span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* ================= HEADER ================= */}
      <div className="mb-8">
        <div className="flex justify-between gap-3 mb-2">
          <div className="flex flex-row gap-4 items-center">
            <MdSwapHoriz className="bg-rose-900 h-10 w-10 text-white p-2 rounded-full" />
            <h1 className="text-lg font-bold text-rose-900">Change Room</h1>
          </div>

          <Link to="/dashboard/rooms">
            <button className="flex items-center justify-center w-11 h-11 border border-rose-900 text-rose-900 hover:bg-rose-900 hover:text-white rounded-lg transition-colors">
              <RiHome3Line className="text-xl" />
            </button>
          </Link>
        </div>

        <p className="text-gray-500 mt-2">
          Transfer a guest from one room to another.
        </p>
      </div>

      {/* ================================================= */}
      {/* SECTION 1 - CURRENT GUEST / OLD ROOM */}
      {/* ================================================= */}
      <div className="card shadow-xl mb-8">
        <div className="card-body">
          <h2 className="card-title text-xl text-rose-900 mb-5">
            Current Stay Information
          </h2>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Select Current Guest
              </span>
            </label>

            <select
              value={selectedCheckInId}
              onChange={handleGuestChange}
              className="select select-bordered w-full bg-white"
            >
              <option value="">Select Guest / Current Room</option>

              {checkInsLoading ? (
                <option disabled>Loading...</option>
              ) : checkIns.length === 0 ? (
                <option disabled>No active guests found</option>
              ) : (
                checkIns.map((checkIn) => (
                  <option key={checkIn._id} value={checkIn._id}>
                    Room {checkIn.roomNumber} — {checkIn.guestName} (
                    {checkIn.roomVariantName})
                  </option>
                ))
              )}
            </select>
          </div>

          {selectedCheckIn && (
            <div className="mt-6">
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-5">
                <h3 className="font-bold text-rose-900 mb-4">
                  Current Room Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div>
                    <p className="text-sm text-gray-500">Guest</p>
                    <p className="font-semibold">{selectedCheckIn.guestName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Room</p>
                    <p className="font-semibold">
                      {selectedCheckIn.roomNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Room Variant</p>
                    <p className="font-semibold">
                      {selectedCheckIn.roomVariantName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price / Night</p>
                    <p className="font-semibold">
                      ৳{selectedCheckIn.pricePerNight}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Check-In Date</p>
                    <p className="font-semibold">
                      {selectedCheckIn.checkInDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Nights</p>
                    <p className="font-semibold">
                      {selectedCheckIn.numberOfNights}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Guest Phone</p>
                    <p className="font-semibold">
                      {selectedCheckIn.contactNumber ||
                        selectedCheckIn.phoneNumber ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-semibold text-rose-900">
                      {selectedCheckIn.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================================================= */}
      {/* SECTION 2 - ROOM TRANSFER */}
      {/* ================================================= */}
      <div className="card shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-xl text-rose-900 mb-6">
            Room Transfer Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedCheckIn && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Days Already Stayed
                  </span>
                </label>

                <input
                  type="number"
                  min="0"
                  max={selectedCheckIn.numberOfNights}
                  value={daysStayed}
                  onChange={(e) => setDaysStayed(Number(e.target.value) || 0)}
                  className="input input-bordered w-full bg-white"
                />

                <p className="text-xs text-gray-500 mt-1">
                  Auto calculated: {calculateDaysStayed(selectedCheckIn)} days
                </p>
              </div>
            )}

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Select New Room
                </span>
              </label>

              <select
                value={newRoomNumber}
                onChange={(e) => setNewRoomNumber(e.target.value)}
                className="select select-bordered w-full bg-white"
                disabled={!selectedCheckInId}
              >
                <option value="">Select New Room</option>

                {roomsLoading ? (
                  <option disabled>Loading...</option>
                ) : rooms.length === 0 ? (
                  <option disabled>No available rooms</option>
                ) : (
                  rooms
                    .filter(
                      (room) =>
                        String(room.roomNo) !==
                        String(selectedCheckIn?.roomNumber),
                    )
                    .map((room) => (
                      <option key={room._id} value={room.roomNo}>
                        Room {room.roomNo} — {room.variantName} (৳
                        {room.price}/night)
                      </option>
                    ))
                )}
              </select>
            </div>
          </div>

          {selectedNewRoom && (
            <div className="mt-8 bg-rose-50 border border-rose-200 rounded-xl p-5">
              <h3 className="font-bold text-rose-900 mb-4">
                New Room Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div>
                  <p className="text-sm text-gray-500">Room Number</p>
                  <p className="font-semibold">{selectedNewRoom.roomNo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Room Variant</p>
                  <p className="font-semibold">{selectedNewRoom.variantName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Price / Night</p>
                  <p className="font-semibold">৳{selectedNewRoom.price}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-semibold text-green-700">Available</p>
                </div>
              </div>
            </div>
          )}

          {selectedCheckIn && newRoomNumber && selectedNewRoom && (
            <div className="mt-8">
              <h3 className="text-lg font-bold text-rose-900 mb-4">
                Transfer Summary
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-xl p-5">
                  <p className="text-sm text-gray-500">
                    Days Stayed in Old Room
                  </p>
                  <p className="text-2xl font-bold mt-1">{daysStayed} days</p>
                </div>

                <div className="border rounded-xl p-5">
                  <p className="text-sm text-gray-500">
                    Cost So Far (Old Room)
                  </p>
                  <p className="text-2xl font-bold text-rose-900 mt-1">
                    ৳{daysStayed * (selectedCheckIn.pricePerNight || 0)}
                  </p>
                </div>

                <div className="border rounded-xl p-5">
                  <p className="text-sm text-gray-500">New Room Price</p>
                  <p className="text-2xl font-bold mt-1">
                    ৳{selectedNewRoom.price} / night
                  </p>
                </div>

                <div className="border rounded-xl p-5">
                  <p className="text-sm text-gray-500">Remaining Nights</p>
                  <p className="text-2xl font-bold mt-1">
                    {Math.max(
                      (selectedCheckIn.numberOfNights || 0) - daysStayed,
                      0,
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={() => {
                setSelectedCheckInId("");
                setNewRoomNumber("");
                setDaysStayed(0);
              }}
              className="btn btn-outline"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={handleTransfer}
              disabled={!selectedCheckInId || !newRoomNumber}
              className="btn bg-rose-900 hover:bg-rose-800 text-white border-none disabled:opacity-50"
            >
              <MdSwapHoriz className="text-xl" />
              Transfer Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeRoom;
