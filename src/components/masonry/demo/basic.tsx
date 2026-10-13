import React from 'react';
import { Card, Masonry } from '@fabi/ui';
import type { MasonryProps } from '@fabi/ui';

type MasonryItemType = NonNullable<MasonryProps<number>['items']>[number];

const heights = [150, 50, 90, 70, 110, 150, 130, 80, 50, 90, 100, 150, 60, 50, 80].map(
  (height, index) => {
    const item: MasonryItemType = {
      key: `item-${index}`,
      data: height,
    };

    if (index === 4) {
      item.children = (
        <Card
          size="small"
          cover={
            <img
              alt="food"
              src="/mock-assets/photo-3.svg"
            />
          }
        >
          <Card.Meta title="I'm Special" description="Let's have a meal" />
        </Card>
      );
    }

    return item;
  },
);

const App: React.FC = () => (
  <Masonry
    columns={4}
    gutter={16}
    items={heights}
    itemRender={({ data, index }) => (
      <Card size="small" style={{ height: data }}>
        {index + 1}
      </Card>
    )}
  />
);

export default App;
