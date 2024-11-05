import { useRef, useState } from 'react';

interface useLocalTimerProps {
  onTimeLimitReached?: () => void;
  timeLimit: number;
}

const useLocalTimer = ({
  onTimeLimitReached,
  timeLimit
}: useLocalTimerProps) => {
  const [timeInMiliseconds, setTimeInMiliseconds] = useState<number>(0);
  const intervalIds = useRef<NodeJS.Timeout[]>([]);
  const timeLimitRef = useRef<number>(timeLimit);

  const isTimeLimitSurpassed = timeInMiliseconds >= timeLimit;
  timeLimitRef.current = timeLimit;

  const clearIntervals = () => {
    intervalIds.current?.forEach((intervalId) => {
      clearInterval(intervalId);
      intervalIds.current = intervalIds.current.filter(
        (id) => id !== intervalId
      );
    });
  };

  // increments timer by 1 every second
  // triggers alarm audio if threshold is met
  // adds to the intervalId ref so that the interval can be canceled when the tab becomes inactive
  const startLocalTimerInterval = () => {
    const intervalId = setInterval(() => {
      setTimeInMiliseconds((currTime) => {
        const newTime = currTime + 1000;
        if (Math.abs(newTime - timeLimitRef.current) < 500) {
          onTimeLimitReached?.();
        }
        return newTime;
      });
    }, 1000);
    intervalIds.current?.push(intervalId);
  };

  const syncLocalTimer = (globalStartTime: number) => {
    clearIntervals();

    // set local timer immediately on refresh
    const _timeInMiliseconds = Date.now() - globalStartTime;
    setTimeInMiliseconds(_timeInMiliseconds);

    // initial timeout will be some fraction of a second
    const initialTimeout = 1000 - (_timeInMiliseconds % 1000);
    setTimeout(() => {
      // set local timer again after initial timeout
      setTimeInMiliseconds(Date.now() - globalStartTime);
      // start interval
      startLocalTimerInterval();
    }, initialTimeout);
  };

  return {
    timeInMiliseconds,
    isTimeLimitSurpassed,
    syncLocalTimer,
    cleanupTimer: clearIntervals
  };
};

export default useLocalTimer;
