import { headers } from "next/headers";
import ClientLogger from "./ClientLogger";
import { isDev } from "../_utils/isDev";

const AboutPageLogger = async () => {
  const resolvedHeaders = await headers();
  const host = resolvedHeaders.get("host");

  const message = `👋 Hey! Check out https://${host}/about`;

  return isDev ? null : <ClientLogger message={message} />;
};

export default AboutPageLogger;
