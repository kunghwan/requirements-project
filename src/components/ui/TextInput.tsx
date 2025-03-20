import React, { Ref } from "react";

interface Props {
  id: string;
  value: string;
  onChange: (value: string) => void;
  ref: Ref<HTMLInputElement | HTMLSelectElement>;
  label: string;
  type?: React.HTMLInputTypeAttribute | undefined;
  placeholder?: string;
  isSelectTag?: boolean
  data?:string[]
}

const TextInput = ({id,label,onChange,ref,value,data,isSelectTag,placeholder,type}:Props) => {
  return <div>
    <label htmlFor=""></label>
    {isSelectTag ? 
    <select id={id} onChange={e => onChange(e.target.value) value={value}}  > 
     </select>: <input id={id} onChange={e => onChange(e.target.value) value={value}}  />}
  </div>;
};

export default TextInput;
