"use client";

import { createContext, type FC, type ReactNode } from "react";

export const context = createContext<string | null>(null);

export const ActiveAccountIdProvider: FC<{
  id: string | null;
  children: ReactNode;
}> = ({ id, children }) => {
  return <context.Provider value={id}>{children}</context.Provider>;
};
