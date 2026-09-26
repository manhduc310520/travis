"""Builds the fc rename map for Figma collections 1-4. Temporary migration tool."""
import json, re

rows = []  # (collection, old, new, note)


def add(col, old, new, note=''):
    rows.append((col, old, new, note))


# ---------- 2. Colors · Base -> global ----------
HUES = {'Blue': 'blue', 'Cyan': 'cyan', 'Geekblue': 'indigo', 'Gold': 'amber', 'Green': 'green',
        'Lime': 'lime', 'Magenta': 'magenta', 'Orange': 'orange', 'Purple': 'purple', 'Red': 'red',
        'Volcano': 'vermilion', 'Yellow': 'yellow'}
for h, n in HUES.items():
    for i in range(1, 11):
        note = 'đổi tên dải' if h in ('Geekblue', 'Gold', 'Volcano') else ''
        add('2. Colors', f'Colors/Base/{h}/{i}', f'global/color/{n}-{i}', note)
for i in range(1, 11):
    add('2. Colors', f'Colors/Base/Pink/{i}', 'XÓA', 'trùng hệt magenta; không biến nào trỏ vào')

# ---------- 2. Colors · semantic ----------
sem = {
    'Brand/Gradient/colorHeaderBgStart': ('color/background/header-start', ''),
    'Brand/Gradient/colorHeaderBgEnd': ('color/background/header-end', ''),
    'Neutral/Text/colorText': ('color/content/neutral-strong', 'chữ chính'),
    'Neutral/Text/colorTextSecondary': ('color/content/neutral', 'chữ phụ'),
    'Neutral/Text/colorTextTertiary': ('color/content/neutral-light', ''),
    'Neutral/Text/colorTextQuaternary': ('color/content/neutral-faded', ''),
    'Neutral/Text/colorTextHeading': ('color/content/heading', ''),
    'Neutral/Text/colorTextLabel': ('color/content/label', ''),
    'Neutral/Text/colorTextDescription': ('color/content/description', ''),
    'Neutral/Text/colorTextDisabled': ('color/content/disabled', ''),
    'Neutral/Text/colorTextPlaceholder': ('color/content/placeholder', ''),
    'Neutral/Text/colorTextLightSolid': ('color/content/on-solid', 'chữ trắng trên nền solid có màu'),
    'Neutral/Text/solidTextColor': ('color/content/on-solid-neutral', 'chữ trên nền color/solid/neutral'),
    'Neutral/Icon/colorIcon': ('color/content/icon', ''),
    'Neutral/Icon/colorIconHover': ('color/content/icon-hover', ''),
    'Neutral/Bg/colorBgContainer': ('color/background/container', 'nền card, bảng, form'),
    'Neutral/Bg/colorBgElevated': ('color/background/elevated', 'nền dropdown, modal'),
    'Neutral/Bg/colorBgLayout': ('color/background/layout', 'nền trang'),
    'Neutral/Bg/colorBgMask': ('color/background/overlay', 'lớp phủ sau modal'),
    'Neutral/Bg/colorBgSpotlight': ('color/background/spotlight', 'nền tooltip'),
    'Neutral/Bg/colorBgContainerDisabled': ('color/background/container-disabled', ''),
    'Neutral/Bg/colorBgTextHover': ('color/background/plain-hover', 'nền control không viền, không nền khi hover'),
    'Neutral/Bg/colorBgTextActive': ('color/background/plain-active', ''),
    'Neutral/Bg/colorBorderBg': ('color/border/container', 'viền trùng màu nền (vòng quanh avatar, badge)'),
    'Neutral/Bg/colorBgSolid': ('color/solid/neutral', 'nền đặc đen (Light) / trắng (Dark)'),
    'Neutral/Bg/colorBgSolidHover': ('color/solid/neutral-hover', ''),
    'Neutral/Bg/colorBgSolidActive': ('color/solid/neutral-active', ''),
    'Neutral/Bg/defaultBg': ('color/background/neutral', 'CẦN XEM: chưa rõ nơi dùng'),
    'Neutral/Border/colorBorder': ('color/border/neutral', ''),
    'Neutral/Border/colorBorderSecondary': ('color/border/neutral-light', ''),
    'Neutral/Border/colorSplit': ('color/border/neutral-faded', 'đường chia'),
    'Neutral/Fill/colorFill': ('color/fill/neutral-strong', ''),
    'Neutral/Fill/colorFillSecondary': ('color/fill/neutral', ''),
    'Neutral/Fill/colorFillTertiary': ('color/fill/neutral-light', ''),
    'Neutral/Fill/colorFillQuaternary': ('color/fill/neutral-faded', ''),
    'Neutral/Fill/colorFillContent': ('color/fill/area', 'CẦN XEM: nền vùng nội dung'),
    'Neutral/Fill/colorFillContentHover': ('color/fill/area-hover', ''),
    'Neutral/Fill/colorFillAlter': ('color/fill/alternate', 'nền xen kẽ, bán trong suốt'),
    'Neutral/Fill/colorFillAlterSolid': ('color/background/alternate', 'nền xen kẽ, đặc'),
    'Neutral/Fill/colorFilledHandleBg': ('color/background/handle', 'CẦN XEM: nền núm kéo'),
    'Neutral/colorWhite': ('global/color/white', ''),
    'Neutral/transparent': ('global/color/transparent', ''),
    'Neutral/colorBgBase': ('color/seed/background', 'màu gốc nền của mode'),
    'Neutral/colorTextBase': ('color/seed/content', 'màu gốc chữ của mode'),
    'Brand/Link/colorLink': ('color/content/link', ''),
    'Brand/Link/colorLinkHover': ('color/content/link-hover', ''),
    'Brand/Link/colorLinkActive': ('color/content/link-active', ''),
    'Brand/Control/controlItemBgHover': ('color/background/item-hover', 'nền dòng trong list, menu'),
    'Brand/Control/controlItemBgActive': ('color/background/item-selected', ''),
    'Brand/Control/controlItemBgActiveHover': ('color/background/item-selected-hover', ''),
    'Brand/Control/controlItemBgActiveDisabled': ('color/background/item-selected-disabled', ''),
    'Brand/Control/controlOutline': ('color/outline/accent', ''),
    'Brand/Control/controlTmpOutline': ('color/outline/neutral', ''),
    'Brand/Error/colorErrorOutline': ('color/outline/danger', ''),
    'Brand/Warning/colorWarningOutline': ('color/outline/warning', ''),
}
ROLES = {'Primary': 'accent', 'Success': 'success', 'Warning': 'warning', 'Error': 'danger', 'Info': 'info'}
SUFFIX = {'': 'solid/{r}', 'Hover': 'solid/{r}-hover', 'Active': 'solid/{r}-active',
          'Bg': 'background/{r}-faded', 'BgHover': 'background/{r}-faded-hover',
          'Border': 'border/{r}-light', 'BorderHover': 'border/{r}-light-hover',
          'Text': 'content/{r}', 'TextHover': 'content/{r}-hover', 'TextActive': 'content/{r}-active'}
