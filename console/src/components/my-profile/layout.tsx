import { AppHeader } from "@/components/site/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mt-16 max-w-[1080px] px-5 md:px-0 mx-auto py-8">
        {children}
      </main>
    </div>
  );
}
