# Bảng đổi tên `fc` — giai đoạn 1 (chờ duyệt)

> Tài liệu tạm thời. Xóa khi hoàn tất chuyển đổi. Sinh từ `build_map.py`.

342 biến thuộc 4 collection: đổi tên 331, xóa 11. Không trùng tên. Collection `5. Components` chưa đổi ở giai đoạn này.

## Tên collection

| Hiện tại | Mới |
|---|---|
| `1. Brand` | `fc · 1. Brand` |
| `2. Colors` | `fc · 2. Colors` |
| `3. Dimensions` | `fc · 3. Dimensions` |
| `4. Typography` | `fc · 4. Typography` |

## Dải màu gốc (120 biến đổi tên theo quy tắc, 10 biến xóa)

`Colors/Base/{Dải}/{n}` → `global/color/{dải}-{n}`, n = 1…10.

| Dải hiện tại | Tên mới | Ghi chú |
|---|---|---|
| Blue | `global/color/blue-{n}` |  |
| Cyan | `global/color/cyan-{n}` |  |
| Geekblue | `global/color/indigo-{n}` | đổi tên dải |
| Gold | `global/color/amber-{n}` | đổi tên dải |
| Green | `global/color/green-{n}` |  |
| Lime | `global/color/lime-{n}` |  |
| Magenta | `global/color/magenta-{n}` |  |
| Orange | `global/color/orange-{n}` |  |
| Purple | `global/color/purple-{n}` |  |
| Red | `global/color/red-{n}` |  |
| Volcano | `global/color/vermilion-{n}` | đổi tên dải |
| Yellow | `global/color/yellow-{n}` |  |
| Pink | XÓA | trùng hệt magenta; không biến nào trỏ vào |

## Màu — chữ và icon (`color/content`)

| Tên hiện tại | Tên mới | Ghi chú |
|---|---|---|
| `Neutral/Text/colorText` | `color/content/neutral-strong` | chữ chính |
| `Neutral/Text/colorTextSecondary` | `color/content/neutral` | chữ phụ |
| `Neutral/Text/colorTextTertiary` | `color/content/neutral-light` |  |
| `Neutral/Text/colorTextQuaternary` | `color/content/neutral-faded` |  |
| `Neutral/Text/colorTextHeading` | `color/content/heading` |  |
| `Neutral/Text/colorTextLabel` | `color/content/label` |  |
| `Neutral/Text/colorTextDescription` | `color/content/description` |  |
| `Neutral/Text/colorTextDisabled` | `color/content/disabled` |  |
| `Neutral/Text/colorTextPlaceholder` | `color/content/placeholder` |  |
| `Neutral/Text/colorTextLightSolid` | `color/content/on-solid` | chữ trắng trên nền solid có màu |
| `Neutral/Text/solidTextColor` | `color/content/on-solid-neutral` | chữ trên nền color/solid/neutral |
| `Neutral/Icon/colorIcon` | `color/content/icon` |  |
| `Neutral/Icon/colorIconHover` | `color/content/icon-hover` |  |
| `Brand/Link/colorLink` | `color/content/link` |  |
| `Brand/Link/colorLinkHover` | `color/content/link-hover` |  |
| `Brand/Link/colorLinkActive` | `color/content/link-active` |  |
| `Brand/Primary/colorPrimaryText` | `color/content/accent` |  |
| `Brand/Primary/colorPrimaryTextHover` | `color/content/accent-hover` |  |
| `Brand/Primary/colorPrimaryTextActive` | `color/content/accent-active` |  |
| `Brand/Success/colorSuccessText` | `color/content/success` |  |
| `Brand/Success/colorSuccessTextHover` | `color/content/success-hover` |  |
| `Brand/Success/colorSuccessTextActive` | `color/content/success-active` |  |
| `Brand/Warning/colorWarningText` | `color/content/warning` |  |
| `Brand/Warning/colorWarningTextHover` | `color/content/warning-hover` |  |
| `Brand/Warning/colorWarningTextActive` | `color/content/warning-active` |  |
| `Brand/Error/colorErrorText` | `color/content/danger` |  |
| `Brand/Error/colorErrorTextHover` | `color/content/danger-hover` |  |
| `Brand/Error/colorErrorTextActive` | `color/content/danger-active` |  |
| `Brand/Info/colorInfoText` | `color/content/info` |  |
| `Brand/Info/colorInfoTextHover` | `color/content/info-hover` |  |
| `Brand/Info/colorInfoTextActive` | `color/content/info-active` |  |

