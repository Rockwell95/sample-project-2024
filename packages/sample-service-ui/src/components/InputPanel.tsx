export interface InputPanelProps {
  readonly value: number;
  onChange(value: number): void;
}

export const InputPanel = (props: InputPanelProps) => {
  const { value, onChange } = props;

  const handleChange = (valueStr: string) => {
    const floatValue = parseFloat(valueStr);
    if (!isNaN(floatValue)) {
      onChange(floatValue);
    }
  };

  return (
    <div className="content">
      <input
        className="input is-primary"
        type="number"
        placeholder="Primary input"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};
