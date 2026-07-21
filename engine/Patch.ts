import { AudioEngine } from "./AudioEngine";
import { Module } from "./Module";
import { Connection } from "./Connection";
import { createModule } from "../audio/ModuleFactory";

export class Patch {
  private engine: AudioEngine;

  private modules = new Map<string, Module>();

  private connections: Connection[] = [];

  private idCounter = 0;

  constructor(engine: AudioEngine) {
    this.engine = engine;
  }

  /** Registers an already-constructed module (e.g. one built directly by a Voice). */
  addModule(module: Module) {
    this.modules.set(module.id, module);

    return module;
  }

  /** Builds a module from a type string via the ModuleFactory and registers it. */
  createModule(type: string, id?: string) {
    const moduleId = id ?? `${type}-${this.idCounter++}`;

    const module = createModule(type, moduleId, this.engine);

    return this.addModule(module);
  }

  removeModule(id: string) {
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

    const connection = new Connection(sourcePort, targetPort);

    connection.connect();

    this.connections.push(connection);

    return connection;
  }

  disconnect(connection: Connection) {
    connection.disconnect();

    this.connections = this.connections.filter((item) => item !== connection);
  }
}
