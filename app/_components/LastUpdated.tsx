"use client";

import { DateTime } from "luxon";
import Link from "next/link";

type LastUpdatedProps = { isoString: string };

const LastUpdated = ({ isoString }: LastUpdatedProps) => {
  const [updatedDayOfWeek, updatedLocalTime] = DateTime.fromISO(isoString)
    .setZone("system")
    .toFormat("EEEE,t")
    .split(",");

  return (
    <Link
      target="_blank"
      href={"https://github.com/adrianAlday/run-rankings/blob/main/vercel.ts"}
    >
      <div>
        Auto updated{" "}
        <span className="underline">
          {updatedDayOfWeek} {updatedLocalTime}
        </span>
      </div>
    </Link>
  );
};

export default LastUpdated;
