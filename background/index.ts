// state
let currentTab: chrome.tabs.TabActiveInfo;

// send message to active and inactive tab content scripts on tab switch
chrome.tabs.onActivated.addListener(
  async (activeInfo: chrome.tabs.TabActiveInfo) => {
    const prevTab = currentTab;
    currentTab = activeInfo;

    // if the previous tab and the new tab are in the same window on switch,
    // it means that the previous tab is hidden, a.k.a inactive
    const prevTabIsHidden = prevTab.windowId === currentTab.windowId;

    if (prevTabIsHidden) {
      try {
        await chrome.tabs.sendMessage(prevTab.tabId, 'tab_is_inactive');
      } catch (e) {
        console.log(
          'Inactive tab (',
          prevTab,
          ') connection could not be established',
          e
        );
      }
    }

    try {
      await chrome.tabs.sendMessage(currentTab.tabId, 'tab_is_active');
    } catch (e) {
      console.log(
        'Active tab (',
        currentTab,
        ') connection could not be established',
        e
      );
    }
  }
);

export {};
