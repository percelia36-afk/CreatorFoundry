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
  // Example: fetch YouTube stats for user
  // Implement as needed
  return new Response(JSON.stringify({ message: "YouTube endpoint" }), {
    status: 200,
  });
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: "Not authenticated" }), {
      status: 401,
    });
  }
  // Parse video data from request
  const { title, description, videoBase64, accessToken } = await req.json();
  if (!title || !videoBase64 || !accessToken) {
    return new Response(
      JSON.stringify({ message: "Missing required fields" }),
      { status: 400 },
    );
  }
  // Upload video to YouTube
  try {
    // Step 1: Initiate resumable upload
    const initiateRes = await fetch(
      "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          snippet: { title, description },
          status: { privacyStatus: "private" },
        }),
      },
    );
    if (!initiateRes.ok) {
      const err = await initiateRes.text();
      return new Response(
        JSON.stringify({ message: "Failed to initiate upload", error: err }),
        { status: 500 },
      );
    }
    const uploadUrl = initiateRes.headers.get("location");
    if (!uploadUrl) {
      return new Response(
        JSON.stringify({ message: "No upload URL returned" }),
        { status: 500 },
      );
    }
    // Step 2: Upload video data
    const videoBuffer = Buffer.from(videoBase64, "base64");
    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Length": videoBuffer.length,
        "Content-Type": "video/*",
      },
      body: videoBuffer,
    });
    if (!uploadRes.ok) {
      const err = await uploadRes.text();
      return new Response(
        JSON.stringify({ message: "Failed to upload video", error: err }),
        { status: 500 },
      );
    }
    const result = await uploadRes.json();
    return new Response(JSON.stringify({ message: "Video uploaded", result }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Upload error", error: error.message }),
      { status: 500 },
    );
  }
}
