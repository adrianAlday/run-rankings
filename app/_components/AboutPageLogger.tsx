import { headers } from "next/headers";
import ClientLogger from "./ClientLogger";

const AboutPageLogger = async () => {
  const resolvedHeaders = await headers();
  const host = resolvedHeaders.get("host");

  const message = `👋 Hey! Check out https://${host}/about`;

  return <ClientLogger message={message} />;
};

export default AboutPageLogger;
