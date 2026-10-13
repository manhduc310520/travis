import React from 'react';
import type { DatePickerProps } from '@fabi/ui';
import { DatePicker, Space, theme } from '@fabi/ui';
import type { Dayjs } from 'dayjs';

const App: React.FC = () => {
  const { token } = theme.useToken();
  const style: React.CSSProperties = {
    border: `${token.lineWidth}px ${token.lineType} ${token.colorPrimary}`,
    borderRadius: '50%',
  };
  const cellRender: DatePickerProps<Dayjs>['cellRender'] = (current, info) => {
    if (info.type !== 'date') {
      return info.originNode;
    }
    if (typeof current === 'number' || typeof current === 'string') {
      return <div className="fabi-picker-cell-inner">{current}</div>;
    }
    return (
      <div className="fabi-picker-cell-inner" style={current.date() === 1 ? style : {}}>
        {current.date()}
      </div>
    );
  };
  return (
    <Space size={12} vertical>
      <DatePicker aria-label="Date" cellRender={cellRender} />
      <DatePicker.RangePicker aria-label="Date range" cellRender={cellRender} />
    </Space>
  );
};

export default App;
