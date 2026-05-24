import { VercelConfig } from "@vercel/config/v1";

// 1 job
const generateEveryWeekJobs = (path: string) => [
  {
    path,
    // utc: 8am
    // eastern: 3am winter, 4am summer
    schedule: "1 8 * * 6",
  },
];

// 1 job
const generateEveryDayJobs = (path: string) => [
  {
    path,
    schedule: "1 8 * * *",
  },
];

const hours = Array.from({ length: 24 }, (_element, index) => index);

// 24 jobs
const generateEveryHourJobs = (path: string) =>
  hours.map((hour) => ({
    path,
    schedule: `1 ${hour} * * *`,
  }));

const minutes = Array.from({ length: 4 }, (_element, index) => index * 15);

// 96 jobs
const generateEveryFifteenMinutesJobs = (path: string) =>
  hours.flatMap((hour) =>
    minutes.map((minute) => ({
      path,
      schedule: `${minute + 1} ${hour} * * *`,
    })),
  );

export const config: VercelConfig = {
  // max 100 jobs
  crons: [
    ...generateEveryDayJobs("/api/friends/refetch"),
    ...generateEveryWeekJobs("/api/shoes/refetch"),
  ],
};
