"use client";

import { getValueRgb, ValueColors } from "@/app/_utils/colors";
import { ShoeRow } from "../shoes/page";
import Link from "next/link";
import LastUpdated from "./LastUpdated";
import ScrollToButton from "./ScrollToButton";
import { useState } from "react";
import BuiltBy from "./BuiltBy";
import { usePathname, useSearchParams } from "next/navigation";
import { encodeParam } from "../_utils/url";
import { capitalize, normalizeStringForFind } from "../_utils/strings";
import { scrollIdIntoView } from "../_utils/scroll";

type ShoesProps = {
  data: ShoeRow[];
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

  const initialValues = initialProcessedData.map((shoe) => shoe.score);
  const initialMinimumValue = Math.min(...initialValues);
  const initialMaximumValue = Math.max(...initialValues);
  const targetMinimumValue = 1;
  const tagetMaximumValue = 99;
  const adjustForBottomValue = (value: number) =>
    value - initialMinimumValue + targetMinimumValue;
  const adjustForTopValue = (value: number) =>
    (adjustForBottomValue(value) / adjustForBottomValue(initialMaximumValue)) *
    tagetMaximumValue;

  const allOption = "all";

  const maximumPrice = Math.max(
    ...initialProcessedData.map((shoe) => shoe.price),
  );
  const priceSteps = 100;
  const topPriceOption = Math.ceil(maximumPrice / priceSteps) * priceSteps;
  const priceOptions = Array.from(
    { length: (topPriceOption - priceSteps) / priceSteps + 1 },
    (_undefined, index) => priceSteps * (index + 1),
  )
    .map((price) => [
      price,
      initialProcessedData.filter((shoe) => shoe.price <= price).length,
    ])
    .filter((value) => value[1])
    .filter((value, index, array) =>
      index === 0 ? true : value[1] !== array[index - 1][1],
    )
    .map((value) => value[0]);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const priceParam = searchParams.get("price");

  const [price, setPrice] = useState(
    Number(priceParam) || (priceOptions.at(-1) as number),
  );

  const typeOptions = [
    ...new Set(
      initialProcessedData
        .map((shoe) => shoe.type)
        .sort((a, b) => a.localeCompare(b)),
    ),
    allOption,
  ];

  const typeParam = searchParams.get("type");

  const [type, setType] = useState(typeParam || (typeOptions.at(-1) as string));

  const findParam = searchParams.get("find");

  const [find, setFind] = useState(findParam || "");

  const idParam = searchParams.get("id");

  const changeParams = (entries: { [key: string]: string | number }) => {
    const nextPrice = Object.hasOwn(entries, "price") ? entries.price : price;
    const nextType = Object.hasOwn(entries, "type") ? entries.type : type;
    const nextFind = Object.hasOwn(entries, "find") ? entries.find : find;

    const newUrl = `${pathname}?${idParam ? `id=${idParam}&` : ""}price=${encodeParam(nextPrice)}&type=${encodeParam(nextType)}&find=${encodeParam(nextFind)}`;

    window.history.replaceState(
      { ...window.history.state, as: newUrl, url: newUrl },
      "",
      newUrl,
    );
  };

  const processedData = initialProcessedData
    .filter(
      (shoe) =>
        shoe.price <= price &&
        (type === allOption || shoe.type === type) &&
        (!find ||
          normalizeStringForFind(shoe.name).includes(
            normalizeStringForFind(find),
          )),
    )
    .map((shoe) => ({
      ...shoe,
      score: adjustForTopValue(shoe.score),
    }))
    .sort(
      (a, b) => (b.score || 0) - (a.score || 0) || a.name.localeCompare(b.name),
    );

  const paretoUrl = "https://en.wikipedia.org/wiki/Pareto_front";

  const lastUpdated = processedData
    .map((shoe) => shoe.updated_at)
    .sort()
    .at(-1) as string;

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
      <div className="my-8 text-xs">
        <div className="my-4">
          <div className="my-1">
            Relative ratings of the energy{" "}
            <span className="italic">absorbed</span> then{" "}
            <span className="italic">returned</span> in{" "}
            <span className="italic">cold</span> conditions with a penalty for{" "}
            <span className="italic">weight</span>
          </div>

          <div className="my-1 border border-[rgb(52,53,54)] rounded-md p-2 bg-[rgb(29,30,31)] font-mono">
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
          <LastUpdated isoString={lastUpdated} />
        </div>
      </div>

      <div className="min-h-lvh">
        <div id="filters" className="my-8">
          <div className="my-2 flex flex-wrap">
            {priceOptions.map((priceOption, index) => (
              <div
                key={priceOption}
                id={`${priceOption}`}
                onClick={() => {
                  setPrice(priceOption);

                  scrollIdIntoView("filters");

                  changeParams({ price: priceOption });
                }}
                className={`mr-2 my-2 border border-[rgb(52,53,54)] hover:border-[rgb(74,119,145)] rounded-md ${price === priceOption ? "bg-[rgb(36,50,59)]" : "bg-[rgb(29,30,31)]"} py-1 px-2 shrink-0 flex items-center justify-center text-xs font-medium transition-all duration-700 transition-discrete`}
              >
                {index === priceOptions.length - 1
                  ? capitalize(allOption)
                  : `${index === 0 ? "Under " : ""}$${priceOption}`}
              </div>
            ))}
          </div>

          <div className="my-2 flex flex-wrap">
            {typeOptions.map((typeOption) => (
              <div
                key={typeOption}
                id={typeOption}
                onClick={() => {
                  setType(typeOption);

                  scrollIdIntoView("filters");

                  changeParams({ type: typeOption });
                }}
                className={`mr-2 border border-[rgb(52,53,54)] hover:border-[rgb(74,119,145)] rounded-md ${type === typeOption ? "bg-[rgb(36,50,59)]" : "bg-[rgb(29,30,31)]"} py-1 px-2 shrink-0 flex items-center justify-center text-xs font-medium transition-all duration-700 transition-discrete`}
              >
                {capitalize(typeOption)}
              </div>
            ))}
          </div>

          <div className="my-4">
            <input
              type="text"
              value={find}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const nextFind = event.target.value;

                setFind(nextFind);

                scrollIdIntoView("filters");

                changeParams({ find: nextFind });
              }}
              className={`border border-[rgb(52,53,54)] focus:border-[rgb(74,119,145)] rounded-md w-full ${find ? "bg-[rgb(36,50,59)]" : "bg-[rgb(29,30,31)]"} py-1 px-2 text-xs font-medium transition-all duration-700 transition-discrete`}
              placeholder="Find"
            />
          </div>
        </div>

        {processedData.map((shoe, shoeIndex) => {
          const value = shoe.score;

          const surpassingShoes = processedData.filter(
            (otherShoe) =>
              otherShoe[energyKey] > shoe[energyKey] &&
              otherShoe.weight < shoe.weight &&
              otherShoe.price < shoe.price,
          );
          const surpassingShoe = surpassingShoes[0];

          const width = value
            ? (100 * (value - targetMinimumValue + minimumWidth)) /
              (tagetMaximumValue - targetMinimumValue + minimumWidth)
            : minimumWidth;

          const backgroundColor = getValueRgb(value, valueColors);

          return (
            <div
              key={shoeIndex}
              id={`${shoe.id}`}
              className={`my-4 ${surpassingShoe ? "opacity-25" : "opacity-100"} transition-all duration-700 transition-discrete`}
            >
              <Link target="_blank" href={`https://runrepeat.com/${shoe.slug}`}>
                <div className="text-sm font-semibold">
                  {shoe.name} {`${shoe.id}` === idParam ? " 🎉🎉🎉" : ""}
                </div>

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

              {!!surpassingShoe && (
                <div className="-mt-1">
                  <ScrollToButton id={`${surpassingShoe.id}`}>
                    <div className=" text-xs">
                      {"<<"} {surpassingShoe.name}
                    </div>
                  </ScrollToButton>
                </div>
              )}
            </div>
          );
        })}

        <BuiltBy />
      </div>
    </div>
  );
};

export default Shoes;
