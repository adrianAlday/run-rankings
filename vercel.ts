import { VercelConfig } from "@vercel/config/v1";

const everyHourArray = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23,
];

const everyFifteenMinuteArray = [0, 15, 30, 45];

export const config: VercelConfig = {
  crons: [
    // friends

    // {
    //   path: "/api/friends/refetch",
    //   schedule: "1 4 * * *",
    // },

    // shoes

    // every week
    // {
    //   path: "/api/shoes/refetch",
    //   schedule: "1 4 * * 6",
    // },

    // every day
    // {
    //   path: "/api/shoes/refetch",
    //   schedule: "1 4 * * *",
    // },

    // every hour
    // ...Array(24)
    //   .keys()
    //   .map((value) => ({
    //     path: "/api/shoes/refetch",
    //     schedule: `1 ${value} * * *`,
    //   })),

    // every 15 minutes
    ...everyHourArray.flatMap((hour) =>
      everyFifteenMinuteArray.map((minute) => ({
        path: "/api/shoes/refetch",
        schedule: `${minute * 15 + 1} ${hour} * * *`,
      })),
    ),
  ],
};
