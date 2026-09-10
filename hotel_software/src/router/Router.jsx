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
import PresentGuestList from "../pages/dashboard/guests/present_guest_list/PresentGuestList";
import EditGuestInfo from "../pages/dashboard/guests/present_guest_list/edit_guest_info/EditGuestInfo";
import BlackListedGuests from "../pages/dashboard/guests/black_listed_guests/BlackListedGuests";
import FoodMenu from "../pages/dashboard/services/restaurant_orders/food_menu/FoodMenu";
import RoomServiceHistory from "../pages/dashboard/services/room_service/RoomServiceHistory";
import RestaurantOrdersHistory from "../pages/dashboard/services/restaurant_orders/RestaurantOrdersHistory";
import LaundryServiceHistory from "../pages/dashboard/services/laundry_service/LaundryServiceHistory";
import TransportServiceHistory from "../pages/dashboard/services/transport_service/TransportServiceHistory";
import EditRestaurantHistory from "../pages/dashboard/services/restaurant_orders/edit_restaurant_history/EditRestaurantHistory";
import RestaurantInvoice from "../pages/dashboard/services/restaurant_orders/restaurant_invoice/RestaurantInvoice";
import Dues from "../pages/dashboard/billing_and_payments/dues/Dues";
import ReservationsHistory from "../pages/dashboard/reservations/ReservationsHistory";
import AssignNewSalaryStructure from "../pages/dashboard/employees/payroll/assign-new-salary-structure/AssignNewSalaryStructure";
import PayrollHistory from "../pages/dashboard/employees/payroll/payroll-history/PayrollHistory";
import MakeSalary from "../pages/dashboard/employees/payroll/make salary/MakeSalary";
import Hotels from "../pages/dashboard/settings/hotels/Hotels";
import Reports from "../pages/dashboard/reports/Reports";
import SalesReport from "../pages/dashboard/reports/sales_report/SalesReport";
import RoomReport from "../pages/dashboard/reports/room_report/RoomReport";
import TransportationSales from "../pages/dashboard/reports/sales_report/transportation_sales/TransportationSales";
import RestaurantSales from "../pages/dashboard/reports/sales_report/restaurant_sales/RestaurantSales";
import LaundrySales from "../pages/dashboard/reports/sales_report/laundry_sales/LaundrySales";
import SalaryReport from "../pages/dashboard/reports/salary_report/SalaryReport";
import ExpenseReport from "../pages/dashboard/reports/expense_report/ExpenseReport";
import EntryReport from "../pages/dashboard/reports/expense_report/entry_report/EntryReport";
import ExpenseOverview from "../pages/dashboard/reports/expense_report/expense_overview/ExpenseOverview";
import MainCheckout from "../pages/dashboard/check_in_out/check_out/main_checkout/MainCheckout";
import PaymentHistory from "../pages/dashboard/billing_and_payments/payment_history/PaymentHistory";
import CheckoutDetails from "../pages/dashboard/billing_and_payments/payment_history/CheckoutDetails";
import GuestHistory from "../pages/dashboard/guests/guest_history/GuestHistory";
import Refunds from "../pages/dashboard/billing_and_payments/refunds/Refunds";
import HotelInformation from "../pages/dashboard/settings/hotel_information/HotelInformation";
import Security from "../pages/dashboard/settings/security/Security";
import UnderPreview from "../pages/error_pages/UnderPreview";
import UnderDue from "../pages/error_pages/UnderDue";
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
      { path: "billing_and_payments/dues", Component: Dues },
      { path: "billing_and_payments/refunds", Component: Refunds },
      {
        path: "billing_and_payments/payment_history",
        Component: PaymentHistory,
      },
      {
        path: "billing_and_payments/checkout_details/:id",
        Component: CheckoutDetails,
      },

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
        path: "services/room_service/room_service_history",
        Component: RoomServiceHistory,
      },
      {
        path: "services/restaurant_orders",
        Component: RestaurantOrders,
      },
      {
        path: "services/restaurant_orders/restaurant_orders_history",
        Component: RestaurantOrdersHistory,
      },
      {
        path: "services/restaurant_orders/edit_restaurant_history/:id",
        Component: EditRestaurantHistory,
      },
      {
        path: "services/restaurant_orders/invoice/:id",
        Component: RestaurantInvoice,
      },
      {
        path: "services/restaurant_orders/food_menu",
        Component: FoodMenu,
      },
      { path: "services/laundry_service", Component: LaundryService },
      {
        path: "services/laundry_service/laundry_service_history",
        Component: LaundryServiceHistory,
      },
      {
        path: "services/transport_service",
        Component: TransportService,
      },
      {
        path: "services/transport_service/transport_service_history",
        Component: TransportServiceHistory,
      },

      { path: "check_in_out", Component: Check_in_Out },
      { path: "check_in_out/check_in", Component: CheckIn },
      { path: "check_in_out/check_out", Component: CheckOut },
      { path: "check_in_out/check_out/:id", Component: MainCheckout },
      { path: "check_in_out", Component: CheckOut },

      { path: "employees", Component: Employees },
      { path: "employees/add_employee", Component: AddEmployee },
      {
        path: "employees/current_employees",
        Component: CurrentEmployees,
      },
      { path: "employees/past_employees", Component: PastEmployees },
      { path: "employees/payroll", Component: Payroll },
      {
        path: "employees/payroll/assign-new-salary-structure",
        Component: AssignNewSalaryStructure,
      },
      {
        path: "employees/payroll/payroll-history",
        Component: PayrollHistory,
      },
      {
        path: "payroll/make-salary/:employeeId",
        Component: MakeSalary,
      },
      { path: "employees/edit/:id", Component: EditEmployee },

      { path: "guests", Component: Guests },
      { path: "guests/present_guest_list", Component: PresentGuestList },
      { path: "guests/guest_history", Component: GuestHistory },
      { path: "guests/edit_guest_info/:id", Component: EditGuestInfo },
      { path: "guests/black_listed_guests", Component: BlackListedGuests },

      { path: "reservations", Component: Reservations },
      {
        path: "reservations/reservation_history",
        Component: ReservationsHistory,
      },
      { path: "reports", Component: Reports },
      { path: "reports/sales_report", Component: SalesReport },
      {
        path: "reports/sales_report/transportation_sales",
        Component: TransportationSales,
      },
      {
        path: "reports/sales_report/restaurant_sales",
        Component: RestaurantSales,
      },
      { path: "reports/sales_report/laundry_sales", Component: LaundrySales },
      { path: "reports/room_report", Component: RoomReport },
      { path: "reports/salary_report", Component: SalaryReport },
      { path: "reports/expense_report", Component: ExpenseReport },
      { path: "reports/expenses/entry-report", Component: EntryReport },
      { path: "reports/expenses/expense_overview", Component: ExpenseOverview },
      { path: "settings", Component: Settings },
      { path: "settings/hotels", Component: Hotels },
      { path: "settings/hotel_information", Component: HotelInformation },
      { path: "settings/security", Component: Security },
      { path: "under_preview", Component: UnderPreview },
      { path: "under_due", Component: UnderDue },
    ],
  },
]);

export default Router;
