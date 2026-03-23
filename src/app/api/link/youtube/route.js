import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export async function GET(req) {
  // Redirect user to YouTube OAuth URL for linking
  // You must register your callback URL with Google
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
  }
  // Construct YouTube OAuth URL
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.YOUTUBE_CALLBACK_URL,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/youtube.readonly",
    access_type: "offline",
    state: session.user.email,
    prompt: "consent",
  });
  return Response.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}
