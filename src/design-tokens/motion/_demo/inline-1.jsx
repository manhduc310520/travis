/**
 * inline: true
 */

import { Col, Row } from '@fabi/ui';

const text = [
  {
    title: 'Natural',
    img: '/mock-assets/illustration.svg',
    content:
      'The animation should based on law of nature. This assures the animation is smooth by its nature and intuitive to its users.',
  },
  {
    title: 'Performant',
    img: '/mock-assets/illustration.svg',
    content:
      'The animation should have a transition time as minimal as possible so that it serves its purpose in the most effective way.',
  },
  {
    title: 'Concise',
    img: '/mock-assets/illustration.svg',
    content:
      'The animation should be meaningful and justified. An over fancy animation will frustrate its users, and therefore should always be avoided.',
  },
];

function Principle() {
  const childrenToRender = text.map((item) => (
    <Col key={item.title} sm={24} md={8}>
      <div className="principle">
        <div>
          <img alt="" src={item.img} width="80%" />
        </div>
        <h4>{item.title}</h4>
        <p>{item.content}</p>
      </div>
    </Col>
  ));
  return (
    <div className="motion-principle-wrapper">
      <Row gutter={{ md: 32, sm: 0 }} className="principle-wrapper">
        {childrenToRender}
      </Row>
    </div>
  );
}

export default Principle;
