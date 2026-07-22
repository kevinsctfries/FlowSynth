import { AudioEngine } from "./AudioEngine";
import { Module } from "./Module";
import { Connection } from "./Connection";
import { createModule } from "../factory/ModuleFactory";
import { VoiceEngine } from "./VoiceEngine";
import type { VoiceMode } from "./VoiceAllocator";
import { MidiInputModule } from "../modules/MidiInput";

export class Patch {
  private engine: AudioEngine;

  private modules = new Map<string, Module>();

  private connections: Connection[] = [];

  private idCounter = 0;

  private voiceEngine?: VoiceEngine;

  private voiceCount = 4;

  constructor(engine: AudioEngine) {
    this.engine = engine;
  }

  addModule(module: Module) {
    this.modules.set(module.id, module);

    return module;
  }

  createModule(type: string, id?: string) {
    const moduleId = id ?? `${type}-${this.idCounter++}`;

    const module = createModule(type, moduleId, this.engine);

    this.addModule(module);

    if (type === "midi") {
      this.voiceEngine = new VoiceEngine(this, module as MidiInputModule);

      this.voiceEngine.rebuildFromPatch(this.voiceCount);
    }

    return module;
  }

  removeModule(id: string) {
    const module = this.modules.get(id);

    if (!module) {
      return;
    }

    const related = this.connections.filter(
      (connection) =>
        connection.sourceModuleId === id ||
        connection.destinationModuleId === id,
    );

    for (const connection of related) {
      this.disconnect(connection);
    }

    module.dispose();

    this.modules.delete(id);
  }

  getModule(id: string) {
    return this.modules.get(id);
  }

  connect(
    sourceModuleId: string,
    sourcePortId: string,
    targetModuleId: string,
    targetPortId: string,
  ) {
    const sourceModule = this.modules.get(sourceModuleId);

    if (!sourceModule) {
      throw new Error(`Missing source module ${sourceModuleId}`);
    }

    const targetModule = this.modules.get(targetModuleId);

    if (!targetModule) {
      throw new Error(`Missing target module ${targetModuleId}`);
    }

    const sourcePort = sourceModule.getPort(sourcePortId);

    if (!sourcePort) {
      throw new Error(`Missing source port ${sourcePortId}`);
    }

    const targetPort = targetModule.getPort(targetPortId);

    if (!targetPort) {
      throw new Error(`Missing target port ${targetPortId}`);
    }

    const connection = new Connection(
      sourcePort,
      targetPort,
      sourceModuleId,
      targetModuleId,
    );

    connection.connect();

    if (
      sourceModule.type !== "midi" &&
      sourcePort.type === "gate" &&
      targetPort.type === "gate"
    ) {
      const sourceGate = sourceModule as Module & {
        subscribe?: (callback: (value: boolean) => void) => () => void;
      };

      const targetGate = targetModule as Module & {
        setGateState?: (value: boolean) => void;
      };

      if (sourceGate.subscribe && targetGate.setGateState) {
        sourceGate.subscribe((value) => targetGate.setGateState?.(value));
      }
    }

    this.connections.push(connection);

    return connection;
  }

  getConnections(): Connection[] {
    return [...this.connections];
  }

  getModules(): Module[] {
    return [...this.modules.values()];
  }

  disconnect(connection: Connection) {
    connection.disconnect();

    this.connections = this.connections.filter((item) => item !== connection);
  }

  setVoiceMode(mode: VoiceMode) {
    console.log("PATCH MODE:", mode);

    this.voiceCount = mode === "poly" ? 4 : 1;

    this.voiceEngine?.setMode(mode);
  }
}
