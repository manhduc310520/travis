import React, { use } from 'react';
import { Flex, Segmented } from 'antd';

import useLocale, { useUiText } from '../../hooks/useLocale';
import SemanticPreview, { SemanticActiveContext } from './SemanticPreview';

export const locales = {
  en: {
    root: 'Root element with relative positioning, inline-flex layout, cursor styles, transitions, border and other basic selector container styles',
    prefix: 'Prefix element with layout and styling for prefix content',
    suffix:
      'Suffix element with layout and styling for suffix content like clear button, arrow icon, etc.',
    input:
      'Input element with search input styling, cursor control, font inheritance and other search-related styles. Remove border styles',
    content:
      'Multiple selection container with layout, spacing, and wrapping styles for selected items',
    clear: 'Clear button element with layout, styling and interactive effects for clear button',
    item: 'Multiple selection item element with border, background, padding, and margin styles',
    itemContent: 'Multiple selection item content area with text ellipsis styles',
    itemRemove: 'Multiple selection item remove button with font-related styles',
    placeholder: 'Placeholder element with font styles and colors for placeholder text',
    'popup.root':
      'Popup element with popup layer positioning, z-index, background, border, box-shadow and other popup container styles',
    'popup.list':
      'Popup list element with option list layout, scrolling, max-height and other list container styles',
    'popup.listItem':
      'Popup item element with option item padding, hover effects, selected states, disabled states and other option interactive styles',
  },
};

interface BlockProps {
  component: React.ComponentType<any>;
  options?: { value: string; label: string }[];
  defaultValue?: string;
  style?: React.CSSProperties;
  mode: 'single' | 'multiple';
  onModeChange: (mode: 'single' | 'multiple') => void;
  multipleProps?: object;
  singleOnly?: boolean;
  [key: string]: any;
}

const Block: React.FC<BlockProps> = ({
  component: Component,
  options,
  defaultValue,
  mode,
  onModeChange,
  multipleProps,
  singleOnly,
  ...props
}) => {
  const t = useUiText();
  const divRef = React.useRef<HTMLDivElement>(null);
  const activeSemantic = use(SemanticActiveContext);
  // multiple mode: the defaultValue in multipleProps comes first
  const multipleDefaultValue = (multipleProps as any)?.defaultValue;
  const initialValue = mode === 'single' ? defaultValue : multipleDefaultValue;
  const [value, setValue] = React.useState(initialValue);
  const [valueMode, setValueMode] = React.useState(mode);

  // single and multiple modes hold different value shapes: reset when the mode changes
  if (valueMode !== mode) {
    setValueMode(mode);
    setValue(initialValue);
  }

  return (
    <Flex
      ref={divRef}
      style={{ position: 'absolute', marginBottom: 80 }}
      vertical
      gap="middle"
      align="center"
    >
      {!singleOnly && (
        <Segmented<'single' | 'multiple'>
          options={[
            { label: t('Single'), value: 'single' },
            { label: t('Multiple'), value: 'multiple' },
          ]}
          value={mode}
          onChange={onModeChange}
        />
      )}
      <Component
        {...props}
        open
        placement="bottomLeft"
        value={activeSemantic === 'placeholder' ? null : value}
        onChange={setValue}
        getPopupContainer={() => divRef.current}
        options={options}
        {...(mode === 'multiple' ? multipleProps : {})}
        styles={{ popup: { zIndex: 1 }, clear: { opacity: 1 }, suffix: { marginInlineEnd: 24 } }}
        maxTagCount={process.env.NODE_ENV === 'test' ? 1 : 'responsive'}
        placeholder="Please select"
        allowClear
      />
    </Flex>
  );
};

export interface SelectSemanticTemplateProps {
  component: React.ComponentType<any>;
  componentName: string;
  options?: { value: string; label: string }[];
  height?: number;
  onSearch?: (text: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  ignoreSemantics?: string[];
  multipleProps?: object;
  singleOnly?: boolean;
  [key: string]: any;
}

const SelectSemanticTemplate: React.FC<SelectSemanticTemplateProps> = ({
  component,
  defaultValue,
  options,
  height,
  style,
  componentName,
  ignoreSemantics = [],
  singleOnly = false,
  ...restProps
}) => {
  const [locale] = useLocale(locales);
  const [mode, setMode] = React.useState<'single' | 'multiple'>(singleOnly ? 'single' : 'single');

  const semanticList =
    mode === 'single'
      ? [
          { name: 'root', desc: locale.root },
          { name: 'prefix', desc: locale.prefix },
          { name: 'content', desc: locale.content },
          { name: 'placeholder', desc: locale.placeholder },
          { name: 'clear', desc: locale.clear },
          { name: 'input', desc: locale.input },
          { name: 'suffix', desc: locale.suffix },
          { name: 'popup.root', desc: locale['popup.root'] },
          { name: 'popup.list', desc: locale['popup.list'] },
          { name: 'popup.listItem', desc: locale['popup.listItem'] },
        ].filter((semantic) => !ignoreSemantics.includes(semantic.name))
      : [
          { name: 'root', desc: locale.root },
          { name: 'prefix', desc: locale.prefix },
          { name: 'content', desc: locale.content },
          { name: 'placeholder', desc: locale.placeholder },
          { name: 'clear', desc: locale.clear },
          { name: 'item', desc: locale.item },
          { name: 'itemContent', desc: locale.itemContent },
          { name: 'itemRemove', desc: locale.itemRemove },
          { name: 'input', desc: locale.input },
          { name: 'suffix', desc: locale.suffix },
          { name: 'popup.root', desc: locale['popup.root'] },
          { name: 'popup.list', desc: locale['popup.list'] },
          { name: 'popup.listItem', desc: locale['popup.listItem'] },
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
        options={options}
        style={style}
        mode={mode}
        onModeChange={singleOnly ? () => {} : setMode}
        singleOnly={singleOnly}
        {...restProps}
      />
    </SemanticPreview>
  );
};

export default SelectSemanticTemplate;
