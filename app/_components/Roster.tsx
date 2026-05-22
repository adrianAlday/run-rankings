"use client";

import { DateTime } from "luxon";
import { FriendResponse } from "../friends/page";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getValueRgb, ValueColors } from "@/app/_utils/colors";
import LastUpdated from "./LastUpdated";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { encodeParam } from "../_utils/url";
import BuiltBy from "./BuiltBy";

type RosterProps = {
  data: FriendResponse[];
};

const Roster = ({ data }: RosterProps) => {
  const now = DateTime.now();

  const dates = data.flatMap((friend) =>
    friend.groupings.map((grouping) =>
      DateTime.fromISO(grouping.activities.start_date),
    ),
  );
  const earliestActivity = DateTime.min(...dates) || now;
  const latestActivity = DateTime.max(...dates) || now;

  const yearsArray = Array.from(
    { length: latestActivity.year - earliestActivity.year + 1 },
    (_undefined, index) => latestActivity.year - index,
  );
  const rangeOptions = [
    ["90 days", [now.plus({ days: -90 }).startOf("day"), now.endOf("day")]],
    ["Goat", [earliestActivity.startOf("day"), latestActivity.endOf("day")]],
    ...yearsArray.map((year) => [
      `${year}`,
      [
        DateTime.fromISO(`${year}-01-01`).startOf("day"),
        DateTime.fromISO(`${year}-12-31`).endOf("day"),
      ],
    ]),
    [
      "Bike era",
      [
        DateTime.fromISO(`1920-01-01`).startOf("day"),
        DateTime.fromISO(`2020-12-31`).endOf("day"),
      ],
    ],
    [
      "Run era",
      [
        DateTime.fromISO(`2021-01-01`).startOf("day"),
        DateTime.fromISO(`2121-12-31`).endOf("day"),
      ],
    ],
  ];
  const rangeLabels = rangeOptions.map(
    (rangeOption) => rangeOption[0],
  ) as string[];

  const searchParams = useSearchParams();

  const rangeParam = searchParams.get("range");

  const [range, setRange] = useState(
    rangeLabels.find(
      (label) => label.toLowerCase() == rangeParam?.toLowerCase(),
    ) || rangeLabels[0],
  );

  const idParam = searchParams.get("id");

  useEffect(() => {
    document.getElementById(rangeLabels.at(-1) as string)?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });

    const timer = setTimeout(() => {
      document.getElementById(range)?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  const [startDate, endDate] = rangeOptions.find(
    (rangeOption) => rangeOption[0] === range,
  )?.[1] as DateTime<true>[];

  const idDenylist = (process.env.NEXT_PUBLIC_STRAVA_ID_DENYLIST || "")
    .split(", ")
    .map((string) => Number(string));
  const maxDisplayCount = 50;
  const allFriends = data
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
    .filter(({ time }) => time > 0);

  const friends = allFriends
    .filter(({ id }) => !idDenylist.includes(id))
    .slice(0, maxDisplayCount);
  const extraFriends = allFriends.length - friends.length;

  const values = friends.map((friend) => friend.time).sort();
  const minimumValue = Math.min(...values);
  const maximumValue = Math.max(...values);
  const maxWidth = 320;
  const minimumWidth = 24;
  const valueColors: ValueColors = [
    [0, [204, 120, 209]], // purple
    [3, [73, 159, 248]], // blue
    [9, [152, 228, 145]], // green
    [27, [249, 215, 73]], // yellow
  ];

  const friendSeconds = data.reduce(
    (accumulator, friend) =>
      accumulator +
      friend.groupings.reduce(
        (friendAccumulator, grouping) =>
          friendAccumulator + grouping.activities.moving_time,
        0,
      ),
    0,
  );

  const firstActivityData = data.map(({ id, name, groupings }) => ({
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

  const router = useRouter();
  const pathname = usePathname();

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
          <Link target="_blank" href={"https://labs.strava.com/roster/"}>
            <div className="my-1">
              Inspired by <span className="underline">The Roster</span> from
              Strava Labs
            </div>
          </Link>
        </div>

        <div className="my-4">
          {data.length.toLocaleString("en-US")} unique athletes,{" "}
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
                  "M/d",
                )}
              </span>
            </Link>
          </div>
        )}

        <div className="my-4">
          <LastUpdated dateTime={latestActivity as DateTime<true>} />
        </div>

        <div className="my-8 flex overflow-x-scroll no-scrollbar">
          {rangeLabels.map((rangeLabel) => (
            <div
              key={rangeLabel}
              id={rangeLabel}
              onClick={() => {
                setRange(rangeLabel);

                router.replace(
                  `${pathname}?${idParam ? `id=${idParam}&` : ""}range=${encodeParam(rangeLabel)}`,
                  {
                    scroll: false,
                  },
                );
              }}
              className={`${range === rangeLabel ? "bg-[rgb(65,121,157)] text-[rgb(253,254,255)]" : ""} mr-2 border border-[rgb(42,43,44)] rounded-md  py-1 px-2 shrink-0 flex items-center justify-center text-xs font-medium transition-all duration-700 transition-discrete`}
            >
              {rangeLabel}
            </div>
          ))}
        </div>
      </div>

      {friends.map((friend, index) => {
        const value = friend.time;

        const width =
          (100 *
            (((maxWidth - minimumWidth) / maxWidth) * (value - minimumValue))) /
          (maximumValue - minimumValue);

        const backgroundColor = getValueRgb(index, valueColors);

        return (
          <div key={index} className={"my-4"}>
            <Link
              target="_blank"
              href={`https://www.strava.com/athletes/${friend.id}`}
            >
              <div className="text-sm font-semibold">
                <span className={"opacity-50"}>{index + 1}</span> {friend.name}
                {`${friend.id}` === idParam ? " 🎉🎉🎉" : ""}
              </div>

              <div
                className={`border border-[rgb(42,43,44)] rounded-md p-1 text-right text-xs font-semibold text-[rgb(18,19,20)] transition-all duration-700 transition-discrete`}
                style={{
                  width: `calc(${minimumWidth}px + ${width}%)`,
                  backgroundColor: `rgb(${backgroundColor.join(",")})`,
                }}
              >
                {Math.floor(friend.time / 60 / 60)}
                {index === 0 ? " hours" : ""}
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

      <BuiltBy />
    </div>
  );
};

export default Roster;
