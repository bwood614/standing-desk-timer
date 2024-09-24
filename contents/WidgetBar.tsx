import cssText from 'data-text:~/contents/WidgetBar.css';
import type { PlasmoCSConfig } from 'plasmo';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { TabMessage } from '~messaging/types';
import { formatTime } from '~utils/timerUtils';

import Button from '../components/shared/Button';
import ChevronLeft from '../components/shared/icons/ChevronLeft';
import ChevronRight from '../components/shared/icons/ChevronRight';
import SettingsIcon from '../components/shared/icons/SettingsIcon';
import {
  getGlobalWidgetState,
  setGlobalWidgetState
} from '../messaging/toBackground';

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
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [intervalIds, setIntervalIds] = useState<NodeJS.Timeout[]>([]);
  const [isTabActive, setIsTabActive] = useState<boolean>(true);
  const widgetBarRef = useRef<HTMLDivElement>();

  // increments timer by 1 every seconds
  // this also sets the intervalId state so that the interval can be canceled when the tab becomes inactive
  const startLocalTimerInterval = () => {
    const _intervalId = setInterval(() => {
      setTimeInMiliseconds((currTime) => currTime + 1000);
    }, 1000);
    setIntervalIds((current) => [...current, _intervalId]);
  };

  const refreshWidgetState = useCallback(async () => {
    const globalIsExpanded = await getGlobalWidgetState('isWidgetExpanded');
    const globalIsStanding = await getGlobalWidgetState('isStanding');
    const globalStartTime = await getGlobalWidgetState('timerStartTime');
    setIsExpanded(globalIsExpanded);
    setIsStanding(globalIsStanding);

    // refresh local timer
    // clear previous intervals
    intervalIds.forEach((interval) => {
      clearInterval(interval);
    });

    // set local timer immediately on refresh
    const _timeInMiliseconds = Date.now() - globalStartTime;
    setTimeInMiliseconds(_timeInMiliseconds);

    // initial timeout will be some fraction of a second
    const initialTimeout = 1000 - (_timeInMiliseconds % 1000);
    setTimeout(() => {
      // set local timer again after initial timeout
      setTimeInMiliseconds(Date.now() - globalStartTime);
      // start interval
      startLocalTimerInterval();
    }, initialTimeout);
  }, [intervalIds, setIsExpanded, setIsStanding]);

  // on component mount, refresh all local state (this handles initial page loads and reloads)
  useEffect(() => {
    refreshWidgetState();
  }, []);

  // set up message listener to listen to messages from background script
  useEffect(() => {
    const handleMessage = (
      message: TabMessage,
      _sender: any,
      _sendResponse: any
    ) => {
      switch (message.id) {
        case 'tab_status_changed':
          if (message.payload.isActive && !isTabActive) {
            setIsTabActive(true);
            refreshWidgetState();
          } else if (!message.payload.isActive && isTabActive) {
            setIsTabActive(false);
            // clean up interval since timer will be refreshed when this tab is active again
            intervalIds.forEach((interval) => {
              clearInterval(interval);
            });
          }
          break;
        case 'widget_state_changed':
          refreshWidgetState();
          break;
      }
    };
    // get a fresh messge listener on page load and when the refreshWidgetState callback is updated
    chrome.runtime.onMessage.addListener(handleMessage);
    return () => {
      // clean up old listener when refreshWidgetState callback is updated
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [refreshWidgetState, isTabActive]);

  // update widget position on isExpanded updating
  useEffect(() => {
    const widgetBarEl = widgetBarRef.current;
    if (isExpanded) {
      widgetBarEl.style.right = '0px';
    } else {
      widgetBarEl.style.right = '-252px';
    }
  }, [isExpanded]);

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
          setIsExpanded((current) => {
            setGlobalWidgetState({
              key: 'isWidgetExpanded',
              value: !current,
              notifyActiveTabs: true
            });
            return !current;
          });
        }}
      />
      <div className="timer-container">{formatTime(timeInMiliseconds)}</div>
      <Button
        text={isStanding ? 'Standing' : 'Sitting'}
        textColor={'white'}
        backgroundColor={isStanding ? '#C1E1C1' : '#ffb9b9'}
        onClick={() => {
          setIsStanding((current) => {
            setGlobalWidgetState({
              key: 'isStanding',
              value: !current,
              notifyActiveTabs: true
            });
            return !current;
          });
          setGlobalWidgetState({
            key: 'timerStartTime',
            value: Date.now()
          });
          refreshWidgetState();
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
