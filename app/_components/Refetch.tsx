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

  return <button onClick={refetch}>Refetch</button>;
};

export default Refetch;
