import m3u8Handler from "./m3u8-proxy.js";

export default async function tsHandler(event: any) {
  try {
    console.log("TS proxy event:", event);

    if (event.path.includes("/m3u8")) {
      await m3u8Handler(event);
    }
  } catch (err: any) {
    console.error("Error in ts-proxy:", err);
    throw err;
  }
}
