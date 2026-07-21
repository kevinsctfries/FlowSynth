import { Module } from "./Module";
import { Connection } from "./Connection";

export class Patch {
  private modules = new Map<string, Module>();

  private connections: Connection[] = [];

  addModule(module: Module) {
    this.modules.set(module.id, module);
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

    const targetModule = this.modules.get(targetModuleId);

    if (!sourceModule) {
      throw new Error(`Missing source module ${sourceModuleId}`);
    }

    if (!targetModule) {
      throw new Error(`Missing target module ${targetModuleId}`);
    }

    const sourcePort = sourceModule.getPort(sourcePortId);

    const targetPort = targetModule.getPort(targetPortId);

    if (!sourcePort) {
      throw new Error(`Missing source port ${sourcePortId}`);
    }

    if (!targetPort) {
      throw new Error(`Missing target port ${targetPortId}`);
    }

    const connection = new Connection(sourcePort, targetPort);

    connection.connect();

    this.connections.push(connection);
  }

  disconnect(connection: Connection) {
    connection.disconnect();

    this.connections = this.connections.filter((item) => item !== connection);
  }
}
