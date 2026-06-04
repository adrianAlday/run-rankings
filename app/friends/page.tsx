import { createClient } from "@/app/_utils/supabase/server";
import { Metadata } from "next";
import Roster from "../_components/Roster";

export type FriendRow = {
  id: number;
  name: string;
  groupings: {
    activities: {
      id: number;
      moving_time: number;
      start_date: string;
      updated_at: string;
    };
  }[];
};

export const metadata: Metadata = {
  title: "Roster - Run Rankings",
};

const RosterPage = async () => {
  const supabase = await createClient();
  const response = await supabase
    .from("friends")
    .select(
      "id, name, groupings ( activities ( id, moving_time, start_date, updated_at ) )",
    );
  const { data, error } = response;
  if (error) {
    console.log(error);
  }

  return (
    <main>
      <Roster data={(data as unknown as FriendRow[]) || []} />;
    </main>
  );
};

export default RosterPage;
