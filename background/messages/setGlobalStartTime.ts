import type { PlasmoMessaging } from '@plasmohq/messaging';
import { Storage } from '@plasmohq/storage';

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  // set up access to local chrome storage
  const storage = new Storage({
    area: 'local'
  });

  const startTime = req.body.startTime;

  try {
    await storage.set('timerStartTime', startTime);
    res.send({ success: true });
  } catch (e) {
    res.send({
      success: false,
      error: e
    });
  }
};

export default handler;
