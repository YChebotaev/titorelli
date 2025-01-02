import Link from "next/link";
import { Container } from "../site/container";

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
