"use client";

import { DateTime } from "luxon";
import { FriendRow } from "../friends/page";
import { useState, Fragment } from "react";
import Link from "next/link";
import { getValueRgb, ValueColors } from "@/app/_utils/colors";
import LastUpdated from "./LastUpdated";
import { usePathname, useSearchParams } from "next/navigation";
import { encodeParam } from "../_utils/url";
import BuiltBy from "./BuiltBy";
import { normalizeStringForFind } from "../_utils/strings";
import { scrollIdIntoView } from "../_utils/scroll";

type RosterProps = {
  data: FriendRow[];
};

const Roster = ({ data }: RosterProps) => {
  const now = DateTime.now();

  const idDenylist = (process.env.NEXT_PUBLIC_STRAVA_ID_DENYLIST || "")
    .split(", ")
    .map((string) => Number(string));
  const filteredData = data.filter(({ id }) => !idDenylist.includes(id));

  const lastUpdated = filteredData
    .flatMap((friend) =>
      friend.groupings.map((grouping) => grouping.activities.updated_at),
    )
    .sort()
    .at(-1) as string;

  const starts = filteredData
    .flatMap((friend) =>
      friend.groupings.map((grouping) => grouping.activities.start_date),
    )
    .sort();
  const earliestActivity = DateTime.fromISO(starts.at(0) as string);

  const goatOption = "Goat";
  const lastCompletedYear = now.year - 1;
  const completedYearsArray = Array.from(
    { length: lastCompletedYear - earliestActivity.year + 1 },
    (_undefined, index) => lastCompletedYear - index,
  );
  const generateYearDates = (startYear: number, endYear = startYear) => [
    DateTime.fromISO(`${startYear}-01-01`).startOf("day"),
    DateTime.fromISO(`${endYear}-12-31`).endOf("day"),
  ];
  const rangeOptions = [
    ["90 days", [now.plus({ days: -90 }).startOf("day"), now.endOf("day")]],
    ["Year to date", generateYearDates(now.year)],
    [goatOption, [earliestActivity.startOf("day"), now.endOf("day")]],
    ...completedYearsArray.map((year) => [`${year}`, generateYearDates(year)]),
    ["Run era", generateYearDates(2021, 2021 + 1000)],
    ["Bike era", generateYearDates(2020 - 1000, 2020)],
  ];
  const rangeLabels = rangeOptions.map(
    (rangeOption) => rangeOption[0],
  ) as string[];

  const rangeIndexesForRowStart = [
    rangeLabels.findIndex((label) => label === `${completedYearsArray[0]}`),
    rangeLabels.findIndex((label) => label.includes("era")),
  ];

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const findParam = searchParams.get("find");

  const initialFind = "";

  const [find, setFind] = useState(findParam || initialFind);

  const rangeParam = searchParams.get("range");

  const [range, setRange] = useState(
    rangeLabels.find(
      (label) => label.toLowerCase() == rangeParam?.toLowerCase(),
    ) || rangeLabels[0],
  );

  const idParam = searchParams.get("id");

  const changeParams = (entries: { [key: string]: string | number }) => {
    const nextFind = Object.hasOwn(entries, "find") ? entries.find : find;
    const nextRange = Object.hasOwn(entries, "range") ? entries.range : range;

    const newUrl = `${pathname}?${idParam ? `id=${idParam}&` : ""}find=${encodeParam(nextFind)}&range=${encodeParam(nextRange)}`;

    window.history.replaceState(
      { ...window.history.state, as: newUrl, url: newUrl },
      "",
      newUrl,
    );
  };

  const [startDate, endDate] = rangeOptions.find(
    (rangeOption) => rangeOption[0] === range,
  )?.[1] as DateTime<true>[];

  const maxDisplayCount = 50;
  const matchingFriends = filteredData
    .map(({ id, name, groupings }) => {
      const time = groupings.reduce((accumulator, grouping) => {
        const { start_date, moving_time } = grouping.activities;

        const date = DateTime.fromISO(start_date);

        return startDate <= date && date <= endDate
          ? accumulator + moving_time
          : accumulator;
      }, 0);

      return { id, name, time };
    })
    .sort((a, b) => b.time - a.time || a.name.localeCompare(b.name))
    .filter(
      (friend) =>
        friend.time > 0 &&
        (!find ||
          normalizeStringForFind(friend.name).includes(
            normalizeStringForFind(find),
          )),
    );

  const shownFriends = matchingFriends.slice(0, maxDisplayCount);
  const extraFriends = matchingFriends.length - shownFriends.length;

  const values = shownFriends.map((friend) => friend.time);
  const minimumValue = Math.min(...values);
  const maximumValue = Math.max(...values);
  const minimumWidth = 24;
  const valueColors: ValueColors = [
    [0, [204, 120, 209]], // purple
    [3, [73, 159, 248]], // blue
    [9, [152, 228, 145]], // green
    [27, [249, 215, 73]], // yellow
  ];

  const friendSeconds = filteredData.reduce(
    (accumulator, friend) =>
      accumulator +
      friend.groupings.reduce(
        (friendAccumulator, grouping) =>
          friendAccumulator + grouping.activities.moving_time,
        0,
      ),
    0,
  );

  const firstActivityData = filteredData.map(({ id, name, groupings }) => ({
    id,
    name,
    firstActivity: groupings
      .map((grouping) => grouping.activities)
      .sort((a, b) => a.start_date.localeCompare(b.start_date))[0],
  }));
  const latestFirstActivity = firstActivityData.sort((a, b) =>
    b.firstActivity.start_date.localeCompare(a.firstActivity.start_date),
  )[0]?.firstActivity;
  const newestFriends = firstActivityData
    .filter(
      (friend) =>
        friend.firstActivity.start_date === latestFirstActivity.start_date,
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <div className="my-8 text-xs">
        <div className="my-4">
          <Link target="_blank" href={"https://www.strava.com/athletes/145082"}>
            Most fun friends ...based on time together on{" "}
            <span className="underline">Strava</span>
          </Link>
        </div>

        <div className="my-4">
          <Link target="_blank" href={"https://labs.strava.com/roster"}>
            <div className="my-1">
              Inspired by <span className="underline">The Roster</span> from
              Strava Labs
            </div>
          </Link>
        </div>

        <div className="my-4">
          {filteredData.length.toLocaleString("en-US")} unique athletes,{" "}
          {Math.floor(friendSeconds / 60 / 60).toLocaleString("en-US")}{" "}
          friend-hours and counting
        </div>

        {latestFirstActivity && (
          <div className="my-4">
            Newest:{" "}
            {newestFriends.map((friend, index) => (
              <Link
                key={friend.id}
                target="_blank"
                href={`https://www.strava.com/athletes/${friend.id}`}
              >
                {index ? ", " : ""}
                <span className={"underline"}>{friend.name}</span>
              </Link>
            ))}{" "}
            on{" "}
            <Link
              target="_blank"
              href={`https://www.strava.com/activities/${latestFirstActivity.id}`}
            >
              <span className="underline">
                {DateTime.fromISO(latestFirstActivity.start_date).toFormat(
                  "LLLL d",
                )}
              </span>
            </Link>
          </div>
        )}

        <div className="my-4">
          <LastUpdated isoString={lastUpdated} />
        </div>
      </div>

      <div className="min-h-lvh">
        <div id="filters" className="my-8">
          <div className="my-4 flex flex-wrap">
            {rangeLabels.map((rangeLabel, index) => (
              <Fragment key={rangeLabel}>
                {rangeIndexesForRowStart.includes(index) && (
                  <div className="basis-full" />
                )}

                <div
                  onClick={() => {
                    setRange(rangeLabel);

                    scrollIdIntoView("filters");

                    changeParams({ range: rangeLabel });
                  }}
                  className={`mr-2 my-1 border border-[rgb(52,53,54)] hover:border-[rgb(74,119,145)] rounded-md ${range === rangeLabel ? "bg-[rgb(36,50,59)]" : "bg-[rgb(29,30,31)]"} py-1 px-2 shrink-0 flex items-center justify-center text-xs font-medium transition-all duration-700 transition-discrete`}
                >
                  {rangeLabel === "2020" ? "🦠 " : ""}
                  {rangeLabel}
                </div>
              </Fragment>
            ))}
          </div>

          <div className="my-4">
            <div className="relative">
              <input
                type="text"
                value={find}
                onClick={() => {
                  scrollIdIntoView("filters");
                }}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const nextFind = event.target.value;

                  setFind(nextFind);

                  setRange(goatOption);

                  scrollIdIntoView("filters");

                  changeParams({ range: goatOption, find: nextFind });
                }}
                className={`border border-[rgb(52,53,54)] focus:border-[rgb(74,119,145)] rounded-md w-full ${find ? "bg-[rgb(36,50,59)]" : "bg-[rgb(29,30,31)]"} py-1 px-2 text-md font-medium
 transition-all duration-700 transition-discrete`}
                placeholder="Find"
              />

              {!!find.length && (
                <button
                  className="absolute right-0 top-1/2 -translate-y-1/2 px-2 py-1 text-xl hover:text-[rgb(74,119,145)]"
                  onClick={() => {
                    setFind(initialFind);

                    changeParams({ find: initialFind });
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {shownFriends.map((friend, index) => {
          const value = friend.time;

          const relativeValue = value / maximumValue;

          const backgroundColor = getValueRgb(index, valueColors);

          const hours = Math.ceil(friend.time / 60 / 60);

          return (
            <div key={index} className={"my-4"}>
              <Link
                target="_blank"
                href={`https://www.strava.com/athletes/${friend.id}`}
              >
                <div className="text-sm font-semibold">
                  <span className={"opacity-50"}>{index + 1}</span>{" "}
                  {friend.name}
                  {`${friend.id}` === idParam ? " 🎉🎉🎉" : ""}
                </div>

                <div
                  className={`border border-[rgb(42,43,44)] rounded-md p-1 text-right text-xs font-semibold text-[rgb(18,19,20)] transition-all duration-700 transition-discrete`}
                  style={{
                    width: `calc( ( 100% - ${minimumWidth}px ) * ${relativeValue} + ${minimumWidth}px )`,
                    backgroundColor: `rgb(${backgroundColor.join(",")})`,
                  }}
                >
                  {hours}
                  {index === 0 ? ` hour${hours !== 1 ? "s" : ""}` : ""}
                </div>
              </Link>
            </div>
          );
        })}

        {!!extraFriends && (
          <div className="my-4 text-sm font-semibold">
            and {extraFriends.toLocaleString("en-US")} more...
          </div>
        )}

        {!shownFriends.length && (
          <div className="my-4 text-sm font-semibold">
            No{find ? "" : "thing"} {find} in{" "}
            {range === goatOption
              ? "the history of the universe"
              : `${range.includes("era") ? "the " : ""}${range}`}{" "}
            {":("}
          </div>
        )}

        <BuiltBy />
      </div>
    </div>
  );
};

export default Roster;
