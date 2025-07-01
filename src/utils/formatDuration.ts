export const formatDuration = (minutes: number) => {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes} menit`;
  const jam = Math.floor(minutes / 60);
  const menit = minutes % 60;
  if (menit === 0) return `${jam} jam`;
  return `${jam} jam ${menit} menit`;
};
