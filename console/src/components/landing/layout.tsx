import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "./container";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <TitorelliLogo />
            <span className="text-xl font-bold">Titorelli</span>
          </div>
          <nav>
            <ul className="flex items-center gap-4">
              <li>
                <Button asChild variant="ghost">
                  <Link href="/authorization/signin">Sign In</Link>
                </Button>
              </li>
              <li>
                <Button asChild>
                  <Link href="/authorization/signup">Sign Up</Link>
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </Container>
    </header>
  );
}

export function Footer() {
  const links = [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Personal Data Policy", href: "/personal-data-policy" },
    { name: "Subscription Options", href: "/subscription-options" },
    { name: "Select Plan", href: "#select-plan" },
    { name: "Connect to Bot", href: "#connect-bot" },
    { name: "Get Docker Image", href: "#docker-image" },
    { name: "Contact Support", href: "/support" },
    { name: "Sign In", href: "/authorization/signin" },
    { name: "Sign Up", href: "/authorization/signup" },
    { name: "Restore Access", href: "/restore-access" },
  ];

  return (
    <footer className="bg-muted py-12">
      <Container>
        <nav>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {links.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-muted-foreground hover:text-primary"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </footer>
  );
}

export function TitorelliLogo(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      {...props}
    >
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
}
