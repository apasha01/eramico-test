import Link from "next/link";
import React, { Children } from "react";

export default function HashtagHighlighter(props: {
  text: string;
  hashtagUrl: string;
  bolder?: boolean;
}) {
  const OriginalText = props.text;
  const OriginalTextList = props.text.split(" ");
  const hashtagList: string[] = OriginalTextList.filter((x) => x.includes("#"));
  return (
    <div className={props.bolder ? "fw-bold" : ""}>
      {OriginalTextList.map((x) =>
        hashtagList.includes(x) ? (
          <Link
            key={x}
            className={props.bolder ? "fw-bolder" : "fw-bolder"}
            style={{ color: "#0068FF" }}
            href={props.hashtagUrl + x.replace("#", "")}
          >
            {x + " "}
          </Link>
        ) : (
          x + " "
        )
      )}
    </div>
  );
}
