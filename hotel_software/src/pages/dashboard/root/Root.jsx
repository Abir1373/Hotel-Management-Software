import { useQuery } from "@tanstack/react-query";
import ReactApexChart from "react-apexcharts";
import {
  FaUsers,
  FaUserTie,
  FaBed,
  FaDoorOpen,
  FaMoneyBillWave,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { Navigate } from "react-router";
import useAxios from "../../../hooks/useAxios";
import useUserStatus from "../../../hooks/useUserStatus";
import PageHeader from "../../../components/PageHeader";

const Root = () => {
  const axiosInstance = useAxios();
  const { status, hotelEmail, statusLoading } = useUserStatus();

  const normalizedStatus = String(status || "")
    .toLowerCase()
    .replace(/[\s_-]/g, "");

  const isSubUser = normalizedStatus === "subuser";
  const isAdmin = normalizedStatus === "admin";
  const canLoadDashboard = Boolean(hotelEmail) && !statusLoading && !isAdmin;

  // Dashboard statistics
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["dashboard-stats", hotelEmail],
    queryFn: async () => {
      const res = await axiosInstance.get("/dashboard/stats", {
        params: { hotelEmail },
      });
      return res.data;
    },
    enabled: canLoadDashboard,
  });

  // Customers per month
  const {
    data: customersData,
    isLoading: customersLoading,
    isError: customersError,
    refetch: refetchCustomers,
  } = useQuery({
    queryKey: ["customers-per-month", hotelEmail],
    queryFn: async () => {
      const res = await axiosInstance.get("/dashboard/customers-per-month", {
        params: { hotelEmail },
      });
      return res.data;
    },
    enabled: canLoadDashboard,
  });

  // Revenue by service: only load for non-sub-users
  const {
    data: revenueData,
    isLoading: revenueLoading,
    isError: revenueError,
    refetch: refetchRevenue,
  } = useQuery({
    queryKey: ["revenue-by-service", hotelEmail],
    queryFn: async () => {
      const res = await axiosInstance.get("/dashboard/revenue-by-service", {
        params: { hotelEmail },
      });
      return res.data;
    },
    enabled: canLoadDashboard && !isSubUser,
  });

  // Customers chart options
  const barOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 6,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: customersData?.categories || [],
    },
    yaxis: {
      title: {
        text: "Number of Customers",
      },
    },
    fill: {
      opacity: 1,
    },
    colors: ["#be123c"],
    tooltip: {
      y: {
        formatter: (value) => `${value} customers`,
      },
    },
  };

  // Revenue pie chart options
  const pieOptions = {
    chart: {
      type: "pie",
      width: 420,
    },
    labels: revenueData?.labels || [],
    title: {
      text: "Revenue by Service",
      align: "center",
      style: {
        fontSize: "16px",
        fontWeight: 600,
      },
    },
    legend: {
      position: "bottom",
    },
    colors: ["#be123c", "#f97316", "#3b82f6", "#22c55e"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  // Status loading
  if (statusLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-rose-900" />
      </div>
    );
  }

  // Redirect admins to Settings
  if (isAdmin) {
    return <Navigate to="/dashboard/settings" replace />;
  }

  // Missing hotel email
  if (!hotelEmail) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center p-6">
        <div className="rounded-2xl border border-rose-100 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-rose-900">
            Hotel account unavailable
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We couldn't identify the hotel account for this dashboard.
          </p>
        </div>
      </div>
    );
  }

  // Loading dashboard data
  const dashboardLoading =
    statsLoading || customersLoading || (!isSubUser && revenueLoading);

  if (dashboardLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-rose-900" />
      </div>
    );
  }

  // Dashboard error state
  const dashboardError =
    statsError || customersError || (!isSubUser && revenueError);

  if (dashboardError) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center p-6">
        <div className="rounded-2xl border border-rose-100 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-rose-900">
            Couldn't load dashboard data
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please check your connection and try again.
          </p>
          <button
            type="button"
            onClick={() => {
              refetchStats();
              refetchCustomers();

              if (!isSubUser) {
                refetchRevenue();
              }
            }}
            className="mt-5 rounded-xl bg-rose-900 px-5 py-2.5 font-semibold text-white transition hover:bg-rose-800"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Reusable customers-per-month chart
  const renderCustomersChart = (title) => (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:border-rose-300 hover:shadow-xl">
      <h3 className="mb-5 text-lg font-bold text-rose-900">{title}</h3>

      {customersData?.series?.[0]?.data?.length > 0 ? (
        <ReactApexChart
          options={barOptions}
          series={customersData.series}
          type="bar"
          height={350}
        />
      ) : (
        <p className="py-20 text-center text-gray-400">
          No checkout data available yet
        </p>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your hotel performance, guests, rooms and revenue."
        icon={<MdDashboard className="text-xl text-white" />}
      />

      {/* Dashboard statistic cards */}
      <div
        className={`mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 ${
          isSubUser ? "xl:grid-cols-3" : "xl:grid-cols-5"
        }`}
      >
        {/* Current Guests */}
        <div className="group rounded-2xl border border-rose-100 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-rose-300 hover:shadow-xl">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 shadow-md shadow-rose-200 transition-transform group-hover:scale-110">
            <FaUsers className="text-xl text-white" />
          </div>

          <p className="mb-1 text-sm text-gray-500">Current Guests</p>
          <p className="text-3xl font-bold text-rose-700">
            {stats?.currentGuests || 0}
          </p>
        </div>

        {/* Hidden for sub-users */}
        {!isSubUser && (
          <div className="group rounded-2xl border border-violet-100 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-violet-300 hover:shadow-xl">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 shadow-md shadow-violet-200 transition-transform group-hover:scale-110">
              <FaUserTie className="text-xl text-white" />
            </div>

            <p className="mb-1 text-sm text-gray-500">Current Employees</p>
            <p className="text-3xl font-bold text-violet-700">
              {stats?.currentEmployees || 0}
            </p>
          </div>
        )}

        {/* Available Rooms */}
        <div className="group rounded-2xl border border-emerald-100 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-xl">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-md shadow-emerald-200 transition-transform group-hover:scale-110">
            <FaDoorOpen className="text-xl text-white" />
          </div>

          <p className="mb-1 text-sm text-gray-500">Available Rooms</p>
          <p className="text-3xl font-bold text-emerald-700">
            {stats?.totalAvailableRooms || 0}
          </p>
        </div>

        {/* Occupied Rooms */}
        <div className="group rounded-2xl border border-amber-100 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-amber-300 hover:shadow-xl">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-md shadow-amber-200 transition-transform group-hover:scale-110">
            <FaBed className="text-xl text-white" />
          </div>

          <p className="mb-1 text-sm text-gray-500">Occupied Rooms</p>
          <p className="text-3xl font-bold text-amber-700">
            {stats?.totalOccupiedRooms || 0}
          </p>
        </div>

        {/* Hidden for sub-users */}
        {!isSubUser && (
          <div className="group rounded-2xl border border-sky-100 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-sky-300 hover:shadow-xl">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 shadow-md shadow-sky-200 transition-transform group-hover:scale-110">
              <FaMoneyBillWave className="text-xl text-white" />
            </div>

            <p className="mb-1 text-sm text-gray-500">This Month Earning</p>
            <p className="text-3xl font-bold text-sky-700">
              ৳{(stats?.currentMonthEarning || 0).toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
        {renderCustomersChart("Customers Per Month")}

        {isSubUser ? (
          renderCustomersChart("Monthly Customer Activity")
        ) : (
          <div className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:border-rose-300 hover:shadow-xl">
            <h3 className="mb-5 self-start text-lg font-bold text-rose-900">
              Revenue by Service
            </h3>

            {revenueData?.series?.some((value) => value > 0) ? (
              <ReactApexChart
                options={pieOptions}
                series={revenueData.series}
                type="pie"
                width={420}
              />
            ) : (
              <p className="py-20 text-center text-gray-400">
                No revenue data available yet
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Root;
