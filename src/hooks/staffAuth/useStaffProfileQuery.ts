import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../../api/staffAuth";
import { ApiError } from "../../api/client";

export function useStaffProfileQuery() {
  return useQuery({
    queryKey: ["staff-profile"],
    queryFn: async () => {
      try {
        return await getProfile();
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          return null;
        }
        throw err;
      }
    },
    retry: false,
  });
}
