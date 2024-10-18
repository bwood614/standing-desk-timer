import { useEffect, useState } from 'react';

import type { TabMessage } from '~messaging/types';

interface useTabMessagesProps {
  onTabActive?: () => void;
  onTabInactive?: () => void;
  onGlobalTimerUpdate?: (isTabActive: boolean, timerStartTime: number) => void;
}
const useTabMessages = (
  { onTabActive, onTabInactive, onGlobalTimerUpdate }: useTabMessagesProps,
  dependecyArray: any[]
) => {
  const [isTabActive, setIsTabActive] = useState<boolean>(true);
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
            onTabActive?.();
          }
          // tab bacame inactive
          else if (!message.payload.isActive && isTabActive) {
            setIsTabActive(false);
            onTabInactive?.();
          }
          break;
        case 'global_timer_update':
          onGlobalTimerUpdate?.(isTabActive, message.payload.timerStartTime);
      }
    };
    // get a fresh messge listener on page load and when the refreshWidgetState callback is updated
    chrome.runtime.onMessage.addListener(handleMessage);
    return () => {
      // clean up old listener when refreshWidgetState callback is updated
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [...dependecyArray, isTabActive]);

  return { isTabActive };
};

export default useTabMessages;
