import { isDev } from "@/app/_utils/isDev";
import { createClient } from "@/app/_utils/supabase/server";
import axios from "axios";
import { DateTime } from "luxon";
import { NextResponse } from "next/server";

const getTrainingActivities = async (
  page: number,
): Promise<{
  models: {
    [key: string]: string | number;
  }[];
}> => {
  await new Promise((resolve) => setTimeout(resolve, 6 * 1000));

  const path = "https://www.strava.com/athlete/training_activities";

  if (isDev) {
    console.log(`${path}?page=${page}`);
  }

  return await axios
    .get(path, {
      headers: {
        "x-requested-with": "XMLHttpRequest",
        cookie: (process.env.STRAVA_COOKIE as string).replace(
          /^['"]+|\*+['"]+$/g,
          "",
        ),
      },
      params: {
        order: "start_date_local+DESC",
        page,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch(async (error) => {
      console.log(error);

      await new Promise((resolve) => setTimeout(resolve, 60 * 1000));

      return await getTrainingActivities(page);
    });
};

export const GET = async (request: Request) => {
  const now = DateTime.now();

  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!isDev) {
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }
  }

  const supabase = await createClient();

  for (let activitiesPage = 1; ; activitiesPage++) {
    const { models: activities } = await getTrainingActivities(activitiesPage);

    if (activities.length) {
      const upsertResponse = await supabase.from("activities").upsert(
        activities.map(
          ({ id, start_time: start_date, moving_time_raw: moving_time }) => ({
            id,
            start_date,
            moving_time,
            pending: true,
          }),
        ),
        { onConflict: "id" },
      );
      if (isDev) {
        console.log(upsertResponse);
      }
    }

    if (
      !activities.length ||
      now.diff(
        DateTime.fromISO(activities.at(-1)?.start_time as string),
        "weeks",
      ).weeks >= 2
    ) {
      break;
    }
  }

  const hostHeader = request.headers.get("host");

  await axios
    .get(`http://${hostHeader}/api/friends/get-groupings`, {
      headers: { Authorization: `Bearer ${cronSecret}` },
    })
    .then((response) => response);

  return NextResponse.json({});
};
