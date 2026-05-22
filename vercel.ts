import { VercelConfig } from "@vercel/config/v1";

const everyHourHoursArray = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23,
];

const everyFifteenMinutesMinutesArray = [0, 15, 30, 45];

const friendsRefetchPath = "/api/friends/refetch";
const shoesRefetchPath = "/api/shoes/refetch";

// 1 job
const generateEveryWeekJobs = (path: string) => [
  {
    path,
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

// 24 jobs
const generateEveryHourJobs = (path: string) =>
  everyHourHoursArray.map((value) => ({
    path,
    schedule: `1 ${value} * * *`,
  }));

// 96 jobs
const generateEveryFifteenMinutesJobs = (path: string) =>
  everyHourHoursArray.flatMap((hour) =>
    everyFifteenMinutesMinutesArray.map((minute) => ({
      path,
      schedule: `${minute} ${hour} * * *`,
    })),
  );

export const config: VercelConfig = {
  // max 100 jobs
  crons: [
    // friends
    // ...generateEveryWeekJobs(friendsRefetchPath),
    // ...generateEveryDayJobs(friendsRefetchPath),
    // ...generateEveryHourJobs(friendsRefetchPath),
    ...generateEveryFifteenMinutesJobs(friendsRefetchPath),

    // shoes
    ...generateEveryWeekJobs(shoesRefetchPath), // default
    // ...generateEveryDayJobs(shoesRefetchPath),
    // ...generateEveryHourJobs(shoesRefetchPath),
    // ...generateEveryFifteenMinutesJobs(shoesRefetchPath),
  ],
};
