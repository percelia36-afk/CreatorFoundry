import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: "Not authenticated" }), {
      status: 401,
    });
  }
  // ...existing logic for link/twitch...
  return new Response(JSON.stringify({ message: "Link Twitch endpoint" }), {
    status: 200,
  });
}
