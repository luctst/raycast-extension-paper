import { List, ActionPanel, Action, Icon, Color } from "@raycast/api";
import { FC, memo, useState } from "react";
import { Paper, PaperRawData, SwitchMode } from "../types";

type ListModeProps = {
  isLoading: boolean;
  paperDataRaw: PaperRawData;
  switchMode: SwitchMode;
  categories: Array<string>;
};

type PaperSearchBarDropdownProps = {
  onChange: (value: string) => void;
  isLoading: boolean;
  categories: Array<string>;
};

type ListItemActionsProps = {
  paper: Paper;
  category: string;
  index: number;
};

const PaperSearchBarDropdown: FC<PaperSearchBarDropdownProps> = ({ onChange, isLoading, categories }) => {
  return (
    <List.Dropdown
      tooltip="Select a category"
      storeValue={true}
      defaultValue="all"
      onChange={onChange}
      isLoading={isLoading}
      throttle={true}
    >
      <List.Dropdown.Item title="All" value="all" />
      {categories.map((item, index) => (
        <List.Dropdown.Item title={item} value={item.toLowerCase()} key={index} />
      ))}
    </List.Dropdown>
  );
};

export const ListMode: FC<ListModeProps> = memo(function ListMode({ paperDataRaw, isLoading, switchMode, categories }) {
  const [categoryActive, setCategoryActive] = useState<string>();

  const onChange = (value: string) => {
    setCategoryActive(value);
  };

  const ListItemActions: FC<ListItemActionsProps> = ({ paper, category, index }) => {
    return (
      <ActionPanel>
        <Action
          title="Read Paper"
          autoFocus={true}
          onAction={() => {
            switchMode("read", { paper, category, index });
          }}
          icon={Icon.List}
        />
        <Action
          title="Edit Paper"
          onAction={() => switchMode("edit", { paper, category, index })}
          shortcut={{ modifiers: ["cmd"], key: "e" }}
          icon={Icon.Pencil}
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
          shortcut={{ modifiers: ["cmd", 'shift'], key: 'delete' }}
          onAction={() => switchMode("delete-category")}
          icon={Icon.Trash}
        />
      </ActionPanel>
    );
  };

  ListItemActions.displayName = "ListItemActions";

  const ListToRender: FC = () => {
    if (!categoryActive || !paperDataRaw) return;
    if (categoryActive === "all") {
      const categories = Object.keys(paperDataRaw);

      return categories.map((category, y) => (
        <List.Section title={category} subtitle={paperDataRaw[category].papers.length.toString()} key={y}>
          {paperDataRaw[category].papers.map((paper, i) => (
            <List.Item
              key={i}
              title={paper.name}
              accessories={[
                { text: { value: paper.description || "", color: Color[paperDataRaw[category].color] } },
                { date: new Date(paper.createdAt), icon: Icon.Calendar },
              ]}
              icon={{ source: Icon.Circle, tintColor: Color[paperDataRaw[category].color] }}
              actions={<ListItemActions paper={paper} category={category} index={i} />}
            />
          ))}
        </List.Section>
      ));
    }

    ListToRender.displayName = "ListToRender";

    return (
      <List.Section title={categoryActive} subtitle={paperDataRaw[categoryActive].papers.length.toString()}>
        {paperDataRaw[categoryActive].papers.map((paper, p) => (
          <List.Item
            title={paper.name}
            key={p}
            icon={{ source: Icon.Circle, tintColor: Color[paperDataRaw[categoryActive].color] }}
            accessories={[
              { text: { value: paper.description || "", color: Color[paperDataRaw[categoryActive].color] } },
              { date: new Date(paper.createdAt), icon: Icon.Calendar },
            ]}
            actions={<ListItemActions paper={paper} category={categoryActive} index={p} />}
          />
        ))}
      </List.Section>
    );
  };

  return (
    <List
      searchBarPlaceholder={isLoading ? "Fetching..." : "Search a paper"}
      searchBarAccessory={<PaperSearchBarDropdown onChange={onChange} isLoading={isLoading} categories={categories} />}
      throttle={true}
      isLoading={isLoading}
    >
      <ListToRender />
    </List>
  );
});

ListMode.displayName = "ListMode";
