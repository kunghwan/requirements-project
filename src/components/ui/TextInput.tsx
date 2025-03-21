import React, { Ref } from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  id: string;
  value: string;
  onChange: (value: string) => void;
  ref: Ref<HTMLInputElement | HTMLSelectElement>;
  label: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  isSelectTag?: boolean;
  data?: string[];
}

const TextInput = ({
  id,
  label,
  onChange,
  isSelectTag,
  ref,
  value,
  data,
  placeholder,
  type,
}: Props) => {
  const i = "ti-input";
  return (
    <div className="ti-div">
      <label htmlFor={id} className="ti-label">
        {label}
      </label>
      {isSelectTag ? (
        <select
          id={id}
          onChange={(e) => onChange(e.target.value)}
          value={value}
          ref={ref as Ref<HTMLSelectElement>}
          className={i}
        >
          <option value="">{placeholder ?? "선택"}</option>
          {data?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          className={twMerge(i, "px-1.5")}
          id={id}
          onChange={(e) => onChange(e.target.value)}
          value={value}
          placeholder={placeholder}
          ref={ref as Ref<HTMLInputElement>}
          type={type ?? "text"}
        />
      )}
    </div>
  );
};

export default TextInput;
