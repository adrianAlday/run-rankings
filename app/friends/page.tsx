import { createClient } from "@/app/_utils/supabase/server";
import { Metadata } from "next";
import Roster from "../_components/Roster";
import LoadingWrapper from "../_components/LoadingWrapper";

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

const DataWrapper = async () => {
  const supabase = await createClient();
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

  return <Roster data={data || []} />;
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
