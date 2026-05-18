"use client";

import { DateTime } from "luxon";
import Link from "next/link";

type LastUpdatedProps = { lastUpdated: string };

const LastUpdated = ({ lastUpdated }: LastUpdatedProps) => {
  const [updatedDayOfWeek, updatedLocalTime] = DateTime.fromISO(lastUpdated)
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