for g, r in ROLES.items():
    for s, pat in SUFFIX.items():
        sem[f'Brand/{g}/color{g}{s}'] = ('color/' + pat.format(r=r), '')
for k, (new, note) in sem.items():
    add('2. Colors', 'Colors/' + k, new, note)
add('2. Colors', 'Color', 'XÓA', 'biến mồ côi, trỏ ngược lên tầng component; không biến nào dùng')

# ---------- 1. Brand ----------
for i in range(1, 11):
    add('1. Brand', f'Primary/{i}', f'brand/primary-{i}')
for m in ('Light', 'Dark'):
    add('1. Brand', f'{m}/controlOutline', f'brand/{m.lower()}/outline-accent')
    add('1. Brand', f'{m}/colorHeaderBgStart', f'brand/{m.lower()}/background-header-start')
    add('1. Brand', f'{m}/colorHeaderBgEnd', f'brand/{m.lower()}/background-header-end')
add('1. Brand', 'Dark/colorPrimary', 'brand/dark/solid-accent')

# ---------- 3. Dimensions ----------
D = '3. Dimensions'
add(D, 'Size/sizeStep', 'size/seed/step', 'bước tăng của thang size')
add(D, 'Size/sizeUnit', 'size/seed/unit', 'đơn vị gốc 4px')
add(D, 'Size/controlInteractiveSize', 'size/control/interactive', 'ô checkbox, radio')
add(D, 'Size/sizePopupArrow', 'size/popup-arrow/base')
for s, n in [('XXS', 'xxs'), ('XS', 'xs'), ('SM', 'sm'), ('', 'base'), ('MS', 'ms'), ('MD', 'md'),
             ('LG', 'lg'), ('XL', 'xl'), ('XXL', 'xxl')]:
    add(D, f'Size/Base/size{s}', f'size/scale/{n}')
