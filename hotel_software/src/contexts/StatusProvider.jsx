import { useQuery } from "@tanstack/react-query";
import { StatusContext } from "./StatusContext";
import useAuth from "../hooks/useAuth";
import useAxios from "../hooks/useAxios";

const StatusProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const axiosInstance = useAxios();

  const {
    data,
    isLoading: statusLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userStatus", user?.email],
    enabled: !authLoading && !!user?.email,
    queryFn: async () => {
      const res = await axiosInstance.get(`/users/${user.email}/status`);
      return res.data; // expected: { status, type, hotelEmail, hotelName }
    },
  });

  // Safe defaults
  const statusInfo = {
    status: data?.status ?? "Pending",
    type: data?.type ?? null,
    hotelEmail: data?.hotelEmail ?? null,
    hotelName: data?.hotelName ?? null,
    statusLoading: authLoading || statusLoading,
    isError,
    error,
    refetch,
  };

  return (
    <StatusContext.Provider value={statusInfo}>
      {children}
    </StatusContext.Provider>
  );
};

export default StatusProvider;
