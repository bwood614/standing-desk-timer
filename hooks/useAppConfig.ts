import { useEffect, useState } from 'react';

import { Storage } from '@plasmohq/storage';
import { useStorage } from '@plasmohq/storage/hook';

import { defaultAppConfig, type AppConfig } from '~utils/appConfig';

export const useAppConfig = () => {
  const [appConfig] = useStorage<AppConfig>({
    key: 'appConfig',
    instance: new Storage({ area: 'local' })
  });

  const updateAppConfig = async (appConfig: AppConfig) => {
    const storage = new Storage({
      area: 'local'
    });

    // get current app config in order to patch with partial input configs
    const currentAppConfig = await storage.get<AppConfig>('appConfig');
    const newAppConfig = { ...currentAppConfig, ...appConfig };

    try {
      await storage.set('appConfig', newAppConfig);

      return true;
    } catch (e) {
      return false;
    }
  };

  const resetDefaultAppConfig = async () => {
    // set up access to local chrome storage
    const storage = new Storage({
      area: 'local'
    });

    try {
      await storage.set('appConfig', defaultAppConfig);

      return true;
    } catch (e) {
      return false;
    }
  };

  return { appConfig, updateAppConfig, resetDefaultAppConfig };
};
