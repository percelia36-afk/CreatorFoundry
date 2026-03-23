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
  const email = session.user.email;
  const userRes = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  const user = userRes.rows[0];
  const result = await pool.query(
    `SELECT
       MAX(CASE WHEN platform = 'youtube' THEN external_account_id END) AS youtube_id,
       MAX(CASE WHEN platform = 'twitch' THEN external_account_id END) AS twitch_id
     FROM linked_accounts
     WHERE auth_user_id = $1`,
    [user.auth_user_id],
  );
  return new Response(JSON.stringify(result.rows[0]), { status: 200 });
}
