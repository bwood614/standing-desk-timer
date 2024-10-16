import { Storage } from '@plasmohq/storage';

import { sendTabMessage } from '../messaging/toContent';

const storage = new Storage({
  area: 'local'
});

// returns arrays of active tab updates
const getActiveTabUpdates = async () => {
  const prevActiveTabs: chrome.tabs.TabActiveInfo[] =
    (await storage.get('activeTabs')) ?? [];

  let newActiveTabs: chrome.tabs.TabActiveInfo[];
  try {
    newActiveTabs = (await chrome.tabs.query({ active: true })).map((tab) => ({
      tabId: tab.id,
      windowId: tab.windowId
    }));
  } catch (e) {
    console.log(`Could not query active tabs with error: ${e}`);
  }

  const becameInactive = prevActiveTabs.filter((pTab) => {
    if (!newActiveTabs.some((nTab) => nTab.tabId === pTab.tabId)) {
      return true;
    }
  });

  const becameActive = newActiveTabs.filter((nTab) => {
    if (!prevActiveTabs.some((pTab) => pTab.tabId === nTab.tabId)) {
      return true;
    }
  });

  await storage.set('activeTabs', newActiveTabs);
  return {
    becameInactive,
    becameActive
  };
};

const sendTabActiveStatusMessages = async () => {
  const activeTabUpdates = await getActiveTabUpdates();
  activeTabUpdates.becameActive.forEach(async (tab) => {
    sendTabMessage(tab.tabId, {
      id: 'tab_status_changed',
      payload: { isActive: true }
    });
  });

  activeTabUpdates.becameInactive.forEach(async (tab) => {
    sendTabMessage(tab.tabId, {
      id: 'tab_status_changed',
      payload: { isActive: false }
    });
  });
};

// send message to active and inactive tab content scripts on tab switch
chrome.tabs.onActivated.addListener(async (_activeInfo) => {
  await sendTabActiveStatusMessages();
});

chrome.tabs.onDetached.addListener(async (_tabId, _detachInfo) => {
  await sendTabActiveStatusMessages();
});

chrome.tabs.onAttached.addListener(async (_tabId, _attachInfo) => {
  await sendTabActiveStatusMessages();
});

// let active tabs know that the timer was updated so they can sync
chrome.storage.onChanged.addListener(async (changes) => {
  if (changes['timerStartTime']) {
    const activeTabs = await chrome.tabs.query({ active: true });
    activeTabs.forEach((tab) => {
      sendTabMessage(tab.id, { id: 'global_timer_update' });
    });
  }
});

export {};
