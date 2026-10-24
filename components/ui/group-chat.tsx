"use client";

import * as React from "react";
import { Blobatar } from "@blobatar/react";
import type { BlobatarOptions } from "blobatar";
import { cn } from "@/lib/utils";

export type ChatMessage = {
  name: string;
  title?: string;
  text: string;
  time?: string;
};

export type GroupChatProps = {
  messages: ChatMessage[];
  channel?: string;
  members?: string[];
  extra?: number;
  typing?: string;
  blobatar?: BlobatarOptions;
  className?: string;
};

function grouped(messages: ChatMessage[]): ChatMessage[][] {
  return messages.reduce<ChatMessage[][]>((runs, message) => {
    const last = runs.at(-1);
    if (last && last[0]!.name === message.name) last.push(message);
    else runs.push([message]);
    return runs;
  }, []);
}

export function GroupChat({
  messages,
  channel,
  members,
  extra,
  typing,
  blobatar,
  className,
}: GroupChatProps) {
  const runs = grouped(messages);

  return (
    <div
      className={cn(
        "bg-card text-card-foreground border-border flex w-full flex-col rounded-xl border",
        className,
      )}
    >
      {(channel || members?.length) && (
        <div className="border-border flex items-center justify-between gap-4 border-b px-5 py-3">
          {channel ? (
            <span className="font-mono text-sm">
              <span className="text-muted-foreground">#</span> {channel}
            </span>
          ) : (
            <span />
          )}

          {members?.length ? (
            <div className="flex items-center" aria-hidden="true">
              {members.map((member) => (
                <Blobatar
                  key={member}
                  name={member}
                  background="circle"
                  className="ring-card -ml-2 size-7 rounded-full ring-2 first:ml-0"
                  {...blobatar}
                />
              ))}
              {extra ? (
                <span className="bg-accent text-muted-foreground ring-card -ml-2 grid size-7 place-items-center rounded-full font-mono text-[0.6rem] ring-2">
                  +{extra}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      )}

      <div className="flex flex-col gap-5 px-5 py-5">
        {runs.map((run) => (
          <div
            key={`${run[0]!.name}-${run[0]!.time ?? ""}-${run.length}`}
            className="flex gap-3"
          >
            <Blobatar
              name={run[0]!.name}
              title={`${run[0]!.title ?? run[0]!.name}`}
              animate="hover"
              className="size-10 shrink-0"
              {...blobatar}
            />

            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium">
                  {run[0]!.title ?? run[0]!.name}
                </span>
                {run[0]!.time ? (
                  <span className="text-muted-foreground font-mono text-[0.7rem]">
                    {run[0]!.time}
                  </span>
                ) : null}
              </div>

              <div className="mt-1 flex flex-col gap-1">
                {run.map((message) => (
                  <p
                    key={message.text}
                    className="text-muted-foreground text-sm leading-relaxed"
                  >
                    {message.text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}

        {typing ? (
          <div className="flex items-center gap-3">
            <Blobatar
              name={typing}
              className="size-10 shrink-0 opacity-50"
              {...blobatar}
            />
            <div
              aria-live="polite"
              className="text-muted-foreground flex items-center gap-2 text-xs"
            >
              {typing} is typing
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default GroupChat;
