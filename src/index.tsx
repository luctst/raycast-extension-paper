import {  showToast, Toast, } from "@raycast/api";
import { useCallback, useEffect, useState, } from "react";
import { getConfig } from "./utils/getConfig";
import { Paper, Mode, PaperToRead } from "./types";
import { ListMode } from './components/ListMode';
import { ReadMode } from "./components/ReadMode";

export default function Command() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [paperDataRaw, setPaperDataRaw] = useState<Paper | null>(null);
  const [mode, setMode] = useState<Mode>('list');
  const [paperToRead, setPaperToRead] = useState<PaperToRead>();

  const switchModeFromList = useCallback((newMode: Mode, fileMetadata: PaperToRead ) => {
    setMode(newMode);
    setPaperToRead(fileMetadata);
  }, []);

  const switchModeFromRead = useCallback((newMode: Mode) => {
    setMode(newMode);
  }, []);

  useEffect(() => {
    const getPaper = async () => {
      const paperConfig = await getConfig();

      if (paperConfig instanceof Error) {
        showToast({
          style: Toast.Style.Failure,
          title: "Something went wrong",
          message: paperConfig.message,
        });
        return;
      }

      setPaperDataRaw(JSON.parse(paperConfig));
      setIsLoading(false);
    };

    getPaper();
  }, []);

  if (mode === 'list') return <ListMode isLoading={isLoading} paperDataRaw={paperDataRaw as Paper} switchMode={switchModeFromList}/>
  if (mode === 'read') return <ReadMode content={paperToRead as PaperToRead} switchMode={switchModeFromRead}/>
}
