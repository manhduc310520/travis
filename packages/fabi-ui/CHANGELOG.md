# Changelog

All notable changes to `@fabi/ui`. Versions follow [semver](https://semver.org): a minor version adds
components or options, a patch fixes things, a major version can break existing code.

## 0.2.0 (2026-10-13)

### Added
- **Icons** `@fabi/ui/fabi-icons`: the FABi icon set, 1,174 line + 1,187 solid icons on a 24 × 24 grid
  (`Home03Line` / `Home03Solid`). Line by default, solid for the selected state.
- **StatisticCard**: one figure of a dashboard (`default` with an icon tile, `primary` on the brand surface), trend,
  comparison, loading / empty / error states, clickable.
- **SearchModal** (+ `SearchModal.Panel`): the feature search: history, grouped results, accent-insensitive
  matching, keyboard (↑ ↓ Enter Esc), no-result and loading states.
- **PageHeader**: breadcrumb, back, title (h1), tags, description, actions, footer (filters, tabs). Without a
  title the breadcrumb and the actions share one row and the last breadcrumb item becomes a hidden h1.
- **FilterBar**: the filter row above a list, with "Xoá bộ lọc", small `tools` after the fields (column
  settings) and list actions; fields full width on phones.
- **Formats**: `formatMoney`, `formatNumber`, `formatPercent`, `formatDate`, `formatDateTime`, `DATE_FORMAT`,
  `DATE_TIME_FORMAT` (vi-VN: 9.615.933 ₫, 12,5%, 02/11/2026 14:05).
- **Charts** `@fabi/ui/charts`: Ant's statistical charts (`@ant-design/plots` 2.6.7).

### Changed
- SearchModal, StatisticCard, PageHeader and FilterBar draw their own texts ("Quay lại", "Xoá bộ lọc", "Chưa có dữ
  liệu"…) in Vietnamese by default and in English when the app gives an English antd locale (`locale={enUS}` on
  FabiProvider). StatisticCard `emptyText` has no fixed default any more (it follows the language).
- Theme: Menu icons and icon-only Buttons are 16px (antd 14 / inherit); Menu icon gap 8px.
- Theme: every `Layout.Header` uses the brand gradient; Card radius 8px, padding 16px.
- Form: the required `*` sits right after the label text; vertical forms no longer reserve space for the hidden colon.
- `theme.defaultAlgorithm` / `theme.darkAlgorithm` are FABi's, so a nested area switching mode keeps FABi's
  accessible colours. A nested `FabiProvider` does not inherit the outer theme.

### Fixed
- Accessibility patches: the hidden measure row of a scrolling Table no longer puts its select-all checkbox in the
  tab order (inputs, buttons and other focusable items in that row).
- Accessibility patches: the canvas of a `QRCode` gets a name (the QRCode's `aria-label`, or "QR code").

## 0.1.0 (2026-10-01)

- First version: Ant Design 6.6.5 re-exported with the FABi CMS theme (5 brands × Light / Dark), the `fabi-` class
  prefix, `--fabi-*` CSS variables, Vietnamese locale and accessibility patches.
