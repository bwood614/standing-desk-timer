import cssText from 'data-text:~/contents/WidgetBar.css';
import type { PlasmoCSConfig } from 'plasmo';
import { useCallback, useEffect, useRef, useState } from 'react';

import { sendToBackground } from '@plasmohq/messaging';

import { Message } from '~utils/Messages';

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
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();
  const [isTabActive, setIsTabActive] = useState<boolean>(true);

  const widgetBarRef = useRef<HTMLDivElement>();

  const formatTime = (miliseconds: number) => {
    const minutes = String(Math.floor(miliseconds / 60000)).padStart(2, '0');
    const secs = String(Math.floor((miliseconds % 60000) / 1000)).padStart(
      2,
      '0'
    );
    return `${minutes}:${secs}`;
  };

  // this function will refresh the local timer by syncing it with the timer start time saved in chrome storage
  // this needs to happen on page reloads and tab switches to ensure an acurate timer value
  const refreshLocalTimer = useCallback(async () => {
    const resp = await sendToBackground({
      name: 'getGlobalStartTime',
      extensionId: 'ddamhcecacmmeokhkcmjfjgdhlfoiaje' // find this in chrome's extension manager
    });
    const { startTime } = resp;

    // calculate timer time in miliseconds
    const _timeInMiliseconds = Date.now() - startTime;
    setTimeInMiliseconds(_timeInMiliseconds);

    // clear previous interval
    clearInterval(intervalId);

    // initial timeout will be some fraction of a second
    const initialTimeout = 1000 - (_timeInMiliseconds % 1000);

    setTimeout(() => {
      setTimeInMiliseconds(Date.now() - startTime);
      startLocalTimerInterval();
    }, initialTimeout);
  }, [intervalId]);

  // on component mount, refresh the local timer (this handles initial page loads and reloads)
  useEffect(() => {
    refreshLocalTimer();
  }, []);

  // set up message listener to listen to messages from background script
  useEffect(() => {
    const handleMessage = (message: any, _sender: any, _sendResponse: any) => {
      if (message === Message.TAB_IS_ACTIVE && !isTabActive) {
        refreshLocalTimer();
        setIsTabActive(true);
      } else if (message === Message.TAB_IS_INACTIVE && isTabActive) {
        // clean up interval since timer will be refreshed when this tab is active again
        clearInterval(intervalId);
        setIsTabActive(false);
      }
    };
    // this adds a new message listener on mount, and when the refreshLocalTimer callback is updated
    chrome.runtime.onMessage.addListener(handleMessage);
    return () => {
      // clean up old listener when refreshLocalTimer callback is updated
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [refreshLocalTimer, isTabActive]);

  // adds 1000 miliseconds to the local timer state every 1000 miliseconds
  // this also sets the intervalId state so that the interval can be canceled when the tab is inactive
  const startLocalTimerInterval = () => {
    const _intervalId = setInterval(() => {
      setTimeInMiliseconds((currTime) => currTime + 1000);
    }, 1000);
    setIntervalId(_intervalId);
  };

  const resetGlobalTimer = async () => {
    // reset local timer to 0 as well
    setTimeInMiliseconds(0);

    // stores startTime in chrome storage so that all tabs can be in sync
    const resp = await sendToBackground({
      name: 'setGlobalStartTime',
      body: {
        startTime: Date.now()
      },
      extensionId: 'ddamhcecacmmeokhkcmjfjgdhlfoiaje' // find this in chrome's extension manager
    });
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
          resetGlobalTimer();
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
