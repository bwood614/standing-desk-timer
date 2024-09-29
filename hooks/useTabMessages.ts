import { useEffect, useState } from 'react';

import type { TabMessage } from '~messaging/types';

interface useTabMessagesProps {
  onTabActive?: () => void;
  onTabInactive?: () => void;
  onGlobalStateChange?: () => void;
  dependecies: any[];
}
const useTabMessages = ({
  onTabActive,
  onTabInactive,
  onGlobalStateChange,
  dependecies
}: useTabMessagesProps) => {
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
        case 'widget_state_changed':
          if (isTabActive) {
            onGlobalStateChange?.();
          }
      }
    };
    // get a fresh messge listener on page load and when the refreshWidgetState callback is updated
    chrome.runtime.onMessage.addListener(handleMessage);
    return () => {
      // clean up old listener when refreshWidgetState callback is updated
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [...dependecies, isTabActive]);
};

export default useTabMessages;
