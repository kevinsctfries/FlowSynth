import { Module } from "./Module";

export class Patch {
  private modules: Module[] = [];

  addModule(module: Module) {
    this.modules.push(module);
  }

  removeModule(module: Module) {
    this.modules = this.modules.filter((m) => m !== module);
  }

  getModules() {
    return this.modules;
  }

  connect(from: Module, to: Module) {
    if (from.output && to.input) {
      from.output.connect(to.input);
    }
  }
}
