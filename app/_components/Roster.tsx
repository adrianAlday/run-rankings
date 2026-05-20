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
        className={
          "mr-2 border border-[rgb(42,43,44)] rounded-md bg-[rgb(65,121,157)] py-1 px-2 shrink-0 flex items-center justify-center text-xs text-[rgb(253,254,255)] font-medium"
        }
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

  const labsRosterUrl = "https://labs.strava.com/roster/";

  return (
    <div>
      <div className="my-8 text-xs">
        <div className="my-4">
          Funnest friends ...based on how much time we log on Strava together
        </div>

        <div className="my-4">
          <Link target="_blank" href={labsRosterUrl}>
            <div>
              <div className="my-1">Inspired by the Strava Labs Roster</div>

              <div className="my-1 underline">{labsRosterUrl}</div>
            </div>
          </Link>
        </div>

        <div className="my-8 flex overflow-x-scroll no-scrollbar">
          <div
            onClick={() => {
              setStartDate(ninetyDayAgo);
              setEndDate(today);
            }}
            className={
              "mr-2 border border-[rgb(42,43,44)] rounded-md bg-[rgb(65,121,157)] py-1 px-2 shrink-0 flex items-center justify-center text-xs text-[rgb(253,254,255)] font-medium"
            }
          >
            90 days
          </div>

          <div
            onClick={() => {
              setStartDate(earliestActivity.startOf("day"));
              setEndDate(latestActivity.endOf("day"));
            }}
            className={
              "mr-2 border border-[rgb(42,43,44)] rounded-md bg-[rgb(65,121,157)] py-1 px-2 shrink-0 flex items-center justify-center text-xs text-[rgb(253,254,255)] font-medium"
            }
          >
            All-time
          </div>

          {yearButtons.reverse()}
        </div>
      </div>

      {friends.map((friend, index) => {
        const value = friend.time;

        const width =
          (100 *
            (((maxWidth - minimumWidth) / maxWidth) * (value - minimumValue))) /
          (maximumValue - minimumValue);

        const backgroundColor = getValueRgb(value, valueColors);

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
