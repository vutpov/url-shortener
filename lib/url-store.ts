import { UrlShortenObject } from "@/types/url-object";
import Redis from "./redis";

const NAMESPACE = "url-shortener";

const DURATION = 60 * 60 * 24; // 24 hours in seconds

export const setUrl = async (shortUrl: string, longUrl: string) => {
  const urlObject: UrlShortenObject = {
    longUrl,
    createdAt: new Date(),
    shortUrl,
  };
  const data = JSON.stringify(urlObject);
  await Redis.set(`${NAMESPACE}:${shortUrl}`, data, {
    ex: DURATION,
  });
  return urlObject;
};

export const getUrl = async (
  shortUrl: string,
): Promise<UrlShortenObject | null> => {
  const data = await Redis.get(`${NAMESPACE}:${shortUrl}`);
  if (!data) return null;
  const result = JSON.parse(data as string);
  return result as UrlShortenObject;
};
