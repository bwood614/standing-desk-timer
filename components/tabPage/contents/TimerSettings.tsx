import Button from '~components/shared/Button';
import NumberPicker from '~components/tabPage/settingsForm/NumberPicker';
import { useAppConfig } from '~hooks/useAppConfig';

import SettingsForm from '../settingsForm/SettingsForm';
import SettingsItem from '../settingsForm/SettingsItem';
import SettingsSection from '../settingsForm/SettingsSection';
import ToggleSwitch from '../settingsForm/ToggleSwitch';

const TimerSettings = () => {
  const { appConfig, updateAppConfig, resetDefaultAppConfig } = useAppConfig();

  return (
    appConfig && (
      <>
        <SettingsForm
          formHeader={'Timer'}
          formDescription={'Manage settings for the timer.'}>
          <SettingsSection
            header="Time Limits"
            description="The length of time you want to spend standing and sitting per cycle">
            <SettingsItem label="Sitting time limit">
              <NumberPicker
                initialValue={appConfig?.sittingTimeLimit / 1000 / 60}
                onChange={(newValue) => {
                  // TODO: debounce this to avoid over calling storage api
                  updateAppConfig({ sittingTimeLimit: newValue * 1000 * 60 });
                }}
              />
            </SettingsItem>
            <SettingsItem label="Standing time limit">
              <NumberPicker
                initialValue={appConfig?.standingTimeLimit / 1000 / 60}
                onChange={(newValue) => {
                  // TODO: debounce this to avoid over calling storage api
                  updateAppConfig({ standingTimeLimit: newValue * 1000 * 60 });
                }}
              />
            </SettingsItem>
            <SettingsItem label="Test Switch">
              <ToggleSwitch handleToggle={() => {}} />
            </SettingsItem>
          </SettingsSection>
          <SettingsSection
            header="Daily Schedule"
            description="This determines what time the timer automatically starts in the morning ends for the day">
            <>{'morning time\nevening time\ndefault reset state'}</>
          </SettingsSection>
          <SettingsSection
            header="Snooze"
            description="Allow snoozing when the alarm sounds. Snoozing lets you stay in your current mode">
            <>
              {'on/off\nnumber of seconds\nautosnooze-on/off; after x seconds'}
            </>
          </SettingsSection>
        </SettingsForm>
        <Button text="Reset Defaults" onClick={resetDefaultAppConfig} />
      </>
    )
  );
};

export default TimerSettings;
