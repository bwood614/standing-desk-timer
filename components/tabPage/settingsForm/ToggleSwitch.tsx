import React, { useState, type CSSProperties } from 'react';

interface ToggleSwitchProps {
  handleToggle?: (isOn: boolean) => void;
}

const ToggleSwitch = ({ handleToggle }: ToggleSwitchProps) => {
  const [isOn, setIsOn] = useState<boolean>(false);
  const styles = buildStyle();
  return (
    <div style={styles.toggleSwitchStyles}>
      <input
        type="checkbox"
        checked={isOn}
        onChange={() => {
          handleToggle(!isOn);
          setIsOn((prev) => !prev);
        }}
        style={styles.checkboxStyles}
        id="toggle-switch"
      />
      <label
        style={{
          ...styles.labelStyles
        }}
        htmlFor="toggle-switch">
        <span
          style={{
            ...styles.switchStyles,
            left: isOn ? '26px' : '3px'
          }}
        />
      </label>
    </div>
  );
};

const buildStyle = (): Record<string, CSSProperties> => {
  return {
    toggleSwitchStyles: {
      position: 'relative',
      width: '50px',
      display: 'inline-block'
    },
    checkboxStyles: {
      display: 'none'
    },
    labelStyles: {
      display: 'block',
      width: '100%',
      height: '24px',
      backgroundColor: '#ccc',
      borderRadius: '50px',
      cursor: 'pointer',
      position: 'relative'
    },
    switchStyles: {
      display: 'block',
      width: '18px',
      height: '18px',
      background: 'white',
      borderRadius: '50%',
      position: 'absolute',
      top: '3px',
      left: '3px',
      boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.2)',
      transition: 'left 0.3s ease'
    }
  };
};

export default ToggleSwitch;
