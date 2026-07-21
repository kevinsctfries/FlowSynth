export function midiToFrequency(note: number) {
  return 440 * Math.pow(2, (note - 69) / 12);
}
