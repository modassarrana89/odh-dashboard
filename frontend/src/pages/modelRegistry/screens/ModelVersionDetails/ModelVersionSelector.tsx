import * as React from 'react';
import {
  HelperText,
  HelperTextItem,
  Menu,
  MenuContainer,
  MenuContent,
  MenuItem,
  MenuList,
  MenuSearch,
  MenuSearchInput,
  MenuToggle,
  SearchInput,
} from '@patternfly/react-core';
import useModelVersionsByRegisteredModel from '~/concepts/modelRegistry/apiHooks/useModelVersionsByRegisteredModel';
import { ModelVersion } from '~/concepts/modelRegistry/types';

type ModelVersionSelectorProps = {
  rmId?: string;
  selection: ModelVersion;
  onSelect: (versionId: string) => void;
};

const ModelVersionSelector: React.FC<ModelVersionSelectorProps> = ({
  rmId,
  selection,
  onSelect,
}) => {
  const [isOpen, setOpen] = React.useState(false);
  const [input, setInput] = React.useState('');

  const toggleRef = React.useRef(null);
  const menuRef = React.useRef(null);

  const [modelVersions] = useModelVersionsByRegisteredModel(rmId);

  const menuListItems = modelVersions.items
    .filter((item) => !input || item.name.toLowerCase().includes(input.toString().toLowerCase()))
    .map((mv, index) => (
      <MenuItem isSelected={mv.id === selection.id} itemId={mv.id} key={index}>
        {mv.name}
      </MenuItem>
    ));

  if (input && modelVersions.size === 0) {
    menuListItems.push(
      <MenuItem isDisabled key="no result">
        No results found
      </MenuItem>,
    );
  }

  const menu = (
    <Menu
      onSelect={(_e, itemId) => {
        onSelect(itemId as string);
        setOpen(false);
      }}
      data-id="model-version-selector-menu"
      ref={menuRef}
      isScrollable
      activeItemId={selection.id}
    >
      <MenuContent>
        <MenuSearch>
          <MenuSearchInput>
            <SearchInput
              value={input}
              aria-label="Filter menu items"
              onChange={(_event, value) => setInput(value)}
            />
          </MenuSearchInput>
          <HelperText style={{ paddingTop: '0.5rem' }}>
            <HelperTextItem variant="indeterminate">
              {`Type a name to search your ${modelVersions.size} versions.`}
            </HelperTextItem>
          </HelperText>
        </MenuSearch>
        <MenuList>{menuListItems}</MenuList>
      </MenuContent>
    </Menu>
  );

  return (
    <MenuContainer
      isOpen={isOpen}
      toggleRef={toggleRef}
      toggle={
        <MenuToggle
          id="model-version-selector"
          ref={toggleRef}
          onClick={() => setOpen(!isOpen)}
          isExpanded={isOpen}
          isFullWidth
          data-testid="model-version-toggle-button"
        >
          {selection.name}
        </MenuToggle>
      }
      menu={menu}
      menuRef={menuRef}
      popperProps={{ maxWidth: 'trigger' }}
      onOpenChange={(open) => setOpen(open)}
    />
  );
};

export default ModelVersionSelector;
