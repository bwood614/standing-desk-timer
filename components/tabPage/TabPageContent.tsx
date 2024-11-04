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
    default:
      content = <>{'Page not found'}</>;
  }
  return <div style={styles.container}>{content}</div>;
};

const buildStyle = (): Record<string, CSSProperties> => {
  return {
    container: {
      marginTop: 50,
      margin: '70px auto 0px auto',
      maxWidth: 950,
      minWidth: 300,
      padding: '0px 30px'
    }
  };
};

export default TabPageContent;
