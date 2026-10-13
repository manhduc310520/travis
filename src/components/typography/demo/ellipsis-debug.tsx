import React, { useState } from 'react';
import { Slider, Switch, Typography } from '@fabi/ui';

const { Text, Paragraph } = Typography;

const templateStr =
  'In the process of internal desktop applications development, many different design specs and implementations would be involved, which might cause designers and developers difficulties and duplication and reduce the efficiency of development.';

const text = `this is a multiline
  text that has many
  lines and
    - render like this
    - and this

  and that`;

const App: React.FC = () => {
  const [rows, setRows] = useState(1);
  const [longText, setLongText] = useState(true);
  const [copyable, setCopyable] = useState(false);
  const [editable, setEditable] = useState(false);
  const [expandable, setExpandable] = useState(false);
  const [display, setDisplay] = useState('none');

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDisplay('block');
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <Switch aria-label="Switch" checked={longText} checkedChildren="Long Text" onChange={setLongText} />
      <Switch aria-label="Switch" checked={copyable} onChange={setCopyable} />
      <Switch aria-label="Switch" checked={editable} onChange={setEditable} />
      <Switch aria-label="Switch" checked={expandable} onChange={setExpandable} />
      <Slider ariaLabelForHandle="Slider" value={rows} min={1} max={10} onChange={setRows} />
      {longText ? (
        <Paragraph ellipsis={{ rows, expandable }} copyable={copyable} editable={editable}>
          FABi CMS, a design language for background applications, is refined by the FABi CMS team.
          This is a nest sample{' '}
          <Text code strong delete>
            Test
          </Text>{' '}
          case. Bnt Design, a design language for background applications, is refined by FABi CMS
          Team. Cnt Design, a design language for background applications, is refined by FABi CMS
          Team. Dnt Design, a design language for background applications, is refined by FABi CMS
          Team. Ent Design, a design language for background applications, is refined by FABi CMS
          Team.
        </Paragraph>
      ) : (
        <Paragraph ellipsis={{ rows, expandable }} copyable={copyable} editable={editable}>
          Hello World
        </Paragraph>
      )}

      <Text style={{ maxWidth: 400, fontSize: 24 }} copyable ellipsis>
        {templateStr}
      </Text>

      <br />

      <Text style={{ maxWidth: 400, fontSize: 12 }} copyable ellipsis>
        {templateStr}
      </Text>

      <br />

      <Text style={{ width: 400, fontSize: 24 }} copyable ellipsis>
        {templateStr}
      </Text>

      <br />

      <Text style={{ width: 100 }} ellipsis copyable>
        FABi CMS is a design language for background applications, is refined by the FABi CMS team.
      </Text>

      <p>
        [Before]<Text ellipsis>not ellipsis</Text>[After]
      </p>

      <div style={{ display }}>
        <Text style={{ width: 100 }} ellipsis={{ tooltip: 'I am ellipsis now!' }}>
          默认 display none 样式的超长文字， 悬停 tooltip 失效了
        </Text>
      </div>

      <Typography.Paragraph
        style={{ width: 300 }}
        ellipsis={{ rows: 3, expandable: true, symbol: <span>Open</span> }}
      >
        {templateStr.slice(0, 60)}
        <span style={{ fontSize: '5em' }}>ANTD</span>
        {templateStr.slice(60)}
      </Typography.Paragraph>

      <pre>
        <Typography.Paragraph ellipsis={{ rows: 2, expandable: true }}>{text}</Typography.Paragraph>
      </pre>

      <br />

      <Text style={{ width: 100, whiteSpace: 'nowrap' }} ellipsis copyable>
        {templateStr}
      </Text>

      <div style={{ marginTop: 24 }}>
        <div style={{ marginBottom: 8, fontSize: 12, color: '#666' }}>
          <strong>Debug: copyable + ellipsis tooltips</strong>
          <br />
          1. Hover the text → ellipsis tooltip (full content) should show.
          <br />
          2. Hover the copy button → only &quot;Copy&quot; / &quot;Copied&quot; tooltip should show.
          <br />
          3. Move from copy button back to the text (without leaving the block) → ellipsis tooltip
          should show again.
        </div>
        <Text style={{ width: 280, display: 'block' }} ellipsis={{ tooltip: true }} copyable>
          {templateStr}
        </Text>
      </div>
    </>
  );
};

export default App;
