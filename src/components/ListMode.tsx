import { List, ActionPanel, Action, Icon, Color } from '@raycast/api';
import { FC, memo, useState, useEffect, useMemo, useCallback } from 'react';
import { Mode, Paper, PaperToRead } from '../types';

type ListModeProps = {
  isLoading: boolean;
  paperDataRaw: Paper;
  switchMode: (newMode: Mode, fileMetadata: PaperToRead) => void;
};

function PaperSearchBarDropdown({ onChange, isLoading, categories }) {
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
}

export const ListMode: FC<ListModeProps> = memo(function ListMode({ paperDataRaw, isLoading, switchMode }) {
  const [categoryActive, setCategoryActive] = useState<string>();
  const [paper, setPaper] = useState([]);

  const getCategories = useMemo(() => {
    if (!paperDataRaw) return [];
    return Object.keys(paperDataRaw).map((key) => key.charAt(0).toUpperCase() + key.slice(1));
  }, [paperDataRaw]);

  const onChange = (value: string) => {
    setCategoryActive(value);
  };

  const generateAccessoriesProps = useCallback((itemData) => {
    const accessories = [{ date: new Date(itemData.createdAt), icon: Icon.Calendar }];

    itemData.keywords.forEach((keyword) => accessories.push({ tag: { value: keyword, color: Color[itemData.color] } }));

    return accessories;
  }, []);

  useEffect(() => {
    if (!paperDataRaw) return;
    const papersDataFiltered = Object.keys(paperDataRaw)
      .map((key) => {
        const objToReturn = {
          category: key,
          childrens: paperDataRaw[key],
        };

        if (categoryActive === "all") return { ...objToReturn };
        if (key !== categoryActive) return null;
        return { ...objToReturn };
      })
      .filter((item) => item !== null);

    setPaper(papersDataFiltered);
  }, [categoryActive, paperDataRaw]);

  return (
    <List
      searchBarPlaceholder={isLoading ? "Fetching..." : "Search a paper"}
      searchBarAccessory={
        <PaperSearchBarDropdown onChange={onChange} isLoading={isLoading} categories={getCategories} />
      }
      throttle={true}
      isLoading={isLoading}
    >
      {paper.map((pp, index) => (
        <List.Section title={pp.category} subtitle={pp.childrens.length.toString()} key={index}>
          {pp.childrens.map((ppChild, key) => (
            <List.Item
              key={key}
              title={ppChild.name}
              accessories={generateAccessoriesProps(ppChild)}
              keywords={ppChild.keywords}
              icon={{ source: Icon.Circle, tintColor: Color[ppChild.color] }}
              actions={
                <ActionPanel>
                  <Action title="Read Paper" autoFocus={true} onAction={() => { switchMode('read', { content: ppChild.content, name: ppChild.name }) }}/>
                </ActionPanel>
              }
            />
          ))}
        </List.Section>
      ))}
    </List>
  );
})

ListMode.displayName = 'ListMode';
