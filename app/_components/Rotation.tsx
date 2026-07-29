"use client";

import { getValueRgb, minimumBarWidth, ValueColors } from "@/app/_utils/colors";
import ScrollToButton from "./ScrollToButton";
import { useState } from "react";
import BuiltBy from "./BuiltBy";
import { usePathname, useSearchParams } from "next/navigation";
import { generateQueryString, replaceUrl } from "../_utils/url";
import { capitalize, normalizeStringForFind } from "../_utils/strings";
import { scrollIdIntoView } from "../_utils/scroll";
import { Shoe } from "../rotation/page";

type ShoesProps = {
  data: Shoe[];
};

const Rotation = ({ data }: ShoesProps) => {
  const otherBrand = "other";

  const initialProcessedData = data
    .filter((shoe) => shoe.total_distance !== "0")
    .map((shoe) => {
      const brand = ["Barefoot (No Shoes)", "No name"].includes(shoe.brand_name)
        ? otherBrand
        : capitalize(shoe.brand_name);
      const model =
        shoe.brand_name === "Barefoot (No Shoes)"
          ? "barefoot"
          : shoe.model_name;
      const name = (brand === otherBrand ? "" : `${brand} `) + model;
      const distance = Number(shoe.total_distance.replaceAll(",", ""));

      return {
        ...shoe,
        brand,
        model,
        name,
        distance,
      };
    });

  const searchParams = useSearchParams();

  const sortOptions = [
    { value: "recent", key: "id", label: "Most recently" },
    { value: "distance", key: "distance", label: "Most miles" },
    { value: "name", key: "name", label: "A to Z" },
  ];

  const sortParam = searchParams.get("sort");

  const [sort, setSort] = useState(sortParam || sortOptions[0].value);

  const brandParam = searchParams.get("brand");

  const allOption = "all";

  const brandOptions = [
    allOption,
    ...[...new Set(initialProcessedData.map((shoe) => shoe.brand))].sort(
      (a, b) => {
        if (a === otherBrand) {
          return 1;
        }

        if (b === otherBrand) {
          return -1;
        }

        return a.localeCompare(b);
      },
    ),
  ];

  const [brand, setBrand] = useState(brandParam || allOption);

  const findParam = searchParams.get("find");

  const initialFind = "";

  const [find, setFind] = useState(findParam || initialFind);

  const pathname = usePathname();

  const changeParams = (newParams: { [key: string]: string | number }) => {
    const originalParams = [
      { key: "sort", value: sort },
      { key: "brand", value: brand },
      { key: "find", value: find },
    ];

    replaceUrl(`${pathname}?${generateQueryString(originalParams, newParams)}`);
  };

  const processedData = initialProcessedData
    .filter(
      (shoe) =>
        (brand === allOption || shoe.brand === brand) &&
        (!find ||
          normalizeStringForFind(shoe.name).includes(
            normalizeStringForFind(find),
          )),
    )
    .sort((a, b) => {
      const key = sortOptions.find((sortOption) => sortOption.value === sort)!
        .key as keyof (typeof initialProcessedData)[number];

      return typeof a[key] === "number" && typeof b[key] === "number"
        ? b[key] - a[key]
        : (a[key] as string).localeCompare(b[key] as string);
    });

  const allValues = initialProcessedData.map((shoe) => shoe.distance);
  const maximumValue = Math.max(...allValues);

  const valueColors: ValueColors = [
    [0, [204, 120, 209]], // purple
    [100, [73, 159, 248]], // blue
    [200, [152, 228, 145]], // green
    [500, [249, 215, 73]], // yellow
    [1000, [239, 130, 119]], // red
  ];

  // last updated?

  const filtersId = "filters";

  return (
    <div>
      <div className="my-8 text-xs">
        <div className="my-4">
          <div className="my-1">{"What I've been wearing 💅"}</div>
        </div>
      </div>

      <div className="min-h-lvh">
        <div id={filtersId} className="my-8">
          <div className="my-2 flex flex-wrap">
            {sortOptions.map((sortOption) => (
              <div
                key={sortOption.value}
                id={sortOption.value}
                onClick={() => {
                  setSort(sortOption.value);

                  scrollIdIntoView(filtersId);

                  changeParams({ sort: sortOption.value });
                }}
                className={`mr-2 my-1 border border-[rgb(52,53,54)] hover:border-[rgb(74,119,145)] rounded-md ${sort === sortOption.value ? "bg-[rgb(36,50,59)]" : "bg-[rgb(29,30,31)]"} py-1 px-2 shrink-0 flex items-center justify-center text-xs font-medium transition-all duration-700 transition-discrete`}
              >
                {sortOption.label}
              </div>
            ))}
          </div>

          <div className="my-2 flex flex-wrap">
            {brandOptions.map((brandOption) => (
              <div
                key={brandOption}
                id={`${brandOption}`}
                onClick={() => {
                  setBrand(brandOption);

                  scrollIdIntoView(filtersId);

                  changeParams({ brand: brandOption });
                }}
                className={`mr-2 my-1 border border-[rgb(52,53,54)] hover:border-[rgb(74,119,145)] rounded-md ${brand === brandOption ? "bg-[rgb(36,50,59)]" : "bg-[rgb(29,30,31)]"} py-1 px-2 shrink-0 flex items-center justify-center text-xs font-medium transition-all duration-700 transition-discrete`}
              >
                {capitalize(brandOption)}
                {[allOption, otherBrand].includes(brandOption) && " brands"}
              </div>
            ))}
          </div>

          <div className="my-4">
            <div className="relative">
              <input
                type="text"
                value={find}
                onClick={() => {
                  scrollIdIntoView(filtersId);
                }}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const nextFind = event.target.value;

                  setFind(nextFind);

                  changeParams({ find: nextFind });
                }}
                className={`border border-[rgb(52,53,54)] focus:border-[rgb(74,119,145)] rounded-md w-full ${find ? "bg-[rgb(36,50,59)]" : "bg-[rgb(29,30,31)]"} py-1 px-2 text-md font-medium transition-all duration-700 transition-discrete`}
                placeholder="Find"
              />

              {!!find.length && (
                <button
                  className="absolute right-0 top-1/2 -translate-y-1/2 px-2 py-1 text-xl hover:text-[rgb(74,119,145)]"
                  onClick={() => {
                    setFind(initialFind);

                    scrollIdIntoView(filtersId);

                    changeParams({ find: initialFind });
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {processedData.map((shoe, shoeIndex) => {
          const value = shoe.distance;

          const relativeValue = value / maximumValue;

          const backgroundColor = getValueRgb(value, valueColors);

          const sharedClasses = "border rounded-md p-1 text-xs font-semibold";

          const text = `${Math.ceil(shoe.distance).toLocaleString()}${shoeIndex === 0 ? " miles" : ""}`;

          return (
            <div
              key={shoeIndex}
              id={`${shoe.id}`}
              className={`my-4 opacity-100 transition-all duration-700 transition-discrete`}
            >
              <div className="text-sm font-semibold">{shoe.name}</div>

              <div className="relative w-full">
                <div
                  className={`${sharedClasses} border-[rgb(42,43,44)] text-[rgb(18,19,20)] absolute text-right text-nowrap overflow-hidden transition-all duration-700 transition-discrete`}
                  style={{
                    width: `calc( ( 100% - ${minimumBarWidth}px ) * ${relativeValue} + ${minimumBarWidth}px )`,
                    backgroundColor: `rgb(${backgroundColor.join(",")})`,
                  }}
                >
                  {text}
                </div>

                <div
                  className={`${sharedClasses} border-[rgb(18,19,20)] text-[rgb(189,190,191)]`}
                >
                  {text}
                </div>
              </div>
            </div>
          );
        })}

        {processedData.length >= 20 && (
          <ScrollToButton id={filtersId} classNames="w-full">
            <div
              className={`my-8 border border-[rgb(52,53,54)] hover:border-[rgb(74,119,145)] rounded-md bg-[rgb(29,30,31)] py-1 px-2 shrink-0 flex items-center justify-center text-xs font-medium transition-all duration-700 transition-discrete`}
            >
              Jump to top
            </div>
          </ScrollToButton>
        )}

        {!processedData.length && (
          <div className="my-4 text-sm font-semibold">
            No {brand !== allOption ? brand : ""} {find}
            {" :("}
          </div>
        )}

        <BuiltBy />
      </div>
    </div>
  );
};

export default Rotation;
