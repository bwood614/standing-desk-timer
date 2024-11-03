import SettingsForm, {
  type SettingsSection
} from '../settingsForm/SettingsForm';

const TimerSettings = () => {
  const sections: SettingsSection[] = [
    {
      title: 'Time Limits',
      description:
        'The length of time you want to spend standing and sitting per cycle',
      element: <>{'time input'}</>
    },
    {
      title: 'Daily Schedule',
      description:
        'This determines what time the timer automatically starts in the morning ends for the day',
      element: <>{'morning time\nevening time\ndefault reset state'}</>
    },
    {
      title: 'Snooze',
      description:
        'Allow snoozing when the alarm sounds. Snoozing lets you stay in your current mode',
      element: (
        <>{'on/off\nnumber of seconds\nautosnooze-on/off; after x seconds'}</>
      )
    }
  ];

  return (
    <>
      <SettingsForm
        formHeader={'Timer'}
        formDescription={'Manage settings for the timer.'}
        sections={sections}
      />
    </>
  );
};

export default TimerSettings;
