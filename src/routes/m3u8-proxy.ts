export default async function m3u8Handler(event: any) {
  try {
    console.log("M3U8 proxy event:", event);
    return {
      status: 200,
      body: { message: "M3U8 proxy working" }
    };
  } catch (err: any) {
    console.error("Error in m3u8-proxy:", err);
    throw err;
  }
}
