import React, { useState } from 'react';
import { UploadOutlined } from '@fabi/ui/icons';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext, PointerSensor, useSensor } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Upload } from '@fabi/ui';
import type { UploadFile, UploadProps } from '@fabi/ui';
import { createStyles } from '@fabi/ui/style';

const useStyles = createStyles((props) => {
  const { css } = props;
  return {
    isDragging: css`
      pointer-events: none;
      a {
        pointer-events: none;
      }
    `,
  };
});

interface DraggableUploadListItemProps {
  originNode: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  file: UploadFile<any>;
}

const DraggableUploadListItem: React.FC<DraggableUploadListItemProps> = (props) => {
  const { styles } = useStyles();

  const { originNode, file } = props;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: file.uid,
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    cursor: 'move',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      // prevent preview event when drag end
      className={isDragging ? styles.isDragging : undefined}
      {...attributes} role={undefined} aria-roledescription={undefined}
      {...listeners}
    >
      {/* hide error tooltip when dragging */}
      {file.status === 'error' && isDragging ? originNode.props.children : originNode}
    </div>
  );
};

const App: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: '-1',
      name: 'image1.png',
      status: 'done',
      url: '/mock-assets/photo-6.svg',
    },
    {
      uid: '-2',
      name: 'image2.png',
      status: 'done',
      url: '/mock-assets/photo-6.svg',
    },
    {
      uid: '-3',
      name: 'image3.png',
      status: 'done',
      url: '/mock-assets/photo-6.svg',
    },
    {
      uid: '-4',
      name: 'image4.png',
      status: 'done',
      url: '/mock-assets/photo-6.svg',
    },
    {
      uid: '-5',
      name: 'image.png',
      status: 'error',
    },
  ]);

  const sensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 10 },
  });

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setFileList((prev) => {
        const activeIndex = prev.findIndex((i) => i.uid === active.id);
        const overIndex = prev.findIndex((i) => i.uid === over?.id);
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
  };

  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  return (
    <DndContext sensors={[sensor]} onDragEnd={onDragEnd}>
      <SortableContext items={fileList.map((i) => i.uid)} strategy={verticalListSortingStrategy}>
        <Upload
          action="/mock-api/upload"
          fileList={fileList}
          onChange={onChange}
          itemRender={(originNode, file) => (
            <DraggableUploadListItem originNode={originNode} file={file} />
          )}
        >
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </SortableContext>
    </DndContext>
  );
};

export default App;
