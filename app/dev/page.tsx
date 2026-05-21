import { isDev } from "@/utils/isDev";
import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import Refetch from "../_components/Refetch";

export const metadata: Metadata = {
  title: "Dev",
};

const DevPage = async () => {
  if (!isDev) {
    redirect("/");
  }

  const resolvedHeaders = await headers();
  const host = resolvedHeaders.get("host");
  const referer = resolvedHeaders.get("referer");

  return (
    <div>
      <div>Shoes</div>

      <Refetch url={"/api/shoes/refetch"} />

      <div>Friends</div>

      <Link
        target="_blank"
        href={
          `http://www.strava.com/oauth/authorize?` +
          `&response_type=code` +
          `&client_id=${process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID}` +
          `&scope=activity:read_all` +
          `&redirect_uri=http://${host}/api/dev/get-activities` +
          `&state=${referer}`
        }
      >
        <div>get activities</div>
      </Link>

      <Link target="_blank" href={"/api/friends/get-groupings"}>
        <div>get groupings</div>
      </Link>

      <Refetch url={"/api/friends/refetch"} />
    </div>
  );
};

export default DevPage;
