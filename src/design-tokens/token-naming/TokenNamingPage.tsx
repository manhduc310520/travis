// Design Tokens / Token Naming: hand-written FABi page (user 2026-10-16: the naming rule of the tokens in code, nothing
// about the design file). The token names are the underlying library's (FabiProvider changes values, not names); the
// size table reads its values live from the theme.
import { Markdown as DocMarkdown, Unstyled as DocUnstyled } from '@storybook/addon-docs/blocks'
import { theme } from '@fabi/ui'
import { useDocsLocale } from '../../../.storybook/locale'

const TEXT = {
  vi: {
    title: 'Đặt tên token',
    intro:
      'Mọi giá trị trong code (màu, khoảng cách, cỡ chữ, bo góc, bóng, chuyển động) lấy từ **token** của theme. `FabiProvider` chỉ đổi **giá trị** của token theo brand, Light / Dark và Compact, **không đổi tên**: tên token là tên của thư viện gốc. Trang này là quy tắc đọc và đặt tên token trong code.',
    tiers: `## 4 tầng token

| Tầng | Là gì | Ví dụ | Đặt ở đâu |
| --- | --- | --- | --- |
| Seed | Vài giá trị gốc, mọi token khác suy ra từ đây | \`colorPrimary\`, \`colorError\`, \`colorTextBase\`, \`fontSize\`, \`borderRadius\`, \`controlHeight\`, \`sizeUnit\` | Theme FABi (\`FabiProvider\`) |
| Map | Thuật toán suy ra từ seed: các bậc màu, các cỡ | \`colorPrimaryHover\`, \`colorPrimaryBg\`, \`fontSizeLG\`, \`borderRadiusLG\`, \`controlHeightSM\` | Thuật toán Light / Dark của FABi |
| Alias | Đặt theo chỗ dùng | \`colorTextSecondary\`, \`colorBgContainer\`, \`colorBorderSecondary\`, \`paddingXS\`, \`boxShadowTertiary\` | Thuật toán, đọc trong code |
| Component | Giá trị riêng của một component | \`Card.bodyPadding\`, \`Menu.iconSize\`, \`Button.onlyIconSize\` | \`theme.components.<Tên>\` trong theme FABi |

Trong code giao diện chỉ **đọc** token (\`theme.useToken()\` hoặc biến CSS), ưu tiên token Alias, rồi Map. Seed và token Component chỉ **đặt** trong theme FABi (\`packages/fabi-ui/src/theme.ts\`).`,
    anatomy: `## Cấu trúc tên

Tên token viết **camelCase**, ghép các phần từ chung đến riêng, phần nào không cần thì bỏ:

\`\`\`
thuộc tính + Vai trò + Phần + Trạng thái / Mức / Cỡ
\`\`\`

### Màu: \`color\` + Vai trò + Phần + Trạng thái

| Phần tên | Từ được dùng |
| --- | --- |
| Vai trò | \`Primary\`, \`Success\`, \`Warning\`, \`Error\`, \`Info\`, \`Link\` · trung tính: \`Text\`, \`Bg\`, \`Border\`, \`Fill\`, \`Split\` |
| Phần (màu vai trò) | không có = màu đặc · \`Bg\` nền nhạt · \`Border\` viền · \`Text\` chữ |
| Trạng thái | \`Hover\`, \`Active\`, \`Disabled\` |
| Mức (trung tính) | không có → \`Secondary\` → \`Tertiary\` → \`Quaternary\` (nhạt dần) |
| Lớp nền | \`colorBgLayout\` nền trang → \`colorBgContainer\` card, bảng, form → \`colorBgElevated\` modal, dropdown, popover |

| Token | Đọc là |
| --- | --- |
| \`colorPrimary\` / \`colorPrimaryHover\` / \`colorPrimaryActive\` | màu chính, khi rê chuột, khi bấm |
| \`colorPrimaryBg\` / \`colorPrimaryBgHover\` | nền nhạt của màu chính (mục menu đang chọn) |
| \`colorPrimaryBorder\` / \`colorPrimaryText\` | viền, chữ theo màu chính |
| \`colorErrorBorderHover\` | viền màu lỗi khi rê chuột |
| \`colorText\` / \`colorTextSecondary\` / \`colorTextTertiary\` / \`colorTextQuaternary\` | chữ chính, phụ, mô tả, placeholder |
| \`colorTextLightSolid\` | chữ trắng trên nền đặc (nút chính) |

### Kích thước: thuộc tính + Cỡ

| Phần tên | Từ được dùng |
| --- | --- |
| Thuộc tính | \`padding\`, \`margin\`, \`size\`, \`fontSize\`, \`lineHeight\`, \`controlHeight\`, \`borderRadius\`, \`screen\` |
| Cỡ | \`XXS\` · \`XS\` · \`SM\` · (không có = cỡ gốc) · \`MD\` · \`LG\` · \`XL\` · \`XXL\` |
| Tiêu đề | \`fontSizeHeading1\`…\`fontSizeHeading5\`, \`lineHeightHeading1\`…\`lineHeightHeading5\` |

Giá trị hiện tại (đọc trực tiếp từ theme):`,
    others: `### Bóng, chuyển động, nét

| Nhóm | Token |
| --- | --- |
| Bóng | \`boxShadow\` (bề mặt nổi: modal, dropdown) · \`boxShadowSecondary\` · \`boxShadowTertiary\` (nhẹ nhất: card, card bấm được khi rê chuột) |
| Chuyển động | \`motionDurationFast\` / \`motionDurationMid\` / \`motionDurationSlow\`, \`motionEaseInOut\`, \`motionEaseOut\`… |
| Nét | \`lineWidth\`, \`lineType\`, \`lineWidthFocus\` |
| Chữ | \`fontFamily\`, \`fontWeightStrong\` |`,
    css: `## Trong TypeScript và CSS

Trong component, đọc token bằng \`theme.useToken()\`:

\`\`\`tsx
import { theme } from '@fabi/ui'

const { token } = theme.useToken()
<div style={{ padding: token.paddingXS, background: token.colorPrimaryBg, borderRadius: token.borderRadiusLG }} />
\`\`\`

Trong CSS, mỗi token là một biến CSS: tên token đổi sang **kebab-case** và thêm tiền tố \`--fabi-\`. Token Component thêm tên component. Biến có sẵn trong mọi phần tử nằm trong \`FabiProvider\`:

| Token | Biến CSS |
| --- | --- |
| \`colorPrimaryBg\` | \`--fabi-color-primary-bg\` |
| \`fontSizeHeading3\` | \`--fabi-font-size-heading-3\` |
| \`boxShadowTertiary\` | \`--fabi-box-shadow-tertiary\` |
| \`Card.bodyPadding\` | \`--fabi-card-body-padding\` |

\`\`\`css
.summary {
  padding: var(--fabi-padding-xs);
  border-radius: var(--fabi-border-radius-lg);
  background: var(--fabi-color-bg-container);
}
\`\`\`

Class của component cũng dùng tiền tố \`fabi\`: \`.fabi-btn\`, \`.fabi-card\`, icon \`.fabi-icon\`.`,
    adding: `## Khi cần một giá trị mới

1. **Tìm token có sẵn trước**: các trang Colors, Font, Layout, Shadow, Motion và mục *Design Token* trên trang từng component.
2. **Giá trị riêng của một component**: đặt token Component trong \`theme.ts\`, \`components.<Tên>.<token>\`, dùng đúng tên token mà trang component đó liệt kê. Ví dụ \`Card: { bodyPadding: 16 }\`.
3. **Giá trị không có token** (ví dụ khung cắt ảnh nền, màu lớp phủ theo design): hằng số tên **UPPER_SNAKE_CASE** đặt cạnh chỗ dùng, kèm chú thích vì sao không có token: \`const PILL_BACKGROUND = 'rgba(0, 0, 0, 0.6)'\`. Dùng chung trong \`@fabi/ui\` thì export từ \`theme.ts\`, như \`FONT_WEIGHT_MEDIUM\`.
4. **Không thêm tên mới vào \`theme.token\`**: kiểu của theme không có tên đó (TypeScript báo lỗi) và không component nào đọc nó.`,
    donts: `## Không nên

- Dán mã hex, rgb hay số px trong component: dùng token.
- Dùng biến \`--ant-*\` hay class \`.ant-*\`: tiền tố là \`fabi\`.
- Tự đặt tên khác cho token có sẵn (\`primaryColor\`, \`paddingSmall\`, \`clrPrimary\`): dùng đúng tên token, đúng thứ tự các phần.
- Đặt tên theo màu cho vai trò giao diện (\`blueButton\`): tên màu (\`blue\`, \`orange\`…) chỉ dùng cho phân loại, như \`color\` của Tag hay StatisticCard.
- Lấy thẳng một bậc trong dải màu (\`geekblue[6]\`) trong code giao diện: dùng token vai trò. Chỉ \`theme.ts\` đọc dải màu.`,
    cols: ['Token', 'Biến CSS', 'Giá trị'],
  },
  en: {
    title: 'Token Naming',
    intro:
      'Every value in code (colour, spacing, font size, radius, shadow, motion) comes from a **token** of the theme. `FabiProvider` changes the token **values** for the brand, Light / Dark and Compact, **not the names**: the token names are those of the underlying library. This page is the rule for reading and naming tokens in code.',
    tiers: `## 4 tiers of tokens

| Tier | What it is | Examples | Set in |
| --- | --- | --- | --- |
| Seed | A few base values every other token is derived from | \`colorPrimary\`, \`colorError\`, \`colorTextBase\`, \`fontSize\`, \`borderRadius\`, \`controlHeight\`, \`sizeUnit\` | The FABi theme (\`FabiProvider\`) |
| Map | Derived from a seed by the algorithm: colour steps, sizes | \`colorPrimaryHover\`, \`colorPrimaryBg\`, \`fontSizeLG\`, \`borderRadiusLG\`, \`controlHeightSM\` | The FABi Light / Dark algorithms |
| Alias | Named by where it is used | \`colorTextSecondary\`, \`colorBgContainer\`, \`colorBorderSecondary\`, \`paddingXS\`, \`boxShadowTertiary\` | The algorithms; read in code |
| Component | One component's own values | \`Card.bodyPadding\`, \`Menu.iconSize\`, \`Button.onlyIconSize\` | \`theme.components.<Name>\` in the FABi theme |

UI code only **reads** tokens (\`theme.useToken()\` or CSS variables), Alias tokens first, then Map. Seeds and Component tokens are only **set** in the FABi theme (\`packages/fabi-ui/src/theme.ts\`).`,
    anatomy: `## Name anatomy

Token names are **camelCase**, built from general to specific; parts that are not needed are left out:

\`\`\`
property + Role + Part + State / Level / Scale
\`\`\`

### Colour: \`color\` + Role + Part + State

| Part of the name | Allowed words |
| --- | --- |
| Role | \`Primary\`, \`Success\`, \`Warning\`, \`Error\`, \`Info\`, \`Link\` · neutral: \`Text\`, \`Bg\`, \`Border\`, \`Fill\`, \`Split\` |
| Part (role colours) | none = the solid colour · \`Bg\` light background · \`Border\` · \`Text\` |
| State | \`Hover\`, \`Active\`, \`Disabled\` |
| Level (neutral) | none → \`Secondary\` → \`Tertiary\` → \`Quaternary\` (lighter each step) |
| Surface layers | \`colorBgLayout\` page → \`colorBgContainer\` card, table, form → \`colorBgElevated\` modal, dropdown, popover |

| Token | Reads as |
| --- | --- |
| \`colorPrimary\` / \`colorPrimaryHover\` / \`colorPrimaryActive\` | the primary colour, on hover, when pressed |
| \`colorPrimaryBg\` / \`colorPrimaryBgHover\` | the primary's light background (selected menu item) |
| \`colorPrimaryBorder\` / \`colorPrimaryText\` | border, text in the primary colour |
| \`colorErrorBorderHover\` | the error border on hover |
| \`colorText\` / \`colorTextSecondary\` / \`colorTextTertiary\` / \`colorTextQuaternary\` | main, secondary, description, placeholder text |
| \`colorTextLightSolid\` | white text on a solid fill (primary button) |

### Size: property + Scale

| Part of the name | Allowed words |
| --- | --- |
| Property | \`padding\`, \`margin\`, \`size\`, \`fontSize\`, \`lineHeight\`, \`controlHeight\`, \`borderRadius\`, \`screen\` |
| Scale | \`XXS\` · \`XS\` · \`SM\` · (none = the base size) · \`MD\` · \`LG\` · \`XL\` · \`XXL\` |
| Headings | \`fontSizeHeading1\`…\`fontSizeHeading5\`, \`lineHeightHeading1\`…\`lineHeightHeading5\` |

Current values (read live from the theme):`,
    others: `### Shadow, motion, lines

| Group | Tokens |
| --- | --- |
| Shadow | \`boxShadow\` (floating surfaces: modal, dropdown) · \`boxShadowSecondary\` · \`boxShadowTertiary\` (the lightest: cards, a clickable card on hover) |
| Motion | \`motionDurationFast\` / \`motionDurationMid\` / \`motionDurationSlow\`, \`motionEaseInOut\`, \`motionEaseOut\`… |
| Lines | \`lineWidth\`, \`lineType\`, \`lineWidthFocus\` |
| Text | \`fontFamily\`, \`fontWeightStrong\` |`,
    css: `## In TypeScript and CSS

In a component, read tokens with \`theme.useToken()\`:

\`\`\`tsx
import { theme } from '@fabi/ui'

const { token } = theme.useToken()
<div style={{ padding: token.paddingXS, background: token.colorPrimaryBg, borderRadius: token.borderRadiusLG }} />
\`\`\`

In CSS, every token is a CSS variable: the token name in **kebab-case** with the \`--fabi-\` prefix. Component tokens add the component name. The variables are set on every element inside \`FabiProvider\`:

| Token | CSS variable |
| --- | --- |
| \`colorPrimaryBg\` | \`--fabi-color-primary-bg\` |
| \`fontSizeHeading3\` | \`--fabi-font-size-heading-3\` |
| \`boxShadowTertiary\` | \`--fabi-box-shadow-tertiary\` |
| \`Card.bodyPadding\` | \`--fabi-card-body-padding\` |

\`\`\`css
.summary {
  padding: var(--fabi-padding-xs);
  border-radius: var(--fabi-border-radius-lg);
  background: var(--fabi-color-bg-container);
}
\`\`\`

Component classes use the \`fabi\` prefix too: \`.fabi-btn\`, \`.fabi-card\`, icons \`.fabi-icon\`.`,
    adding: `## When you need a new value

1. **Look for an existing token first**: the Colors, Font, Layout, Shadow and Motion pages, and the *Design Token* section of each component page.
2. **A value for one component**: set a Component token in \`theme.ts\`, \`components.<Name>.<token>\`, with the exact token name that component's page lists. For example \`Card: { bodyPadding: 16 }\`.
3. **A value with no token** (for example a photo crop, an overlay colour from the design): an **UPPER_SNAKE_CASE** constant next to where it is used, with a comment saying why there is no token: \`const PILL_BACKGROUND = 'rgba(0, 0, 0, 0.6)'\`. Shared inside \`@fabi/ui\`: export it from \`theme.ts\`, like \`FONT_WEIGHT_MEDIUM\`.
4. **Don't add new names to \`theme.token\`**: the theme types don't know them (TypeScript reports an error) and no component reads them.`,
    donts: `## Don't

- Paste hex, rgb or px numbers in a component: use a token.
- Use \`--ant-*\` variables or \`.ant-*\` classes: the prefix is \`fabi\`.
- Give an existing token another name (\`primaryColor\`, \`paddingSmall\`, \`clrPrimary\`): use the exact token name, parts in the same order.
- Name UI roles by hue (\`blueButton\`): hue names (\`blue\`, \`orange\`…) are only for categories, like the \`color\` of a Tag or a StatisticCard.
- Read a palette step (\`geekblue[6]\`) in UI code: use the role token. Only \`theme.ts\` reads the palettes.`,
    cols: ['Token', 'CSS variable', 'Value'],
  },
}

