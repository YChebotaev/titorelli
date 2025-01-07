"use server";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "../container";
import { TitorelliLogo } from "../titorelli-logo";
import { UserNav } from "./user-nav/user-nav";
import { getUserInHeader } from "@/server-actions/header/get-user-in-header";
import { Suspense } from "react";
import { renderAvatar, UserNavSkeleton } from "./user-nav";

export async function Header() {
  const user = await getUserInHeader();
  const isLoggedIn = Boolean(user);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <TitorelliLogo />
            <span className="text-xl font-bold">Titorelli</span>
          </div>
          <nav>
            {isLoggedIn ? (
              <Suspense
                fallback={
                  <UserNavSkeleton buttonWithAvatar={renderAvatar({ user: user! })} />
                }
              >
                <UserNav user={user!} />
              </Suspense>
            ) : (
              <ul className="flex items-center gap-4">
                <li>
                  <Button asChild variant="ghost">
                    <Link href="/authorization/signin">Войти</Link>
                  </Button>
                </li>
                <li>
                  <Button asChild>
                    <Link href="/authorization/signup">Зарегистрироваться</Link>
                  </Button>
                </li>
              </ul>
            )}
          </nav>
        </div>
      </Container>
    </header>
  );
}
