"use client";
import QRCode from "qrcode";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { generateShortUrl } from "./actions";
import { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UrlShortenObject } from "@/types/url-object";

const schema = z.object({
  longUrl: z.url("Please enter a valid URL"),
});

type Inputs = z.infer<typeof schema>;

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      longUrl: "",
    },
  });

  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{
    message: string;
    data: UrlShortenObject;
  } | null>(null);

  useEffect(() => {
    if (result) {
      QRCode.toCanvas(
        document.getElementById("qrcode") as HTMLCanvasElement,
        `${window.location.origin}/${result.data.shortUrl}`,
      );
    }
  }, [result]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    startTransition(async () => {
      const result = await generateShortUrl(data);
      setResult(result);
    });
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-sm w-full mx-auto"
      >
        <FieldSet className="w-full">
          <FieldGroup className="w-full">
            <Field>
              <FieldLabel htmlFor="longUrl">Long URL</FieldLabel>
              <Input
                id="longUrl"
                // autoComplete="off"
                placeholder="https://example.com"
                {...register("longUrl", { required: true })}
              />
              <FieldDescription className="text-sm flex">
                <>Enter the URL you want to shorten.</>
              </FieldDescription>
              {errors.longUrl && (
                <span className="text-red-500">{errors.longUrl.message}</span>
              )}
            </Field>
          </FieldGroup>

          <Button variant="outline" type="submit" disabled={isPending}>
            {isPending ? "Shortening..." : "Shorten URL"}
          </Button>

          {result && (
            <div className="mt-4 p-4 bg-green-100 rounded">
              <p className="text-green-600">{result.message}</p>
              <a
                href={result.data.longUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline"
              >
                {`${window.location.origin}/${result.data.shortUrl}`}
              </a>
              <div className="mt-2 flex flex-col items-center">
                <canvas id="qrcode" className="block"></canvas>

                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => {
                    const canvas = document.getElementById(
                      "qrcode",
                    ) as HTMLCanvasElement;
                    const pngUrl = canvas
                      .toDataURL("image/png")
                      .replace("image/png", "image/octet-stream");
                    const downloadLink = document.createElement("a");
                    downloadLink.href = pngUrl;
                    downloadLink.download = `${result.data.shortUrl}.png`;
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                  }}
                >
                  Download QR Code
                </Button>
              </div>
            </div>
          )}
        </FieldSet>
      </form>
    </div>
  );
}
