import { set } from 'lodash';
import { useState, type CSSProperties } from 'react';

import AnalyticsIcon from '~components/shared/icons/AnalyticsIcon';
import ProfileIcon from '~components/shared/icons/ProfileIcon';
import SettingsIcon from '~components/shared/icons/SettingsIconOutline';

import TabPageContent from './TabPageContent';
import TabPageSideBar, { type SidebarGroup } from './TabPageSideBar';

export type Page = 'settings-timer' | 'settings-sound';

const SettingsContainer = () => {
  const styles = buildStyle();
  const [currentPage, setCurrentPage] = useState<Page | null>('settings-timer');

  const sidebarGroups: SidebarGroup[] = [
    {
      header: {
        text: 'Analytics',
        icon: <AnalyticsIcon height={24} color={'#7e7e7e'} />
      },
      items: [
        {
          text: "Today's Summary",
          onClick: () => {
            setCurrentPage(null);
          }
        },
        {
          text: 'This Month',
          onClick: () => {
            setCurrentPage(null);
          }
        },
        {
          text: 'This Year',
          onClick: () => {
            setCurrentPage(null);
          }
        }
      ]
    },
    {
      header: {
        text: 'Settings',
        icon: <SettingsIcon height={24} color={'#7e7e7e'} />
      },
      items: [
        {
          text: 'Timer',
          onClick: () => {
            setCurrentPage('settings-timer');
          }
        },
        {
          text: 'Appearance',
          onClick: () => {
            setCurrentPage(null);
          }
        },
        {
          text: 'Sound',
          onClick: () => {
            setCurrentPage('settings-sound');
          }
        }
      ]
    },
    {
      header: {
        text: 'Account',
        icon: <ProfileIcon height={24} color={'#7e7e7e'} />
      },
      items: [
        {
          text: 'Profile',
          onClick: () => {
            setCurrentPage(null);
          }
        },
        {
          text: 'Friends',
          onClick: () => {
            setCurrentPage(null);
          }
        },
        {
          text: 'Data',
          onClick: () => {
            setCurrentPage(null);
          }
        }
      ]
    }
  ];

  return (
    <div style={styles.settingsContainer}>
      <div style={styles.sideBarContainer}>
        <TabPageSideBar sidebarGroups={sidebarGroups} />
      </div>
      <div style={styles.contentContainer}>
        <TabPageContent pageName={currentPage} />
      </div>
    </div>
  );
};

const buildStyle = (): Record<string, CSSProperties> => {
  return {
    settingsContainer: {
      display: 'flex',
      flexDirection: 'row',
      height: '100vh'
    },
    sideBarContainer: {
      flex: '0 0 270px',
      height: '100%',
      backgroundColor: '#f3f4f6',
      padding: 25,
      boxSizing: 'border-box'
    },
    contentContainer: {
      flex: '1 1 auto',
      height: '100%',
      backgroundColor: '#ffffff'
    }
  };
};

export default SettingsContainer;
