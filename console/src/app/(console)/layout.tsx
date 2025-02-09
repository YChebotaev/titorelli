import { AppLayout } from "@/layouts/app-layout";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
