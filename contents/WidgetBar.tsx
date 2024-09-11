import cssText from "data-text:~/contents/WidgetBar.css";
import type { PlasmoCSConfig } from "plasmo";
import { useEffect, useState } from "react";

import Button from "~components/shared/Button";

export const getStyle = () => {
  const style = document.createElement("style");
  style.textContent = cssText;
  return style;
};

export const config: PlasmoCSConfig = {
  matches: ["*://*/*"]
};

const WidgetBar = () => {
  const [timeInSeconds, setTimeInSeconds] = useState<number>(0);

  const formatTime = (seconds: number) => {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const incrementTimer = () => {
      setTimeInSeconds((currTime) => currTime + 1);
      timeoutId = setTimeout(incrementTimer, 1_000);
    };

    timeoutId = setTimeout(incrementTimer, 1_000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [timeInSeconds]);

  return (
    <div className="widget-bar">
      <div className="timer-container">{formatTime(timeInSeconds)}</div>
      <Button
        text={"Hello"}
        onClick={() => {
          console.log("Hello");
        }}
      />
    </div>
  );
};

export default WidgetBar;
