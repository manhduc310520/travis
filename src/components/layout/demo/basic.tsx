import React from 'react';
import { Flex, Layout } from '@fabi/ui';

const { Header, Footer, Sider, Content } = Layout;

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 48,
  lineHeight: '64px',
  backgroundColor: '#0958d9',
};

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#0958d9',
};

const siderStyle: React.CSSProperties = {
  textAlign: 'center',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#0958d9',
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#0958d9',
};

const layoutStyle = {
  borderRadius: 8,
  overflow: 'hidden',
  width: 'calc(50% - 8px)',
  maxWidth: 'calc(50% - 8px)',
};

const App: React.FC = () => (
  <Flex gap="medium" wrap>
    <Layout style={layoutStyle}>
      <Header role="group" aria-label="Header 1" style={headerStyle}>Header</Header>
      <Content style={contentStyle}>Content</Content>
      <Footer role="group" aria-label="Footer 1" style={footerStyle}>Footer</Footer>
    </Layout>

    <Layout style={layoutStyle}>
      <Header role="group" aria-label="Header 2" style={headerStyle}>Header</Header>
      <Layout>
        <Sider role="region" aria-label="Sider 1" width="25%" style={siderStyle}>
          Sider
        </Sider>
        <Content style={contentStyle}>Content</Content>
      </Layout>
      <Footer role="group" aria-label="Footer 2" style={footerStyle}>Footer</Footer>
    </Layout>

    <Layout style={layoutStyle}>
      <Header role="group" aria-label="Header 3" style={headerStyle}>Header</Header>
      <Layout>
        <Content style={contentStyle}>Content</Content>
        <Sider role="region" aria-label="Sider 2" width="25%" style={siderStyle}>
          Sider
        </Sider>
      </Layout>
      <Footer role="group" aria-label="Footer 3" style={footerStyle}>Footer</Footer>
    </Layout>

    <Layout style={layoutStyle}>
      <Sider role="region" aria-label="Sider 3" width="25%" style={siderStyle}>
        Sider
      </Sider>
      <Layout>
        <Header role="group" aria-label="Header 4" style={headerStyle}>Header</Header>
        <Content style={contentStyle}>Content</Content>
        <Footer role="group" aria-label="Footer 4" style={footerStyle}>Footer</Footer>
      </Layout>
    </Layout>
  </Flex>
);

export default App;
