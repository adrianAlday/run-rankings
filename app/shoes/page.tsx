import { createClient } from "@/app/_utils/supabase/server";
import { Metadata } from "next";
import Shoes from "../_components/Shoes";
import LoadingWrapper from "../_components/LoadingWrapper";

export type ShoeRow = {
  cold_energy_returned_fore: number;
  deal_price: number;
  id: number;
  name: string;
  retail_price: number;
  slug: string;
  type: string;
  updated_at: string;
  weight: number;
};

const DataWrapper = async () => {
  const supabase = await createClient();
  const response = await supabase
    .from("shoes")
    .select(
      "cold_energy_returned_fore, deal_price, id, name, retail_price, slug, type, updated_at, weight",
    );
  const { data, error } = response;
  if (error) {
    console.log(error);
  }

  return <Shoes data={(data as unknown as ShoeRow[]) || []} />;
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
