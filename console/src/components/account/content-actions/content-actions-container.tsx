'use client'

import { type RefObject, type FC } from "react";

export const ContentActionsContainer: FC<{
  ref: RefObject<HTMLDivElement | null>;
}> = ({ ref }) => <div ref={ref} />;
