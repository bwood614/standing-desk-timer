export const formatTime = (miliseconds: number) => {
  const minutes = String(Math.floor(miliseconds / 60000)).padStart(2, '0');
  const secs = String(Math.floor((miliseconds % 60000) / 1000)).padStart(
    2,
    '0'
  );
  return `${minutes}:${secs}`;
};
