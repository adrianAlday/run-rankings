import { VercelConfig } from "@vercel/config/v1";

const everyHourArray = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23,
];

const everyFifteenMinuteArray = [0, 15, 30, 45];

const shoesRefetchPath = "/api/shoes/refetch";

const generateEveryWeekJobs = (path: string) => [
  {
    path,
    schedule: "1 4 * * 6",
  },
];

const generateEveryDayJobs = (path: string) => [
  {
    path,
    schedule: "1 4 * * *",
  },
];

const generateEveryHourJobs = (path: string) =>
  everyHourArray.map((value) => ({
    path,
    schedule: `1 ${value} * * *`,
  }));

const generateEvery15MinutesJobs = (path: string) =>
  everyHourArray.flatMap((hour) =>
    everyFifteenMinuteArray.map((minute) => ({
      path,
      schedule: `${minute} ${hour} * * *`,
    })),
  );

export const config: VercelConfig = {
  crons: [
    // friends
    // {
    //   path: "/api/friends/refetch",
    //   schedule: "1 4 * * *",
    // },

    // shoes
    // ...generateEveryWeekJobs(shoesRefetchPath),
    // ...generateEveryDayJobs(shoesRefetchPath),
    // ...generateEveryHourJobs(shoesRefetchPath),
    ...generateEvery15MinutesJobs(shoesRefetchPath),
  ],
};
