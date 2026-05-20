import { isDev } from "@/utils/isDev";
import { createClient } from "@/utils/supabase/server";
import axios from "axios";
import { NextResponse } from "next/server";

const getGroup = async (
  activityId: number,
): Promise<{
  athletes: { [key: string]: string }[];
}> => {
  await new Promise((resolve) => setTimeout(resolve, 6 * 1000));

  const path = `https://www.strava.com/feed/activity/${activityId}/group_athletes`;

  if (isDev) {
    console.log(path);
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
    })
    .then((response) => {
      return response.data;
    })
    .catch(async (error) => {
      console.log(error);

      await new Promise((resolve) => setTimeout(resolve, 60 * 1000));

      return await getGroup(activityId);
    });
};

export const GET = async () => {
  if (!isDev) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const supabase = await createClient();

  const data = {
    activities: [] as {
      [key: string]: number;
    }[],
  };

  const selectResponse = await supabase
    .from("activities")
    .select("id")
    .eq("pending", true)
    .order("start_date", { ascending: true });
  if (isDev) {
    console.log(selectResponse);
  }

  for (const { id: activity_id } of selectResponse.data || []) {
    const group = await getGroup(activity_id);

    const friendsUpsertResponse = await supabase.from("friends").upsert([
      ...new Map(
        group.athletes.map(({ id, name }: { [key: string]: string }) => [
          id,
          {
            id,
            name,
          },
        ]),
      ).values(),
    ]);
    if (isDev) {
      console.log(friendsUpsertResponse);
    }

    if (friendsUpsertResponse.success) {
      const groupingsUpsertResponse = await supabase.from("groupings").upsert(
        group.athletes.map(({ id: friend_id }: { [key: string]: string }) => ({
          friend_id,
          activity_id,
        })),
      );
      if (isDev) {
        console.log(groupingsUpsertResponse);
      }

      if (groupingsUpsertResponse.success) {
        const activitiesUpdateResponse = await supabase
          .from("activities")
          .update({ pending: false })
          .eq("id", activity_id);
        if (isDev) {
          console.log(activitiesUpdateResponse);
        }

        if (activitiesUpdateResponse.success) {
          data.activities = [...data.activities, activity_id];
          if (isDev) {
            console.log(data.activities.length, "activities updated");
          }
        }
      }
    }
  }

  return NextResponse.json(data);
};
