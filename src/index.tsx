import { showToast, Toast } from "@raycast/api";
import { useCallback, useEffect, useState, useMemo } from "react";
import { getConfig } from "./utils/getConfig";
import { Mode, SwitchMode, PaperDataSwitchMode, PaperRawData, Paper } from "./types";
import { ListMode } from "./components/ListMode";
import { ReadMode } from "./components/ReadMode";
import { EditMode } from "./components/EditMode";
import { encode } from "./utils/base64";
import { updateConfigFile } from "./utils/updateConfigFile";

export default function Command() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [paperDataRaw, setPaperDataRaw] = useState<PaperRawData | null>(null);
  const [mode, setMode] = useState<Mode>("list");
  const [paperToRead, setPaperToRead] = useState<PaperDataSwitchMode>();

  const switchMode: SwitchMode = useCallback((newMode, paperDatas) => {
    setMode(newMode);
    setPaperToRead(paperDatas);
  }, []);

  const getCategories = useMemo(() => {
    if (!paperDataRaw) return [];
    return Object.keys(paperDataRaw).map((key) => key.charAt(0).toUpperCase() + key.slice(1));
  }, [paperDataRaw]);

  const onSubmit: (
    paperData: Paper & { category: string | undefined },
    oldCategory: string,
    index: number,
  ) => Promise<void> = useCallback(
    async (paperData, oldCategory, index) => {
      const toast = await showToast({
        style: Toast.Style.Animated,
        title: "Updating..",
      });

      try {
        if (!paperDataRaw) return;
        if (paperData.category === undefined) return;

        const objFormated: Paper = {
          name: paperData.name,
          description: paperData.description || "",
          content: encode(paperData.content),
          createdAt: new Date(paperData.createdAt).getTime(),
        };
        const newPaperRawData = { ...paperDataRaw };

        if (paperData.category !== oldCategory) {
          newPaperRawData[oldCategory].papers.splice(index, 1);
          newPaperRawData[paperData.category].papers.push(objFormated);

          const newConfigFile = await updateConfigFile(newPaperRawData);

          setPaperDataRaw(JSON.parse(newConfigFile as string));
          setMode('list');

          toast.style = Toast.Style.Success;
          toast.message = 'Success';

          return;
        }

        newPaperRawData[paperData.category].papers[index] = { ...objFormated };

        const newConfigFile = await updateConfigFile(newPaperRawData);

        setPaperDataRaw(JSON.parse(newConfigFile as string));
        setMode('list');

        toast.style = Toast.Style.Success;
        toast.message = 'Success';
      } catch (error) {
        toast.style = Toast.Style.Failure;
        toast.title = "Oups.. An error occured, please try again";
      }
    },
    [paperDataRaw],
  );

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

  if (paperDataRaw === null) return null;

  if (mode === "list")
    return (
      <ListMode isLoading={isLoading} paperDataRaw={paperDataRaw} switchMode={switchMode} categories={getCategories} />
    );
  if (mode === "read") return <ReadMode paperDatas={paperToRead as PaperDataSwitchMode} switchMode={switchMode} />;
  if (mode === "edit")
    return (
      <EditMode
        paperDatas={paperToRead as PaperDataSwitchMode}
        switchMode={switchMode}
        categories={getCategories}
        onSubmit={onSubmit}
      />
    );
}
