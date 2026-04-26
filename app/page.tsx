"use client";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { generateShortUrl } from "./actions";
import { useState, useTransition } from "react";
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
                <div>Enter the URL you want to shorten.</div>
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
            </div>
          )}
        </FieldSet>
      </form>
    </div>
  );
}
