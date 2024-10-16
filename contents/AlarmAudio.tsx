import type { PlasmoCSConfig } from 'plasmo';
import alarmAudioSrc from 'url:../alarm.wav';

export const config: PlasmoCSConfig = {
  matches: ['<all_urls>']
};

// place the audio element in a custom root container which is a child of the body element
// this places the audio element outside of a shadow dom, allowing background scripts to
// play and pause the audio as needed
export const getRootContainer = () => {
  const container = document.createElement('div');
  document.querySelector('body').appendChild(container);
  return container;
};

const AlarmAudio = () => {
  return (
    <>
      <audio id="alarm-audio-element" loop>
        <source src={alarmAudioSrc} type="audio/wav" />
      </audio>
    </>
  );
};

export default AlarmAudio;
