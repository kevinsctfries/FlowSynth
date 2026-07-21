import { createContext } from "react";

import { PatchManager } from "./PatchManager";

export const SynthContext = createContext<PatchManager | null>(null);
