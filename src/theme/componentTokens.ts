/**
 * Component-scope token overrides, exported from Figma.
 *
 * Source: Figma `hneVCBNUiPizVorg7Jp18G` -> collection `5. Components`,
 * every variable matching `Components/<Component>/Component/<token>`.
 *
 * These are the numeric and string tokens only. They do not change with the
 * brand, so one copy serves all ten themes. Colour tokens are derived from the
 * seed by Ant Design's algorithm — see `themes.ts`.
 *
 * Resolved with Dimensions = Default and Typography = Default.
 */
export const componentTokens = {
  Alert: { withDescriptionIconSize: 24 },
  Anchor: { linkPaddingBlock: 4, linkPaddingInlineStart: 16 },
  AutoComplete: { optionFontSize: 14, optionHeight: 32 },
  Avatar: {
    containerSize: 32, containerSizeLG: 40, containerSizeSM: 24,
    groupOverlapping: -8,
    iconFontSize: 18, iconFontSizeLG: 24, iconFontSizeSM: 14,
    textFontSize: 18, textFontSizeLG: 24, textFontSizeSM: 14,
  },
  Badge: {
    dotSize: 6, indicatorHeight: 20, indicatorHeightSM: 14,
    statusSize: 6, textFontSize: 12, textFontSizeSM: 12,
  },
  Breadcrumb: { iconFontSize: 14, separatorMargin: 8 },
  Button: {
    contentFontSize: 14, contentFontSizeLG: 16, contentFontSizeSM: 14,
    // Ratios, not px: Ant Design multiplies these by the font size.
    // Figma holds 22px at 14px and 24px at 16px.
    contentLineHeight: 22 / 14, contentLineHeightLG: 24 / 16, contentLineHeightSM: 22 / 14,
    fontWeight: 400,
    onlyIconSize: 16, onlyIconSizeLG: 18, onlyIconSizeSM: 14,
    paddingInline: 15, paddingInlineLG: 15, paddingInlineSM: 7,
  },
  Calendar: { miniContentHeight: 256, monthControlWidth: 70, yearControlWidth: 80 },
  Card: {
    bodyPadding: 16, bodyPaddingSM: 12,
    fontHeight: 22, fontSize: 14, fontSizeLG: 16, fontWeightStrong: 600,
    headerFontSize: 12, headerFontSizeSM: 14,
    headerHeight: 56, headerHeightSM: 38,
    headerPadding: 16, headerPaddingSM: 12,
    lineHeight: 22 / 14, lineWidth: 1,
  },
  Carousel: {
    arrowOffset: 8, arrowSize: 16,
    dotActiveWidth: 24, dotGap: 4, dotHeight: 3, dotOffset: 12, dotWidth: 16,
  },
  Cascader: {
    controlItemWidth: 111, controlWidth: 184, dropdownHeight: 180,
    menuPadding: 4, optionSelectedFontWeight: 600,
  },
  DatePicker: {
    cellHeight: 24, cellWidth: 36,
    inputFontSize: 14, inputFontSizeLG: 16, inputFontSizeSM: 12,
    multipleItemHeight: 24, multipleItemHeightLG: 32, multipleItemHeightSM: 16,
    paddingBlock: 4, paddingBlockLG: 7, paddingBlockSM: 0,
    paddingInline: 11, paddingInlineLG: 11, paddingInlineSM: 7,
    presetsMaxWidth: 200, presetsWidth: 120,
    textHeight: 40, timeCellHeight: 28, timeColumnHeight: 224, timeColumnWidth: 56,
    withoutTimeCellHeight: 66,
  },
  Descriptions: {
    colonMarginLeft: 2, colonMarginRight: 8,
    itemPaddingBottom: 16, itemPaddingEnd: 16, titleMarginBottom: 20,
  },
  Divider: { verticalMarginInline: 8 },
  Drawer: { footerPaddingBlock: 8, footerPaddingInline: 16 },
  Dropdown: { paddingBlock: 5 },
  Form: {
    itemMarginBottom: 16, labelColonMarginInlineEnd: 8,
    labelColonMarginInlineStart: 2, labelFontSize: 14, labelHeight: 32,
  },
  Image: { previewOperationSize: 18 },
  Input: {
    inputFontSize: 14, inputFontSizeLG: 16, inputFontSizeSM: 12,
    paddingBlock: 4, paddingBlockLG: 7, paddingBlockSM: 0,
    paddingInline: 11, paddingInlineLG: 11, paddingInlineSM: 7,
  },
  InputNumber: {
    controlWidth: 90, handleWidth: 22,
    inputFontSize: 14, inputFontSizeLG: 16, inputFontSizeSM: 12,
    paddingBlock: 4, paddingBlockLG: 7, paddingBlockSM: 0,
    paddingInline: 11, paddingInlineLG: 11, paddingInlineSM: 7,
  },
  Layout: { headerHeight: 64, triggerHeight: 48, zeroTriggerHeight: 40, zeroTriggerWidth: 40 },
  List: { avatarMarginRight: 16, descriptionFontSize: 14 },
  Menu: {
    activeBarBorderWidth: 1, collapsedIconSize: 16, collapsedWidth: 80,
    dropdownWidth: 160, groupTitleFontSize: 14, groupTitleLineHeight: 22 / 14,
    iconMarginInlineEnd: 10, iconSize: 14,
    itemBorderRadius: 8, itemHeight: 32,
    itemMarginBlock: 8, itemMarginInline: 4, itemPaddingInline: 16,
    horizontalLineHeight: '46px', subMenuItemBorderRadius: 4,
  },
  Mentions: { controlItemWidth: 100 },
  Modal: { titleFontSize: 16, titleLineHeight: 22 / 16 },
  Notification: { width: 384 },
  Pagination: { itemSize: 32, itemSizeLG: 40, itemSizeSM: 24, miniOptionsSizeChangerTop: 0 },
  Popover: { titleMinWidth: 177 },
  Progress: { lineBorderRadius: 100 },
  Radio: { buttonPaddingInline: 15, dotSize: 8, radioSize: 16, wrapperMarginInlineEnd: 8 },
  Rate: { starSize: 20, starSizeLG: 25, starSizeSM: 15 },
  Result: { iconFontSize: 42, subtitleFontSize: 14, titleFontSize: 24 },
  Segmented: { trackPadding: 2 },
  Select: {
    multipleItemHeight: 24, multipleItemHeightLG: 32, multipleItemHeightSM: 16,
    optionHeight: 32, optionLineHeight: 22 / 14, optionSelectedFontWeight: 600,
    showArrowPaddingInlineEnd: 18, singleItemHeightLG: 40,
  },
  Skeleton: { blockRadius: 4, paragraphLiHeight: 16, paragraphMarginTop: 28, titleHeight: 16 },
  Slider: {
    controlSize: 10, dotSize: 8, handleLineWidth: 2, handleLineWidthHover: 2.5,
    handleSize: 10, handleSizeHover: 12, railSize: 4,
  },
  Spin: { contentHeight: 400, dotSize: 20, dotSizeLG: 32, dotSizeSM: 14 },
  Splitter: { splitBarDraggableSize: 20, splitBarSize: 2, splitTriggerSize: 6 },
  Statistic: { contentFontSize: 24, titleFontSize: 14 },
  Steps: {
    customIconFontSize: 24, descriptionMaxWidth: 140,
    dotCurrentSize: 10, dotSize: 8,
    // titleLineHeight is px here: Ant Design defaults it to `token.controlHeight`.
    iconFontSize: 14, iconSize: 32, iconSizeSM: 24, titleLineHeight: 32,
  },
  Switch: {
    handleSize: 18, handleSizeSM: 12,
    innerMaxMargin: 24, innerMaxMarginSM: 18,
    innerMinMargin: 9, innerMinMarginSM: 6,
    trackHeight: 22, trackHeightSM: 16, trackMinWidth: 44, trackMinWidthSM: 28,
    trackPadding: 2,
  },
  Table: {
    cellFontSize: 14, cellFontSizeMD: 14, cellFontSizeSM: 14,
    cellPaddingBlock: 16, cellPaddingBlockMD: 12, cellPaddingBlockSM: 8,
    cellPaddingInline: 16, cellPaddingInlineMD: 8, cellPaddingInlineSM: 8,
    headerBorderRadius: 8, selectionColumnWidth: 32,
    stickyScrollBarBorderRadius: 100,
  },
  Tabs: {
    cardGutter: 2, cardHeight: 40, cardHeightLG: 48,
    horizontalItemGutter: 32,
    titleFontSize: 14, titleFontSizeLG: 16, titleFontSizeSM: 14,
  },
  TimePicker: {
    cellHeight: 24, cellWidth: 36,
    inputFontSize: 14, inputFontSizeLG: 16, inputFontSizeSM: 12,
    multipleItemHeight: 24, multipleItemHeightLG: 32, multipleItemHeightSM: 16,
    paddingBlock: 4, paddingBlockLG: 7, paddingBlockSM: 0,
    paddingInline: 11, paddingInlineLG: 11, paddingInlineSM: 7,
    presetsMaxWidth: 200, presetsWidth: 120,
    textHeight: 40, timeCellHeight: 28, timeColumnHeight: 224, timeColumnWidth: 56,
    withoutTimeCellHeight: 66,
  },
  Timeline: { itemPaddingBottom: 20, tailWidth: 2 },
  Tooltip: { maxWidth: 250 },
  Tour: { closeBtnSize: 22 },
  Transfer: {
    headerHeight: 40, itemHeight: 32, itemPaddingBlock: 5,
    listHeight: 200, listWidth: 180, listWidthLG: 250,
  },
  Tree: { indentSize: 24, titleHeight: 24 },
  TreeSelect: { titleHeight: 24 },
  Upload: { pictureCardSize: 102 },
} as const

/**
 * Values dropped during export because the Figma source holds something Ant
 * Design cannot accept. Fix these in Figma, then re-export.
 *
 * - `Select/optionFontSize`  = "Inter"  — a font family in a font-size token
 * - `Menu/itemPaddingBlock 2`           — stray name with a space and a suffix
 * - `Button/line` = 1.2000000476837158  — not an Ant Design Button token
 * - `DatePicker/handleFontSize` = 7     — not an Ant Design DatePicker token
 * - `Card/fontFamily`, `Select/fontFamily` — belong on the global token, not per component
 */
export const skippedFromFigma = [
  'Select/optionFontSize',
  'Menu/itemPaddingBlock 2',
  'Button/line',
  'DatePicker/handleFontSize',
  'Card/fontFamily',
  'Select/fontFamily',
] as const
