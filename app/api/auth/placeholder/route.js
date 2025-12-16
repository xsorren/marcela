export const dynamic = 'force-static';

export async function GET() {
  return new Response(JSON.stringify({ placeholder: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
} 