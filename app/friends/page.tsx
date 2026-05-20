import { createClient } from "@/utils/supabase/client";
import { Metadata } from "next";
import Roster from "../_components/Roster";
import { redirect } from "next/navigation";

export type FriendResponse = {
  id: number;
  name: string;
  groupings: {
    activities: { start_date: string; moving_time: number; updated_at: string };
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
      "id, name, groupings ( activities ( start_date, moving_time, updated_at ) )",
    );
  const { data, error } = response as unknown as {
    data: FriendResponse[];
    error: null;
  };
  if (error) {
    console.log(error);
    redirect("/");
  }

  return <Roster data={data} />;
};

export default RosterPage;
