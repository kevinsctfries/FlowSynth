import { useEffect, useState } from "react";

type KnobProps = {
  value: number;

  min: number;

  max: number;

  step?: number;

  onChange: (value: number) => void;
};

export default function Knob({
  value,
  min,
  max,
  step = 0.01,
  onChange,
}: KnobProps) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const percent = (value - min) / (max - min);

    setRotation(-135 + percent * 270);
  }, [value, min, max]);

  function change(event: React.ChangeEvent<HTMLInputElement>) {
    onChange(Number(event.target.value));
  }

  return (
    <div
      className="nodrag"
      onPointerDown={(event) => event.stopPropagation()}
      onMouseDown={(event) => event.stopPropagation()}
    >
      <div
        style={{
          width: "55px",

          height: "55px",

          borderRadius: "50%",

          background: "#111",

          border: "3px solid #777",

          transform: `rotate(${rotation}deg)`,

          cursor: "pointer",

          position: "relative",
        }}
      >
        <div
          style={{
            width: "3px",

            height: "20px",

            background: "white",

            position: "absolute",

            top: "5px",

            left: "50%",

            transform: "translateX(-50%)",
          }}
        />
      </div>

      <input
        className="nodrag"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={change}
        onPointerDown={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
      />
    </div>
  );
}
