import { AppLayout } from "@/layouts/app-layout";

export default async function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
