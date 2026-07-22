import { Patch } from "./Patch";
import { MidiInputModule } from "../modules/MidiInput";
import { VoiceAllocator, type VoiceMode } from "./VoiceAllocator";

type PortHandlers = {
  pitchHandler?: (value: number) => void;
  gateHandler?: (value: boolean) => void;
  velocityHandler?: (value: number) => void;
};

type ClonedVoice = PortHandlers & { moduleIds: string[] };

export class VoiceEngine {
  private patch: Patch;
  private midi: MidiInputModule;
  private allocator: VoiceAllocator = new VoiceAllocator(1);

  private templateModuleIds: string[] = [];
  private templateInputs: {
    targetModuleId: string;
    targetPortId: string;
    kind: "pitch" | "gate" | "velocity";
  }[] = [];
  private templateOutputs: {
    sourceModuleId: string;
    sourcePortId: string;
    targetModuleId: string;
    targetPortId: string;
  }[] = [];

  private voices: ClonedVoice[] = [];
  private cloneCounter = 0;

  constructor(patch: Patch, midi: MidiInputModule) {
    this.patch = patch;
    this.midi = midi;

    this.midi.noteEvents.subscribe((event) => this.handleNoteEvent(event));
  }

  setMode(mode: VoiceMode) {
    this.allocator.setMode(mode);
  }

  rebuildFromPatch(voiceCount: number) {
    this.detectTemplate();
    this.setVoiceCount(voiceCount);
  }

  setVoiceCount(count: number) {
    this.teardownClones();
    this.allocator = new VoiceAllocator(count);

    this.voices = [this.bindVoice(this.templateModuleIds, true)];

    for (let i = 1; i < count; i++) {
      this.voices.push(this.cloneTemplate());
    }
  }

  private handleNoteEvent(event: {
    note: number;
    frequency: number;
    velocity: number;
    on: boolean;
  }) {
    if (event.on) {
      const { voice } = this.allocator.noteOn(event.note);
      const target = this.voices[voice];
      target?.pitchHandler?.(event.frequency);
      target?.velocityHandler?.(event.velocity);
      target?.gateHandler?.(true);
      return;
    }

    const voice = this.allocator.noteOff(event.note);
    if (voice === undefined) return;
    this.voices[voice]?.gateHandler?.(false);
  }

  private detectTemplate() {
    const connections = this.patch.getConnections();
    const visited = new Set<string>();
    const queue: string[] = [];

    this.templateInputs = [];
    this.templateOutputs = [];

    for (const conn of connections) {
      if (conn.sourceModuleId !== this.midi.id) continue;

      const kind =
        conn.source.id === "pitch_out"
          ? "pitch"
          : conn.source.id === "gate_out"
            ? "gate"
            : conn.source.id === "velocity_out"
              ? "velocity"
              : undefined;

      if (!kind) continue;

      this.templateInputs.push({
        targetModuleId: conn.destinationModuleId,
        targetPortId: conn.destination.id,
        kind,
      });

      if (!visited.has(conn.destinationModuleId)) {
        visited.add(conn.destinationModuleId);
        queue.push(conn.destinationModuleId);
      }
    }

    while (queue.length > 0) {
      const moduleId = queue.shift()!;
      const module = this.patch.getModule(moduleId);
      if (!module || module.type === "output") continue;

      for (const conn of connections) {
        if (conn.sourceModuleId !== moduleId) continue;

        const targetModule = this.patch.getModule(conn.destinationModuleId);
        if (!targetModule) continue;

        if (targetModule.type === "output") {
          this.templateOutputs.push({
            sourceModuleId: conn.sourceModuleId,
            sourcePortId: conn.source.id,
            targetModuleId: conn.destinationModuleId,
            targetPortId: conn.destination.id,
          });
          continue;
        }

        if (!visited.has(conn.destinationModuleId)) {
          visited.add(conn.destinationModuleId);
          queue.push(conn.destinationModuleId);
        }
      }
    }

    this.templateModuleIds = [...visited];

    for (const conn of connections) {
      if (
        conn.sourceModuleId === this.midi.id &&
        this.templateModuleIds.includes(conn.destinationModuleId)
      ) {
        this.patch.disconnect(conn);
      }
    }
  }

  private bindVoice(moduleIds: string[], isOriginal: boolean): ClonedVoice {
    const handlers: PortHandlers = {};

    for (const input of this.templateInputs) {
      const moduleId = isOriginal
        ? input.targetModuleId
        : this.mapId(input.targetModuleId, moduleIds);

      const module = this.patch.getModule(moduleId);
      const port = module?.getPort(input.targetPortId);
      if (!port) continue;

      if (input.kind === "pitch" || input.kind === "velocity") {
        const handler = port.controlHandler;
        if (input.kind === "pitch") handlers.pitchHandler = handler;
        else handlers.velocityHandler = handler;
      } else {
        handlers.gateHandler = port.gateHandler;
      }
    }

    return { ...handlers, moduleIds };
  }

  private cloneTemplate(): ClonedVoice {
    const idMap = new Map<string, string>();

    for (const originalId of this.templateModuleIds) {
      const original = this.patch.getModule(originalId);
      if (!original) continue;

      const cloneId = `${originalId}-voice-${this.cloneCounter++}`;
      this.patch.createModule(original.type, cloneId);
      idMap.set(originalId, cloneId);
    }

    for (const conn of this.patch.getConnections()) {
      if (
        idMap.has(conn.sourceModuleId) &&
        idMap.has(conn.destinationModuleId) &&
        this.templateModuleIds.includes(conn.sourceModuleId)
      ) {
        this.patch.connect(
          idMap.get(conn.sourceModuleId)!,
          conn.source.id,
          idMap.get(conn.destinationModuleId)!,
          conn.destination.id,
        );
      }
    }

    for (const output of this.templateOutputs) {
      this.patch.connect(
        idMap.get(output.sourceModuleId)!,
        output.sourcePortId,
        output.targetModuleId,
        output.targetPortId,
      );
    }

    const cloneIds = [...idMap.values()];
    return this.bindVoice(cloneIds, false);
  }

  private teardownClones() {
    for (const voice of this.voices.slice(1)) {
      for (const moduleId of voice.moduleIds) {
        this.patch.removeModule(moduleId);
      }
    }
    this.voices = [];
  }

  private mapId(originalId: string, cloneIds: string[]): string {
    const index = this.templateModuleIds.indexOf(originalId);
    return cloneIds[index];
  }
}
