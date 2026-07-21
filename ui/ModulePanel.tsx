type ModulePanelProps = {
  onAddModule: (type: string) => void;
};

export default function ModulePanel({ onAddModule }: ModulePanelProps) {
  return (
    <div
      style={{
        position: "absolute",

        top: 20,

        left: 20,

        zIndex: 10,

        background: "#222",

        color: "white",

        padding: "15px",

        borderRadius: "8px",

        display: "flex",

        flexDirection: "column",

        gap: "10px",
      }}
    >
      <h3>Modules</h3>

      <button onClick={() => onAddModule("oscillator")}>Oscillator</button>

      <button onClick={() => onAddModule("gain")}>Gain</button>

      <button onClick={() => onAddModule("output")}>Output</button>

      <button onClick={() => onAddModule("filter")}>Filter</button>
    </div>
  );
}
