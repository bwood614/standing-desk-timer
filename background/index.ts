import { Storage } from '@plasmohq/storage';

// send message to active tab content script on tab switch
chrome.tabs.onActivated.addListener(async (activeInfo: any) => {
  const response = await chrome.tabs.sendMessage(
    activeInfo.tabId,
    'tab_update'
  );
});

export {};
