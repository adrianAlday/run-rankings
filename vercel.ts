import { VercelConfig } from "@vercel/config/v1";

const generateHourlyJobs = () => {};

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
    ...Array(24)
      .keys()
      .map((value) => ({
        path: "/api/shoes/refetch",
        schedule: `10 ${value} * * *`,
      })),

    // every 15 minutes
    // ...Array(24)
    //   .keys()
    //   .flatMap((value) =>
    //     Array(4)
    //       .keys()
    //       .map((innerValue) => ({
    //         path: "/api/shoes/refetch",
    //         schedule: `${innerValue * 15 + 1} ${value} * * *`,
    //       })),
    //   ),
  ],
};