## Màu — nền (`color/background`)

| Tên hiện tại | Tên mới | Ghi chú |
|---|---|---|
| `Brand/Gradient/colorHeaderBgStart` | `color/background/header-start` |  |
| `Brand/Gradient/colorHeaderBgEnd` | `color/background/header-end` |  |
| `Neutral/Bg/colorBgContainer` | `color/background/container` | nền card, bảng, form |
| `Neutral/Bg/colorBgElevated` | `color/background/elevated` | nền dropdown, modal |
| `Neutral/Bg/colorBgLayout` | `color/background/layout` | nền trang |
| `Neutral/Bg/colorBgMask` | `color/background/overlay` | lớp phủ sau modal |
| `Neutral/Bg/colorBgSpotlight` | `color/background/spotlight` | nền tooltip |
| `Neutral/Bg/colorBgContainerDisabled` | `color/background/container-disabled` |  |
| `Neutral/Bg/colorBgTextHover` | `color/background/plain-hover` | nền control không viền, không nền khi hover |
| `Neutral/Bg/colorBgTextActive` | `color/background/plain-active` |  |
| `Neutral/Bg/defaultBg` | `color/background/neutral` | **CẦN XEM: chưa rõ nơi dùng** |
| `Neutral/Fill/colorFillAlterSolid` | `color/background/alternate` | nền xen kẽ, đặc |
| `Neutral/Fill/colorFilledHandleBg` | `color/background/handle` | **CẦN XEM: nền núm kéo** |
| `Brand/Control/controlItemBgHover` | `color/background/item-hover` | nền dòng trong list, menu |
| `Brand/Control/controlItemBgActive` | `color/background/item-selected` |  |
| `Brand/Control/controlItemBgActiveHover` | `color/background/item-selected-hover` |  |
| `Brand/Control/controlItemBgActiveDisabled` | `color/background/item-selected-disabled` |  |
| `Brand/Primary/colorPrimaryBg` | `color/background/accent-faded` |  |
| `Brand/Primary/colorPrimaryBgHover` | `color/background/accent-faded-hover` |  |
| `Brand/Success/colorSuccessBg` | `color/background/success-faded` |  |
| `Brand/Success/colorSuccessBgHover` | `color/background/success-faded-hover` |  |
| `Brand/Warning/colorWarningBg` | `color/background/warning-faded` |  |
| `Brand/Warning/colorWarningBgHover` | `color/background/warning-faded-hover` |  |
| `Brand/Error/colorErrorBg` | `color/background/danger-faded` |  |
| `Brand/Error/colorErrorBgHover` | `color/background/danger-faded-hover` |  |
| `Brand/Info/colorInfoBg` | `color/background/info-faded` |  |
| `Brand/Info/colorInfoBgHover` | `color/background/info-faded-hover` |  |

## Màu — solid (`color/solid`)

| Tên hiện tại | Tên mới | Ghi chú |
|---|---|---|
| `Neutral/Bg/colorBgSolid` | `color/solid/neutral` | nền đặc đen (Light) / trắng (Dark) |
| `Neutral/Bg/colorBgSolidHover` | `color/solid/neutral-hover` |  |
| `Neutral/Bg/colorBgSolidActive` | `color/solid/neutral-active` |  |
| `Brand/Primary/colorPrimary` | `color/solid/accent` |  |
| `Brand/Primary/colorPrimaryHover` | `color/solid/accent-hover` |  |
| `Brand/Primary/colorPrimaryActive` | `color/solid/accent-active` |  |
| `Brand/Success/colorSuccess` | `color/solid/success` |  |
| `Brand/Success/colorSuccessHover` | `color/solid/success-hover` |  |
| `Brand/Success/colorSuccessActive` | `color/solid/success-active` |  |
| `Brand/Warning/colorWarning` | `color/solid/warning` |  |
| `Brand/Warning/colorWarningHover` | `color/solid/warning-hover` |  |
| `Brand/Warning/colorWarningActive` | `color/solid/warning-active` |  |
| `Brand/Error/colorError` | `color/solid/danger` |  |
| `Brand/Error/colorErrorHover` | `color/solid/danger-hover` |  |
| `Brand/Error/colorErrorActive` | `color/solid/danger-active` |  |
| `Brand/Info/colorInfo` | `color/solid/info` |  |
| `Brand/Info/colorInfoHover` | `color/solid/info-hover` |  |
| `Brand/Info/colorInfoActive` | `color/solid/info-active` |  |

