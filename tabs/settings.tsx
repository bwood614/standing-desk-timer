import { useState } from 'react';

import AnalyticsPage from '../components/AnalyticsPage';
import SettingsPage from '../components/SettingsPage';

function Settings() {
  const [activeTab, setActiveTab] = useState('settings');

  const sidebarStyle = {
    width: '200px',
    height: '100vh',
    backgroundColor: '#f8f9fa',
    padding: '10px',
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
  };

  const tabStyle = {
    padding: '10px',
    margin: '5px 0',
    cursor: 'pointer',
    borderRadius: '5px',
    transition: 'background-color 0.3s'
  };

  const activeTabStyle = {
    ...tabStyle,
    backgroundColor: '#007bff',
    color: 'white'
  };

  const contentStyle = {
    marginLeft: '220px',
    padding: '20px'
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={sidebarStyle}>
        <div
          style={activeTab === 'settings' ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('settings')}>
          Settings
        </div>
        <div
          style={activeTab === 'analytics' ? activeTabStyle : tabStyle}
          onClick={() => setActiveTab('analytics')}>
          Analytics
        </div>
      </div>
      <div style={contentStyle}>
        {activeTab === 'analytics' ? <AnalyticsPage /> : <SettingsPage />}
      </div>
    </div>
  );
}

export default Settings;
