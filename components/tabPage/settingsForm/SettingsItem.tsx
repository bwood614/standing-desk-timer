interface SettingsItemProps {
  children: JSX.Element; // Settings Interactive element (NumberPicker, ToggleSwitch, etc.)
  label?: string;
  // TODO: add tooltip with description of setting
}

const SettingsItem = ({ children, label }: SettingsItemProps) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <p>{label}</p>
      {children}
    </div>
  );
};

export default SettingsItem;
