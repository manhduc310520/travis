import React from 'react';
import { Flex, Segmented } from 'antd';

import useLocale, { useUiText } from '../../hooks/useLocale';
import SemanticPreview from './SemanticPreview';

export const locales = {
  en: {
    root: 'Root element with tree selector base styles, border, border radius container styles',
    prefix: 'Prefix element with prefix content layout and styles',
    input:
      'Input element with text input, search, selected value display and other input core interaction styles',
    suffix:
      'Suffix element with suffix content, clear button, dropdown arrow and other suffix area styles',
    content:
      'Multiple selection container with layout, spacing, and wrapping styles for selected items',
    item: 'Multiple selection item element with border, background, padding, and margin styles',
    itemContent: 'Multiple selection item content area with text ellipsis styles',
    itemRemove: 'Multiple selection item remove button with font-related styles',
    placeholder: 'Placeholder element with font styles and colors for placeholder text',
    'popup.root':
      'Popup element with dropdown tree selection panel positioning, z-index, background, border, shadow and other popup layer styles',
    'popup.item':
      'Popup item element with tree node option styles, hover state, selected state and other interaction states',
    'popup.itemTitle': 'Popup title element with tree node title text display styles',
    'popup.itemSwitcher':
      'Popup switcher element with tree node expand/collapse button styles and background',
  },
};

interface BlockProps {
  component: React.ComponentType<any>;
  treeData?: any[];
  defaultValue?: string | string[];
  style?: React.CSSProperties;
  mode: 'single' | 'multiple';
  onModeChange: (mode: 'single' | 'multiple') => void;
  multipleProps?: object;
  [key: string]: any;
}

const Block: React.FC<BlockProps> = ({
  component: Component,
  treeData,
  defaultValue,
  mode,
  onModeChange,
  multipleProps,
  ...props
}) => {
  const t = useUiText();
  const divRef = React.useRef<HTMLDivElement>(null);
  // multiple mode: the defaultValue in multipleProps comes first
  const multipleDefaultValue = (multipleProps as any)?.defaultValue;
  const initialValue = mode === 'single' ? defaultValue : multipleDefaultValue;
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(mode === 'single' ? defaultValue : multipleDefaultValue);
  }, [mode, defaultValue, multipleDefaultValue]);

  return (
    <Flex
      ref={divRef}
      style={{ position: 'absolute', marginBottom: 80 }}
      vertical
      gap="middle"
      align="center"
    >
      <Segmented
        options={[
          { label: t('Single'), value: 'single' },
          { label: t('Multiple'), value: 'multiple' },
        ]}
        value={mode}
        onChange={(value) => onModeChange(value as 'single' | 'multiple')}
      />
      <Component
        {...props}
        open
        placement="bottomLeft"
        value={value}
        onChange={setValue}
        getPopupContainer={() => divRef.current}
        treeData={treeData}
        {...(mode === 'multiple' ? multipleProps : {})}
        styles={{ popup: { zIndex: 1 } }}
        maxTagCount={process.env.NODE_ENV === 'test' ? 1 : 'responsive'}
        placeholder="Please select"
      />
    </Flex>
  );
};

export interface TreeSelectSemanticTemplateProps {
  component: React.ComponentType<any>;
  componentName: string;
  treeData?: any[];
  height?: number;
  onSearch?: (text: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  ignoreSemantics?: string[];
  multipleProps?: object;
  [key: string]: any;
}

const TreeSelectSemanticTemplate: React.FC<TreeSelectSemanticTemplateProps> = ({
  component,
  defaultValue,
  treeData,
  height,
  style,
  componentName,
  ignoreSemantics = [],
  ...restProps
}) => {
  const [locale] = useLocale(locales);
  const [mode, setMode] = React.useState<'single' | 'multiple'>('single');

  const semanticList =
    mode === 'single'
      ? [
          { name: 'root', desc: locale.root },
          { name: 'prefix', desc: locale.prefix },
          { name: 'placeholder', desc: locale.placeholder },
          { name: 'input', desc: locale.input },
          { name: 'suffix', desc: locale.suffix },
          { name: 'popup.root', desc: locale['popup.root'] },
          { name: 'popup.item', desc: locale['popup.item'] },
          { name: 'popup.itemTitle', desc: locale['popup.itemTitle'] },
          { name: 'popup.itemSwitcher', desc: locale['popup.itemSwitcher'], version: '6.4.0' },
        ].filter((semantic) => !ignoreSemantics.includes(semantic.name))
      : [
          { name: 'root', desc: locale.root },
          { name: 'prefix', desc: locale.prefix },
          { name: 'content', desc: locale.content },
          { name: 'item', desc: locale.item },
          { name: 'itemContent', desc: locale.itemContent },
          { name: 'itemRemove', desc: locale.itemRemove },
          { name: 'input', desc: locale.input },
          { name: 'placeholder', desc: locale.placeholder },
          { name: 'suffix', desc: locale.suffix },
          { name: 'popup.root', desc: locale['popup.root'] },
          { name: 'popup.item', desc: locale['popup.item'] },
          { name: 'popup.itemTitle', desc: locale['popup.itemTitle'] },
          { name: 'popup.itemSwitcher', desc: locale['popup.itemSwitcher'], version: '6.4.0' },
        ].filter((semantic) => !ignoreSemantics.includes(semantic.name));

  return (
    <SemanticPreview
      componentName={componentName}
      semantics={semanticList}
      height={height}
      style={{
        alignItems: 'flex-start',
      }}
    >
      <Block
        component={component}
        defaultValue={defaultValue}
        treeData={treeData}
        style={style}
        mode={mode}
        onModeChange={setMode}
        {...restProps}
      />
    </SemanticPreview>
  );
};

export default TreeSelectSemanticTemplate;
