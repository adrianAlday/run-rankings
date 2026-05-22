import { createClient } from "@/app/_utils/supabase/client";
import { Metadata } from "next";
import Shoes from "../_components/Shoes";

export type Shoe = {
  name: string;
  slug: string;
  type: string;
  updated_at: string;
  url: string;
} & {
  [key: string]: number;
};

export const metadata: Metadata = {
  title: "Shoes - Run Rankings",
};

const ShoesPage = async () => {
  const supabase = createClient();
  const response = await supabase.from("shoes").select("*");
  const { data, error } = response as { data: Shoe[]; error: null };
  if (error) {
    console.log(error);
  }

  return <Shoes data={data || []} />;
};

export default ShoesPage;
