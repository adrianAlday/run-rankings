import { createClient } from "@/utils/supabase/client";
import { isDev } from "@/utils/isDev";
import Refetch from "../_components/Refetch";
import Link from "next/link";
import { Metadata } from "next";

type Shoe = { name: string; url: string } & { [key: string]: number };

type ValueColors = [number, number[]][];

export const metadata: Metadata = {
  title: "Run Rankings - 👠 Shoes",
};

const ShoesPage = async () => {
  const supabase = createClient();
  const response = await supabase.from("shoes").select("*");
  const { data, error } = response as { data: Shoe[]; error: null };
  if (error) {
    console.log(error);
  }

  const valueKey = "cold_energy_returned_fore";

  const filteredData = data.filter((shoe) => shoe[valueKey]);

  const values = filteredData.map((shoe) => shoe[valueKey]);
  const maximumValue = Math.max(...values);
  const minimumValue = Math.min(...values);

  const minimumWidth = 5;

  const dataByType = filteredData
    ?.sort(
      (a, b) =>
        (b[valueKey] || 0) - (a[valueKey] || 0) || a.name.localeCompare(b.name),
    )
    .reduce(
      (accumulator, shoe) => {
        accumulator[shoe.type] = [...(accumulator[shoe.type] || []), shoe];

        return accumulator;
      },
      {} as { [key: string]: Shoe[] },
    );

  const valueColors: ValueColors = [
    [50, [239, 130, 119]], // red
    [75, [249, 215, 73]], // yellow
    [100, [73, 159, 248]], // blue
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

  const showRefetch = false;

  return (
    <div>
      <main>
        {isDev && showRefetch && <Refetch />}

        <div className="my-8 text-xs">
          <div className="my-4">
            <div className="my-1">
              Calculation of the energy <span className="italic">absorbed</span>{" "}
              then <span className="italic">returned</span> in{" "}
              <span className="italic">cold</span> conditions
            </div>

            <div className="my-1 border border-[rgb(42,43,44)] rounded-md p-2 bg-[rgb(25,26,27)] font-mono">
              <div>shock_absorption_forefoot *</div>

              <div>energy_return_forefoot *</div>

              <div>100 / ( 100 + hardness_increase_in_cold )</div>
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
        </div>

        {Object.entries(dataByType).map(([type, shoes]) => (
          <div key={type}>
            <div className="my-8 text-sm font-semibold">
              {type
                .toLowerCase()
                .replace(/\b\w/g, (char) => char.toUpperCase())}
            </div>

            {shoes.map((shoe) => {
              const value = shoe[valueKey];
              const width = value
                ? (100 * (value - minimumValue + minimumWidth)) /
                  (maximumValue - minimumValue + minimumWidth)
                : minimumWidth;

              const backgroundColor = getValueRgb(value, valueColors);

              const isNotParetoEfficient = shoes.some(
                (otherShoe) =>
                  otherShoe[valueKey] > shoe[valueKey] &&
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
                      {Math.round(shoe[valueKey]) || "-"}
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        ))}
      </main>
    </div>
  );
};

export default ShoesPage;
