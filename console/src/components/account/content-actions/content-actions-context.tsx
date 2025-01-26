'use client'

import { createContext } from "react";

import type { ContentActionsContextProps } from "./types";

export const ContentActionsContext =
  createContext<ContentActionsContextProps | null>(null);
