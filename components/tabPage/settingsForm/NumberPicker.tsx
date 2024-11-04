import React, { useState } from 'react';

export interface NumberPickerProps {
  min?: number;
  max?: number;
  step?: number;
  initialValue?: number;
  onChange?: (newValue: number) => void;
}

const NumberPicker = ({
  min = 0,
  max = 100,
  step = 1,
  initialValue = 0,
  onChange
}: NumberPickerProps) => {
  console.log('inital value', initialValue);
  const [value, setValue] = useState(initialValue);

  const handleIncrement = () => {
    setValue((prevValue) => {
      const newValue = Math.min(prevValue + step, max);
      onChange?.(newValue);
      return newValue;
    });
  };

  const handleDecrement = () => {
    setValue((prevValue) => {
      const newValue = Math.max(prevValue - step, min);
      onChange?.(newValue);
      return newValue;
    });
  };

  const handleChange = (e: any) => {
    const newValue = Number(e.target.value);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange?.(newValue);
      setValue(newValue);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <button onClick={handleDecrement} disabled={value <= min}>
        -
      </button>
      <input
        type="number"
        value={value}
        onChange={handleChange}
        style={{ width: '50px', textAlign: 'center' }}
      />
      <button onClick={handleIncrement} disabled={value >= max}>
        +
      </button>
    </div>
  );
};

export default NumberPicker;
