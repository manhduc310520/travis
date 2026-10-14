import React from 'react';
import { SmileOutlined } from '@fabi/ui/icons';
import { DatePicker, Flex, Segmented } from '@fabi/ui';

import useLocale from '../../../_dumi/hooks/useLocale';
import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';

const locales = {
  en: {
    root: 'Root element with relative positioning, inline-flex layout, padding, border-radius, transition animations and other basic styles for date picker container',
    prefix: 'Prefix element with flex layout and margin styles for prefix content layout',
    input:
      'Input element with relative positioning, width, color, font, line-height, transition animations and other core interactive styles for input field',
    suffix:
      'Suffix element with flex layout, color, line-height, pointer events, transition animations and other styles for suffix content',
    popup: 'Popup element',
    'popup.container':
      'Container element, set background color, padding, border radius, shadow, border and content display styles',
    'popup.header':
      'Popup header element with navigation buttons, month/year selectors and other header control area layout and styles',
    'popup.body': 'Popup body element with container layout and styles for date panel table',
    'popup.content':
      'Popup content element with width, border, cell and other content display styles for date table',
    'popup.item':
      'Popup item element with size, background, border-radius, hover state, selected state and other interactive styles for date cells',
    'popup.footer':
      'Popup footer element with layout styles for bottom operation area including confirm/cancel buttons and shortcuts',
  },
};

interface BlockProps<P> {
  singleComponent: React.ComponentType<P>;
  multipleComponent: React.ComponentType<P>;
  type: 'Single' | 'Multiple';
  setType: (type: 'Single' | 'Multiple') => void;
}

const Block: React.FC<BlockProps<any>> = (props) => {
  const {
    singleComponent: SingleComponent,
    multipleComponent: MultipleComponent,
    type,
    setType,
    ...restProps
  } = props;

  const divRef = React.useRef<HTMLDivElement>(null);

  const config = {
    ...restProps,
    prefix: <SmileOutlined />,
    zIndex: 1,
    open: true,
    getPopupContainer: () => divRef?.current!,
    needConfirm: true,
  };

  const PickerComponent = type === 'Single' ? SingleComponent : MultipleComponent;

  return (
    <Flex vertical ref={divRef} style={{ alignSelf: 'flex-start' }} gap="medium" align="center">
      <Segmented options={['Single', 'Multiple'] as const} value={type} onChange={setType} />
      <PickerComponent {...config} />
    </Flex>
  );
};

export interface PickerSemanticTemplateProps<P> {
  singleComponent: [string, React.ComponentType<P>];
  multipleComponent: [string, React.ComponentType<P>];
  ignoreSemantics?: string[];
}

export const PickerSemanticTemplate: React.FC<Readonly<PickerSemanticTemplateProps<any>>> = (
  props,
) => {
  const { singleComponent, multipleComponent, ignoreSemantics = [] } = props;

  const [type, setType] = React.useState<'Single' | 'Multiple'>('Single');
  const [locale] = useLocale(locales);

  return (
    <SemanticPreview
      componentName={type === 'Single' ? singleComponent[0] : multipleComponent[0]}
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'prefix', desc: locale.prefix },
        { name: 'input', desc: locale.input },
        { name: 'suffix', desc: locale.suffix },
        { name: 'popup.root', desc: locale.popup },
        { name: 'popup.container', desc: locale['popup.container'] },
        { name: 'popup.header', desc: locale['popup.header'] },
        { name: 'popup.body', desc: locale['popup.body'] },
        { name: 'popup.content', desc: locale['popup.content'] },
        { name: 'popup.item', desc: locale['popup.item'] },
        { name: 'popup.footer', desc: locale['popup.footer'] },
      ].filter((semantic) => !ignoreSemantics.includes(semantic.name))}
    >
      <Block
        singleComponent={singleComponent[1]}
        multipleComponent={multipleComponent[1]}
        type={type}
        setType={setType}
      />
    </SemanticPreview>
  );
};

const App: React.FC = () => {
  return (
    <PickerSemanticTemplate
      singleComponent={['DatePicker', DatePicker]}
      multipleComponent={['DatePicker.RangePicker', DatePicker.RangePicker]}
    />
  );
};

export default App;
