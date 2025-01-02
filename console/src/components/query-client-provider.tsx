"use client";

import { useMemo, type FC, type ReactNode } from "react";
import {
  QueryClientProvider as BaseProvider,
  QueryClient,
} from "@tanstack/react-query";

export const QueryClientProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const queryClient = useMemo(() => new QueryClient(), []);

  return <BaseProvider client={queryClient}>{children}</BaseProvider>;
};
