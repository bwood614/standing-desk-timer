import type { PlasmoMessaging } from '@plasmohq/messaging';
import { Storage } from '@plasmohq/storage';

import { defaultAppConfig } from '~utils/appConfig';

const handler: PlasmoMessaging.MessageHandler = async (_req, res) => {
  // set up access to local chrome storage
  const storage = new Storage({
    area: 'local'
  });

  try {
    await storage.set('appConfig', defaultAppConfig);

    res.send({ success: true });
  } catch (e) {
    res.send({
      success: false,
      error: e
    });
  }
};

export default handler;
