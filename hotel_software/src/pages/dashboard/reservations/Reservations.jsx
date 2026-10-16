import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { LuBookImage, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { MdWorkHistory } from "react-icons/md";
import PageHeader from "../../../components/PageHeader";

// Fixed national holidays (same date every year)
const FIXED_HOLIDAYS = [
  { month: 2, day: 21 }, // Shaheed Dibosh / Mother Language Day
  { month: 3, day: 26 }, // Independence Day
  { month: 4, day: 14 }, // Pohela Boishakh
  { month: 5, day: 1 }, // May Day
  { month: 8, day: 5 }, // July Mass Uprising Day
  { month: 8, day: 15 }, // National Mourning Day
  { month: 12, day: 16 }, // Victory Day
  { month: 12, day: 25 }, // Christmas
];

// Movable holidays (Islamic / Hindu) — update each year from govt gazette
// Format: "YYYY-MM-DD"
const MOVABLE_HOLIDAYS_BY_YEAR = {
  2025: [
    "2025-02-14", // Shab-e-Barat (approx / gazette)
    "2025-03-28", // Shab-e-Qadr
    "2025-03-31",
    "2025-04-01",
    "2025-04-02", // Eid-ul-Fitr period
    "2025-06-07",
    "2025-06-08",
    "2025-06-09",
    "2025-06-10", // Eid-ul-Adha period
    "2025-07-06", // Ashura
    "2025-09-05", // Eid-e-Milad-un-Nabi
    "2025-08-16", // Janmashtami
    "2025-10-01",
    "2025-10-02", // Durga Puja
  ],
  2026: [
    "2026-02-04", // Shab-e-Barat
    "2026-03-17", // Shab-e-Qadr
    "2026-03-19",
    "2026-03-20",
    "2026-03-21",
    "2026-03-22",
    "2026-03-23", // Eid-ul-Fitr
    "2026-05-26",
    "2026-05-27",
    "2026-05-28",
    "2026-05-29",
    "2026-05-30",
    "2026-05-31", // Eid-ul-Adha
    "2026-06-26", // Ashura
    "2026-08-26", // Eid-e-Milad-un-Nabi
    "2026-09-04", // Janmashtami
    "2026-10-20",
    "2026-10-21", // Durga Puja
  ],
  2027: [
    "2027-01-24", // Shab-e-Barat
    "2027-03-07", // Shab-e-Qadr
    "2027-03-08",
    "2027-03-09",
    "2027-03-10",
    "2027-03-11",
    "2027-03-12", // Eid-ul-Fitr
    "2027-05-15",
    "2027-05-16",
    "2027-05-17",
    "2027-05-18",
    "2027-05-19",
    "2027-05-20", // Eid-ul-Adha
    "2027-06-15", // Ashura
    "2027-08-15", // Eid-e-Milad-un-Nabi
    "2027-08-24", // Janmashtami
    "2027-10-08",
    "2027-10-09", // Durga Puja
  ],
};

const getNationalHolidays = (year) => {
  const fixed = FIXED_HOLIDAYS.map(
    ({ month, day }) =>
      `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
  );
  const movable = MOVABLE_HOLIDAYS_BY_YEAR[year] || [];
  return [...new Set([...fixed, ...movable])];
};

const Reservations = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const nationalHolidays = getNationalHolidays(year);

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const isSpecialDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const d = new Date(year, month, day);
    const dayOfWeek = d.getDay(); // 4 = Thu, 5 = Fri, 6 = Sat

    return (
      dayOfWeek === 4 ||
      dayOfWeek === 5 ||
      dayOfWeek === 6 ||
      nationalHolidays.includes(dateStr)
    );
  };

  const isPastDay = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(year, month, day);
    return checkDate < today;
  };

  const handleDayClick = (day) => {
    if (isPastDay(day)) return;

    const selectedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    navigate(`/dashboard/rooms/all-rooms?date=${selectedDate}&mode=reserve`);
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="p-6">
      {/* ===== Page Header ===== */}
      <PageHeader
        title="Reservations"
        subtitle="Select a date to view available rooms and make a reservation."
        icon={<LuBookImage className="text-xl text-white" />}
        extra={
          <Link to="/dashboard/reservations/reservation_history">
            <button className="btn btn-outline btn-sm border-rose-900 text-rose-900 hover:bg-rose-900 hover:text-white gap-2">
              <MdWorkHistory className="text-lg" />
              History
            </button>
          </Link>
        }
      />

      {/* Live Date & Time */}
      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 mb-8 text-center shadow-sm mt-6">
        <p className="text-sm text-gray-500 mb-1">Current Date & Time</p>
        <p className="text-xl font-bold text-rose-900">
          {now.toLocaleDateString("en-GB", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <p className="text-2xl font-mono text-rose-900 mt-1 tracking-wider">
          {now.toLocaleTimeString("en-GB")}
        </p>
      </div>

      {/* Calendar Card */}
      <div className="bg-white shadow-xl rounded-2xl p-5 sm:p-6 border border-gray-100">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={prevMonth}
            className="btn btn-circle btn-ghost hover:bg-rose-50"
          >
            <LuChevronLeft className="text-2xl text-rose-900" />
          </button>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            {monthNames[month]} {year}
          </h2>

          <button
            onClick={nextMonth}
            className="btn btn-circle btn-ghost hover:bg-rose-50"
          >
            <LuChevronRight className="text-2xl text-rose-900" />
          </button>
        </div>

        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-3">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center font-semibold text-gray-500 text-xs sm:text-sm py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const special = isSpecialDay(day);
            const past = isPastDay(day);
            const isToday =
              day === new Date().getDate() &&
              month === new Date().getMonth() &&
              year === new Date().getFullYear();

            return (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                disabled={past}
                className={`
                  aspect-square rounded-xl flex flex-col items-center justify-center
                  font-bold transition-all duration-200
                  ${
                    past
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
                      : special
                        ? "bg-orange-500 text-white hover:bg-orange-600 hover:scale-105 active:scale-95 shadow-md"
                        : "bg-green-500 text-white hover:bg-green-600 hover:scale-105 active:scale-95 shadow-md"
                  }
                  ${isToday && !past ? "ring-4 ring-rose-500 ring-offset-2" : ""}
                `}
              >
                <span className="text-base sm:text-lg">{day}</span>
                {special && !past && (
                  <span className="text-[9px] sm:text-[10px] opacity-90 leading-none mt-0.5">
                    Holiday
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 sm:gap-6 mt-8 text-sm justify-center">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-green-500 shadow-sm"></span>
            <span className="text-gray-700">Normal Day</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-orange-500 shadow-sm"></span>
            <span className="text-gray-700">Thu / Fri / Sat + Holiday</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded ring-4 ring-rose-500 ring-offset-1 bg-white"></span>
            <span className="text-gray-700">Today</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-gray-100 border border-gray-300"></span>
            <span className="text-gray-700">Past Date</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservations;
