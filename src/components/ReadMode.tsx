import { Action, ActionPanel, Detail } from '@raycast/api';
import { FC, memo, useEffect, useState } from 'react';
import { decode } from '../utils/base64';
import { Mode, PaperToRead } from '../types';

type ReadModeProps = {
  content: PaperToRead;
  switchMode: (newMode: Mode) => void;
};

export const ReadMode: FC<ReadModeProps> = memo(function ReadMode({ content, switchMode }) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [markdown, setMarkdown] = useState<string>('');

  useEffect(() => {
    setMarkdown(decode(content.content));
    setIsLoading(false);
  }, []);

  return (
    <Detail isLoading={isLoading} markdown={markdown} navigationTitle={content.name} actions={
      <ActionPanel>
        <Action title='List All Your Papers' autoFocus={true} onAction={() => { switchMode('list') }}/>
      </ActionPanel>
    }/>
  );
});

ReadMode.displayName = 'ReadMode';
