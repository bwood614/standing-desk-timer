import type { PlasmoMessaging } from '@plasmohq/messaging';
import { Storage } from '@plasmohq/storage';

import type { GetWidgetStateMessage } from '../../messaging/types';

const handler: PlasmoMessaging.MessageHandler<GetWidgetStateMessage> = async (
  req,
  res
) => {
  // set up access to local chrome storage
  const storage = new Storage({
    area: 'local'
  });

  const key = req.body;

  try {
    const storageVariable = await storage.get(key);
    res.send(storageVariable);
  } catch (e) {
    res.send({
      success: false,
      error: e
    });
  }
};

export default handler;
