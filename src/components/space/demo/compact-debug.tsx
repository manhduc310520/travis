import React, { useState } from 'react';
import { CopyOutlined, DownloadOutlined, SettingOutlined } from '@fabi/ui/icons';
import {
  Button,
  Cascader,
  DatePicker,
  Divider,
  Drawer,
  Dropdown,
  Input,
  InputNumber,
  Modal,
  Popover,
  Select,
  Space,
  Tooltip,
} from '@fabi/ui';

const selectBefore = (
  <Select aria-label="Select"
    defaultValue="http"
    style={{ width: 90 }}
    options={[
      { label: 'http://', value: 'http' },
      { label: 'https://', value: 'https' },
    ]}
  />
);

const selectAfter = (
  <Select aria-label="Select"
    defaultValue=".com"
    style={{ width: 90 }}
    options={[
      { label: '.com', value: '.com' },
      { label: '.jp', value: '.jp' },
      { label: '.cn', value: '.cn' },
      { label: '.org', value: '.org' },
    ]}
  />
);

const App: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  return (
    <Space orientation="vertical">
      <Space.Compact block>
        <Button>default Button</Button>
        <Button danger>danger Button</Button>
        <Button type="dashed">dashed Button</Button>
        <Button type="text">text Button</Button>
        <Button type="link">Link Button</Button>
        <Tooltip title="Tooltip">
          <Button icon={<DownloadOutlined />} disabled />
        </Tooltip>
      </Space.Compact>
      <br />
      <Space.Compact>
        <Button>Prefix</Button>
        <Input aria-label="Input" addonBefore="http://" addonAfter=".com" defaultValue="mysite" />
        <Button type="primary">Submit</Button>
      </Space.Compact>
      <Space.Compact>
        <Input aria-label="prefix" placeholder="prefix" />
        <Input aria-label="Input" addonBefore={selectBefore} addonAfter={selectAfter} defaultValue="mysite" />
        <Button icon={<CopyOutlined />} />
      </Space.Compact>
      <Space.Compact>
        <Input.Search aria-label="Search" />
        <Input.Search aria-label="Search" />
        <Button icon={<CopyOutlined />} />
      </Space.Compact>
      <Space.Compact>
        <Input aria-label="Input" addonAfter={<SettingOutlined />} defaultValue="mysite" />
        <Button type="primary">Submit</Button>
        <Input aria-label="suffix" placeholder="suffix" addonAfter={<SettingOutlined />} />
      </Space.Compact>
      <Space.Compact>
        <Input aria-label="Input" addonBefore="http://" suffix=".com" defaultValue="mysite" />
        <Button type="primary">Submit</Button>
      </Space.Compact>
      <Space.Compact>
        <Button>Prefix</Button>
        <Input aria-label="cascader"
          addonBefore={<Cascader aria-label="cascader" placeholder="cascader" style={{ width: 150 }} />}
          defaultValue="mysite"
        />
        <Button type="primary">Submit</Button>
      </Space.Compact>
      <Space.Compact>
        <Input aria-label="Input" addonBefore="Prefix" defaultValue="mysite" showCount />
        <Button type="primary">Submit</Button>
        <Input aria-label="Input"
          addonBefore="Prefix"
          defaultValue="mysite"
          showCount
          addonAfter={<SettingOutlined />}
        />
        <Input aria-label="Input" addonBefore="Prefix" defaultValue="mysite" showCount />
      </Space.Compact>
      <br />
      <Space.Compact>
        <Button onClick={() => setShowModal(true)}>debug Modal context</Button>
        {showModal && (
          <Modal title="Basic Modal" open={showModal} onCancel={() => setShowModal(false)}>
            <Button>normal button A</Button>
            <Button>normal button B</Button>
            <br />
            <br />
            <Input aria-label="Input" />
            <br />
            <br />
            <Space.Compact>
              <Button>compact button A</Button>
              <Button>compact button B</Button>
            </Space.Compact>
          </Modal>
        )}
      </Space.Compact>
      <Space.Compact>
        <Dropdown.Button
          menu={{
            items: [
              {
                key: '1',
                label: <Button>menu button</Button>,
              },
              {
                key: '2',
                label: 'normal menu item',
              },
            ],
          }}
        >
          debug Dropdown.Button context
        </Dropdown.Button>
      </Space.Compact>
      <Space.Compact>
        <Button onClick={() => setShowDrawer(true)}>debug Drawer context</Button>
        {showDrawer && (
          <Drawer
            title="Basic Drawer"
            placement="right"
            onClose={() => setShowDrawer(false)}
            open={showDrawer}
          >
            <Button>normal button A</Button>
            <Button>normal button B</Button>
            <br />
            <br />
            <Space.Compact>
              <Button>compact button A</Button>
              <Button>compact button B</Button>
            </Space.Compact>
          </Drawer>
        )}
      </Space.Compact>
      <Space.Compact>
        <Input aria-label="Debug Popover context" placeholder="Debug Popover context" />
        <Popover
          content={
            <>
              <Input aria-label="Left Border" placeholder="Left Border" />
              <Divider />
              <DatePicker aria-label="Date" />
              <Divider />
              <InputNumber aria-label="Number" />
              <Divider />
              <Select aria-label="Select" />
            </>
          }
          trigger={['click']}
          placement="bottom"
        >
          <Button>Settings</Button>
        </Popover>
      </Space.Compact>
      <Space.Compact>
        <InputNumber aria-label="Number" addonBefore="+" addonAfter="$" defaultValue={100} />
      </Space.Compact>
      <Space.Compact>
        <Select aria-label="Select"
          defaultValue="Sign Up"
          options={[
            { label: 'Sign Up', value: 'Sign Up' },
            { label: 'Sign In', value: 'Sign In' },
          ]}
        />
      </Space.Compact>
      <Space.Compact>
        <DatePicker.RangePicker aria-label="Date range" style={{ width: '70%' }} />
      </Space.Compact>
      <Space.Compact>
        <InputNumber aria-label="Number" defaultValue={12} />
      </Space.Compact>
      <Space.Compact>
        <Cascader aria-label="Select Address"
          style={{ width: '70%' }}
          options={[
            {
              value: 'zhejiang',
              label: 'Zhejiang',
              children: [
                {
                  value: 'hangzhou',
                  label: 'Hangzhou',
                  children: [
                    {
                      value: 'xihu',
                      label: 'West Lake',
                    },
                  ],
                },
              ],
            },
            {
              value: 'jiangsu',
              label: 'Jiangsu',
              children: [
                {
                  value: 'nanjing',
                  label: 'Nanjing',
                  children: [
                    {
                      value: 'zhonghuamen',
                      label: 'Zhong Hua Men',
                    },
                  ],
                },
              ],
            },
          ]}
          placeholder="Select Address"
        />
      </Space.Compact>
      <Space.Compact orientation="vertical">
        <Button>vertical compact button A</Button>
      </Space.Compact>
    </Space>
  );
};

export default App;
