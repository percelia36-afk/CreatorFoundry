import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DB_CONN });

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  if (!code || !state) {
    return NextResponse.json({ message: "Missing code or state" }, { status: 400 });
  }
  // Exchange code for tokens and get YouTube user info (pseudo-code, implement real fetch)
  // const youtubeUser = await fetchYouTubeUser(code);
  const youtubeId = "mocked-youtube-id"; // Replace with real ID
  const email = state;
  // Check if already linked
  const userRes = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  if (!userRes.rows.length) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  const authUserId = userRes.rows[0].auth_user_id;
  const exists = await pool.query(
    "SELECT 1 FROM linked_accounts WHERE auth_user_id = $1 AND platform = 'youtube'",
    [authUserId]
  );
  if (exists.rows.length) {
    return NextResponse.json({ message: "YouTube already linked" }, { status: 409 });
  }
  // Insert new link
  await pool.query(
    `INSERT INTO linked_accounts (auth_user_id, platform, external_account_id) VALUES ($1, 'youtube', $2)`,
    [authUserId, youtubeId]
  );
  return NextResponse.json({ message: "YouTube linked" });
}
