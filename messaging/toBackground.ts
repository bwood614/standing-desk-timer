import { sendToBackground } from '@plasmohq/messaging';

import type { GetWidgetStateMessage, SetWidgetStateMessage } from './types';

export const extensionId = 'ddamhcecacmmeokhkcmjfjgdhlfoiaje';

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

export const playGlobalAlarmAudio = async (alarmAudioSrc: string) => {
  try {
    const response = await sendToBackground({
      name: 'playAlarmAudio',
      body: alarmAudioSrc,
      extensionId
    });
    return response;
  } catch (e) {
    console.log('Error sending message to play alarm audio', e);
  }
};

export const stopGlobalAlarmAudio = async () => {
  try {
    const response = await sendToBackground({
      name: 'stopAlarmAudio',
      extensionId
    });
    return response;
  } catch (e) {
    console.log('Error sending message to stop alarm audio', e);
  }
};
