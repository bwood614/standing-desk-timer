import type { PlasmoMessaging } from '@plasmohq/messaging';
import { Storage } from '@plasmohq/storage';

import type { SetWidgetStateMessage } from '../../messaging/types';

const handler: PlasmoMessaging.MessageHandler<SetWidgetStateMessage> = async (
  req,
  res
) => {
  // set up access to local chrome storage
  const storage = new Storage({
    area: 'local'
  });

  const { key, value } = req.body;

  try {
    await storage.set(key, value);

    res.send({ success: true });
  } catch (e) {
    res.send({
      success: false,
      error: e
    });
  }
};

export default handler;
