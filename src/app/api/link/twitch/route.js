import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export async function GET(req) {
  // Redirect user to Twitch OAuth URL for linking
  // You must register your callback URL with Twitch
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
  }
  // Construct Twitch OAuth URL
  const params = new URLSearchParams({
    client_id: process.env.TWITCH_CLIENT_ID,
    redirect_uri: process.env.TWITCH_CALLBACK_URL,
    response_type: "code",
    scope: "user:read:email",
    state: session.user.email,
  });
  return Response.redirect(`https://id.twitch.tv/oauth2/authorize?${params.toString()}`);
}
