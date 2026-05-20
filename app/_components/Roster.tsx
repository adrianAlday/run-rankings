"use client";

import { DateTime } from "luxon";
import { FriendResponse } from "../friends/page";
import { useState } from "react";
import Link from "next/link";
import { getValueRgb, ValueColors } from "@/utils/colors";

type RosterProps = {
  data: FriendResponse[];
};

const Roster = ({ data }: RosterProps) => {
  const today = DateTime.now().endOf("day");
  const ninetyDayAgo = today.plus({ days: -90 }).startOf("day");

  const [startDate, setStartDate] = useState(ninetyDayAgo);
  const [endDate, setEndDate] = useState(today);

  const dates = data.flatMap((friend) =>
    friend.groupings.map((grouping) =>
      DateTime.fromISO(grouping.activities.start_date),
    ),
  );
  const earliestActivity = DateTime.min(...dates) as DateTime<true>;
  const latestActivity = DateTime.max(...dates) as DateTime<true>;

  const yearButtons = [];
  for (
    let year = earliestActivity?.year;
    year < latestActivity?.year + 1;
    year++
  ) {
    yearButtons.push(
      <div
        key={year}
        onClick={() => {
          setStartDate(
            DateTime.fromISO(`${year}-01-01`).startOf("day") as DateTime<true>,
          );
          setEndDate(
            DateTime.fromISO(`${year}-12-31`).endOf("day") as DateTime<true>,
          );
        }}
        className="shrink-0 px-1"
      >
        {year}
      </div>,
    );
  }

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
    [values.at(-8) || 0, [249, 215, 73]], // yellow
    [values.at(-4) || 0, [152, 228, 145]], // green
    [values.at(-2) || 0, [73, 159, 248]], // blue
  ];

  return (
    <div>
      <div>
        Funnest friends based on how much time we log on Strava together
      </div>

      <div>
        Inspired by the Strava Labs Roster https://labs.strava.com/roster/
      </div>

      <div className="flex overflow-x-scroll no-scrollbar">
        <div
          onClick={() => {
            setStartDate(ninetyDayAgo);
            setEndDate(today);
          }}
          className="shrink-0 px-1"
        >
          90 days
        </div>

        <div
          onClick={() => {
            setStartDate(earliestActivity.startOf("day"));
            setEndDate(latestActivity.endOf("day"));
          }}
          className="shrink-0 px-1"
        >
          All-time
        </div>

        {yearButtons.reverse()}
      </div>

      {friends.map((friend, index) => {
        const value = friend.time;

        const width =
          (100 *
            (((maxWidth - minimumWidth) / maxWidth) * (value - minimumValue))) /
          (maximumValue - minimumValue);

        const backgroundColor = getValueRgb(value, valueColors);

        return (
          <div key={friend.id} className={"my-4"}>
            <Link
              target="_blank"
              href={`https://www.strava.com/athletes/${friend.id}`}
            >
              <div className="text-sm font-semibold">
                <span className={"opacity-50"}>{index + 1}</span> {friend.name}
              </div>

              <div
                className={`border border-[rgb(42,43,44)] rounded-md p-1 text-right text-xs font-semibold text-[rgb(18,19,20)]`}
                style={{
                  width: `calc(${minimumWidth}px + ${width}%)`,
                  backgroundColor: `rgb(${backgroundColor.join(",")})`,
                }}
              >
                {Math.round(friend.time / 60 / 60)}
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
