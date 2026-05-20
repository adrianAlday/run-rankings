"use client";

import { isDev } from "@/utils/isDev";
import axios from "axios";

type RefetchProps = { url: string };

const Refetch = ({ url }: RefetchProps) => {
  const refetch = async () => {
    const response = await axios
      .get(url)
      .then((response) => response)
      .catch(async (error) => {
        console.log(error);
      });

    if (isDev) {
      console.log("response", response);
    }
  };

  return (
    isDev && (
      <button onClick={refetch} className="cursor-pointer">
        <div>refetch</div>
      </button>
    )
  );
};

export default Refetch;
