import React from 'react';
import { Badge, Card, Space } from '@fabi/ui';

const App: React.FC = () => (
  <Space vertical style={{ width: '100%' }}>
    <Badge.Ribbon text="啦啦啦啦">
      <Card>推开窗户举起望远镜</Card>
    </Badge.Ribbon>
    <Badge.Ribbon text="啦啦啦啦" color="purple">
      <Card>推开窗户举起望远镜</Card>
    </Badge.Ribbon>
    <Badge.Ribbon text="啦啦啦啦" color="#0958d9">
      <Card>推开窗户举起望远镜</Card>
    </Badge.Ribbon>
    <Badge.Ribbon text="啦啦啦啦" color="#0958d9" placement="start">
      <Card>推开窗户举起望远镜</Card>
    </Badge.Ribbon>
    <Badge.Ribbon text="啦啦啦啦" color="#0958d9" placement="end">
      <Card>推开窗户举起望远镜</Card>
    </Badge.Ribbon>
  </Space>
);

export default App;
