import React from 'react';
import { ConfigProvider, Divider, Typography } from '@fabi/ui';

const { Title, Paragraph, Text, Link } = Typography;

const blockContent = `FABi CMS helps restaurants run menus, orders, staff and reports from one place. It is built for busy teams: every screen favours clear information, fast actions and consistent patterns, so new staff learn it quickly and managers see what matters at a glance.`;

const App: React.FC = () => (
  <ConfigProvider
    theme={{
      components: {
        Typography: {
          fontWeightStrong: 700,
          titleMarginTop: '2.4em',
          titleMarginBottom: '1em',
          colorSuccessText: '#FF0000',
          colorWarningText: '#00FF00',
          colorErrorText: '#0000FF',
        },
      },
    }}
  >
    <Typography>
      <Title>Introduction</Title>
      <Paragraph>
        After massive project practice and summaries, FABi CMS, a design language for background
        applications, is refined by the FABi CMS team, which aims to{' '}
        <Text strong>
          uniform the user interface specs for internal background projects, lower the unnecessary
          cost of design differences and implementation and liberate the resources of design and
          front-end development
        </Text>
        .
      </Paragraph>
      <Title level={2}>Guidelines and Resources</Title>
      <Paragraph>
        We supply a series of design principles, practical patterns and high quality design
        resources (<Text code>Sketch</Text> and <Text code>Axure</Text>), to help people create
        their product prototypes beautifully and efficiently.
      </Paragraph>

      <Paragraph>
        <ul>
          <li>
            <Link href="/docs/spec/proximity">Principles</Link>
          </li>
          <li>
            <Link href="/docs/spec/overview">Patterns</Link>
          </li>
          <li>
            <Link href="/docs/resources">Resource Download</Link>
          </li>
        </ul>
      </Paragraph>

      <Paragraph>
        Press <Text keyboard>Esc</Text> to exit...
      </Paragraph>

      <Divider />

      <Title>介绍</Title>
      <Paragraph>
        随着商业化的趋势，越来越多的企业级产品对更好的用户体验有了进一步的要求。带着这样的一个终极目标，我们经过大量的项目实践和总结，逐步打磨出一个服务于企业级产品的设计体系
        FABi CMS。基于<Text mark>『确定』和『自然』</Text>
        的设计价值观，通过模块化的解决方案，降低冗余的生产成本，让设计者专注于
        <Text strong>更好的用户体验</Text>。
      </Paragraph>
      <Title level={2}>设计资源</Title>
      <Paragraph>
        我们提供完善的设计原则、最佳实践和设计资源文件（<Text code>Sketch</Text> 和
        <Text code>Axure</Text>），来帮助业务快速设计出高质量的产品原型。
      </Paragraph>

      <Paragraph>
        <ul>
          <li>
            <Link href="/docs/spec/proximity-cn">设计原则</Link>
          </li>
          <li>
            <Link href="/docs/spec/overview-cn">设计模式</Link>
          </li>
          <li>
            <Link href="/docs/resources-cn">设计资源</Link>
          </li>
        </ul>
      </Paragraph>

      <Paragraph>
        <blockquote>{blockContent}</blockquote>
        <pre>{blockContent}</pre>
      </Paragraph>

      <Paragraph>
        按<Text keyboard>Esc</Text>键退出阅读……
      </Paragraph>
    </Typography>

    <Typography.Text type="success">Success but red</Typography.Text>
    <Typography.Text type="warning">Warning but green</Typography.Text>
    <Typography.Text type="danger">Danger but blue</Typography.Text>
  </ConfigProvider>
);

export default App;
