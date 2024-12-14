import React, { useState, type CSSProperties } from 'react';

interface TimePickerProps {
  onChange?: (isOn: boolean) => void;
}

const TimePicker = ({ onChange }: TimePickerProps) => {
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
  const [amPm, setAmPm] = useState('AM');

  const styles = buildStyle();

  const handleHourChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setHour(event.target.value);
  };

  const handleMinuteChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setMinute(event.target.value);
  };

  const handleAmPmChange: React.ChangeEventHandler<HTMLSelectElement> = (
    event
  ) => {
    setAmPm(event.target.value);
  };

  return (
    <div style={styles.container}>
      <input
        value={hour}
        onChange={handleHourChange}
        onBlur={() => {
          const hourVal = parseInt(hour);
          if (!hourVal || hourVal <= 0 || hourVal > 12) {
            setHour('12');
          }
        }}
        style={styles.input}
      />
      <span>:</span>
      <input
        value={minute}
        onChange={handleMinuteChange}
        style={styles.input}
        onBlur={() => {
          const minVal = parseInt(minute);
          if ((minVal !== 0 && !minVal) || minVal < 0 || minVal > 59) {
            setMinute('00');
          } else {
            setMinute(String(minVal).padStart(2, '0'));
          }
        }}
      />
      <select value={amPm} onChange={handleAmPmChange} style={styles.select}>
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
};

const buildStyle = (): Record<string, CSSProperties> => {
  return {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#f9f9f9',
      gap: 5
    },
    input: {
      padding: '8px',
      fontSize: '16px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      outline: 'none',
      appearance: 'none',
      width: '40px',
      textAlign: 'center'
    },
    select: {
      padding: '8px',
      fontSize: '16px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      outline: 'none',
      appearance: 'none',
      width: '70px',
      textAlign: 'center'
    }
  };
};

export default TimePicker;
