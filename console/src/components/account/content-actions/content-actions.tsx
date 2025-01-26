"use client";

import { use, type FC, ReactNode, useState, useEffect } from "react";
import { Portal } from "@radix-ui/react-portal";
import { ContentActionsContext } from "./content-actions-context";

export const ContentActions: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const { containerRef } = use(ContentActionsContext)!;

  useEffect(() => {
    if (containerRef?.current) {
      setContainer(containerRef?.current);
    }

    return () => {
      setContainer(null);
    };
  }, [containerRef]);

  return <Portal container={container}>{children}</Portal>;
};
