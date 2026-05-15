import { isDev } from "@/utils/isDev";
import { createClient } from "@/utils/supabase/server";
import axios from "axios";
import { NextResponse } from "next/server";

const typeProductIds = {
  road: 40586, // Adidas Adizero EVO SL
  trail: 40863, // Saucony Xodus Ultra 4
};

const testIds = [
  68, // Shock absorption forefoot
  67, // Shock absorption heel
  66, // Energy return forefoot
  65, // Energy return heel
  13, // Midsole softness in cold (%)
  24, // Weight
  52, // Price
];

const getTestData = async (
  typeProductId: number,
  testId: number,
): Promise<{
  headers: string[];
  rows: { [key: string]: string | number }[][];
}> => {
  await new Promise((resolve) => setTimeout(resolve, 6 * 1000));

  const url = `https://api.runrepeat.com/api/product/lab-test-list/${testId}?product_id=${typeProductId}`;

  if (isDev) {
    console.log(url);
  }

  return await axios({
    method: "get",
    url,
  })
    .then((response) => {
      return response.data;
    })
    .catch(async (error) => {
      console.log(error);

      await new Promise((resolve) => setTimeout(resolve, 60 * 1000));

      return await getTestData(typeProductId, testId);
    });
};

export const GET = async (request: Request) => {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!isDev) {
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }
  }

  const shoeData: { [key: string]: { [key: string]: string | number } } = {};

  for (const [type, typeProductId] of Object.entries(typeProductIds)) {
    for (const testId of testIds) {
      const testData = await getTestData(typeProductId, testId);

      const testName = testData.headers[0];

      for (const shoeTest of testData.rows) {
        const shoeName = shoeTest[1].text;

        shoeData[shoeName] = {
          ...shoeData[shoeName],
          type,
          name: shoeName,
          url: shoeTest[1].url,
          [testName]: shoeTest[0].value,
        };
      }
    }
  }

  for (const shoeName of Object.keys(shoeData)) {
    for (const footPart of ["forefoot", "heel"]) {
      if (
        shoeData[shoeName][`Shock absorption ${footPart}`] &&
        shoeData[shoeName][`Energy return ${footPart}`]
      ) {
        shoeData[shoeName][`Energy returned ${footPart}`] =
          ((shoeData[shoeName][`Shock absorption ${footPart}`] as number) *
            (shoeData[shoeName][`Energy return ${footPart}`] as number)) /
          100;
      }

      if (
        shoeData[shoeName][`Shock absorption ${footPart}`] &&
        shoeData[shoeName]["Midsole softness in cold (%)"]
      ) {
        shoeData[shoeName][`Cold shock absorption ${footPart}`] =
          ((shoeData[shoeName][`Shock absorption ${footPart}`] as number) *
            100) /
          (100 +
            (shoeData[shoeName]["Midsole softness in cold (%)"] as number));
      }

      if (
        shoeData[shoeName][`Energy returned ${footPart}`] &&
        shoeData[shoeName]["Midsole softness in cold (%)"]
      ) {
        shoeData[shoeName][`Cold energy returned ${footPart}`] =
          ((shoeData[shoeName][`Energy returned ${footPart}`] as number) *
            100) /
          (100 +
            (shoeData[shoeName]["Midsole softness in cold (%)"] as number));
      }
    }
  }

  const values = Object.values(shoeData).sort((a, b) =>
    a.type === "road" && b.type === "road"
      ? ((b["Cold energy returned forefoot"] as number) || 0) -
        ((a["Cold energy returned forefoot"] as number) || 0)
      : a.type === "trail" && b.type === "trail"
        ? ((b["Cold shock absorption forefoot"] as number) || 0) -
          ((a["Cold shock absorption forefoot"] as number) || 0)
        : (a.type as string).localeCompare(b.type as string),
  );

  const supabase = await createClient();
  const insertResponse = await supabase.from("shoes").upsert(
    values.map((value) => {
      const {
        Weight: weight,
        Price: price,
        "Shock absorption forefoot": shock_absorption_fore,
        "Shock absorption heel": shock_absorption_heel,
        "Energy return forefoot": energy_return_fore,
        "Energy return heel": energy_return_heel,
        "Midsole softness in cold (%)": cold_softness,
        "Energy returned forefoot": energy_returned_fore,
        "Energy returned heel": energy_returned_heel,
        "Cold energy returned forefoot": cold_energy_returned_fore,
        "Cold energy returned heel": cold_energy_returned_feel,
        "Cold shock absorption forefoot": cold_shock_absorption_fore,
        "Cold shock absorption heel": cold_shock_absorption_heel,
        ...rest
      } = value;

      return {
        weight,
        price,
        shock_absorption_fore,
        shock_absorption_heel,
        energy_return_fore,
        energy_return_heel,
        cold_softness,
        energy_returned_fore,
        energy_returned_heel,
        cold_energy_returned_fore,
        cold_energy_returned_feel,
        cold_shock_absorption_fore,
        cold_shock_absorption_heel,
        ...rest,
      };
    }),
    { onConflict: "name" },
  );

  if (isDev) {
    console.log(insertResponse);
  }

  return NextResponse.json({});
};
