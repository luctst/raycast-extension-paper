import { showToast, Toast, confirmAlert, Alert } from "@raycast/api";
import { useCallback, useEffect, useState, useMemo } from "react";
import { getConfig } from "./utils/getConfig";
import { Mode, SwitchMode, PaperDataSwitchMode, PaperRawData, Paper, CategoryToUpdate, Base64 } from "./types";
import { ListMode } from "./components/ListMode";
import { ReadMode } from "./components/ReadMode";
import { EditMode } from "./components/EditMode";
import { CreateCategory } from "./components/CreateCategory";
import { encode } from "./utils/base64";
import { updateConfigFile } from "./utils/updateConfigFile";
import { UpdateCategory } from "./components/UpdateCategory";
import { DeleteCategory } from "./components/DeleteCategory";
import { CreatePaper } from "./components/CreatePaper";

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
          setMode("list");

          toast.style = Toast.Style.Success;
          toast.title = "Success";

          return;
        }

        newPaperRawData[paperData.category].papers[index] = { ...objFormated };

        const newConfigFile = await updateConfigFile(newPaperRawData);

        setPaperDataRaw(JSON.parse(newConfigFile as string));
        setMode("list");

        toast.style = Toast.Style.Success;
        toast.title = "Success";
      } catch (error) {
        toast.style = Toast.Style.Failure;
        toast.title = "Oups.. An error occured, please try again";
      }
    },
    [paperDataRaw],
  );

  const onSubmitCategory = useCallback(
    async (values: CategoryToUpdate) => {
      const toast = await showToast({
        style: Toast.Style.Animated,
        title: "Create new category..",
      });

      if (values.category.toLowerCase().trim() === "deleted") {
        toast.style = Toast.Style.Failure;
        toast.title = `Deleted is a special category which is created when you delete papers or category`;
        return;
      }

      if (getCategories.includes(values.category.charAt(0).toUpperCase() + values.category.slice(1))) {
        toast.style = Toast.Style.Failure;
        toast.title = `${values.category} already exist`;
        return;
      }

      try {
        const newPaperRawData = { ...paperDataRaw };

        newPaperRawData[values.category.toLowerCase()] = {
          color: values.color,
          papers: [],
        };

        const newConfigFile = await updateConfigFile(newPaperRawData);
        setPaperDataRaw(JSON.parse(newConfigFile as string));
        setMode("list");

        toast.style = Toast.Style.Success;
        toast.title = "New Category Created";
      } catch (error) {
        toast.style = Toast.Style.Failure;
        toast.title = "Oups.. An error occured, please try again";
      }
    },
    [paperDataRaw, getCategories],
  );

  const onSubmitUpdateCategory = useCallback(
    async (categoryToUpdateDatas: CategoryToUpdate) => {
      const toast = await showToast({
        style: Toast.Style.Animated,
        title: `Update ${categoryToUpdateDatas.category} to -> ${categoryToUpdateDatas.newCategoryName}`,
      });

      if (
        getCategories.includes(
          categoryToUpdateDatas.newCategoryName.charAt(0).toUpperCase() +
            categoryToUpdateDatas.newCategoryName.slice(1),
        )
      ) {
        toast.style = Toast.Style.Failure;
        toast.title = `${categoryToUpdateDatas.newCategoryName} already exist`;
        return;
      }

      try {
        const newPaperRawData = { ...paperDataRaw };

        newPaperRawData[categoryToUpdateDatas.newCategoryName.toLowerCase()] = {
          papers: [...newPaperRawData[categoryToUpdateDatas.category.toLowerCase()].papers],
          color: categoryToUpdateDatas.color,
        };

        delete newPaperRawData[categoryToUpdateDatas.category.toLowerCase()];

        const newConfigFile = await updateConfigFile(newPaperRawData);
        setPaperDataRaw(JSON.parse(newConfigFile as string));
        setMode("list");

        toast.style = Toast.Style.Success;
        toast.title = "Category updated";
      } catch (error) {
        toast.style = Toast.Style.Failure;
        toast.title = "Oups.. An error occured, please try again";
      }
    },
    [paperDataRaw, getCategories],
  );

  const onSubmitDeleteCategory = useCallback(
    async ({ category }: { category: string }) => {
      const userWanteDelete = await confirmAlert({
        title: `Delete ${category} ?`,
        message: "Are you sur to delete this category all papers related to will be moved in the deleted category",
        primaryAction: { style: Alert.ActionStyle.Destructive, title: "Delete" },
      });

      if (userWanteDelete === false) return;

      const toast = await showToast({
        style: Toast.Style.Animated,
        title: `Delete ${category} Category`,
      });

      try {
        const newPaperRawData = { ...paperDataRaw };

        if (!newPaperRawData.deleted) {
          newPaperRawData.deleted = {
            color: "SecondaryText",
            papers: [],
          };
        }

        newPaperRawData[category.toLowerCase()].papers.forEach((paper) => newPaperRawData.deleted.papers.push(paper));

        delete newPaperRawData[category.toLowerCase()];

        const newConfigFile = await updateConfigFile(newPaperRawData);
        setPaperDataRaw(JSON.parse(newConfigFile as string));
        setMode("list");

        toast.style = Toast.Style.Success;
        toast.title = "Category deleted";
      } catch (error) {
        toast.style = Toast.Style.Failure;
        toast.title = "Oups.. An error occured, please try again";
      }
    },
    [paperDataRaw],
  );

  const onActionDeletePaper = useCallback(
    async (category: string, index: number) => {
      const toast = await showToast({
        style: Toast.Style.Animated,
        title: `Delete Paper`,
      });

      if (category === "deleted") {
        toast.style = Toast.Style.Failure;
        toast.title = "Paper already deleted";
        return;
      }

      try {
        const newPaperRawData = { ...paperDataRaw };
        const paper = newPaperRawData[category].papers[index];

        newPaperRawData[category].papers.splice(index, 1);

        if (!newPaperRawData.deleted) {
          newPaperRawData.deleted = {
            color: "SecondaryText",
            papers: [],
          };
        }

        newPaperRawData.deleted.papers.push(paper);

        const newConfigFile = await updateConfigFile(newPaperRawData);
        setPaperDataRaw(JSON.parse(newConfigFile as string));
        setMode("list");

        toast.style = Toast.Style.Success;
        toast.title = "Paper Deleted";
      } catch (error) {
        toast.style = Toast.Style.Failure;
        toast.title = "Oups.. An error occured, please try again";
      }
    },
    [paperDataRaw],
  );

  const onSubmitCreatePaper = useCallback(
    async (newPaperData: Paper & { category: string }) => {
      const toast = await showToast({
        style: Toast.Style.Animated,
        title: "Adding new paper",
      });

      try {
        const newPaperRawData = { ...paperDataRaw };
        const newPaper = {
          name: newPaperData.name,
          description: newPaperData.description || "",
          content: encode(newPaperData.content) as Base64,
          createdAt: new Date(newPaperData.createdAt).getTime(),
        };

        newPaperRawData[newPaperData.category].papers.push({ ...newPaper });

        const newConfigFile = await updateConfigFile(newPaperRawData);
        setPaperDataRaw(JSON.parse(newConfigFile as string));
        setMode("list");

        toast.style = Toast.Style.Success;
        toast.title = "Paper Created";
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
      <ListMode
        isLoading={isLoading}
        paperDataRaw={paperDataRaw}
        switchMode={switchMode}
        categories={getCategories}
        onActionDeletePaper={onActionDeletePaper}
      />
    );
  if (mode === "read")
    return (
      <ReadMode
        paperDatas={paperToRead as PaperDataSwitchMode}
        switchMode={switchMode}
        onActionDeletePaper={onActionDeletePaper}
      />
    );
  if (mode === "edit")
    return (
      <EditMode
        paperDatas={paperToRead as PaperDataSwitchMode}
        switchMode={switchMode}
        categories={getCategories}
        onSubmit={onSubmit}
      />
    );
  if (mode === "create-category") return <CreateCategory switchMode={switchMode} onSubmit={onSubmitCategory} />;
  if (mode === "update-category")
    return <UpdateCategory categories={getCategories} switchMode={switchMode} onSubmit={onSubmitUpdateCategory} />;
  if (mode === "delete-category")
    return <DeleteCategory categories={getCategories} switchMode={switchMode} onSubmit={onSubmitDeleteCategory} />;
  if (mode === "create-paper")
    return <CreatePaper categories={getCategories} switchMode={switchMode} onSubmit={onSubmitCreatePaper} />;
}
