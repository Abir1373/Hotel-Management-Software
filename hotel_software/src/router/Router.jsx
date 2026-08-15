import { createBrowserRouter } from "react-router";
import Login from "../pages/login/Login";
import AuthLayout from "../layouts/AuthLayout";
import Signup from "../pages/signup/Signup";
import Root from "../pages/dashboard/root/Root";
import DashboardLayout from "../layouts/DashboardLayout";
import Rooms from "../pages/dashboard/rooms/Rooms";
import Services from "../pages/dashboard/services/Services";
import Billing_and_Payments from "../pages/dashboard/billing_and_payments/Billing_and_Payments";
import Check_in_Out from "../pages/dashboard/check_in_out/Check_in_Out";
import Employees from "../pages/dashboard/employees/Employees";
import Guests from "../pages/dashboard/guests/Guests";
import Reservations from "../pages/dashboard/reservations/Reservations";
import Settings from "../pages/dashboard/settings/Settings";
import RoomService from "../pages/dashboard/services/room_service/RoomService";
import RestaurantOrders from "../pages/dashboard/services/restaurant_orders/RestaurantOrders";
import LaundryService from "../pages/dashboard/services/laundry_service/LaundryService";
import TransportService from "../pages/dashboard/services/transport_service/TransportService";
import CheckIn from "../pages/dashboard/check_in_out/check_in/CheckIn";
import CheckOut from "../pages/dashboard/check_in_out/check_out/CheckOut";
import AddEmployee from "../pages/dashboard/employees/add_employee/AddEmployee";
import NewReservation from "../pages/dashboard/reservations/new_reservation/NewReservation";
import GroupBookings from "../pages/dashboard/reservations/group_reservation/GroupBookings";
import CurrentEmployees from "../pages/dashboard/employees/current_employees/CurrentEmployees";
import EditEmployee from "../pages/dashboard/employees/edit_employee_info/EditEmployee";
import PastEmployees from "../pages/dashboard/employees/past_employees/PastEmployees";
import Payroll from "../pages/dashboard/employees/payroll/Payroll";
import Maintenance from "../pages/dashboard/rooms/maintenance/Maintenance";
import EditMaintenance from "../pages/dashboard/rooms/maintenance/edit_maintenance/EditMaintenance";
import MaintenanceHistory from "../pages/dashboard/rooms/maintenance/maintenance_history/MaintenanceHistory";
import EditMaintenanceHistory from "../pages/dashboard/rooms/maintenance/edit_maintenance_history/EditMaintenanceHistory";
import AddRoomVariant from "../pages/dashboard/rooms/add_room_variant/AddRoomVariant";
import RoomOverview from "../pages/dashboard/rooms/room_overview/RoomOverview";
import EditRoomVariant from "../pages/dashboard/rooms/room_overview/edit_room_variant/EditRoomVariant";
import AddRoom from "../pages/dashboard/rooms/room_overview/add_room/AddRoom";
import ViewRooms from "../pages/dashboard/rooms/room_status/ViewRooms";
import RoomStatus from "../pages/dashboard/rooms/room_status/RoomStatus";
const Router = createBrowserRouter([
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        index: true,
        Component: Login,
      },
      {
        path: "signup",
        Component: Signup,
      },
    ],
  },

  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      {
        index: true,
        Component: Root,
      },

      { path: "billing_and_payments", Component: Billing_and_Payments },

      { path: "rooms", Component: Rooms },
      { path: "rooms/add_room_variant", Component: AddRoomVariant },
      { path: "rooms/room_status", Component: RoomStatus },
      { path: "rooms/room_overview", Component: RoomOverview },
      { path: "rooms/edit_room_variant/:id", Component: EditRoomVariant },

      { path: "rooms/add_room/:id", Component: AddRoom },
      { path: "rooms/maintenance", Component: Maintenance },
      { path: "rooms/edit_maintenance/:id", Component: EditMaintenance },
      {
        path: "rooms/maintenance_history",
        Component: MaintenanceHistory,
      },
      {
        path: "rooms/view_rooms/:id",
        Component: ViewRooms,
      },
      {
        path: "rooms/edit_maintenance_history/:id",
        Component: EditMaintenanceHistory,
      },

      { path: "services", Component: Services },
      { path: "services/room_service", Component: RoomService },
      {
        path: "services/restaurant_orders",
        Component: RestaurantOrders,
      },
      { path: "services/laundry_service", Component: LaundryService },
      {
        path: "services/transport_service",
        Component: TransportService,
      },

      { path: "check_in_out", Component: Check_in_Out },
      { path: "check_in_out/check_in", Component: CheckIn },
      { path: "check_in_out/check_out", Component: CheckOut },

      { path: "employees", Component: Employees },
      { path: "employees/add_employee", Component: AddEmployee },
      {
        path: "employees/current_employees",
        Component: CurrentEmployees,
      },
      { path: "employees/past_employees", Component: PastEmployees },
      { path: "employees/payroll", Component: Payroll },
      { path: "employees/edit/:id", Component: EditEmployee },

      { path: "guests", Component: Guests },

      { path: "reservations", Component: Reservations },
      {
        path: "reservations/new_reservation",
        Component: NewReservation,
      },
      {
        path: "reservations/group_bookings",
        Component: GroupBookings,
      },

      { path: "settings", Component: Settings },
    ],
  },
]);

export default Router;
