import cssText from 'data-text:~/contents/WidgetBar.css';
import type { PlasmoCSConfig } from 'plasmo';
import { useEffect, useRef } from 'react';
import alarmAudioSrc from 'url:../alarm.wav';

import { sendToBackground } from '@plasmohq/messaging';
import { Storage } from '@plasmohq/storage';
import { useStorage } from '@plasmohq/storage/hook';

import { useAppConfig } from '~hooks/useAppConfig';
import useLocalTimer from '~hooks/useLocalTimer';
import useTabMessages from '~hooks/useTabMessages';
import { formatTime } from '~utils/timerUtils';

import Button from '../components/shared/Button';
import ChevronLeft from '../components/shared/icons/ChevronLeft';
import ChevronRight from '../components/shared/icons/ChevronRight';
import SettingsIcon from '../components/shared/icons/SettingsIcon';
import {
  getGlobalWidgetState,
  playGlobalAlarmAudio,
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

const WidgetBar = () => {
  // state
  const [isStanding, setIsStanding] = useStorage<boolean>(
    {
      key: 'isStanding',
      instance: new Storage({ area: 'local' })
    },
    (current) => current ?? false
  );
  const [isExpanded, setIsExpanded] = useStorage<boolean>(
    {
      key: 'isExpanded',
      instance: new Storage({ area: 'local' })
    },
    (current) => current ?? true
  );

  const [timerStartTime, setTimerStartTime] = useStorage<number>(
    {
      key: 'timerStartTime',
      instance: new Storage({ area: 'local' })
    },
    (current) => current
  );

  const { appConfig } = useAppConfig();

  // refs
  const widgetBarRef = useRef<HTMLDivElement>();

  // derived state
  !!widgetBarRef.current &&
    (widgetBarRef.current.style.right = isExpanded ? '0px' : '-252px');

  // hook to use local timer logic
  const {
    isTimeLimitSurpassed,
    timeInMiliseconds,
    syncLocalTimer,
    cleanupTimer
  } = useLocalTimer({
    timeLimit: isStanding
      ? appConfig?.standingTimeLimit
      : appConfig?.sittingTimeLimit,
    onTimeLimitReached: () => {
      getGlobalWidgetState('audibleAlarmTabId').then((tabId) => {
        if (!tabId) {
          playGlobalAlarmAudio(alarmAudioSrc);
        }
      });
    }
  });

  useTabMessages(
    {
      onTabActive: () => {
        widgetBarRef.current.style.transition = 'right 0.3s';
        syncLocalTimer(timerStartTime);
        // play the alarm if the time limit is surpassed AND it is not already sounding
        // this fixes the issue of a missed play audio trigger such as when the user is on a non-url tab
        // when the time limit is reached (extensions page, etc.)
        const isTimeLimitReached =
          (isStanding &&
            Date.now() - timerStartTime >= appConfig?.standingTimeLimit) ||
          (!isStanding &&
            Date.now() - timerStartTime >= appConfig?.sittingTimeLimit);

        if (isTimeLimitReached) {
          getGlobalWidgetState('audibleAlarmTabId').then((tabId) => {
            if (!tabId) {
              playGlobalAlarmAudio(alarmAudioSrc);
            }
          });
        }
      },
      onTabInactive: () => {
        // turn off widget bar animation styles
        widgetBarRef.current.style.transition = 'none';
        // clean up timer interval so it doesn't run in the background uneccessarily
        cleanupTimer();
      },
      onGlobalTimerUpdate: (isTabActive, newTimerStartTime) => {
        if (isTabActive) {
          console.log('sync timer start timer', Date.now() - timerStartTime);
          syncLocalTimer(newTimerStartTime);
        }
      }
    },
    [timerStartTime, isStanding]
  );

  // on component mount, syncronize local timer
  useEffect(() => {
    getGlobalWidgetState('timerStartTime').then((timerStartTime) => {
      syncLocalTimer(timerStartTime);
    });
  }, []);

  return (
    <div className="widget-bar" id={'widgetBar'} ref={widgetBarRef}>
      {isTimeLimitSurpassed && <div className="pulse"></div>}

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
          setIsExpanded((curr) => !curr);
        }}
      />
      <div className="timer-container">{formatTime(timeInMiliseconds)}</div>
      <Button
        text={isStanding ? 'Standing' : 'Sitting'}
        textColor={'white'}
        backgroundColor={isStanding ? '#C1E1C1' : '#ffb9b9'}
        onClick={() => {
          stopGlobalAlarmAudio();
          setIsStanding((curr) => !curr);
          setTimerStartTime(Date.now());
        }}
        width={120}
        customStyle={{ marginRight: 5 }}
        debounce={1000}
      />
      <Button
        icon={<SettingsIcon color="grey" height={24} />}
        isTransparent
        onClick={() => {
          sendToBackground({
            name: 'openNewTab',
            body: 'extension://ddamhcecacmmeokhkcmjfjgdhlfoiaje/tabs/SettingsPage.html',
            extensionId: 'ddamhcecacmmeokhkcmjfjgdhlfoiaje'
          });
        }}
        customStyle={{ marginRight: 6 }}
      />
    </div>
  );
};

export default WidgetBar;
