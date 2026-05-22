"use client";

import { getValueRgb, ValueColors } from "@/app/_utils/colors";
import { Shoe } from "../shoes/page";
import Link from "next/link";
import LastUpdated from "./LastUpdated";
import ScrollToButton from "./ScrollToButton";
import { isDev } from "@/app/_utils/isDev";
import { useState } from "react";

type ShoesProps = {
  data: Shoe[];
};

const Shoes = ({ data }: ShoesProps) => {
  const energyKey = "cold_energy_returned_fore";

  const weightPenalty = 20;

  const initialProcessedData = data
    .filter(
      (shoe) =>
        shoe[energyKey] &&
        shoe.weight &&
        (shoe.deal_price || shoe.retail_price),
    )
    .map((shoe) => ({
      ...shoe,
      price: shoe.deal_price || shoe.retail_price,
      score: shoe[energyKey] - (shoe.weight * weightPenalty) / 100,
    }));

  const maximumPrice = Math.max(
    ...initialProcessedData.map((shoe) => shoe.price),
  );
  const priceSteps = 100;
  const topPriceOption = Math.ceil(maximumPrice / priceSteps) * priceSteps;
  const initialPriceArray = Array.from(
    { length: (topPriceOption - priceSteps) / priceSteps + 1 },
    (_undefined, index) => topPriceOption - priceSteps * index,
  );
  const priceArray = initialPriceArray
    .map((price) => [
      price,
      initialProcessedData.filter((shoe) => shoe.price <= price).length,
    ])
    .filter((value, index, array) =>
      index === 0 ? true : value[1] !== array[index - 1][1],
    )
    .map((value) => value[0]);
  const priceLabels = priceArray.map(
    (rangeOption, index) => `${index === 0 ? "Under " : ""}$${rangeOption}`,
  ) as string[];
  const priceOptions = priceLabels.map((label, index) => [
    label,
    priceArray[index],
  ]);

  const [price, setPrice] = useState(priceLabels[0]);

  const priceLimit = priceOptions.find(
    (priceOption) => priceOption[0] === price,
  )?.[1] as number;

  const filteredData = initialProcessedData.filter(
    (shoe) => shoe.price <= priceLimit,
  );

  const initialValues = filteredData.map((shoe) => shoe.score);
  const initialMinimumValue = Math.min(...initialValues);
  const initialMaximumValue = Math.max(...initialValues);
  const targetMinimumValue = 1;
  const tagetMaximumValue = 99;
  const adjustForBottomValue = (value: number) =>
    value - initialMinimumValue + targetMinimumValue;
  const adjustForTopValue = (value: number) =>
    (adjustForBottomValue(value) / adjustForBottomValue(initialMaximumValue)) *
    tagetMaximumValue;

  const processedData = filteredData.map((shoe) => ({
    ...shoe,
    score: adjustForTopValue(shoe.score),
  })) as unknown as Shoe[];

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
  const dataEntries = Object.entries(dataByType);

  const paretoUrl = "https://en.wikipedia.org/wiki/Pareto_front";

  const lastUpdated = processedData
    .map((shoe) => shoe.updated_at)
    .sort()
    .at(-1) as string;

  const capitalize = (value: string) =>
    value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

  const minimumWidth = 5;

  const valueColors: ValueColors = [
    [20, [239, 130, 119]], // red
    [40, [249, 215, 73]], // yellow
    [60, [152, 228, 145]], // green
    [80, [73, 159, 248]], // blue
    [100, [204, 120, 209]], // purple
  ];

  return (
    <div>
      <main>
        <div className="my-8 text-xs">
          <div className="my-4">
            <div className="my-1">
              Relative rating of the energy{" "}
              <span className="italic">absorbed</span> then{" "}
              <span className="italic">returned</span> in{" "}
              <span className="italic">cold</span> conditions with a penalty for{" "}
              <span className="italic">weight</span>
            </div>

            <div className="my-1 border border-[rgb(42,43,44)] rounded-md p-2 bg-[rgb(25,26,27)] font-mono">
              <div>energy_absorbed_forefoot</div>

              <div>* energy_return_rate_forefoot</div>

              <div>* ( 100% - hardness_increase_in_cold )</div>

              <div>- weight * {weightPenalty}%</div>
            </div>
          </div>

          <div className="my-4">
            <Link target="_blank" href={paretoUrl}>
              <div>
                <div className="my-1">
                  Grayed out if some other shoe is bouncier, lighter, and
                  currently cheaper
                </div>

                <div className="my-1 underline">{paretoUrl}</div>
              </div>
            </Link>
          </div>

          <div className="my-4">
            <Link target="_blank" href={"https://runrepeat.com"}>
              <div>
                Lab data and current prices from{" "}
                <span className="underline">RunRepeat</span>
              </div>
            </Link>
          </div>

          <div className="my-4">
            <LastUpdated iso={lastUpdated} />
          </div>
        </div>

        <div className="my-8 flex overflow-x-scroll no-scrollbar">
          {priceLabels.map((priceLabel) => (
            <div
              key={priceLabel}
              onClick={() => {
                setPrice(priceLabel);
              }}
              className={`${price === priceLabel ? "bg-[rgb(65,121,157)] text-[rgb(253,254,255)]" : ""} mr-2 border border-[rgb(42,43,44)] rounded-md  py-1 px-2 shrink-0 flex items-center justify-center text-xs font-medium transition-all duration-700 transition-discrete`}
            >
              {priceLabel}
            </div>
          ))}
        </div>

        {dataEntries.map(([type, shoes], index) => {
          const typeToScrollTo =
            dataEntries[dataEntries.length === index + 1 ? 0 : index + 1][0];

          return (
            <div key={type} id={type}>
              <div className="my-8 flex justify-between">
                <div className="text-sm font-semibold">{capitalize(type)}</div>

                <ScrollToButton id={typeToScrollTo}>
                  <div className="text-xs">
                    jump to{" "}
                    <span className="underline">
                      {capitalize(typeToScrollTo)}
                    </span>
                  </div>
                </ScrollToButton>
              </div>

              {shoes.map((shoe, shoeIndex) => {
                const value = shoe.score;

                const width = value
                  ? (100 * (value - targetMinimumValue + minimumWidth)) /
                    (tagetMaximumValue - targetMinimumValue + minimumWidth)
                  : minimumWidth;

                const backgroundColor = getValueRgb(value, valueColors);

                const surpassedBy = shoes.filter(
                  (otherShoe) =>
                    otherShoe[energyKey] > shoe[energyKey] &&
                    otherShoe.weight < shoe.weight &&
                    otherShoe.price < shoe.price,
                );
                const isNotParetoEfficient = surpassedBy.length;
                if (isDev && isNotParetoEfficient) {
                  console.log(
                    shoe.name,
                    "surpassedBy",
                    surpassedBy.map((shoe) => shoe.name)[0],
                  );
                }

                return (
                  <div
                    key={shoeIndex}
                    className={`my-4 ${isNotParetoEfficient ? "opacity-25" : "opacity-100"} transition-all duration-700 transition-discrete`}
                  >
                    <Link
                      target="_blank"
                      href={`https://runrepeat.com/${shoe.slug}`}
                    >
                      <div className="text-sm font-semibold">{shoe.name}</div>

                      <div
                        className={`border border-[rgb(42,43,44)] rounded-md p-1 text-right text-xs font-semibold text-[rgb(18,19,20)] transition-all duration-700 transition-discrete`}
                        style={{
                          width: `${width}%`,
                          backgroundColor: `rgb(${backgroundColor.join(",")})`,
                        }}
                      >
                        {Math.floor(shoe.score)}
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          );
        })}
      </main>
    </div>
  );
};

export default Shoes;
