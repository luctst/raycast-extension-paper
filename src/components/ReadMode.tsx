import {  Detail } from "@raycast/api";
import { FC, useEffect, useState } from "react";
import { decode } from "../utils/base64";
import { Paper } from "../types";
import { Actions } from "./Actions";

type ReadModeProps = {
  paper: Paper
};

export const ReadMode: FC<ReadModeProps> = ({ paper }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [markdown, setMarkdown] = useState<string>("");

  useEffect(() => {
    setMarkdown(decode(paper.content));
    setIsLoading(false);
  }, []);

  return (
    <Detail
      isLoading={isLoading}
      markdown={markdown}
      navigationTitle={paper.name}
      actions={<Actions mode="read"/>}
    />
  );
}

ReadMode.displayName = "ReadMode";
