import { ActionPanel, Form, Action, Toast, showToast, useNavigation } from "@raycast/api";
import { useForm, FormValidation } from "@raycast/utils";
import { FC } from "react";
import { Paper, Base64 } from "../types";
import { useGetConfig } from "../hooks/useGetConfig";
import { useGetCategories } from "../hooks/useGetCategories";
import { encode } from "../utils/base64";
import { updateConfigFile } from "../utils/updateConfigFile";
import { ListMode } from "./ListMode";

export const CreatePaper: FC = () => {
  const { isLoading, paperDataRaw } = useGetConfig();
  const categories = useGetCategories(paperDataRaw);
  const { push } = useNavigation();
  const { handleSubmit, itemProps } = useForm<Paper & { category: string }>({
    async onSubmit(values) {
      try {
        const toast = await showToast({
          style: Toast.Style.Animated,
          title: "Adding new paper",
        });

        const newPaperRawData = { ...paperDataRaw };
        const newPaper = {
          name: values.name,
          description: values.description || "",
          content: encode(values.content) as Base64,
          createdAt: new Date(values.createdAt).getTime(),
        };

        newPaperRawData[values.category.toLowerCase()].papers.push({ ...newPaper });

        await updateConfigFile(newPaperRawData);

        toast.style = Toast.Style.Success;
        toast.title = "Paper Created";

        push(<ListMode />);
      } catch(error) {
        return false;
      }
    },
    validation: {
      name: FormValidation.Required,
      createdAt: FormValidation.Required,
      category: FormValidation.Required,
    },
  })

  return (
    <Form
      navigationTitle="Create paper"
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Create Paper" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField
        title="Name of Your paper"
        placeholder="Enter the name of your new paper"
        { ...itemProps.name }
      />
      <Form.DatePicker
        title="Created at"
        // @ts-expect-error Raycast Type
        type={Form.DatePicker.Date}
        { ...itemProps.createdAt }
      />
      <Form.TextArea
        title="Content"
        enableMarkdown={true}
        placeholder="Write anything you want, you can use Markdown syntax"
        { ...itemProps.content }
      />
      <Form.Dropdown title="Category" throttle={true} { ...itemProps.category }>
        {categories.map((category, index) => {
          if (category === "Deleted") return null;
          return <Form.Dropdown.Item title={category} value={category.toLowerCase()} key={index} />;
        })}
      </Form.Dropdown>
      <Form.TextField
        placeholder="Enter a description"
        info="Optional field"
        title="Description"
        { ...itemProps.description }
      />
    </Form>
  );
};

CreatePaper.displayName = "CreatePaper";
