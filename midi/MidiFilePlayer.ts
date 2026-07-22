// import { Midi } from "@tonejs/midi";
// import { Synth } from "../synth/Synth";

// type MidiEvent = {
//   time: number;
//   type: "on" | "off";
//   note: number;
//   velocity: number;
// };

// export class MidiFilePlayer {
//   private synth: Synth;

//   private events: MidiEvent[] = [];

//   private timers: number[] = [];

//   private duration = 0;

//   private position = 0;

//   private startTime = 0;

//   private playing = false;

//   private paused = false;

//   constructor(synth: Synth) {
//     this.synth = synth;
//   }

//   async load(file: File) {
//     const buffer = await file.arrayBuffer();

//     const midi = new Midi(buffer);

//     this.events = [];

//     this.duration = midi.duration;

//     for (const track of midi.tracks) {
//       for (const note of track.notes) {
//         this.events.push({
//           time: note.time,

//           type: "on",

//           note: note.midi,

//           velocity: note.velocity * 127,
//         });

//         this.events.push({
//           time: note.time + note.duration,

//           type: "off",

//           note: note.midi,

//           velocity: 0,
//         });
//       }
//     }

//     this.events.sort((a, b) => a.time - b.time);

//     this.position = 0;
//   }

//   play() {
//     if (this.playing) {
//       return;
//     }

//     this.playing = true;

//     this.paused = false;

//     this.startTime = performance.now() - this.position * 1000;

//     for (const event of this.events) {
//       if (event.time < this.position) {
//         continue;
//       }

//       const delay = (event.time - this.position) * 1000;

//       const timer = window.setTimeout(() => {
//         if (!this.playing) {
//           return;
//         }

//         if (event.type === "on") {
//           this.synth.noteOn(event.note, event.velocity);
//         } else {
//           this.synth.noteOff(event.note);
//         }
//       }, delay);

//       this.timers.push(timer);
//     }
//   }

//   pause() {
//     this.playing = false;

//     this.paused = true;

//     this.updatePosition();

//     this.clearTimers();
//   }

//   stop() {
//     this.playing = false;

//     this.paused = false;

//     this.position = 0;

//     this.clearTimers();
//   }

//   restart() {
//     this.stop();

//     this.play();
//   }

//   seek(seconds: number) {
//     this.stop();

//     this.position = seconds;

//     this.play();
//   }

//   getPosition() {
//     if (this.playing) {
//       return (performance.now() - this.startTime) / 1000;
//     }

//     return this.position;
//   }

//   getDuration() {
//     return this.duration;
//   }

//   private updatePosition() {
//     this.position = this.getPosition();
//   }

//   private clearTimers() {
//     for (const timer of this.timers) {
//       clearTimeout(timer);
//     }

//     this.timers = [];
//   }
// }
