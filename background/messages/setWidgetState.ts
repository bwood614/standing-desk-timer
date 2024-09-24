import type { PlasmoMessaging } from '@plasmohq/messaging';
import { Storage } from '@plasmohq/storage';

import { sendTabMessage } from '~messaging/toContent';

import type { SetWidgetStateMessage } from '../../messaging/types';

const handler: PlasmoMessaging.MessageHandler<SetWidgetStateMessage> = async (
  req,
  res
) => {
  // set up access to local chrome storage
  const storage = new Storage({
    area: 'local'
  });

  const { key, value, notifyActiveTabs } = req.body;

  try {
    await storage.set(key, value);

    if (notifyActiveTabs) {
      const activeTabs = (await chrome.tabs.query({ active: true }))
        .map((tab) => tab.id)
        .filter((tabId) => tabId !== req?.sender?.tab?.id);

      activeTabs.forEach((tabId) =>
        sendTabMessage(tabId, {
          id: 'widget_state_changed'
        })
      );
    }

    res.send({ success: true });
  } catch (e) {
    res.send({
      success: false,
      error: e
    });
  }
};

export default handler;
