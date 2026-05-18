import { createClient } from "@/utils/supabase/client";
import { isDev } from "@/utils/isDev";
import Refetch from "../_components/Refetch";
import Link from "next/link";
import { Metadata } from "next";
import LastUpdated from "../_components/LastUpdated";

type Shoe = { name: string; type: string; updated_at: string; url: string } & {
  [key: string]: number;
};

type ValueColors = [number, number[]][];

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

  const energyKey = "cold_energy_returned_fore";

  const processedData = data
    .filter((shoe) => shoe[energyKey] && shoe.weight && shoe.price)
    .map((shoe) => ({
      ...shoe,
      score: shoe[energyKey] - shoe.weight / 10,
    })) as unknown as Shoe[];

  const values = processedData.map((shoe) => shoe.score);
  const maximumValue = Math.max(...values);
  const minimumValue = Math.min(...values);

  const lastUpdated = processedData
    .map((shoe) => shoe.updated_at)
    .sort()
    .at(-1) as string;

  const dataByType = processedData
    ?.sort(
      (a, b) => (b.score || 0) - (a.score || 0) || a.name.localeCompare(b.name),
    )
    .reduce(
      (accumulator, shoe) => {
        accumulator[shoe.type] = [...(accumulator[shoe.type] || []), shoe];

        return accumulator;
      },
      {} as { [key: string]: Shoe[] },
    );

  const minimumWidth = 10;

  const valueColors: ValueColors = [
    [25, [239, 130, 119]], // red
    [50, [249, 215, 73]], // yellow
    [75, [73, 159, 248]], // blue
  ];

  const getValueRgb = (value: number, valueColors: ValueColors) => {
    const firstCriteria = valueColors[0];
    if (value <= firstCriteria[0]) {
      return firstCriteria[1];
    }

    const lastCriteria = valueColors[valueColors.length - 1];
    if (value >= lastCriteria[0]) {
      return lastCriteria[1];
    }

    const higherIndex = valueColors.findIndex(
      (criteria) => value <= criteria[0],
    );
    const higherCriteria = valueColors[higherIndex];
    const lowerCriteria = valueColors[higherIndex - 1];
    const split =
      (value - lowerCriteria[0]) / (higherCriteria[0] - lowerCriteria[0]);

    return lowerCriteria[1].map(
      (lowerColor, index) =>
        lowerColor + (higherCriteria[1][index] - lowerColor) * split,
    );
  };

  const paretoUrl = "https://en.wikipedia.org/wiki/Pareto_front";

  return (
    <div>
      <main>
        <div className="my-8 text-xs">
          <div className="my-4">
            <div className="my-1">
              Calculation of the energy <span className="italic">absorbed</span>{" "}
              then <span className="italic">returned</span> in{" "}
              <span className="italic">cold</span> conditions with a{" "}
              <span className="italic">weight</span> penalty
            </div>

            <div className="my-1 border border-[rgb(42,43,44)] rounded-md p-2 bg-[rgb(25,26,27)] text-[11px] font-mono">
              <div>energy_absorbed_forefoot</div>

              <div>* energy_return_rate_forefoot</div>

              <div>* 100 / ( 100 + hardness_increase_in_cold )</div>

              <div>- weight / 10</div>
            </div>
          </div>

          <div className="my-4">
            <Link target="_blank" href={paretoUrl}>
              <div>
                <div className="my-1">
                  Grayed out if some other shoe is bouncier, lighter, and
                  cheaper
                </div>

                <div className="my-1 underline">{paretoUrl}</div>
              </div>
            </Link>
          </div>

          <div className="my-4">
            <Link target="_blank" href={"https://runrepeat.com"}>
              <div>
                Test data from <span className="underline">RunRepeat</span>
              </div>
            </Link>
          </div>

          <div className="my-4">
            <LastUpdated lastUpdated={lastUpdated} />
          </div>
        </div>

        {Object.entries(dataByType).map(([type, shoes]) => (
          <div key={type}>
            <div className="my-8 text-sm font-semibold">
              {type
                .toLowerCase()
                .replace(/\b\w/g, (char) => char.toUpperCase())}
            </div>

            {shoes.map((shoe) => {
              const value = shoe.score;

              const width = value
                ? (100 * (value - minimumValue + minimumWidth)) /
                  (maximumValue - minimumValue + minimumWidth)
                : minimumWidth;

              const backgroundColor = getValueRgb(value, valueColors);

              const isNotParetoEfficient = shoes.some(
                (otherShoe) =>
                  otherShoe[energyKey] > shoe[energyKey] &&
                  otherShoe.weight < shoe.weight &&
                  otherShoe.price < shoe.price,
              );

              return (
                <div
                  key={shoe.name}
                  className={`my-4 ${isNotParetoEfficient ? "opacity-25" : "opacity-100"}`}
                >
                  <Link target="_blank" href={shoe.url}>
                    <div className="text-sm font-semibold">{shoe.name}</div>

                    <div
                      className={`border border-[rgb(42,43,44)] rounded-md p-1 text-right text-xs font-semibold text-[rgb(18,19,20)]`}
                      style={{
                        width: `${width}%`,
                        backgroundColor: `rgb(${backgroundColor.join(",")})`,
                      }}
                    >
                      {Math.round(shoe.score)}
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        ))}

        {isDev && <Refetch />}
      </main>
    </div>
  );
};

export default ShoesPage;
