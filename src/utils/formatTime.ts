export const formatTime = (seconds: number = 0) =>
  new Date(seconds * 1000).toISOString().substring(11, 19);
