import cssText from 'data-text:~/contents/WidgetBar.css';
import type { PlasmoCSConfig } from 'plasmo';
import { useCallback, useEffect, useRef, useState } from 'react';

import { sendToBackground } from '@plasmohq/messaging';

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
  matches: ['<all_urls>']
};

const WidgetBar = () => {
  const [timeInMiliseconds, setTimeInMiliseconds] = useState<number>(0);
  const [isStanding, setIsStanding] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();
  const [updateCount, setUpdateCount] = useState<number>(0);

  const widgetBarRef = useRef<HTMLDivElement>();

  const formatTime = (miliseconds: number) => {
    const minutes = String(Math.floor(miliseconds / 60000)).padStart(2, '0');
    const secs = String(Math.floor((miliseconds % 60000) / 1000)).padStart(
      2,
      '0'
    );
    return `${minutes}:${secs}`;
  };

  // on tab active,
  useEffect(() => {
    console.log('Adding new listener');
    chrome.runtime.onMessage.addListener(
      (_message: any, _sender: any, _sendResponse: any) => {
        setUpdateCount((curr) => curr + 1);
      }
    );
  }, []);

  // on component mount, get timer in seconds and kickoff timer
  useEffect(() => {
    const setInitTimeInMilisseconds = async () => {
      const resp = await sendToBackground({
        name: 'widgetBarLoad',
        extensionId: 'ddamhcecacmmeokhkcmjfjgdhlfoiaje' // find this in chrome's extension manager
      });
      const { startTime } = resp;

      // calculate timer time in miliseconds
      const _timeInMiliseconds = Date.now() - startTime;
      setTimeInMiliseconds(_timeInMiliseconds);

      // kickoff timer
      clearTimeout(timeoutId);
      const initialTimeout = 1_000 - (_timeInMiliseconds % 1_000);
      console.log(
        'Wait partial second to start timer (ON MOUNT)',
        initialTimeout
      );
      setTimeoutId(setTimeout(incrementTimer, initialTimeout));
    };

    setInitTimeInMilisseconds();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [updateCount]);

  const incrementTimer = () => {
    console.log('Increment Time by 1 second');
    setTimeInMiliseconds((currTime) => currTime + 1_000);
    setTimeoutId(setTimeout(incrementTimer, 1_000));
  };

  const startTimer = async () => {
    setTimeInMiliseconds(0);

    // stores startTime in chrome storage so that all tabs can be in sync
    const resp = await sendToBackground({
      name: 'startTimer',
      body: {
        startTime: Date.now()
      },
      extensionId: 'ddamhcecacmmeokhkcmjfjgdhlfoiaje' // find this in chrome's extension manager
    });

    console.log(resp);
  };

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
      <div className="timer-container">{formatTime(timeInMiliseconds)}</div>
      <Button
        text={isStanding ? 'Standing' : 'Sitting'}
        textColor={'white'}
        backgroundColor={isStanding ? '#C1E1C1' : '#ffb9b9'}
        onClick={() => {
          setIsStanding((current) => !current);
          startTimer();
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
