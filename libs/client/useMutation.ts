import { useState } from "react";

interface UseMutationState<T> {
  data?: T;
  loading?: boolean;
  error?: any;
}

type UseMutationResult<T> = [(data: any) => void, UseMutationState<T>];

export default function useMutation<T>(url: string): UseMutationResult<T> {
  const [state, setState] = useState<UseMutationState<T>>({
    loading: false,
    data: undefined,
    error: undefined,
  });
  const mutation = async (data: any) => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const response = await (
        await fetch(url, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        })
      ).json();
      setState((prev) => ({ ...prev, data: response }));
    } catch (error) {
      setState((prev) => ({ ...prev, error }));
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };
  return [mutation, { ...state }];
}
