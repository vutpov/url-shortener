"use server";
import { UrlShortenObject } from "@/types/url-object";

export async function generateShortUrl(data: { longUrl: string }) {
  const result = await fetch(`${process.env.BASE_URL}/api`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!result.ok) {
    throw new Error(await result.text());
  }
  return (await result.json()) as { message: string; data: UrlShortenObject };
}
