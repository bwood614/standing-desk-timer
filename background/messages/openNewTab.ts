import type { PlasmoMessaging } from '@plasmohq/messaging';

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const url = req.body;

  try {
    console.log(url);
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