## Màu — viền (`color/border`)

| Tên hiện tại | Tên mới | Ghi chú |
|---|---|---|
| `Neutral/Bg/colorBorderBg` | `color/border/container` | viền trùng màu nền (vòng quanh avatar, badge) |
| `Neutral/Border/colorBorder` | `color/border/neutral` |  |
| `Neutral/Border/colorBorderSecondary` | `color/border/neutral-light` |  |
| `Neutral/Border/colorSplit` | `color/border/neutral-faded` | đường chia |
| `Brand/Primary/colorPrimaryBorder` | `color/border/accent-light` |  |
| `Brand/Primary/colorPrimaryBorderHover` | `color/border/accent-light-hover` |  |
| `Brand/Success/colorSuccessBorder` | `color/border/success-light` |  |
| `Brand/Success/colorSuccessBorderHover` | `color/border/success-light-hover` |  |
| `Brand/Warning/colorWarningBorder` | `color/border/warning-light` |  |
| `Brand/Warning/colorWarningBorderHover` | `color/border/warning-light-hover` |  |
| `Brand/Error/colorErrorBorder` | `color/border/danger-light` |  |
| `Brand/Error/colorErrorBorderHover` | `color/border/danger-light-hover` |  |
| `Brand/Info/colorInfoBorder` | `color/border/info-light` |  |
| `Brand/Info/colorInfoBorderHover` | `color/border/info-light-hover` |  |

## Màu — fill (`color/fill`)

| Tên hiện tại | Tên mới | Ghi chú |
|---|---|---|
| `Neutral/Fill/colorFill` | `color/fill/neutral-strong` |  |
| `Neutral/Fill/colorFillSecondary` | `color/fill/neutral` |  |
| `Neutral/Fill/colorFillTertiary` | `color/fill/neutral-light` |  |
| `Neutral/Fill/colorFillQuaternary` | `color/fill/neutral-faded` |  |
| `Neutral/Fill/colorFillContent` | `color/fill/area` | **CẦN XEM: nền vùng nội dung** |
| `Neutral/Fill/colorFillContentHover` | `color/fill/area-hover` |  |
| `Neutral/Fill/colorFillAlter` | `color/fill/alternate` | nền xen kẽ, bán trong suốt |

## Màu — outline, seed, global lẻ

| Tên hiện tại | Tên mới | Ghi chú |
|---|---|---|
| `Neutral/colorWhite` | `global/color/white` |  |
| `Neutral/transparent` | `global/color/transparent` |  |
| `Neutral/colorBgBase` | `color/seed/background` | màu gốc nền của mode |
| `Neutral/colorTextBase` | `color/seed/content` | màu gốc chữ của mode |
| `Brand/Control/controlOutline` | `color/outline/accent` |  |
| `Brand/Control/controlTmpOutline` | `color/outline/neutral` |  |
| `Brand/Error/colorErrorOutline` | `color/outline/danger` |  |
| `Brand/Warning/colorWarningOutline` | `color/outline/warning` |  |

## Xóa

| Tên hiện tại | Tên mới | Ghi chú |
|---|---|---|
| `Color` | `XÓA` | biến mồ côi, trỏ ngược lên tầng component; không biến nào dùng |

## Brand (`fc · 1. Brand`)

