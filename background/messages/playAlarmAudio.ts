import type { PlasmoMessaging } from '@plasmohq/messaging';
import { Storage } from '@plasmohq/storage';

const runPlayAudioScript = async (tabId: number) => {
  const [{ result }] = await chrome.scripting.executeScript({
    injectImmediately: true,
    target: { tabId },
    func: async () => {
      try {
        let audioEl = document.getElementById(
          'alarm-audio-element'
        ) as HTMLAudioElement;

        await audioEl.play();

        return { success: true };
      } catch (e) {
        console.log('test', e);
        return { success: false };
      }
    }
  });
  return result;
};

const handler: PlasmoMessaging.MessageHandler = async (_req, res) => {
  // set up access to local chrome storage
  const storage = new Storage({
    area: 'local'
  });

  try {
    // attempt to play the audio in each unmuted tab until one succeeds
    // an attempt will fail if page on the tab has not been interacted with by the user
    const unmutedTabs = (await chrome.tabs.query({ muted: false })).sort(
      (a, b) => a.id - b.id
    );

    for (let i = 0; i <= unmutedTabs.length; i++) {
      const result = await runPlayAudioScript(unmutedTabs[i].id);
      if (result.success) {
        // if audio successfully played, store that tab id to be able to stop it later
        await storage.set('audibleAlarmTabId', unmutedTabs[i].id);
        return;
      }
    }

    // if we made it here, the audio could not be played anywhere :(
    res.send({ success: false });
  } catch (e) {
    res.send({
      success: false,
      error: e
    });
  }
};

export default handler;
