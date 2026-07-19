import { useNavigate } from "react-router-dom";
import { useStaffLogoutMutation } from "./staffAuth/useStaffLogoutMutation";
import { useStaffUnreadCountQuery } from "./staffNotifications/useStaffUnreadCountQuery";

export function useStaffNavUtilities(isAuthenticated: boolean) {
  const navigate = useNavigate();
  const logoutMutation = useStaffLogoutMutation();
  const unreadCountQuery = useStaffUnreadCountQuery(isAuthenticated);
  const unreadCount = unreadCountQuery.data?.unread_count ?? 0;

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/staff/login");
      },
    });
  };

  return {
    unreadCount,
    logoutMutation,
    handleLogout,
  };
}
