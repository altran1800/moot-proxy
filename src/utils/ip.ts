export default function ip(event: any) {
  return event.node?.req?.headers['x-forwarded-for'] || '127.0.0.1';
}
