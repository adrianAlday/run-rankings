"use client";

import { DateTime } from "luxon";
import { FriendResponse } from "../friends/page";
import { useState } from "react";
import Link from "next/link";
import { getValueRgb, ValueColors } from "@/utils/colors";
import LastUpdated from "./LastUpdated";

type RosterProps = {
  data: FriendResponse[];
};

const Roster = ({ data }: RosterProps) => {
  const today = DateTime.now().endOf("day");

  const dates = data.flatMap((friend) =>
    friend.groupings.map((grouping) =>
      DateTime.fromISO(grouping.activities.start_date),
    ),
  );
  const earliestActivity = DateTime.min(...dates) as DateTime<true>;
  const latestActivity = DateTime.max(...dates) as DateTime<true>;

  const yearsArray = Array.from(
    { length: latestActivity.year - earliestActivity.year + 1 },
    (_undefined, index) => latestActivity.year - index,
  );
  const rangeOptions = [
    ["90 days", [today.plus({ days: -90 }).startOf("day"), today]],
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

  const [range, setRange] = useState("90 days");

  const [startDate, endDate] = rangeOptions.find(
    (rangeOption) => rangeOption[0] === range,
  )?.[1] as DateTime<true>[];

  const idDenylist = (process.env.NEXT_PUBLIC_STRAVA_ID_DENYLIST || "")
    .split(", ")
    .map((string) => Number(string));
  const maxDisplayCount = 50;
  const friends = data
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
    .filter(({ time, id }) => time / 60 / 60 > 1 && !idDenylist.includes(id))
    .slice(0, maxDisplayCount);

  const values = friends.map((friend) => friend.time).sort();
  const minimumValue = Math.min(...values);
  const maximumValue = Math.max(...values);
  const maxWidth = 320;
  const minimumWidth = 24;
  const valueColors: ValueColors = [
    [0, [73, 159, 248]], // blue
    [8, [152, 228, 145]], // green
    [24, [249, 215, 73]], // yellow
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
  )[0].firstActivity;
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
              {DateTime.fromISO(latestFirstActivity.start_date).toFormat("M/d")}
            </span>
          </Link>
        </div>

        <div className="my-4">
          <LastUpdated dateTime={latestActivity} />
        </div>

        <div className="my-8 flex overflow-x-scroll no-scrollbar">
          {rangeLabels.map((rangeLabel) => (
            <div
              key={rangeLabel}
              onClick={() => {
                setRange(rangeLabel);
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
    </div>
  );
};

export default Roster;
