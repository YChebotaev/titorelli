import { type FC, type ReactNode } from "react";

export const AccountContentLayout: FC<{ children: ReactNode }> = ({
  children,
}) => (
  <div className="p-4">
    {children}
  </div>
);
