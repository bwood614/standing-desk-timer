import type { TabMessage } from './types';

/*
 * Generic T is the resonse type of chrome.tabs.sendMessage
 */
export const sendTabMessage = <T = any>(tabId: number, message: TabMessage) => {
  try {
    const response = chrome.tabs.sendMessage<TabMessage, T>(tabId, message);
    console.log('From Helper', response);
    return response;
  } catch (e) {
    console.log('Error sending message to tab:' + tabId, e);
  }
};
