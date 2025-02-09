import * as React from 'react';
import { createCollection } from './collection';

export default { title: 'Components/Collection (deprecated)' };

export const Basic = () => (
  <List>
    <Item>Red</Item>
    <Item disabled>Green</Item>
    <Item>Blue</Item>
  </List>
);

export const WithElementInBetween = () => (
  <List>
    <li style={{ fontVariant: 'small-caps' }}>Colors</li>
    <Item>Red</Item>
    <Item disabled>Green</Item>
    <Item>Blue</Item>
    <li style={{ fontVariant: 'small-caps' }}>Words</li>
    <Item>Hello</Item>
    <Item>World</Item>
  </List>
);

const Tomato = () => <Item style={{ color: 'tomato' }}>Tomato</Item>;

export const WithWrappedItem = () => (
  <List>
    <Item>Red</Item>
    <Item disabled>Green</Item>
    <Item>Blue</Item>
    <Tomato />
  </List>
);

export const WithFragment = () => {
  const countries = (
    <>
      <Item>France</Item>
      <Item disabled>UK</Item>
      <Item>Spain</Item>
    </>
  );
  return <List>{countries}</List>;
};

export const DynamicInsertion = () => {
  const [hasTomato, setHasTomato] = React.useState(false);
  const [, forceUpdate] = React.useState<any>();
  return (
    <>
      <button onClick={() => setHasTomato(!hasTomato)}>
        {hasTomato ? 'Remove' : 'Add'} Tomato
      </button>
      <button onClick={() => forceUpdate({})} style={{ marginLeft: 10 }}>
        Force Update
      </button>

      <List>
        <MemoItems hasTomato={hasTomato} />
      </List>
    </>
  );
};

function WrappedItems({ hasTomato }: any) {
  return (
    <>
      <MemoItem>Red</MemoItem>
      {hasTomato ? <Tomato /> : null}
      <MemoItem disabled>Green</MemoItem>
      <MemoItem>Blue</MemoItem>
    </>
  );
}

// Ensure that our implementation doesn't break if the item list/item is memoized
const MemoItem = React.memo(Item);
const MemoItems = React.memo(WrappedItems);

export const WithChangingItem = () => {
  const [isDisabled, setIsDisabled] = React.useState(false);
  return (
    <>
      <button onClick={() => setIsDisabled(!isDisabled)}>
        {isDisabled ? 'Enable' : 'Disable'} Green
      </button>

      <List>
        <Item>Red</Item>
        <Item disabled={isDisabled}>Green</Item>
        <Item>Blue</Item>
      </List>
    </>
  );
};

export const BasicTabs = () => {
  return (
    <Tabs>
      <TabList>
        <Tab>One</Tab>
        <Tab>Two</Tab>
      </TabList>
      <TabPanels>
        <Panel>Panel One</Panel>
        <Panel>Panel Two</Panel>
      </TabPanels>
    </Tabs>
  );
};

/* -------------------------------------------------------------------------------------------------
 * List implementation
 * -----------------------------------------------------------------------------------------------*/

const [createListCollection, useListItem, useList] = createCollection<
  HTMLLIElement,
  { disabled: boolean }
>('List');

type ListProps = {
  children: React.ReactNode;
};

const List = createListCollection(function List({ children }: ListProps) {
  const items = useList();
  console.log({ items });
  return (
    <div style={{ display: 'flex' }}>
      <ul style={{ width: 200 }}>{children}</ul>
    </div>
  );
});

type ItemProps = React.ComponentPropsWithRef<'li'> & {
  children: React.ReactNode;
  disabled?: boolean;
};

function Item({ children, disabled = false, ...props }: ItemProps) {
  const { ref, index } = useListItem({ disabled });
  return (
    <li ref={ref} {...props} style={{ ...props.style, opacity: disabled ? 0.3 : undefined }}>
      {index} — {children}
    </li>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Tabs implementation
 * -----------------------------------------------------------------------------------------------*/

const [createTabsCollection, useTabsItem, useTabs] = createCollection('Tabs');
const [createPanelsCollection, usePanelsItem, usePanels] = createCollection('Panels');

const TabsContext = React.createContext<{
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
}>({ selectedIndex: 0, setSelectedIndex: () => {} });

const Tabs = createTabsCollection(function Tabs({ children }) {
  const tabs = useTabs();
  console.log({ tabs });
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  return (
    <TabsContext.Provider value={{ selectedIndex, setSelectedIndex }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
});

function TabList({ children }: any) {
  return <ul>{children}</ul>;
}

function Tab({ children }: any) {
  const { setSelectedIndex } = React.useContext(TabsContext);
  const { ref, index } = useTabsItem();
  return (
    <li ref={ref}>
      {index} — <button onClick={() => setSelectedIndex(index)}>{children}</button>
    </li>
  );
}

const TabPanels = createPanelsCollection(function TabPanels({ children }: any) {
  const panels = usePanels();
  console.log({ panels });
  return children;
});

function Panel({ children }: any) {
  const { selectedIndex } = React.useContext(TabsContext);
  const { ref, index } = usePanelsItem();
  if (index !== selectedIndex) return null;
  return (
    <div ref={ref}>
      {index} — {children}
    </div>
  );
}
