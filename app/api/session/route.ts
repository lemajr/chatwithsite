import { NextResponse } from "next/server";
import { ragChat } from "@/lib/rag-chat";
import { redis } from "@/lib/redis";
import { cookies } from "next/headers";

function reconstructUrl(url: string | string[] | undefined): string {
  if (!url) return "";
  if (typeof url === "string") {
    return decodeURIComponent(url);
  }
  return url.map(decodeURIComponent).join("/");
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    const reconstructedUrl = reconstructUrl(url);

    // Retrieve sessionId from cookies or use a default
    const sessionCookies = await cookies();
    const sessionCookie = sessionCookies.get("sessionId")?.value || "defaultSession";

    // Generate the session ID based on the reconstructed URL and session cookie
    const sessionId = (reconstructedUrl + "--" + sessionCookie).replace(/\//g, "");

    // Check if the reconstructed URL has already been indexed
    const isAlreadyIndexed = await redis.sismember("indexed-urls", reconstructedUrl);

    const initialMessages = await ragChat.history.getMessages({ amount: 10, sessionId });

    if (!isAlreadyIndexed) {
      await ragChat.context.add({
        type: "html",
        source: reconstructedUrl, 
        config: { chunkOverlap: 50, chunkSize: 100 }, 
      });

      // Add the reconstructed URL to the set of indexed URLs in Redis
      await redis.sadd("indexed-urls", reconstructedUrl);
    }

    return NextResponse.json({ sessionId, initialMessages });
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}