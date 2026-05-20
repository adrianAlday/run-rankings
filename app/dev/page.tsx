import { isDev } from "@/utils/isDev";
import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

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
      <div>Friends</div>

      <Link
        target="_blank"
        href={
          `http://www.strava.com/oauth/authorize?` +
          `&response_type=code` +
          `&client_id=${process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID}` +
          `&scope=activity:read` +
          `&redirect_uri=http://${host}/api/dev/get-activities` +
          `&state=${referer}`
        }
      >
        <div>get activities</div>
      </Link>

      <Link target="_blank" href={`http://${host}/api/dev/get-groupings`}>
        <div>get groupings</div>
      </Link>
    </div>
  );
};

export default DevPage;
