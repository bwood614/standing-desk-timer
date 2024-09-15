import cssText from 'data-text:~/contents/WidgetBar.css';
import type { PlasmoCSConfig } from 'plasmo';
import { useEffect, useState } from 'react';

import Button from '../components/shared/Button';
import ChairIcon from '../components/shared/icons/ChairIcon';
import SettingsIcon from '../components/shared/icons/SettingsIcon';

export const getStyle = () => {
  const style = document.createElement('style');
  style.textContent = cssText;
  return style;
};

export const config: PlasmoCSConfig = {
  matches: ['*://*/*']
};

const WidgetBar = () => {
  const [timeInSeconds, setTimeInSeconds] = useState<number>(0);
  const [isStanding, setIsStanding] = useState<boolean>(false);

  const formatTime = (seconds: number) => {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${minutes}:${secs}`;
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const incrementTimer = () => {
      setTimeInSeconds((currTime) => currTime + 1);
      timeoutId = setTimeout(incrementTimer, 1_000);
    };

    timeoutId = setTimeout(incrementTimer, 1_000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [timeInSeconds]);

  return (
    <div className="widget-bar">
      <div className="timer-container">{formatTime(timeInSeconds)}</div>
      <Button
        text={isStanding ? 'Standing' : 'Sitting'}
        contentColor={'white'}
        backgroundColor={isStanding ? '#C1E1C1' : '#ffb9b9'}
        onClick={() => {
          setIsStanding((current) => !current);
          setTimeInSeconds(0);
        }}
        width={120}
        customStyle={{ marginRight: 20 }}
      />
      <Button
        icon={SettingsIcon}
        isTransparent
        contentColor={'grey'}
        onClick={() => {
          console.log('Hello');
          alert('To settings page');
        }}
      />
    </div>
  );
};

export default WidgetBar;
