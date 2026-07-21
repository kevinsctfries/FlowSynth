import { createContext } from "react";

import { Patch } from "../engine/Patch";

export const SynthContext = createContext<Patch | null>(null);
