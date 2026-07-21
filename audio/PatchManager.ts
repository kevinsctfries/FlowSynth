import { AudioEngine } from "./AudioEngine";
import { Patch } from "./Patch";
import { createModule } from "./ModuleFactory";

export class PatchManager {
  public readonly patch: Patch;

  private idCounter = 0;

  private engine: AudioEngine;

  constructor(engine: AudioEngine) {
    this.engine = engine;

    this.patch = new Patch();
  }

  createModule(type: string) {
    const id = `${type}-${this.idCounter++}`;

    const module = createModule(type, id, this.engine);

    this.patch.addModule(module);

    return {
      id,
      module,
    };
  }

  addModule(id: string, type: string) {
    const module = createModule(type, id, this.engine);

    this.patch.addModule(module);

    return module;
  }

  getModule(id: string) {
    return this.patch.getModule(id);
  }

  connect(
    sourceModuleId: string,
    sourcePortId: string,
    targetModuleId: string,
    targetPortId: string,
  ) {
    this.patch.connect(
      sourceModuleId,
      sourcePortId,
      targetModuleId,
      targetPortId,
    );
  }
}
