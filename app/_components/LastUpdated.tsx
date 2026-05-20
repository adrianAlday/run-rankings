"use client";

import { DateTime } from "luxon";
import Link from "next/link";

type LastUpdatedProps = { iso?: string; dateTime?: DateTime<true> };

const LastUpdated = ({ dateTime, iso }: LastUpdatedProps) => {
  const [updatedDayOfWeek, updatedLocalTime] = (
    dateTime || DateTime.fromISO(iso as string)
  )
    .setZone("system")
    .toFormat("EEEE,t")
    .split(",");

  return (
    <Link
      target="_blank"
      href={"https://github.com/adrianAlday/run-rankings/blob/main/vercel.json"}
    >
      <div>
        Updated {updatedDayOfWeek},{" "}
        <span className="underline">{updatedLocalTime}</span>
      </div>
    </Link>
  );
};

export default LastUpdated;
