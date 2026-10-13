import React from 'react';
import { CopyOutlined, SearchOutlined } from '@fabi/ui/icons';
import { Button, Cascader, Flex, Input, InputNumber, Select, Space, TimePicker } from '@fabi/ui';

const App: React.FC = () => (
  <Flex vertical gap="medium">
    <Space.Compact block>
      <Space.Compact>
        <Space.Compact>
          <Input aria-label="Typing..." style={{ width: 90 }} placeholder="Typing..." />
          <Button icon={<SearchOutlined />} />
        </Space.Compact>
        <Space.Compact>
          <InputNumber aria-label="Number" defaultValue={12} />
          <Select aria-label="Select"
            defaultValue="Option1"
            options={[
              { label: 'Opt1', value: 'Option1' },
              { label: 'Opt2', value: 'Option2' },
            ]}
          />
        </Space.Compact>
      </Space.Compact>
      <Button type="primary">Separator</Button>
      <Space.Compact>
        <Space.Compact>
          <Input.Search aria-label="Search" style={{ width: 110 }} placeholder="Search" />
          <Button type="primary">Submit</Button>
        </Space.Compact>
        <Space.Compact>
          <Input aria-label="Input" defaultValue="mysite" />
          <Button icon={<CopyOutlined />} />
        </Space.Compact>
      </Space.Compact>
    </Space.Compact>

    <Space.Compact block>
      <Space.Compact>
        <TimePicker aria-label="Time" />
        <Button type="primary">Submit</Button>
      </Space.Compact>
      <Button type="primary">~</Button>
      <Button type="primary">~</Button>
      <Space.Compact>
        <Cascader aria-label="Select Address"
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
        <Button type="primary">Submit</Button>
      </Space.Compact>
    </Space.Compact>

    <Space.Compact>
      <Button color="default" variant="solid">
        Button 1
      </Button>
      <Button color="default" variant="solid">
        Button 2
      </Button>
      <Button color="danger" variant="solid">
        Button 3
      </Button>
      <Button color="danger" variant="solid">
        Button 4
      </Button>
    </Space.Compact>
  </Flex>
);

export default App;
