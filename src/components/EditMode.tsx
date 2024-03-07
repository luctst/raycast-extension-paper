import { Action, ActionPanel, Form, Icon } from "@raycast/api";
import { FC, memo, useEffect, useState } from "react";
import { Paper, PaperDataSwitchMode, SwitchMode } from "../types";
import { decode } from "../utils/base64";

type EditModeProps = {
  paperDatas: PaperDataSwitchMode;
  switchMode: SwitchMode;
  categories: Array<string>;
  onSubmit: (paperData: Paper & { category: string;}, oldCategory: string, index: number) => void;
};

export const EditMode: FC<EditModeProps> = memo(function EditMode({ paperDatas, switchMode, categories, onSubmit }) {

  const defaultValues = paperDatas.paper;

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [name, setName] = useState<string>(defaultValues.name || "");
  const [nameError, setNameError] = useState<string | undefined>();

  const [createdAt, setCreatedAt] = useState<Date | null>(new Date(defaultValues.createdAt) || "");
  const [createdAtError, setCreatedAtError] = useState<string | undefined>();

  const [content, setContent] = useState<string>(defaultValues.content || '');

  const [category, setCategory] = useState<string>(paperDatas.category || '');

  const [description, setDescription] = useState<string>(defaultValues.description || '');

  const onBlurName = (event) => {
    if (event.target.value.length <= 0) {
      if (nameError) return;

      setNameError('Enter name');
      return;
    }

    if (nameError === undefined) return;
    setNameError(undefined);
  };

  const onBlurCreatedAt = (event) => {
    if (event.target.value === null) {
      if (createdAtError) return;

      setCreatedAtError('Enter date');
      return;
    }

    if (createdAtError === undefined) return;
    setCreatedAtError(undefined);
  };

  useEffect(() => {
    setContent(decode(paperDatas.paper.content))
    setIsLoading(false)
  }, [])

  return (
    <Form
      isLoading={isLoading}
      navigationTitle={`Edit ${paperDatas.paper.name}`}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Submit" onSubmit={(values: Paper & { category: string;}) => onSubmit(values, paperDatas.category, paperDatas.index)} icon={Icon.Redo}/>
          <Action
            title="Go Back To List Mode"
            autoFocus={true}
            icon={Icon.List}
            onAction={() => switchMode("list", paperDatas)}
            shortcut={
              { modifiers: ['cmd'], key: 'l' }
            }
          />
          <Action
            title="Create Paper"
            onAction={() => switchMode('create-paper')}
            shortcut={{ modifiers: ["cmd", "shift"], key: "n" }}
            icon={Icon.Plus}
          />
          <Action
            title="Create New Category"
            shortcut={{ modifiers: ['cmd'], key: 'n' }}
            onAction={() => switchMode('create-category')}
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
            shortcut={{ modifiers: ["cmd", 'shift'], key: 'delete' }}
            onAction={() => switchMode("delete-category")}
            icon={Icon.Trash}
          />
        </ActionPanel>
      }
    >
      <Form.TextField id="name" value={name} onChange={setName} title="Name of your paper" storeValue={true} error={nameError} onBlur={onBlurName}/>
      <Form.DatePicker id="createdAt" value={createdAt} onChange={setCreatedAt} title="Created at" storeValue={true} type={Form.DatePicker.Date} error={createdAtError} onBlur={onBlurCreatedAt}/>
      <Form.TextArea id="content" value={content} storeValue={true} title="Content" onChange={setContent} enableMarkdown={true}/>
      <Form.Dropdown id="category" title="Category" value={category} onChange={setCategory} storeValue={true} throttle={true}>
        {
          categories.map((category, index) => {
            if (category === 'Deleted') return null;
            return <Form.Dropdown.Item title={category} value={category.toLowerCase()} key={index} />
          })
        }
      </Form.Dropdown>
      <Form.TextField id="description" placeholder="Enter a description" info="Optional field" storeValue={true} value={description} onChange={setDescription} title="Description"/>
    </Form>
  );
});

EditMode.displayName = "EditMode";
