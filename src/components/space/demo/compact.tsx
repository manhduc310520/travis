import React from 'react';
import { CopyOutlined } from '@fabi/ui/icons';
import {
  AutoComplete,
  Button,
  Cascader,
  ColorPicker,
  DatePicker,
  Input,
  InputNumber,
  Select,
  Space,
  TimePicker,
  Tooltip,
  TreeSelect,
} from '@fabi/ui';

const { TreeNode } = TreeSelect;

const App: React.FC = () => (
  <Space orientation="vertical">
    <Space.Compact block>
      <Input aria-label="Input" style={{ width: '20%' }} defaultValue="0571" />
      <Input aria-label="Input" style={{ width: '30%' }} defaultValue="26888888" />
    </Space.Compact>
    <Space.Compact block size="small">
      <Input aria-label="Input" style={{ width: 'calc(100% - 200px)' }} defaultValue="https://example.com" />
      <Button type="primary">Submit</Button>
    </Space.Compact>
    <Space.Compact block>
      <Input aria-label="Input" style={{ width: 'calc(100% - 200px)' }} defaultValue="https://example.com" />
      <Button type="primary">Submit</Button>
    </Space.Compact>
    <Space.Compact block>
      <Input aria-label="Input"
        style={{ width: 'calc(100% - 200px)' }}
        defaultValue="git@example.com:fabi/menu.git"
      />
      <Tooltip title="copy git url">
        <Button icon={<CopyOutlined />} />
      </Tooltip>
    </Space.Compact>
    <Space.Compact block>
      <Select aria-label="Select"
        allowClear
        defaultValue="Zhejiang"
        options={[
          { label: 'Zhejiang', value: 'Zhejiang' },
          { label: 'Jiangsu', value: 'Jiangsu' },
        ]}
      />
      <Input aria-label="Input" style={{ width: '50%' }} defaultValue="Xihu District, Hangzhou" />
    </Space.Compact>
    <Space.Compact block>
      <Select aria-label="Select"
        allowClear
        mode="multiple"
        defaultValue="Zhejiang"
        style={{ width: '50%' }}
        options={[
          { label: 'Zhejiang', value: 'Zhejiang' },
          { label: 'Jiangsu', value: 'Jiangsu' },
        ]}
      />
      <Input aria-label="Input" style={{ width: '50%' }} defaultValue="Xihu District, Hangzhou" />
    </Space.Compact>
    <Space.Compact block>
      <Input.Search aria-label="Search" style={{ width: '30%' }} defaultValue="0571" />
      <Input.Search aria-label="Search" allowClear style={{ width: '50%' }} defaultValue="26888888" />
      <Input.Search aria-label="Search" style={{ width: '20%' }} defaultValue="+1" />
    </Space.Compact>
    <Space.Compact block>
      <Select aria-label="Select"
        defaultValue="Option1"
        options={[
          { label: 'Option1', value: 'Option1' },
          { label: 'Option2', value: 'Option2' },
        ]}
      />
      <Input aria-label="Input" style={{ width: '50%' }} defaultValue="input content" />
      <InputNumber aria-label="Number" defaultValue={12} />
    </Space.Compact>
    <Space.Compact block>
      <Input aria-label="Input" style={{ width: '50%' }} defaultValue="input content" />
      <DatePicker aria-label="Date" style={{ width: '50%' }} />
    </Space.Compact>
    <Space.Compact block>
      <DatePicker.RangePicker aria-label="Date range" style={{ width: '70%' }} />
      <Input aria-label="Input" style={{ width: '30%' }} defaultValue="input content" />
      <Button type="primary">Search</Button>
    </Space.Compact>
    <Space.Compact block>
      <Input aria-label="Input" style={{ width: '30%' }} defaultValue="input content" />
      <DatePicker.RangePicker aria-label="Date range" style={{ width: '70%' }} />
    </Space.Compact>
    <Space.Compact block>
      <Select aria-label="Select"
        defaultValue="Option1-1"
        options={[
          { label: 'Option1-1', value: 'Option1-1' },
          { label: 'Option1-2', value: 'Option1-2' },
        ]}
      />
      <Select aria-label="Select"
        defaultValue="Option2-2"
        options={[
          { label: 'Option2-1', value: 'Option2-1' },
          { label: 'Option2-2', value: 'Option2-2' },
        ]}
      />
    </Space.Compact>
    <Space.Compact block>
      <Select aria-label="Select"
        defaultValue="1"
        options={[
          { label: 'Between', value: '1' },
          { label: 'Except', value: '2' },
        ]}
      />
      <Input aria-label="Minimum" style={{ width: 100, textAlign: 'center' }} placeholder="Minimum" />
      <Input aria-label="~"
        className="site-input-split"
        style={{
          width: 30,
          borderInlineStart: 0,
          borderInlineEnd: 0,
          pointerEvents: 'none',
        }}
        placeholder="~"
        disabled
      />
      <Input aria-label="Maximum"
        className="site-input-right"
        style={{
          width: 100,
          textAlign: 'center',
        }}
        placeholder="Maximum"
      />
    </Space.Compact>
    <Space.Compact block>
      <Select aria-label="Select"
        defaultValue="Sign Up"
        style={{ width: '30%' }}
        options={[
          { label: 'Sign Up', value: 'Sign Up' },
          { label: 'Sign In', value: 'Sign In' },
        ]}
      />
      <AutoComplete aria-label="Email"
        style={{ width: '70%' }}
        placeholder="Email"
        options={[{ value: 'text 1' }, { value: 'text 2' }]}
      />
    </Space.Compact>
    <Space.Compact block>
      <TimePicker aria-label="Time" style={{ width: '70%' }} />
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
    <Space.Compact block>
      <TimePicker.RangePicker aria-label="Time range" />
      <TreeSelect aria-label="Please select"
        showSearch
        style={{ width: '60%' }}
        value="leaf1"
        styles={{
          popup: {
            root: { maxHeight: 400, overflow: 'auto' },
          },
        }}
        placeholder="Please select"
        allowClear
        treeDefaultExpandAll
        onChange={() => {}}
      >
        <TreeNode value="parent 1" title="parent 1">
          <TreeNode value="parent 1-0" title="parent 1-0">
            <TreeNode value="leaf1" title="leaf1" />
            <TreeNode value="leaf2" title="leaf2" />
          </TreeNode>
          <TreeNode value="parent 1-1" title="parent 1-1">
            <TreeNode value="leaf3" title={<b style={{ color: '#08c' }}>leaf3</b>} />
          </TreeNode>
        </TreeNode>
      </TreeSelect>
      <Button type="primary">Submit</Button>
    </Space.Compact>
    <Space.Compact>
      <Input aria-label="input here" placeholder="input here" />
      <Space.Addon>$</Space.Addon>
      <InputNumber aria-label="another input" placeholder="another input" style={{ width: '100%' }} />
      <InputNumber aria-label="another input" placeholder="another input" style={{ width: '100%' }} />
      <Space.Addon>$</Space.Addon>
    </Space.Compact>
    <Space.Compact>
      <Input aria-label="input here" placeholder="input here" />
      <ColorPicker />
    </Space.Compact>
    <Space.Compact>
      <Button type="primary">Button</Button>
      <Input aria-label="input here" placeholder="input here" />
      <Space.Addon>$</Space.Addon>
    </Space.Compact>
  </Space>
);

export default App;
