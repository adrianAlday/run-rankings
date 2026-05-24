import { createClient } from "@/app/_utils/supabase/server";
import { Metadata } from "next";
import Shoes from "../_components/Shoes";
import LoadingWrapper from "../_components/LoadingWrapper";

export type Shoe = {
  name: string;
  slug: string;
  type: string;
  updated_at: string;
  url: string;
} & {
  [key: string]: number;
};

const DataWrapper = async () => {
  const supabase = await createClient();
  const response = await supabase.from("shoes").select("*");
  const { data, error } = response as { data: Shoe[]; error: null };
  if (error) {
    console.log(error);
  }

  return <Shoes data={data || []} />;
};

export const metadata: Metadata = {
  title: "Shoes - Run Rankings",
};

const ShoesPage = () => (
  <main>
    <LoadingWrapper>
      <DataWrapper />
    </LoadingWrapper>
  </main>
);

export default ShoesPage;
