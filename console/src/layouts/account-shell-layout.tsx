import { ReactNode, type FC } from "react";
import { AppLayout } from "./app-layout";

export const AccountShellLayout: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return <AppLayout>{children}</AppLayout>;
};
