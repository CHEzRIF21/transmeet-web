"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useProfileApi } from "@/lib/api/profile";

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  avatar_url: string | null;
  is_active: boolean;
  kyc_status: string | null;
}

export function useProfile() {
  const supabase = createClient();

  const sessionQuery = useQuery({
    queryKey: ["auth-session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const profileQuery = useProfileApi(sessionQuery.data?.access_token);

  return {
    profile: profileQuery.data as Profile | null | undefined,
    loading: sessionQuery.isLoading || profileQuery.isLoading,
    error: sessionQuery.error ?? profileQuery.error,
    accessToken: sessionQuery.data?.access_token,
  };
}
