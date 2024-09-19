import React from 'react';

export default function SettingsPage() {
  const [incrementTime, setIncrementTime] = React.useState('1 hour');
  const [audioNotifications, setAudioNotifications] = React.useState(true);
  const [visualNotifications, setVisualNotifications] = React.useState(true);
  const [theme, setTheme] = React.useState('default');
  const [autoPopOut, setAutoPopOut] = React.useState(false);

  const settingsStyle = {
    paddingBottom: '20px',
    borderRadius: '5px',
    width: '300px'
  };

  const sectionStyle = {
    marginBottom: '20px',
    fontSize: '16px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    fontSize: '32px'
  };

  const selectStyle = {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ced4da',
    fontSize: '16px'
  };

  const toggleStyle = {
    marginRight: '10px'
  };

  const radioStyle = {
    marginRight: '10px'
  };

  return (
    <div style={settingsStyle}>
      <h1>Settings</h1>

      <div style={sectionStyle}>
        <label style={labelStyle}>Increment Time</label>
        <select
          style={selectStyle}
          value={incrementTime}
          onChange={(e) => setIncrementTime(e.target.value)}>
          <option value="30 minutes">30 minutes</option>
          <option value="1 hour">1 hour</option>
          <option value="2 hours">2 hours</option>
          <option value="4 hours">4 hours</option>
        </select>
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>Notifications</label>
        <div>
          <input
            type="checkbox"
            checked={audioNotifications}
            onChange={() => setAudioNotifications(!audioNotifications)}
            style={toggleStyle}
          />
          <span>Audio Notifications</span>
        </div>
        <div>
          <input
            type="checkbox"
            checked={visualNotifications}
            onChange={() => setVisualNotifications(!visualNotifications)}
            style={toggleStyle}
          />
          <span>Visual Notifications</span>
        </div>
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>Theme</label>
        <div>
          <input
            type="radio"
            name="theme"
            value="default"
            checked={theme === 'default'}
            onChange={() => setTheme('default')}
            style={radioStyle}
          />
          <span>Default</span>
        </div>
        <div>
          <input
            type="radio"
            name="theme"
            value="dark"
            checked={theme === 'dark'}
            onChange={() => setTheme('dark')}
            style={radioStyle}
          />
          <span>Dark</span>
        </div>
        <div>
          <input
            type="radio"
            name="theme"
            value="light"
            checked={theme === 'light'}
            onChange={() => setTheme('light')}
            style={radioStyle}
          />
          <span>Light</span>
        </div>
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>Auto Pop-out</label>
        <div>
          <input
            type="checkbox"
            checked={autoPopOut}
            onChange={() => setAutoPopOut(!autoPopOut)}
            style={toggleStyle}
          />
          <span>Enable Auto Pop-out</span>
        </div>
      </div>
    </div>
  );
}
