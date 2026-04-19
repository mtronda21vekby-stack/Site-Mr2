export async function GET() {
  const content = `User-agent: *\nAllow: /`;
  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}