import cssText from 'data-text:~/contents/WidgetBar.css';
import type { PlasmoCSConfig } from 'plasmo';
import { useCallback, useEffect, useRef, useState } from 'react';
import alarmAudioSrc from 'url:../alarm.wav';

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

const WidgetBar = () => {
  // state
  const [isStanding, setIsStanding] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // refs
  const widgetBarRef = useRef<HTMLDivElement>();

  // derived state
  !!widgetBarRef.current &&
    (widgetBarRef.current.style.right = isExpanded ? '0px' : '-252px');

  const {
    isTimeLimitSurpassed,
    timeInMiliseconds,
    refreshLocalTimer,
    cleanupTimer
  } = useLocalTimer({
    timeLimit: 30 * 1000,
    onTimeLimitReached: () => {
      getGlobalWidgetState('audibleAlarmTabId').then((tabId) => {
        if (!tabId) {
          playGlobalAlarmAudio(alarmAudioSrc);
        }
      });
    }
  });

  const refreshWidgetState = async () => {
    const globalIsExpanded = await getGlobalWidgetState('isWidgetExpanded');
    const globalIsStanding = await getGlobalWidgetState('isStanding');
    const globalStartTime = await getGlobalWidgetState('timerStartTime');
    setIsExpanded(globalIsExpanded);
    setIsStanding(globalIsStanding);
    refreshLocalTimer(globalStartTime);
  };

  useTabMessages({
    onTabActive: () => {
      refreshWidgetState();
    },
    onTabInactive: () => {
      // turn off widget bar animation styles
      widgetBarRef.current.style.transition = 'none';
      // clean up timer interval so it doesn't run in the background uneccessarily
      cleanupTimer();
    },
    onGlobalStateChange: () => {
      refreshWidgetState();
    },
    dependecies: []
  });

  // on component mount, refresh all local state (this handles initial page loads and reloads)
  useEffect(() => {
    refreshWidgetState();
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
