import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../../api/profile";
import { ApiError } from "../../api/client";

export function useProfileQuery() {
  return useQuery({
    queryKey: ["profile"],
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
