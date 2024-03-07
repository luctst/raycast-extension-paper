import { Action, ActionPanel, Form, Icon } from "@raycast/api";
import { FC, useState } from "react";
import { SwitchMode } from "../types";

type DeleteCategoryProps = {
  switchMode: SwitchMode;
  categories: Array<string>;
  onSubmit: (values: { category: string }) => void;
};

export const DeleteCategory: FC<DeleteCategoryProps> = ({ switchMode, categories, onSubmit }) => {
  const [category, setCategory] = useState<string>();

  return (
    <Form navigationTitle="Delete Category" actions={
      <ActionPanel>
        <Action.SubmitForm icon={Icon.Redo} title="Delete Category" onSubmit={onSubmit}/>
        <Action
          title="Go Back To List Mode"
          autoFocus={true}
          icon={Icon.List}
          onAction={() => switchMode('list')}
          shortcut={{ modifiers: ["cmd"], key: "l" }}
        />
        <Action
          title="Create Paper"
          onAction={() => switchMode('create-paper')}
          shortcut={{ modifiers: ["cmd", "shift"], key: "n" }}
          icon={Icon.Plus}
        />
        <Action
          title="Create New Category"
          shortcut={{ modifiers: ["cmd"], key: "n" }}
          onAction={() => switchMode("create-category")}
          icon={Icon.NewDocument}
        />
        <Action
          title="Update Category"
          shortcut={{ modifiers: ["cmd", 'shift'], key: "u" }}
          onAction={() => switchMode("update-category")}
          icon={Icon.Switch}
        />
      </ActionPanel>
    }>
      <Form.Dropdown id="category" autoFocus={true} throttle={true} title="Select category to delete" value={category} onChange={setCategory}>
        {
          categories.map((category, index) => {
            if (category === 'Deleted') return null;
            return <Form.Dropdown.Item value={category} title={category} key={index}/>
          })
        }
      </Form.Dropdown>
    </Form>
  );
}

DeleteCategory.displayName = 'DeleteCategory';
