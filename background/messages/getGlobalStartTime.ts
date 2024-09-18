import type { PlasmoMessaging } from '@plasmohq/messaging';
import { Storage } from '@plasmohq/storage';

const handler: PlasmoMessaging.MessageHandler = async (_req, res) => {
  // set up access to local chrome storage
  const storage = new Storage({
    area: 'local'
  });

  try {
    const startTime = await storage.get('timerStartTime');
    res.send({ success: true, startTime });
  } catch (e) {
    res.send({
      success: false,
      error: e
    });
  }
};

export default handler;
