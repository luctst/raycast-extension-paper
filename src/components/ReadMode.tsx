import { Action, ActionPanel, Detail, Icon } from '@raycast/api';
import { FC, memo, useEffect, useState } from 'react';
import { decode } from '../utils/base64';
import { PaperDataSwitchMode, SwitchMode } from '../types';

type ReadModeProps = {
  paperDatas: PaperDataSwitchMode;
  switchMode: SwitchMode;
};

export const ReadMode: FC<ReadModeProps> = memo(function ReadMode({ paperDatas, switchMode }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [markdown, setMarkdown] = useState<string>('');

  useEffect(() => {
    setMarkdown(decode(paperDatas.paper.content));
    setIsLoading(false);
  }, []);

  return (
    <Detail isLoading={isLoading} markdown={markdown} navigationTitle={paperDatas.paper.name} actions={
      <ActionPanel>
        <Action title='List All Your Papers' autoFocus={true} onAction={() => { switchMode('list', paperDatas) }} icon={Icon.List}/>
        <Action title='Edit Paper' onAction={() => switchMode('edit', paperDatas)} shortcut={{ modifiers: ['cmd'], key: 'e', }} icon={Icon.Pencil}/>
        <Action
          title="Create New Category"
          shortcut={{ modifiers: ['cmd'], key: 'n' }}
          onAction={() => switchMode("create-category")}
          icon={Icon.NewDocument}
        />
        <Action
          title="Update Category"
          shortcut={{ modifiers: ["cmd"], key: "u" }}
          onAction={() => switchMode("update-category")}
          icon={Icon.Switch}
        />
      </ActionPanel>
    }/>
  );
});

ReadMode.displayName = 'ReadMode';