// the size tokens shown live, in scale order (all in px)
const SIZE_TOKENS = [
  'paddingXXS', 'paddingXS', 'paddingSM', 'padding', 'paddingMD', 'paddingLG', 'paddingXL',
  'fontSizeSM', 'fontSize', 'fontSizeLG', 'fontSizeHeading3',
  'controlHeightSM', 'controlHeight', 'controlHeightLG',
  'borderRadiusSM', 'borderRadius', 'borderRadiusLG',
] as const

/** colorPrimaryBg → --fabi-color-primary-bg (the CSS variable the theme writes) */
const cssVar = (name: string) => `--fabi-${name.replace(/([a-z])([A-Z0-9])/g, '$1-$2').toLowerCase()}`

const cell = { padding: '8px 12px', borderBottom: '1px solid rgba(0,0,0,0.06)', textAlign: 'start' as const }

export default function TokenNamingPage() {
  const lang = useDocsLocale() === 'vi' ? 'vi' : 'en'
  const t = TEXT[lang]
  const { token } = theme.useToken()
  return (
    <>
      <h1 className="fabi-sb-page-title">{t.title}</h1>
      <DocMarkdown>{`${t.intro}\n\n${t.tiers}\n\n${t.anatomy}`}</DocMarkdown>
      <DocUnstyled>
        <div className="fabi-sb-block" style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                {t.cols.map((c) => (
                  <th key={c} scope="col" style={cell}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZE_TOKENS.map((name) => (
                <tr key={name}>
                  <td style={cell}><code>{name}</code></td>
                  <td style={cell}><code>{cssVar(name)}</code></td>
                  <td style={cell}>{token[name]}px</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocUnstyled>
      <DocMarkdown>{`${t.others}\n\n${t.css}\n\n${t.adding}\n\n${t.donts}`}</DocMarkdown>
    </>
  )
}
