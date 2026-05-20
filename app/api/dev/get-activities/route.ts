import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { isDev } from "@/utils/isDev";
import { createClient } from "@/utils/supabase/server";

const getActivities = async (
  accessToken: string,
  beforeEpoch: number,
  page: number,
): Promise<
  {
    [key: string]: string;
  }[]
> => {
  await new Promise((resolve) => setTimeout(resolve, 6 * 1000));

  const path = "https://www.strava.com/api/v3/athlete/activities";

  if (isDev) {
    console.log(`${path}?page=${page}`);
  }

  return await axios
    .get(path, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        before: beforeEpoch,
        per_page: 200,
        page,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch(async (error) => {
      console.log(error);

      await new Promise((resolve) => setTimeout(resolve, 60 * 1000));

      return await getActivities(accessToken, beforeEpoch, page);
    });
};

export const GET = async (request: NextRequest) => {
  if (!isDev) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const searchParamsObject = Object.fromEntries(
    request.nextUrl.searchParams.entries(),
  );

  const authorizationCodeResponse = await axios
    .post("https://www.strava.com/api/v3/oauth/token", {
      client_id: process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      grant_type: "authorization_code",
      code: searchParamsObject.code,
    })
    .then((response) => {
      return response.data;
    });

  const refreshTokenResponse = await axios
    .post("https://www.strava.com/api/v3/oauth/token", {
      client_id: process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: authorizationCodeResponse.refresh_token,
    })
    .then((response) => {
      return response.data;
    });

  const data = {
    activities: [] as {
      [key: string]: string;
    }[],
  };

  const supabase = await createClient();

  for (let activitiesPage = 1; ; activitiesPage++) {
    const activitiesResponse = await getActivities(
      refreshTokenResponse.access_token,
      refreshTokenResponse.expires_at,
      activitiesPage,
    );

    if (activitiesResponse.length) {
      data.activities = [...data.activities, ...activitiesResponse];

      const upsertResponse = await supabase.from("activities").upsert(
        activitiesResponse.map(({ id, start_date, moving_time }) => ({
          id,
          start_date,
          moving_time,
        })),
      );

      if (isDev) {
        console.log(upsertResponse);
        console.log(data.activities.length, "activities upserted");
      }
    } else {
      break;
    }
  }

  return NextResponse.json(data);
};
