import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DB_CONN });

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: "Not authenticated" }), {
      status: 401,
    });
  }
  // Example: fetch Twitch stats for user
  // Implement as needed
  return new Response(JSON.stringify({ message: "Twitch endpoint" }), {
    status: 200,
  });
}
