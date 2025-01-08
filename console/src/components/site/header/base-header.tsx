"use server";

import { type ReactNode } from "react";
import { Container } from "../container";
import { TitorelliLogo } from "../titorelli-logo";

export async function BaseHeader({ navNode = null }: { navNode?: ReactNode }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <TitorelliLogo />
            <span className="text-xl font-bold">Titorelli</span>
          </div>
          {navNode}
        </div>
      </Container>
    </header>
  );
}
