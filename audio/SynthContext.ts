import { createContext } from "react";

import { Patch } from "./Patch";

export const SynthContext = createContext<Patch | null>(null);
