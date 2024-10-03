import type { PlasmoMessaging } from '@plasmohq/messaging';
import { Storage } from '@plasmohq/storage';

const runStopAudioScript = async (tabId: number) => {
  const [{ result }] = await chrome.scripting.executeScript({
    injectImmediately: true,
    target: { tabId },
    func: async () => {
      try {
        const audioEl = document.getElementById('alarm-audio-element');
        (audioEl as HTMLAudioElement).pause();
        return { success: true };
      } catch (e) {
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
    const tabId = await storage.get<number>('audibleAlarmTabId');
    runStopAudioScript(tabId);
    await storage.remove('audibleAlarmTabId');
    res.send({ success: true });
  } catch (e) {
    res.send({
      success: false,
      error: e
    });
  }
};

export default handler;
