import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container max-w-[1080px] px-5 md:px-0 mx-auto flex items-center justify-between py-4">
          <div className="flex items-center space-x-2">
            <Image
              src="/logo.svg"
              alt="Titorelli Logo"
              width={32}
              height={32}
            />
            <span className="text-xl font-bold">Titorelli</span>
          </div>
        </div>
      </header>
      <main className="container max-w-[1080px] px-5 md:px-0 mx-auto py-8">
        {children}
      </main>
    </div>
  );
}
