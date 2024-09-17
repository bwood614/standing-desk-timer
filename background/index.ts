import { Message } from '../utils/Messages';

// state
let activeTabs: chrome.tabs.TabActiveInfo[] = [];

// returns old active tab if one exists, otherwise null
const getActiveTabUpdates = async () => {
  const prevActiveTabs = [...activeTabs];
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

  activeTabs = newActiveTabs;
  return {
    becameInactive,
    becameActive
  };
};

const sendTabActiveStatusMessages = async () => {
  const activeTabUpdates = await getActiveTabUpdates();
  activeTabUpdates.becameActive.forEach(async (tab) => {
    try {
      await chrome.tabs.sendMessage(tab.tabId, Message.TAB_IS_ACTIVE);
      console.log(
        `Successfully sent message: ${Message.TAB_IS_ACTIVE} to tab: ${tab.tabId}`
      );
    } catch (e) {
      console.log(
        `Could not connect to tab: ${tab.tabId}; intended message: ${Message.TAB_IS_ACTIVE}`
      );
    }
  });

  activeTabUpdates.becameInactive.forEach(async (tab) => {
    try {
      await chrome.tabs.sendMessage(tab.tabId, Message.TAB_IS_INACTIVE);
      console.log(
        `Successfully sent message: ${Message.TAB_IS_INACTIVE} to tab: ${tab.tabId}`
      );
    } catch (e) {
      console.log(
        `Could not connect to tab: ${tab.tabId}; intended message: ${Message.TAB_IS_INACTIVE}`
      );
    }
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

export {};
