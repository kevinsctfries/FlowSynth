import { AudioEngine } from "./audio/AudioEngine";
import { Synth } from "./audio/Synth";
import { MidiManager } from "./audio/MidiManager";

import { createControls } from "./ui/Controls";
import { MidiFilePlayer } from "./audio/MidiFilePlayer";
import { createMidiControls } from "./ui/MidiControls";

const engine = new AudioEngine();

const synth = new Synth(engine);

createControls(synth);

const midiPlayer = new MidiFilePlayer(synth);

createMidiControls(midiPlayer);

const midi = new MidiManager();

await midi.connect(async (note, velocity, pressed) => {
  await engine.start();

  console.log({
    note,
    velocity,
    pressed,
  });

  if (pressed) {
    synth.noteOn(note, velocity);
  } else {
    synth.noteOff(note);
  }
});

console.log("MoogSim ready");
