import type { PlasmoMessaging } from '@plasmohq/messaging';

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const url = req.body;

  try {
    chrome.tabs.create({ url });
    res.send(true);
  } catch (e) {
    res.send({
      success: false,
      error: e
    });
  }
};

export default handler;
