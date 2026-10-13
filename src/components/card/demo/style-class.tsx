import React from 'react';
import { EditOutlined, HeartOutlined, ShareAltOutlined } from '@fabi/ui/icons';
import { Avatar, Button, Card, Flex } from '@fabi/ui';
import type { CardMetaProps, CardProps, GetProp } from '@fabi/ui';
import { createStyles } from '@fabi/ui/style';

const { Meta } = Card;

const useStyles = createStyles(({ token }) => ({
  root: {
    width: 300,
    backgroundColor: token.colorBgContainer,
    borderRadius: token.borderRadius,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: `${token.lineWidth}px ${token.lineType} ${token.colorBorderSecondary}`,
  },
  header: {
    borderBottom: 'none',
    paddingBottom: token.paddingXS,
  },
  body: {
    paddingTop: 0,
  },
}));

const stylesCard: CardProps['styles'] = {
  root: {
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 500,
  },
};

const stylesCardFn: CardProps['styles'] = (info): GetProp<CardProps, 'styles', 'Return'> => {
  if (info.props.variant === 'outlined') {
    return {
      root: {
        borderColor: '#531dab',
        boxShadow: '0 2px 8px #A7AAE1',
        borderRadius: 8,
      },
      extra: {
        color: 'light-dark(#531dab, #ab7ae0)',
      },
      title: {
        fontSize: 16,
        fontWeight: 500,
        color: 'light-dark(#531dab, #ab7ae0)',
      },
    };
  }
};

const stylesCardMeta: CardMetaProps['styles'] = {
  title: {
    color: 'light-dark(#531dab, #ab7ae0)',
  },
  description: {
    color: 'light-dark(#531dab, #ab7ae0)',
  },
};

const actions = [
  <HeartOutlined key="heart" style={{ color: 'light-dark(#ff6b6b, #f37370)' }} />,
  <ShareAltOutlined key="share" style={{ color: 'light-dark(#4ecdc4, #58d1c9)' }} />,
  <EditOutlined key="edit" style={{ color: 'light-dark(#45b7d1, #58d1c9)' }} />,
];

const App: React.FC = () => {
  const { styles: classNames } = useStyles();

  const sharedCardProps: CardProps = {
    classNames,
    actions,
  };

  const sharedCardMetaProps: CardMetaProps = {
    avatar: <Avatar alt="Avatar" src="/mock-assets/avatar-2.svg" />,
    description: 'This is the description',
  };

  return (
    <Flex gap="medium">
      <Card
        {...sharedCardProps}
        title="Object Card"
        styles={stylesCard}
        extra={<Button type="link">More</Button>}
        variant="borderless"
      >
        <Meta {...sharedCardMetaProps} title="Object Card Meta title" />
      </Card>
      <Card
        {...sharedCardProps}
        title="Function Card"
        styles={stylesCardFn}
        extra={
          <Button type="link" styles={{ root: { color: 'light-dark(#531dab, #ab7ae0)' } }}>
            More
          </Button>
        }
      >
        <Meta {...sharedCardMetaProps} styles={stylesCardMeta} title="Function Card Meta title" />
      </Card>
    </Flex>
  );
};

export default App;
