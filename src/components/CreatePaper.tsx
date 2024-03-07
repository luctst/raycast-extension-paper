import { ActionPanel, Form, Action, Icon } from "@raycast/api";
import { FC, useState } from "react";
import { SwitchMode, Paper } from "../types";

type NewPaper = Paper & { category: string };

type CreatePaperProps = {
  categories: Array<string>;
  switchMode: SwitchMode;
  onSubmit: (values: NewPaper) => void;
};

export const CreatePaper: FC<CreatePaperProps> = ({ categories, switchMode, onSubmit }) => {
  const [name, setName] = useState<string>();
  const [nameError, setNameError] = useState<string | undefined>();

  const [createdAt, setCreatedAt] = useState<Date | null>(new Date());
  const [createdAtError, setCreatedAtError] = useState<string | undefined>();

  const [content, setContent] = useState<string>();

  const [category, setCategory] = useState<string>();

  const [description, setDescription] = useState<string>();

  const onBlurName = (event) => {
    if (event.target.value.length <= 0) {
      if (nameError) return;

      setNameError("Enter name");
      return;
    }

    if (nameError === undefined) return;
    setNameError(undefined);
  };

  const onBlurCreatedAt = (event) => {
    if (event.target.value === null) {
      if (createdAtError) return;

      setCreatedAtError("Enter date");
      return;
    }

    if (createdAtError === undefined) return;
    setCreatedAtError(undefined);
  };

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Submit" onSubmit={onSubmit} icon={Icon.Redo} />
          <Action
            title="Go Back To List Mode"
            autoFocus={true}
            icon={Icon.List}
            onAction={() => switchMode("list")}
            shortcut={{ modifiers: ["cmd"], key: "l" }}
          />
          <Action
            title="Create New Category"
            shortcut={{ modifiers: ["cmd"], key: "n" }}
            onAction={() => switchMode("create-category")}
            icon={Icon.NewDocument}
          />
          <Action
            title="Update Category"
            shortcut={{ modifiers: ["cmd"], key: "u" }}
            onAction={() => switchMode("update-category")}
            icon={Icon.Switch}
          />
          <Action
            title="Delete Category"
            shortcut={{ modifiers: ["cmd", "shift"], key: "delete" }}
            onAction={() => switchMode("delete-category")}
            icon={Icon.Trash}
          />
        </ActionPanel>
      }
      navigationTitle="Create paper"
    >
      <Form.TextField
        id="name"
        value={name}
        onChange={setName}
        title="Name of your paper"
        error={nameError}
        onBlur={onBlurName}
      />
      <Form.DatePicker
        id="createdAt"
        value={createdAt}
        onChange={setCreatedAt}
        title="Created at"
        type={Form.DatePicker.Date}
        error={createdAtError}
        onBlur={onBlurCreatedAt}
      />
      <Form.TextArea id="content" value={content} title="Content" onChange={setContent} enableMarkdown={true} />
      <Form.Dropdown id="category" title="Category" value={category} onChange={setCategory} throttle={true}>
        {categories.map((category, index) => {
          if (category === "Deleted") return null;
          return <Form.Dropdown.Item title={category} value={category.toLowerCase()} key={index} />;
        })}
      </Form.Dropdown>
      <Form.TextField
        id="description"
        placeholder="Enter a description"
        info="Optional field"
        value={description}
        onChange={setDescription}
        title="Description"
      />
    </Form>
  );
};

CreatePaper.displayName = "CreatePaper";
