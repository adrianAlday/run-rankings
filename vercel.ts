import { VercelConfig } from "@vercel/config/v1";

const everyHourArray = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23,
];

const everyFifteenMinuteArray = [0, 15, 30, 45];

const friendsRefetchPath = "/api/shoes/refetch";
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
  everyHourArray.map((value) => ({
    path,
    schedule: `1 ${value} * * *`,
  }));

// 96 jobs
const generateEvery15MinutesJobs = (path: string) =>
  everyHourArray.flatMap((hour) =>
    everyFifteenMinuteArray.map((minute) => ({
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
    ...generateEvery15MinutesJobs(friendsRefetchPath),

    // shoes
    ...generateEveryWeekJobs(shoesRefetchPath), // default
    // ...generateEveryDayJobs(shoesRefetchPath),
    // ...generateEveryHourJobs(shoesRefetchPath),
    // ...generateEvery15MinutesJobs(shoesRefetchPath),
  ],
};
