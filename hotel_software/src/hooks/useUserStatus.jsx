import useAuth from "./useAuth";
import useAxios from "./useAxios";
import { useQuery } from "@tanstack/react-query";

const useUserStatus = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosInstance = useAxios();

  const {
    data: status = "Pending",
    isLoading: statusLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userStatus", user?.email],
    enabled: !authLoading && !!user?.email,
    queryFn: async () => {
      console.log("Fetching status for:", user.email); // debug
      const res = await axiosInstance.get(`/users/${user.email}/status`);
      console.log("Status response:", res.data); // debug
      return res.data.status;
    },
    retry: 1,
  });

  // Log error if any
  if (isError) {
    console.error("Status fetch error:", error);
  }

  return {
    status,
    statusLoading: authLoading || statusLoading,
    isError,
    refetch,
  };
};

export default useUserStatus;