for s, n in [('', 'base'), ('LG', 'lg'), ('SM', 'sm'), ('XS', 'xs')]:
    add(D, f'Size/Height/controlHeight{s}', f'size/control/{n}')
add(D, 'Size/Line Width/lineWidth', 'stroke/width/base')
add(D, 'Size/Line Width/lineWidthBold', 'stroke/width/strong')
add(D, 'Size/Line Width/lineWidthFocus', 'stroke/width/focus')
add(D, 'Size/Line Width/controlOutlineWidth', 'stroke/width/outline')
add(D, 'Size/Line Width/lineIcon', 'stroke/width/icon')
for s in ['XS', 'SM', 'MD', 'LG', 'XL', 'XXL']:
    add(D, f'Size/Screen Size/screen{s}', f'breakpoint/{s.lower()}')
    add(D, f'Size/Screen Size/screen{s}Min', f'breakpoint/{s.lower()}-min')
    if s != 'XXL':
        add(D, f'Size/Screen Size/screen{s}Max', f'breakpoint/{s.lower()}-max')
for p in ('Margin', 'Padding'):
    for s, n in [('', 'base'), ('XXS', 'xxs'), ('XS', 'xs'), ('SM', 'sm'), ('MD', 'md'), ('LG', 'lg'),
                 ('XL', 'xl'), ('XXL', 'xxl')]:
        if p == 'Padding' and s == 'XXL':
            continue
        add(D, f'Space/{p}/{p.lower()}{s}', f'space/{p.lower()}/{n}')
for ax, prop in [('Horizontal', 'padding-inline'), ('Vertical', 'padding-block')]:
    for s, n in [('', ''), ('LG', '-lg'), ('SM', '-sm')]:
        add(D, f'Space/Padding/paddingContent{ax}{s}', f'space/{prop}/container{n}')
add(D, 'Space/Padding/controlPaddingHorizontal', 'space/padding-inline/control')
add(D, 'Space/Padding/controlPaddingHorizontalSM', 'space/padding-inline/control-sm')
for s, n in [('', 'base'), ('LG', 'lg'), ('SM', 'sm'), ('XS', 'xs')]:
    add(D, f'Border Radius/borderRadius{s}', f'radius/{n}')

# ---------- 4. Typography ----------
T = '4. Typography'
add(T, 'Typography/Font Family/fontFamily', 'typography/family/base', 'dọn mô tả')
add(T, 'Typography/Font Family/fontFamilyCode', 'typography/family/code', 'dọn mô tả')
for s, n in [('', 'base'), ('SM', 'sm'), ('LG', 'lg'), ('XL', 'xl')]:
    add(T, f'Typography/Font Size/fontSize{s}', f'typography/size/{n}')
for i in range(1, 6):
    add(T, f'Typography/Font Size/fontSizeHeading{i}', f'typography/size/heading-{i}')
add(T, 'Typography/Font Size/fontSizeIcon', 'typography/size/icon')
for s, n in [('', 'base'), ('SM', 'sm'), ('LG', 'lg')]:
    add(T, f'Typography/Line Height/lineHeight{s}', f'typography/line-height/{n}')
for i in range(1, 6):
    add(T, f'Typography/Line Height/lineHeightHeading{i}', f'typography/line-height/heading-{i}')
for o, n in [('Normal', 'regular'), ('Medium', 'medium'), ('Strong', 'semibold')]:
    add(T, f'Typography/Font Weight/fontWeight{o}', f'typography/weight/{n}')

# ---------- checks ----------
news = [r[2] for r in rows if r[2] != 'XÓA']
dups = sorted({n for n in news if news.count(n) > 1})
bad = [n for n in news if not re.fullmatch(r'[a-z0-9]+(/[a-z0-9]+(-[a-z0-9]+)*)+', n)]
by = {}
for r in rows:
    by[r[0]] = by.get(r[0], 0) + 1
print('rows', len(rows), 'rename', len(news), 'delete', len(rows) - len(news), 'dups', dups, 'bad', bad)
print(by)
json.dump([{'collection': c, 'old': o, 'new': n, 'note': t} for c, o, n, t in rows],
          open('fc-rename-map.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
