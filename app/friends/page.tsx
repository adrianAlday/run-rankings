import { createClient } from "@/app/_utils/supabase/server";
import { Metadata } from "next";
import Roster from "../_components/Roster";
import LoadingWrapper from "../_components/LoadingWrapper";

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

const DataWrapper = async () => {
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

  return <Roster data={(data as unknown as FriendRow[]) || []} />;
};

export const metadata: Metadata = {
  title: "Roster - Run Rankings",
};

const RosterPage = () => (
  <main>
    <LoadingWrapper>
      <DataWrapper />
    </LoadingWrapper>
  </main>
);

export default RosterPage;
