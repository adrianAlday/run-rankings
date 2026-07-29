import { Metadata } from "next";
import Rotation from "../_components/Rotation";

export type Shoe = {
  id: number;
  brand_name: string;
  model_name: string;
  total_distance: string;
};

export const metadata: Metadata = {
  title: "Rotation - Run Rankings",
};

export const revalidate = 3600; // 60 * 60;

const RotationPage = async () => {
  const data = await fetch(
    `https://www.strava.com/athletes/${process.env.NEXT_PUBLIC_STRAVA_ID}/gear/shoes`,
    {
      headers: {
        cookie: (process.env.STRAVA_COOKIE as string).replace(
          /^['"]+|\*+['"]+$/g,
          "",
        ),
      },
      next: { revalidate },
    },
  ).then(async (response) => await response.json());

  return (
    <main>
      <Rotation data={data} />
    </main>
  );
};

export default RotationPage;
