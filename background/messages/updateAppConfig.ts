import type { PlasmoMessaging } from '@plasmohq/messaging';
import { Storage } from '@plasmohq/storage';

import type { AppConfig } from '~utils/appConfig';

const handler: PlasmoMessaging.MessageHandler<AppConfig> = async (req, res) => {
  // set up access to local chrome storage
  const storage = new Storage({
    area: 'local'
  });

  // get current app config in order to patch with partial input configs
  const currentAppConfig = await storage.get<AppConfig>('appConfig');
  const newAppConfig = { ...currentAppConfig, ...req.body };

  try {
    console.log('background: updating app config', newAppConfig);

    await storage.set('appConfig', newAppConfig);

    res.send({ success: true });
  } catch (e) {
    res.send({
      success: false,
      error: e
    });
  }
};

export default handler;
