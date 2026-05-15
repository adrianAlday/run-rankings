import { createClient } from "@/utils/supabase/client";
import { isDev } from "@/utils/isDev";
import Refetch from "./_components/Refetch";

const HomePage = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from("shoes").select("*");
  if (error) {
    console.log(error);
  }

  const chunkedData: { [key: string]: { [key: string]: string | number }[] } =
    {};

  data
    ?.sort(
      (a, b) =>
        ((b["cold_energy_returned_fore"] as number) || 0) -
          ((a["cold_energy_returned_fore"] as number) || 0) ||
        (a.name as string).localeCompare(b.name as string),
    )
    .forEach((shoe) => {
      if (!chunkedData[shoe.type]) {
        chunkedData[shoe.type] = [];
      }
      chunkedData[shoe.type] = [...chunkedData[shoe.type], shoe];
    });

  return (
    <div>
      <main>
        {isDev && <Refetch />}

        <div>road</div>

        {chunkedData.road.map((shoe) => (
          <div key={shoe.name}>
            {shoe.name}, {shoe.cold_energy_returned_fore}
          </div>
        ))}

        <div>trail</div>

        {chunkedData.trail.map((shoe) => (
          <div key={shoe.name}>
            {shoe.name}, {shoe.cold_energy_returned_fore}
          </div>
        ))}
      </main>
    </div>
  );
};

export default HomePage;
