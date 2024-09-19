import { useState } from 'react';

function IndexPopup() {
  const [data, setData] = useState('');
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 16,
        width: '300px', // Add this line to set a fixed width
        minHeight: '200px' // Add this line to ensure a minimum height
      }}>
      <h2>
        Welcome to your{' '}
        <a href="https://www.plasmo.com" target="_blank">
          Plasmo
        </a>{' '}
        Extension!
      </h2>
      <input onChange={(e) => setData(e.target.value)} value={data} />
      <a href="https://docs.plasmo.com" target="_blank">
        View Docs
      </a>
      <button
        onClick={() => {
          chrome.tabs.create({
            url: './tabs/delta-flyer.html'
          });
        }}>
        open tab page
      </button>
      <button
        onClick={() => {
          chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
              const { id } = tabs[0];
              chrome.scripting.executeScript({
                target: { tabId: id },
                func: () => {
                  const iframe = document.createElement('iframe');
                  iframe.src = chrome.runtime.getURL('/tabs/settings.html');
                  iframe.name = 'settings';
                  document.body.appendChild(iframe);
                }
              });
            }
          );
        }}>
        iframe mounting
      </button>
    </div>
  );
}

export default IndexPopup;
