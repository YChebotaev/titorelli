"use server";

import { BaseHeader } from "./base-header";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserNav } from "./user-nav/user-nav";
import { getUserInHeader } from "@/server-actions/header/get-user-in-header";
import { Suspense } from "react";
import { renderAvatar, UserNavSkeleton } from "./user-nav";

export async function AppHeader() {
  const user = await getUserInHeader();
  const isLoggedIn = Boolean(user);

  return (
    <BaseHeader
      navNode={
        <nav>
          {isLoggedIn ? (
            <Suspense
              fallback={
                <UserNavSkeleton
                  buttonWithAvatar={renderAvatar({ user: user! })}
                />
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
      }
    />
  );
}
