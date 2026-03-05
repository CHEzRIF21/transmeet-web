import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "./client";

export function useProfileApi(accessToken: string | undefined) {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () =>
      apiRequest<{
        id: string;
        full_name: string | null;
        email: string | null;
        phone: string | null;
        role: string;
        avatar_url: string | null;
        is_active: boolean;
        kyc_status: string | null;
      }>("users/me", { accessToken }).then((r) =>
        r.success ? r.data : null
      ),
    enabled: !!accessToken,
  });
}
