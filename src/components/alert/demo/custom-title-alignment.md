## en-US

When `description` is not set, Alert vertically centers the icon, content, action, and close button as a group. Ant Design does not switch this default layout to `flex-start` with token-derived offsets because customized `styles` may change font size, line height, or action size, making those offsets no longer match the actual rendered styles. When a wrapping title should align those elements with the first line, adjust them with semantic `styles`.
