import moment from 'moment-timezone';

export const getNYCGreeting = (): string => {
  const nycTime = moment().tz('America/New_York');
  const hour = nycTime.hour();

  if (hour >= 5 && hour < 10) return 'Good Morning, NYC!';
  if (hour >= 10 && hour < 12) return 'Late Morning Vibes!';
  if (hour >= 12 && hour < 17) return 'Good Afternoon, NYC!';
  if (hour >= 17 && hour < 21) return 'Good Evening, NYC!';
  return 'Night Owl in NYC!';
};
