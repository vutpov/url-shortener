import { UrlShortenObject } from "@/types/url-object";
import { getUrl, setUrl } from "@/lib/url-store";
import { ratelimit } from "@/lib/ratelimit";

type ResponseData = {
  message: string;
  data?: UrlShortenObject;
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const shortUrl = url.searchParams.get("shortUrl");
  if (!shortUrl) {
    return new Response(
      JSON.stringify({ message: "shortUrl query parameter is required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const urlObject = await getUrl(shortUrl);
  if (!urlObject) {
    return new Response(JSON.stringify({ message: "Short URL not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  const { longUrl } = body;
  if (!longUrl) {
    return new Response(
      JSON.stringify({ message: "longUrl is required in the request body" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const shortUrl = Math.random().toString(36).substring(2, 8);
  const urlObject = await setUrl(shortUrl, longUrl);
  const result: ResponseData = {
    message: "Short URL generated successfully. It will expire in 24 hours.",
    data: urlObject,
  };
  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
