import SettingsForm, {
  type SettingsSection
} from '../settingsForm/SettingsForm';

const SoundSettings = () => {
  const sections: SettingsSection[] = [
    {
      title: 'Alarm Sound',
      description:
        'Set weather you want an audible alarm to sound in the browser when its time to switch between sitting and standing',
      element: <>{'on/off'}</>
    }
  ];

  return (
    <>
      <SettingsForm
        formHeader={'Sound'}
        formDescription={'Manage extention sound settings.'}
        sections={sections}
      />
    </>
  );
};

export default SoundSettings;
