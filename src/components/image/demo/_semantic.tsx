import React from 'react';
import type { ImageProps as RcImageProps } from '@rc-component/image';
import { Flex, Image, theme } from '@fabi/ui';
import type { ImageProps } from '@fabi/ui';
import { createStaticStyles } from '@fabi/ui/style';
import { clsx } from 'clsx';

import useLocale from '../../../_dumi/hooks/useLocale';
import SemanticPreview from '../../../_dumi/theme/common/SemanticPreview';

const styles = createStaticStyles(({ css }) => ({
  cover: css`
    &.semantic-mark-active {
      opacity: 1;
    }
  `,
}));

const locales = {
  en: {
    root: 'Root element, sets relative positioning and inline-block layout styles',
    image: 'Image element, sets width, height and vertical alignment styles',
    cover:
      'Image hover display prompt element, sets absolute positioning, background color, opacity and transition animation styles',
    'popup.root':
      'Preview root element, sets fixed positioning, z-index and background mask styles',
    'popup.mask':
      'Preview mask element, sets absolute positioning and semi-transparent background styles',
    'popup.body':
      'Preview body element, sets flex layout, center alignment and pointer event styles',
    'popup.footer':
      'Preview footer element, sets absolute positioning, center layout and bottom operation area styles',
    'popup.actions':
      'Preview actions group element, sets flex layout, background color, border radius and action button styles',
    'popup.close': 'Preview close button element, sets basic button styles',
  },
};
interface ImagePropsBlock extends Omit<ImageProps, 'classNames'> {
  classNames?: RcImageProps['classNames'];
}

const Block: React.FC<Readonly<ImagePropsBlock>> = ({ classNames, ...restProps }) => {
  const holderRef = React.useRef<HTMLDivElement>(null);

  const { token } = theme.useToken();

  return (
    <Flex vertical align="center" style={{ minHeight: '100%', width: '100%' }}>
      <Flex style={{ padding: token.padding, flex: 'none' }} justify="center">
        <Image alt="Image"
          width={200}
          src="/mock-assets/photo-6.svg"
          classNames={{ ...classNames, cover: clsx(classNames?.cover, styles.cover) }}
          {...restProps}
        />
      </Flex>
      <div style={{ flex: 1, position: 'relative', minHeight: 360, width: '100%' }} ref={holderRef}>
        <Image.PreviewGroup
          items={[
            '/mock-assets/illustration.svg',
            '/mock-assets/illustration.svg',
          ]}
          classNames={classNames}
          styles={{ popup: { root: { position: 'absolute' } } }}
          preview={{ getContainer: () => holderRef.current!, open: true, focusTrap: false }}
        />
      </div>
    </Flex>
  );
};

const App: React.FC = () => {
  const [locale] = useLocale(locales);
  return (
    <SemanticPreview
      componentName="Image"
      padding={false}
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'image', desc: locale.image },
        { name: 'cover', desc: locale.cover },
        { name: 'popup.root', desc: locale['popup.root'] },
        { name: 'popup.mask', desc: locale['popup.mask'] },
        { name: 'popup.body', desc: locale['popup.body'] },
        { name: 'popup.footer', desc: locale['popup.footer'] },
        { name: 'popup.actions', desc: locale['popup.actions'] },
        { name: 'popup.close', desc: locale['popup.close'], version: '6.4.0' },
      ]}
    >
      <Block />
    </SemanticPreview>
  );
};

export default App;
