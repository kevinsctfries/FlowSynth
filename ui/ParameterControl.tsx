import { useEffect, useState } from "react";

import { Parameter } from "../engine/Parameter";

import Knob from "./Knob";

import "./nodes/Node.css";

type ParameterControlProps<T> = {
  parameter: Parameter<T>;
};

export default function ParameterControl<T>({
  parameter,
}: ParameterControlProps<T>) {
  const [value, setValue] = useState(parameter.value);

  useEffect(() => {
    setValue(parameter.value);

    return parameter.onChange(setValue);
  }, [parameter]);

  if (parameter.type === "enum") {
    return (
      <div className="parameter-control">
        <label>{parameter.name}</label>

        <select
          className="nodrag"
          value={value as string}
          onChange={(event) =>
            parameter.setValue(event.target.value as unknown as T)
          }
          onPointerDown={(event) => event.stopPropagation()}
        >
          {parameter.options?.map((option) => (
            <option key={String(option)} value={option as string}>
              {String(option)}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="parameter-control">
      <label>{parameter.name}</label>

      <Knob
        value={value as number}
        min={parameter.min ?? 0}
        max={parameter.max ?? 1}
        step={parameter.step ?? 0.01}
        onChange={(next) => parameter.setValue(next as unknown as T)}
      />

      <div>{typeof value === "number" ? value.toFixed(2) : String(value)}</div>
    </div>
  );
}
