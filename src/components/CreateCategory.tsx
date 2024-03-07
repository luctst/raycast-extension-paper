import { Action, ActionPanel, Form, Icon, Color } from "@raycast/api";
import { FC, useRef, useState } from "react";
import { CategoryToUpdate, SwitchMode } from "../types";

type CreateCategoryProps = {
  switchMode: SwitchMode;
  onSubmit: (newCategoryDate: CategoryToUpdate) => void;
};

export const CreateCategory: FC<CreateCategoryProps> = ({ switchMode, onSubmit }) => {
  const [category, setCategory] = useState<string>();
  const [categoryError, setCategoryError] = useState<string | undefined>();

  const [color, setColor] = useState<string>();

  const colorsAsArray = useRef<Array<string>>(Object.keys(Color));

  const onBlurCategory = (event) => {
    if (event.target.value.length <= 0) {
      if (categoryError) return;

      setCategoryError("Enter category");
      return;
    }

    if (categoryError === undefined) return;
    setCategoryError(undefined);
  };

  return (
    <Form
      navigationTitle="Create New Category"
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Submit" icon={Icon.Redo} onSubmit={onSubmit} />
          <Action
            title="Go Back To List Mode"
            autoFocus={true}
            icon={Icon.List}
            onAction={() => switchMode("list")}
            shortcut={{ modifiers: ["cmd"], key: "l" }}
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
    >
      <Form.TextField
        id="category"
        title="New Category"
        value={category}
        onChange={setCategory}
        autoFocus={true}
        error={categoryError}
        onBlur={onBlurCategory}
      />
      <Form.Dropdown id="color" throttle={true} title="Color" value={color} onChange={setColor}>
        {colorsAsArray.current.map((color: string, i) => (
          <Form.Dropdown.Item
            icon={{ source: Icon.Circle, tintColor: Color[color] }}
            key={i}
            title={color}
            value={color}
          />
        ))}
      </Form.Dropdown>
    </Form>
  );
};

CreateCategory.displayName = "CreateCategory";
