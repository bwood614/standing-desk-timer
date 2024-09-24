import { sendToBackground } from '@plasmohq/messaging';

import type { GetWidgetStateMessage, SetWidgetStateMessage } from './types';

const extensionId = 'ddamhcecacmmeokhkcmjfjgdhlfoiaje';

export const setGlobalWidgetState = async ({
  key,
  value,
  notifyActiveTabs = false
}: SetWidgetStateMessage) => {
  try {
    await sendToBackground({
      name: 'setWidgetState',
      body: { key, value, notifyActiveTabs },
      extensionId
    });
  } catch (e) {
    console.log(
      'Error setting storage variable with key:',
      key,
      'and value:',
      value,
      e
    );
  }
};

export const getGlobalWidgetState = async (key: GetWidgetStateMessage) => {
  try {
    const response = await sendToBackground({
      name: 'getWidgetState',
      body: key,
      extensionId
    });
    return response;
  } catch (e) {
    console.log('Error getting storage variable with key:', key, e);
  }
};
