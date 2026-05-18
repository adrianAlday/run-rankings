"use client";

import { isDev } from "@/utils/isDev";
import axios from "axios";

const Refetch = () => {
  const refetch = async () => {
    const response = await axios
      .get("/api/shoes/refetch", {
        headers: { Authorization: `Bearer ${process.env.VERCEL_CRON_SECRET!}` },
      })
      .then((response) => response);

    if (isDev) {
      console.log("response", response);
    }
  };

  return (
    <button onClick={refetch} className="cursor-pointer">
      <div className="my-8 text-[rgb(147,148,149)]">⚠️ Refetch</div>
    </button>
  );
};

export default Refetch;
