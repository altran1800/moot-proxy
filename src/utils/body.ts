export default async function body(event: any) {
  if (event.node?.req) {
    const chunks: Uint8Array[] = [];
    for await (const chunk of event.node.req) {
      chunks.push(chunk);
    }
    const raw = Buffer.concat(chunks).toString();
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }
  return {};
}
