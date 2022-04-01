import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

interface UserProfile {
  ok: true;
  profile: User;
}

export default function useUser() {
  const { data, error } = useSWR<UserProfile>("/api/users/me");

  const router = useRouter();
  useEffect(() => {
    if (data && !data.ok) {
      router.replace("/enter");
    }
  }, [data, router]);
  return { user: data, isLoading: !data && !error };
}