| Tên hiện tại | Tên mới | Ghi chú |
|---|---|---|
| `Primary/1` | `brand/primary-1` |  |
| `Primary/2` | `brand/primary-2` |  |
| `Primary/3` | `brand/primary-3` |  |
| `Primary/4` | `brand/primary-4` |  |
| `Primary/5` | `brand/primary-5` |  |
| `Primary/6` | `brand/primary-6` |  |
| `Primary/7` | `brand/primary-7` |  |
| `Primary/8` | `brand/primary-8` |  |
| `Primary/9` | `brand/primary-9` |  |
| `Primary/10` | `brand/primary-10` |  |
| `Light/controlOutline` | `brand/light/outline-accent` |  |
| `Light/colorHeaderBgStart` | `brand/light/background-header-start` |  |
| `Light/colorHeaderBgEnd` | `brand/light/background-header-end` |  |
| `Dark/controlOutline` | `brand/dark/outline-accent` |  |
| `Dark/colorHeaderBgStart` | `brand/dark/background-header-start` |  |
| `Dark/colorHeaderBgEnd` | `brand/dark/background-header-end` |  |
| `Dark/colorPrimary` | `brand/dark/solid-accent` |  |

## Kích thước (`fc · 3. Dimensions`)

| Tên hiện tại | Tên mới | Ghi chú |
|---|---|---|
| `Size/sizeStep` | `size/seed/step` | bước tăng của thang size |
| `Size/sizeUnit` | `size/seed/unit` | đơn vị gốc 4px |
| `Size/controlInteractiveSize` | `size/control/interactive` | ô checkbox, radio |
| `Size/sizePopupArrow` | `size/popup-arrow/base` |  |
| `Size/Base/sizeXXS` | `size/scale/xxs` |  |
| `Size/Base/sizeXS` | `size/scale/xs` |  |
| `Size/Base/sizeSM` | `size/scale/sm` |  |
| `Size/Base/size` | `size/scale/base` |  |
| `Size/Base/sizeMS` | `size/scale/ms` |  |
| `Size/Base/sizeMD` | `size/scale/md` |  |
| `Size/Base/sizeLG` | `size/scale/lg` |  |
| `Size/Base/sizeXL` | `size/scale/xl` |  |
| `Size/Base/sizeXXL` | `size/scale/xxl` |  |
| `Size/Height/controlHeight` | `size/control/base` |  |
| `Size/Height/controlHeightLG` | `size/control/lg` |  |
| `Size/Height/controlHeightSM` | `size/control/sm` |  |
| `Size/Height/controlHeightXS` | `size/control/xs` |  |
| `Size/Line Width/lineWidth` | `stroke/width/base` |  |
| `Size/Line Width/lineWidthBold` | `stroke/width/strong` |  |
| `Size/Line Width/lineWidthFocus` | `stroke/width/focus` |  |
| `Size/Line Width/controlOutlineWidth` | `stroke/width/outline` |  |
| `Size/Line Width/lineIcon` | `stroke/width/icon` |  |
| `Size/Screen Size/screenXS` | `breakpoint/xs` |  |
| `Size/Screen Size/screenXSMin` | `breakpoint/xs-min` |  |
| `Size/Screen Size/screenXSMax` | `breakpoint/xs-max` |  |
| `Size/Screen Size/screenSM` | `breakpoint/sm` |  |
| `Size/Screen Size/screenSMMin` | `breakpoint/sm-min` |  |
| `Size/Screen Size/screenSMMax` | `breakpoint/sm-max` |  |
| `Size/Screen Size/screenMD` | `breakpoint/md` |  |
| `Size/Screen Size/screenMDMin` | `breakpoint/md-min` |  |
| `Size/Screen Size/screenMDMax` | `breakpoint/md-max` |  |
| `Size/Screen Size/screenLG` | `breakpoint/lg` |  |
| `Size/Screen Size/screenLGMin` | `breakpoint/lg-min` |  |
| `Size/Screen Size/screenLGMax` | `breakpoint/lg-max` |  |
| `Size/Screen Size/screenXL` | `breakpoint/xl` |  |
| `Size/Screen Size/screenXLMin` | `breakpoint/xl-min` |  |
| `Size/Screen Size/screenXLMax` | `breakpoint/xl-max` |  |
| `Size/Screen Size/screenXXL` | `breakpoint/xxl` |  |
| `Size/Screen Size/screenXXLMin` | `breakpoint/xxl-min` |  |
| `Space/Margin/margin` | `space/margin/base` |  |
| `Space/Margin/marginXXS` | `space/margin/xxs` |  |
| `Space/Margin/marginXS` | `space/margin/xs` |  |
| `Space/Margin/marginSM` | `space/margin/sm` |  |
| `Space/Margin/marginMD` | `space/margin/md` |  |
| `Space/Margin/marginLG` | `space/margin/lg` |  |
| `Space/Margin/marginXL` | `space/margin/xl` |  |
| `Space/Margin/marginXXL` | `space/margin/xxl` |  |
| `Space/Padding/padding` | `space/padding/base` |  |
| `Space/Padding/paddingXXS` | `space/padding/xxs` |  |
| `Space/Padding/paddingXS` | `space/padding/xs` |  |
| `Space/Padding/paddingSM` | `space/padding/sm` |  |
| `Space/Padding/paddingMD` | `space/padding/md` |  |
| `Space/Padding/paddingLG` | `space/padding/lg` |  |
| `Space/Padding/paddingXL` | `space/padding/xl` |  |
| `Space/Padding/paddingContentHorizontal` | `space/padding-inline/container` |  |
| `Space/Padding/paddingContentHorizontalLG` | `space/padding-inline/container-lg` |  |
| `Space/Padding/paddingContentHorizontalSM` | `space/padding-inline/container-sm` |  |
| `Space/Padding/paddingContentVertical` | `space/padding-block/container` |  |
| `Space/Padding/paddingContentVerticalLG` | `space/padding-block/container-lg` |  |
| `Space/Padding/paddingContentVerticalSM` | `space/padding-block/container-sm` |  |
| `Space/Padding/controlPaddingHorizontal` | `space/padding-inline/control` |  |
| `Space/Padding/controlPaddingHorizontalSM` | `space/padding-inline/control-sm` |  |
| `Border Radius/borderRadius` | `radius/base` |  |
| `Border Radius/borderRadiusLG` | `radius/lg` |  |
| `Border Radius/borderRadiusSM` | `radius/sm` |  |
| `Border Radius/borderRadiusXS` | `radius/xs` |  |

