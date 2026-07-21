import { Synth } from "../synth/Synth";

function createSlider(
  label: string,
  min: number,
  max: number,
  value: number,
  callback: (value: number) => void,
) {
  const container = document.createElement("div");

  const labelElement = document.createElement("label");

  labelElement.textContent = `${label}: ${value}`;

  const slider = document.createElement("input");

  slider.type = "range";
  slider.min = String(min);
  slider.max = String(max);
  slider.step = "0.01";
  slider.value = String(value);

  slider.oninput = () => {
    const newValue = Number(slider.value);

    labelElement.textContent = `${label}: ${newValue.toFixed(2)}`;

    callback(newValue);
  };

  container.appendChild(labelElement);
  container.appendChild(slider);

  document.body.appendChild(container);
}

function createWaveSelector(synth: Synth) {
  const select = document.createElement("select");

  const waves: OscillatorType[] = ["sine", "square", "sawtooth", "triangle"];

  for (const wave of waves) {
    const option = document.createElement("option");

    option.value = wave;
    option.textContent = wave;

    select.appendChild(option);
  }

  select.onchange = () => {
    synth.setWaveform(select.value as OscillatorType);
  };

  document.body.appendChild(select);
}

function createVoiceModeSelector(synth: Synth) {
  const mono = document.createElement("input");

  mono.type = "radio";
  mono.name = "voice";
  mono.checked = false;

  const monoLabel = document.createElement("label");

  monoLabel.textContent = "Monophonic";

  monoLabel.prepend(mono);

  const poly = document.createElement("input");

  poly.type = "radio";
  poly.name = "voice";
  poly.checked = true;

  const polyLabel = document.createElement("label");

  polyLabel.textContent = "Polyphonic";

  polyLabel.prepend(poly);

  mono.onchange = () => {
    synth.setMode("mono");
  };

  poly.onchange = () => {
    synth.setMode("poly");
  };

  document.body.appendChild(monoLabel);

  document.body.appendChild(polyLabel);
}

export function createControls(synth: Synth) {
  createWaveSelector(synth);

  createVoiceModeSelector(synth);

  createSlider("Attack", 0, 2, 0.1, (value) => synth.setAttack(value));

  createSlider("Decay", 0, 2, 0.2, (value) => synth.setDecay(value));

  createSlider("Sustain", 0, 1, 0.7, (value) => synth.setSustain(value));

  createSlider("Release", 0, 3, 0.5, (value) => synth.setRelease(value));

  createSlider("Volume", 0, 1, 0.5, (value) => synth.setVolume(value));

  createSlider("Cutoff", 50, 10000, 1000, (value) => synth.setCutoff(value));

  createSlider("Resonance", 0, 20, 1, (value) => synth.setResonance(value));
}
