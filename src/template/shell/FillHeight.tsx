// FillHeight: an empty state (or any block) that grows so its card reaches the bottom of the screen, instead of
// leaving a strip of page background under it (user 2026-10-17: "full height", every empty state). The content is
// centred in the grown block. It measures the card (`fill` = the element whose bottom should meet the screen
// bottom, minus `gap`) after layout and on resize; the block never shrinks below its own height.
import React, { useLayoutEffect, useRef, useState } from 'react';
import { Flex, theme } from '@fabi/ui';

const FillHeight: React.FC<{ children: React.ReactNode; fill?: string }> = ({ children, fill = '.fabi-card' }) => {
  const { token } = theme.useToken();
  const ref = useRef<HTMLDivElement>(null);
  const [extra, setExtra] = useState(0);
  useLayoutEffect(() => {
    const measure = () => {
      const el = ref.current;
      const box = el?.closest<HTMLElement>(fill) ?? el;
      if (!el || !box) return;
      setExtra((prev) => {
        // the box's bottom without the extra already added; the page's bottom gap = the content padding
        const natural = box.getBoundingClientRect().bottom + window.scrollY - prev;
        return Math.max(0, Math.round(window.innerHeight - token.padding - natural));
      });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [fill, token.padding]);
  return (
    <Flex ref={ref} vertical align="center" justify="center" style={{ paddingBlock: extra / 2 }}>
      {children}
    </Flex>
  );
};

export default FillHeight;
