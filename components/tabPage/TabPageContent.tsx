import type { CSSProperties } from 'react';

import SoundSettings from './contents/SoundSettings';
import TimerSettings from './contents/TimerSettings';
import type { Page } from './TabPageContainer';

interface SettingsContentProps {
  pageName: Page;
}

const TabPageContent = ({ pageName }: SettingsContentProps) => {
  const styles = buildStyle();

  let content;
  switch (pageName) {
    case 'settings-timer':
      content = <TimerSettings />;
      break;
    case 'settings-sound':
      content = <SoundSettings />;
      break;
  }
  return <div style={styles.container}>{content}</div>;
};

const buildStyle = (): Record<string, CSSProperties> => {
  return {
    container: {
      padding: '70px 250px'
    }
  };
};

export default TabPageContent;
