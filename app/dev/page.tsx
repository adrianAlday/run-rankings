import { isDev } from "@/app/_utils/isDev";
import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

type DevButtonProps = {
  url: string;
  text: string;
};

const DevButton = ({ url, text }: DevButtonProps) => (
  <button>
    <Link target="_blank" href={url}>
      <div>{text}</div>
    </Link>
  </button>
);

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
    <div className="flex flex-col gap-4">
      <div>Shoes</div>

      <DevButton url={"/api/shoes/refetch"} text={"shoes refetch"} />

      <div>Friends</div>

      <DevButton
        url={
          `http://www.strava.com/oauth/authorize?` +
          `&response_type=code` +
          `&client_id=${process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID}` +
          `&scope=activity:read_all` +
          `&redirect_uri=http://${host}/api/dev/get-activities` +
          `&state=${referer}`
        }
        text={"get activities"}
      />

      <DevButton url={"/api/friends/get-groupings"} text={"get groupings"} />

      <DevButton url={"/api/friends/refetch"} text={"friends refetch"} />
    </div>
  );
};

export default DevPage;
