import { MidiFilePlayer } from "../audio/MidiFilePlayer";

export function createMidiControls(player: MidiFilePlayer) {
  const container = document.createElement("div");

  const file = document.createElement("input");

  file.type = "file";

  file.accept = ".mid,.midi";

  const play = document.createElement("button");

  play.textContent = "Play";

  const pause = document.createElement("button");

  pause.textContent = "Pause";

  const stop = document.createElement("button");

  stop.textContent = "Stop";

  const restart = document.createElement("button");

  restart.textContent = "Restart";

  const timeline = document.createElement("input");

  timeline.type = "range";

  timeline.min = "0";

  timeline.max = "1";

  timeline.step = "0.01";

  const time = document.createElement("span");

  file.onchange = async () => {
    const f = file.files?.[0];

    if (!f) return;

    await player.load(f);

    timeline.max = String(player.getDuration());
  };

  play.onclick = () => {
    player.play();
  };

  pause.onclick = () => {
    player.pause();
  };

  stop.onclick = () => {
    player.stop();

    timeline.value = "0";
  };

  restart.onclick = () => {
    player.restart();
  };

  timeline.oninput = () => {
    player.seek(Number(timeline.value));
  };

  setInterval(() => {
    const current = player.getPosition();

    timeline.value = String(current);

    time.textContent = `${current.toFixed(1)}s`;
  }, 100);

  container.appendChild(file);

  container.appendChild(play);

  container.appendChild(pause);

  container.appendChild(stop);

  container.appendChild(restart);

  container.appendChild(timeline);

  container.appendChild(time);

  document.body.appendChild(container);
}
