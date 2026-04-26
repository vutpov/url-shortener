import { UrlShortenObject } from "@/types/url-object";
import { getUrl, setUrl } from "@/lib/url-store";

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
}

export async function POST(req: Request) {
  const body = await req.json();
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
    message: "Short URL generated successfully",
    data: urlObject,
  };
  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