## Chữ (`fc · 4. Typography`)

| Tên hiện tại | Tên mới | Ghi chú |
|---|---|---|
| `Typography/Font Family/fontFamily` | `typography/family/base` | dọn mô tả |
| `Typography/Font Family/fontFamilyCode` | `typography/family/code` | dọn mô tả |
| `Typography/Font Size/fontSize` | `typography/size/base` |  |
| `Typography/Font Size/fontSizeSM` | `typography/size/sm` |  |
| `Typography/Font Size/fontSizeLG` | `typography/size/lg` |  |
| `Typography/Font Size/fontSizeXL` | `typography/size/xl` |  |
| `Typography/Font Size/fontSizeHeading1` | `typography/size/heading-1` |  |
| `Typography/Font Size/fontSizeHeading2` | `typography/size/heading-2` |  |
| `Typography/Font Size/fontSizeHeading3` | `typography/size/heading-3` |  |
| `Typography/Font Size/fontSizeHeading4` | `typography/size/heading-4` |  |
| `Typography/Font Size/fontSizeHeading5` | `typography/size/heading-5` |  |
| `Typography/Font Size/fontSizeIcon` | `typography/size/icon` |  |
| `Typography/Line Height/lineHeight` | `typography/line-height/base` |  |
| `Typography/Line Height/lineHeightSM` | `typography/line-height/sm` |  |
| `Typography/Line Height/lineHeightLG` | `typography/line-height/lg` |  |
| `Typography/Line Height/lineHeightHeading1` | `typography/line-height/heading-1` |  |
| `Typography/Line Height/lineHeightHeading2` | `typography/line-height/heading-2` |  |
| `Typography/Line Height/lineHeightHeading3` | `typography/line-height/heading-3` |  |
| `Typography/Line Height/lineHeightHeading4` | `typography/line-height/heading-4` |  |
| `Typography/Line Height/lineHeightHeading5` | `typography/line-height/heading-5` |  |
| `Typography/Font Weight/fontWeightNormal` | `typography/weight/regular` |  |
| `Typography/Font Weight/fontWeightMedium` | `typography/weight/medium` |  |
| `Typography/Font Weight/fontWeightStrong` | `typography/weight/semibold` |  |

