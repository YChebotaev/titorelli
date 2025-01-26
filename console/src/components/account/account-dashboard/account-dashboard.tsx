import { AccountContentLayout } from "@/layouts/accounts-content-layout";
import { type FC } from "react";
import { ContentActions } from "../content-actions";

export const AccountDashboard: FC = () => {
  return (
    <AccountContentLayout>
      Account dashboard
      <ContentActions>
        Hello, world!
      </ContentActions>
    </AccountContentLayout>
  );
};
