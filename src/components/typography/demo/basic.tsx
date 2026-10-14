import React from 'react';
import { Divider, Typography } from '@fabi/ui';

const { Title, Paragraph, Text, Link } = Typography;

const blockContent = `FABi CMS helps restaurants run menus, orders, staff and reports from one place. It is built for busy teams: every screen favours clear information, fast actions and consistent patterns, so new staff learn it quickly and managers see what matters at a glance.`;

const App: React.FC = () => (
  <Typography>
    <Title>Introduction</Title>

    <Paragraph>
      A restaurant group runs menus, orders, staff and stock in many branches. When every branch keeps
      its own spreadsheets and habits, prices drift apart, reports disagree and new staff need longer to
      learn the job.
    </Paragraph>

    <Paragraph>
      FABi CMS brings this work into one back office, which aims to{' '}
      <Text strong>
        keep every branch on the same menu, prices and processes, cut the time spent on daily reports
        and let managers see sales and stock at a glance
      </Text>
      .
    </Paragraph>

    <Title level={2}>Guides and Resources</Title>

    <Paragraph>
      Each module comes with short guides, checklists and import templates (<Text code>Excel</Text> and{' '}
      <Text code>CSV</Text>), so a new branch can set up its menu and tables in a day.
    </Paragraph>

    <Paragraph>
      <ul>
        <li>
          <Link href="https://example.com">Menu setup guide</Link>
        </li>
        <li>
          <Link href="https://example.com">Opening checklist</Link>
        </li>
        <li>
          <Link href="https://example.com">Import templates</Link>
        </li>
      </ul>
    </Paragraph>

    <Paragraph>
      Press <Text keyboard>Esc</Text> to exit...
    </Paragraph>
  </Typography>
);

export default App;
