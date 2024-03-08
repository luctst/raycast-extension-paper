import { ActionPanel, Action, Form, Icon, Color } from "@raycast/api";
import { FC, useState, useRef } from "react";
import { CategoryToUpdate, SwitchMode } from "../types";

type UpdateCategoryProps = {
  categories: Array<string>;
  switchMode: SwitchMode;
  onSubmit: (categoryToUpdateData: CategoryToUpdate) => void;
};

export const UpdateCategory: FC<UpdateCategoryProps> = ({ categories, switchMode, onSubmit }) => {
  const [category, setCategory] = useState<string>();

  const [newCategoryName, setNewCategoryName] = useState<string>();
  const [newCategoryNameError, setNewCategoryNameError] = useState<string | undefined>();

  const [color, setColor] = useState<string>();

  const colorsAsArray = useRef<Array<string>>(Object.keys(Color));

  const onBlurCategoryName = (event: any) => {
    if (event.target.value.length <= 0) {
      if (newCategoryNameError) return;

      setNewCategoryNameError("Enter new category name");
      return;
    }

    if (newCategoryNameError === undefined) return;
    setNewCategoryNameError(undefined);
  };

  return (
    <Form
      navigationTitle="Update Category"
      actions={
        <ActionPanel>
          <Action.SubmitForm icon={Icon.Redo} title="Update Catagory" onSubmit={onSubmit} />
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
            title="Delete Category"
            shortcut={{ modifiers: ["cmd", "shift"], key: "delete" }}
            onAction={() => switchMode("delete-category")}
            icon={Icon.Trash}
          />
        </ActionPanel>
      }
    >
      <Form.Dropdown
        id="category"
        autoFocus={true}
        throttle={true}
        title="Select category to update"
        value={category}
        onChange={setCategory}
      >
        {categories.map((category, index) => {
          if (category === "Deleted") return null;
          return <Form.Dropdown.Item value={category} title={category} key={index} />;
        })}
      </Form.Dropdown>
      <Form.TextField
        id="newCategoryName"
        title="New category name"
        value={newCategoryName}
        onChange={setNewCategoryName}
        error={newCategoryNameError}
        onBlur={onBlurCategoryName}
      />
      <Form.Dropdown id="color" throttle={true} title="Color" value={color} onChange={setColor}>
        {colorsAsArray.current.map((color: string, i) => (
          <Form.Dropdown.Item
            // @ts-ignore
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

UpdateCategory.displayName = "UpdateCategory";
