import { createClient } from "@/app/_utils/supabase/client";
import { Metadata } from "next";
import Roster from "../_components/Roster";
import { Suspense } from "react";

export type FriendResponse = {
  id: number;
  name: string;
  groupings: {
    activities: {
      id: number;
      start_date: string;
      moving_time: number;
      updated_at: string;
    };
  }[];
};

export const metadata: Metadata = {
  title: "Roster - Run Rankings",
};

const RosterPage = async () => {
  const supabase = createClient();
  const response = await supabase
    .from("friends")
    .select(
      "id, name, groupings ( activities ( id, start_date, moving_time, updated_at ) )",
    );
  const { data, error } = response as unknown as {
    data: FriendResponse[];
    error: null;
  };
  if (error) {
    console.log(error);
  }

  return (
    <Suspense>
      <Roster data={data || []} />
    </Suspense>
  );
};

export default RosterPage;
