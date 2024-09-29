import cssText from 'data-text:~/contents/WidgetBar.css';
import type { PlasmoCSConfig } from 'plasmo';
import { useCallback, useEffect, useRef, useState } from 'react';
import alarmAudioSrc from 'url:../alarm.wav';

import type { TabMessage } from '~messaging/types';
import { formatTime } from '~utils/timerUtils';

import Button from '../components/shared/Button';
import ChevronLeft from '../components/shared/icons/ChevronLeft';
import ChevronRight from '../components/shared/icons/ChevronRight';
import SettingsIcon from '../components/shared/icons/SettingsIcon';
import {
  getGlobalWidgetState,
  playGlobalAlarmAudio,
  setGlobalWidgetState,
  stopGlobalAlarmAudio
} from '../messaging/toBackground';

export const getStyle = () => {
  const style = document.createElement('style');
  style.textContent = cssText;
  return style;
};

export const config: PlasmoCSConfig = {
  matches: ['<all_urls>']
};

const THRESHOLD = 30 * 1000;

const WidgetBar = () => {
  // state
  const [timeInMiliseconds, setTimeInMiliseconds] = useState<number>(0);
  const [isStanding, setIsStanding] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isTabActive, setIsTabActive] = useState<boolean>(true);

  // refs
  const intervalIds = useRef<NodeJS.Timeout[]>([]);
  const widgetBarRef = useRef<HTMLDivElement>();

  // derived state
  const isAlarmOn = timeInMiliseconds >= THRESHOLD;
  !!widgetBarRef.current &&
    (widgetBarRef.current.style.right = isExpanded ? '0px' : '-252px');

  // increments timer by 1 every second
  // triggers alarm audio if threshold is met
  // adds to the intervalId ref so that the interval can be canceled when the tab becomes inactive
  const startLocalTimerInterval = () => {
    const intervalId = setInterval(() => {
      setTimeInMiliseconds((currTime) => {
        const newTime = currTime + 1000;
        // start alarm if the time is greater than the threshold and an alarm is not already started by another tab
        if (newTime >= THRESHOLD) {
          getGlobalWidgetState('audibleAlarmTabId').then((tabId) => {
            if (!tabId) {
              playGlobalAlarmAudio(alarmAudioSrc);
            }
          });
        }
        return newTime;
      });
    }, 1000);
    intervalIds.current?.push(intervalId);
  };

  const refreshWidgetState = useCallback(async () => {
    const globalIsExpanded = await getGlobalWidgetState('isWidgetExpanded');
    const globalIsStanding = await getGlobalWidgetState('isStanding');
    const globalStartTime = await getGlobalWidgetState('timerStartTime');
    setIsExpanded(globalIsExpanded);
    setIsStanding(globalIsStanding);

    // clear previous intervals
    intervalIds.current?.forEach((interval) => {
      clearInterval(interval);
    });
    intervalIds.current = [];

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
      _sendResponse: (arg: any) => void
    ) => {
      switch (message.id) {
        case 'tab_status_changed':
          // tab bacame active
          if (message.payload.isActive && !isTabActive) {
            setIsTabActive(true);
            refreshWidgetState();
          }
          // tab bacame inactive
          else if (!message.payload.isActive && isTabActive) {
            setIsTabActive(false);
            // turn off widget bar animation styles
            widgetBarRef.current.style.transition = 'none';
            // clean up interval since timer will be refreshed when this tab is active again
            intervalIds.current.forEach((interval) => {
              clearInterval(interval);
            });
            intervalIds.current = [];
          }
          return false;
        case 'widget_state_changed':
          refreshWidgetState();
          return false;
      }
    };
    // get a fresh messge listener on page load and when the refreshWidgetState callback is updated
    chrome.runtime.onMessage.addListener(handleMessage);
    return () => {
      // clean up old listener when refreshWidgetState callback is updated
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [refreshWidgetState, isTabActive]);

  return (
    <div className="widget-bar" id={'widgetBar'} ref={widgetBarRef}>
      {isAlarmOn && <div className="pulse"></div>}

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
          // turn on widget bar animation styles
          widgetBarRef.current.style.transition = 'right 0.3s';

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
          stopGlobalAlarmAudio();
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
        onClick={() => {}}
        customStyle={{ marginRight: 6 }}
      />
    </div>
  );
};

export default WidgetBar;
