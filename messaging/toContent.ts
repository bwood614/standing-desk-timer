import type { TabMessage } from './types';

export const sendTabMessage = async (tabId: number, message: TabMessage) => {
  try {
    await chrome.tabs.sendMessage(tabId, message);
  } catch (e) {
    console.log('Error sending message to tab:' + tabId, e);
  }
};
