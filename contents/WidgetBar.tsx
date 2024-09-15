import cssText from 'data-text:~/contents/WidgetBar.css';
import type { PlasmoCSConfig } from 'plasmo';
import { useEffect, useRef, useState } from 'react';

import Button from '../components/shared/Button';
import ChevronLeft from '../components/shared/icons/ChevronLeft';
import ChevronRight from '../components/shared/icons/ChevronRight';
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
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const widgetBarRef = useRef<HTMLDivElement>();

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

  const toggleWidgetBar = () => {
    const widgetBarEl = widgetBarRef.current;
    if (isExpanded) {
      widgetBarEl.style.right = '-252px';
      setIsExpanded(false);
    } else {
      widgetBarEl.style.right = '0px';
      setIsExpanded(true);
    }
  };

  return (
    <div className="widget-bar" id={'widgetBar'} ref={widgetBarRef}>
      <Button
        icon={
          isExpanded ? (
            <ChevronRight color={'#c5c5c5'} height={18} />
          ) : (
            <ChevronLeft color={'#c5c5c5'} height={18} />
          )
        }
        isTransparent
        onClick={() => {
          toggleWidgetBar();
        }}
      />
      <div className="timer-container">{formatTime(timeInSeconds)}</div>
      <Button
        text={isStanding ? 'Standing' : 'Sitting'}
        textColor={'white'}
        backgroundColor={isStanding ? '#C1E1C1' : '#ffb9b9'}
        onClick={() => {
          setIsStanding((current) => !current);
          setTimeInSeconds(0);
        }}
        width={120}
        customStyle={{ marginRight: 5 }}
      />
      <Button
        icon={<SettingsIcon color="grey" height={24} />}
        isTransparent
        onClick={() => {
          console.log('Hello');
          alert('To settings page');
        }}
        customStyle={{ marginRight: 6 }}
      />
    </div>
  );
};

export default WidgetBar;
