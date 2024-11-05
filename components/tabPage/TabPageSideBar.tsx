import { useState, type CSSProperties } from 'react';

import SettingsIcon from '~components/shared/icons/SettingsIconOutline';

export interface SidebarGroup {
  header: {
    icon?: JSX.Element;
    text: string;
  };
  items: {
    text: string;
    onClick?: () => void;
  }[];
}

interface SettingsSideBarProps {
  sidebarGroups: SidebarGroup[];
}

const SettingsSideBar = ({ sidebarGroups }: SettingsSideBarProps) => {
  const styles = buildStyle();

  const [activeItem, setActiveItem] = useState<{
    group: number;
    item: number;
  }>({ group: 1, item: 0 });

  const isActiveItem = (group: number, item: number) => {
    return group === activeItem.group && item === activeItem.item;
  };

  return sidebarGroups.map((sidebarGroup, groupIdx) => (
    <div key={groupIdx} style={styles.settingsGroupContainer}>
      <div style={styles.settingsGroupHeader}>
        {sidebarGroup.header.icon}
        {sidebarGroup.header.text}
      </div>
      <div style={styles.settingsGroupItemsContainer}>
        {sidebarGroup.items.map((item, itemIdx) => (
          <div
            key={itemIdx}
            onClick={() => {
              setActiveItem({ group: groupIdx, item: itemIdx });
              item.onClick();
            }}
            style={
              isActiveItem(groupIdx, itemIdx)
                ? {
                    ...styles.settingsGroupItem,
                    ...styles.settingsGroupItemActive
                  }
                : styles.settingsGroupItem
            }>
            {item.text}
          </div>
        ))}
      </div>
    </div>
  ));
};

const buildStyle = (): Record<string, CSSProperties> => {
  const iconWidth = 24;
  const iconGap = 10;
  const itemPadding = 10;

  return {
    settingsGroupContainer: {
      display: 'flex',
      width: '100%',
      alignItems: 'flex-start',
      flexDirection: 'column',
      boxSizing: 'border-box'
    },
    settingsGroupHeader: {
      display: 'flex',
      gap: 10,
      paddingTop: itemPadding,
      paddingBottom: itemPadding,
      fontSize: '16px',
      cursor: 'default',
      color: '#7e7e7e',
      fontWeight: '600'
    },
    settingsGroupItemsContainer: {
      paddingLeft: iconWidth + iconGap - itemPadding,
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      boxSizing: 'border-box'
    },
    settingsGroupItem: {
      fontSize: '16px',
      cursor: 'pointer',
      paddingTop: itemPadding,
      paddingBottom: itemPadding,
      paddingLeft: itemPadding,
      fontWeight: '500'
    },
    settingsGroupItemActive: {
      backgroundColor: '#e5e7eb',
      borderRadius: 5
    }
  };
};

export default SettingsSideBar;
