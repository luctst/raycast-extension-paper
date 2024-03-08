import { ActionPanel, Action, Icon, useNavigation } from '@raycast/api';
import { FC } from 'react';
import { Mode, Paper } from '../types';

import { ReadMode } from '../views/ReadMode';
import { ListMode } from '../views/ListMode';

type ActionsProps = {
  mode: Mode;
  paper?: Paper;
  category?: string;
  index?: number;
};

export const Actions: FC<ActionsProps> = ({ mode, paper }) => {
  const { push } = useNavigation();

  return (
    <ActionPanel>
      {
        mode === 'list' ?
        <>
          <Action title="Read Paper" autoFocus={true} icon={Icon.List} onAction={() => push(<ReadMode paper={paper}/>)}/>
          <Action title="Edit Paper" shortcut={{ modifiers: ["cmd"], key: "e" }} icon={Icon.Pencil} />
        </> :
        <Action title='List All Papers' autoFocus={true} icon={Icon.List} onAction={() => push(<ListMode />)}/>
      }
      <Action title="Create Paper" shortcut={{ modifiers: ["cmd", "shift"], key: "n" }} icon={Icon.Plus} />
      <Action title="Create New Category" shortcut={{ modifiers: ["cmd"], key: "n" }} icon={Icon.NewDocument} />
      <Action title="Update Category" shortcut={{ modifiers: ["cmd"], key: "u" }} icon={Icon.Switch} />
      <Action title="Delete Category" shortcut={{ modifiers: ["cmd", "shift"], key: "delete" }} icon={Icon.Trash} />
      <Action
        title="Delete Paper"
        shortcut={{ modifiers: ["cmd"], key: "deleteForward" }}
        icon={Icon.Trash}
        style={Action.Style.Destructive}
      />
    </ActionPanel>
  );
};

Actions.displayName = 'Actions';
