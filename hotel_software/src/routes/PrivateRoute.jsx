import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";

const RiderRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();
  if (loading || roleLoading) {
    <span className="loading loading-spinner text-primary"></span>;
  }
  if (!user || role !== "rider") {
    console.log(role);
    return (
      <Navigate state={{ from: location.pathname }} to="/forbidden"></Navigate>
    );
  }
  return children;
};

export default RiderRoute;
