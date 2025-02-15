"use client";

import { useMemo, type FC, type ReactNode } from "react";
import {
  QueryClientProvider as BaseProvider,
  QueryClient,
  MutationCache,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const QueryClientProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        mutationCache: new MutationCache({
          onError(error) {
            if (error instanceof AxiosError) {
              toast.error(error.message)
            }
          },
        }),
      }),
    [],
  );

  return <BaseProvider client={queryClient}>{children}</BaseProvider>;
};
