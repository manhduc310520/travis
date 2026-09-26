"""Builds leaf-name maps and Vietnamese descriptions for the Figma docs pages. Temporary migration tool."""
import json

rows = json.load(open('fc-rename-map.json', encoding='utf-8'))

leaf_colors, leaf_dims = {}, {}
for r in rows:
    if r['new'] == 'XÓA' or r['old'].startswith('Colors/Base/'):
        continue
    leaf = r['old'].split('/')[-1]
    if r['collection'] == '2. Colors':
        leaf_colors[leaf] = r['new']
    elif r['collection'] == '3. Dimensions':
        leaf_dims[leaf] = r['new']

D = {}
# accent
D.update({
    'color/solid/accent': 'Màu brand chính: nút primary, checkbox đã chọn, vòng focus. Mỗi màn hình chỉ một hành động dùng màu này.',
    'color/solid/accent-hover': 'Màu brand chính khi hover.',
    'color/solid/accent-active': 'Màu brand chính khi đang nhấn.',
    'color/background/accent-faded': 'Nền brand rất nhạt, cho trạng thái chọn nhẹ như item đang chọn.',
    'color/background/accent-faded-hover': 'Nền brand rất nhạt khi hover.',
    'color/border/accent-light': 'Viền brand nhạt.',
    'color/border/accent-light-hover': 'Viền brand nhạt khi hover.',
    'color/content/accent': 'Chữ và icon màu brand.',
    'color/content/accent-hover': 'Chữ và icon màu brand khi hover.',
    'color/content/accent-active': 'Chữ và icon màu brand khi đang nhấn.',
})
ROLE_VN = {'success': 'thành công', 'warning': 'cảnh báo', 'info': 'thông tin', 'danger': 'lỗi'}
SOLID_USE = {
    'success': 'icon trạng thái, thanh tiến trình hoàn tất',
    'warning': 'icon và điểm nhấn cảnh báo',
    'info': 'icon và điểm nhấn thông tin',
    'danger': 'icon lỗi, nút hành động nguy hiểm',
}
for r, vn in ROLE_VN.items():
    D.update({
        f'color/solid/{r}': f'Màu chính của trạng thái {vn}: {SOLID_USE[r]}.',
        f'color/solid/{r}-hover': f'Màu chính của trạng thái {vn} khi hover.',
        f'color/solid/{r}-active': f'Màu chính của trạng thái {vn} khi đang nhấn.',
        f'color/background/{r}-faded': f'Nền nhạt của trạng thái {vn}, dùng cho Alert, Tag.',
        f'color/background/{r}-faded-hover': f'Nền nhạt của trạng thái {vn} khi hover.',
        f'color/border/{r}-light': f'Viền của trạng thái {vn}, dùng cho Alert, Tag.',
        f'color/border/{r}-light-hover': f'Viền của trạng thái {vn} khi hover.',
        f'color/content/{r}': f'Chữ màu {vn}.',
        f'color/content/{r}-hover': f'Chữ màu {vn} khi hover.',
        f'color/content/{r}-active': f'Chữ màu {vn} khi đang nhấn.',
    })
D.update({
    'color/content/link': 'Màu chữ của liên kết.',
    'color/content/link-hover': 'Màu chữ của liên kết khi hover.',
    'color/content/link-active': 'Màu chữ của liên kết khi đang nhấn.',
    'color/background/item-hover': 'Nền một dòng trong list, menu, select khi hover.',
    'color/background/item-selected': 'Nền dòng đang chọn trong list, menu, select.',
    'color/background/item-selected-hover': 'Nền dòng đang chọn khi hover.',
    'color/background/item-selected-disabled': 'Nền dòng đang chọn khi bị vô hiệu.',
    'color/outline/accent': 'Vòng sáng quanh control khi focus.',
    'color/outline/neutral': 'Vòng sáng trung tính quanh control mặc định.',
    'color/outline/danger': 'Vòng sáng khi focus vào trường đang lỗi.',
    'color/outline/warning': 'Vòng sáng khi focus vào trường đang cảnh báo.',
    'color/content/neutral-strong': 'Chữ chính, đậm nhất trong nhóm trung tính.',
    'color/content/neutral': 'Chữ phụ: nhãn, nội dung không cần nhấn mạnh.',
    'color/content/neutral-light': 'Chữ mô tả, chú thích dưới trường nhập.',
    'color/content/neutral-faded': 'Chữ mờ nhất: gợi ý trong ô nhập, chữ bị vô hiệu.',
    'color/content/on-solid': 'Chữ đặt trên nền solid có màu, như chữ trong nút primary.',
    'color/content/on-solid-neutral': 'Chữ đặt trên nền solid trung tính.',
    'color/content/heading': 'Chữ tiêu đề.',
    'color/content/label': 'Chữ nhãn của trường nhập.',
    'color/content/description': 'Chữ mô tả.',
    'color/content/disabled': 'Chữ khi bị vô hiệu.',
    'color/content/placeholder': 'Chữ gợi ý trong ô nhập.',
    'color/content/icon': 'Màu icon mặc định.',
    'color/content/icon-hover': 'Màu icon khi hover.',
    'color/background/container': 'Nền của card, bảng, form, ô nhập.',
    'color/background/elevated': 'Nền của lớp nổi: modal, dropdown, popover. Phân biệt với nền trang bằng shadow.',
    'color/background/layout': 'Nền trang, lớp thấp nhất của bố cục.',
    'color/background/overlay': 'Lớp phủ phía sau modal và drawer.',
    'color/background/spotlight': 'Nền cần gây chú ý mạnh, hiện dùng cho tooltip.',
    'color/background/container-disabled': 'Nền container khi bị vô hiệu.',
    'color/background/plain-hover': 'Nền control không viền, không nền khi hover.',
    'color/background/plain-active': 'Nền control không viền, không nền khi đang nhấn.',
    'color/border/container': 'Viền trùng màu nền container, tạo khoảng hở quanh avatar, badge.',
    'color/border/neutral': 'Viền mặc định để tách phần tử: ô nhập, card.',
    'color/border/neutral-light': 'Viền nhạt, dạng màu đặc.',
    'color/border/neutral-faded': 'Đường chia, dạng bán trong suốt.',
    'color/fill/neutral-strong': 'Nền trung tính bán trong suốt, mức đậm nhất.',
    'color/fill/neutral': 'Nền trung tính mức 2, làm rõ hình khối như skeleton.',
    'color/fill/neutral-light': 'Nền trung tính mức 3, cho rãnh slider, segmented.',
    'color/fill/neutral-faded': 'Nền trung tính nhẹ nhất, cho mảng màu không cần gây chú ý.',
    'color/fill/area': 'Nền vùng nội dung.',
    'color/fill/area-hover': 'Nền vùng nội dung khi hover.',
    'color/fill/alternate': 'Nền xen kẽ, ví dụ header bảng.',
    'color/background/alternate': 'Nền xen kẽ dạng màu đặc.',
    'color/seed/background': 'Màu gốc của nền theo mode.',
    'color/seed/content': 'Màu gốc của chữ theo mode.',
})
SCALE_VN = {'xxs': 'XXS', 'xs': 'XS', 'sm': 'SM', 'ms': 'MS', 'base': 'chuẩn', 'md': 'MD', 'lg': 'LG', 'xl': 'XL', 'xxl': 'XXL'}
for s, vn in SCALE_VN.items():
    D[f'size/scale/{s}'] = f'Cỡ {vn} trong thang kích thước chung.'
    D[f'space/margin/{s}'] = f'Khoảng cách ngoài cỡ {vn}.'
    D[f'space/padding/{s}'] = f'Khoảng đệm cỡ {vn}.'
for s in ['xs', 'sm', 'md', 'lg', 'xl', 'xxl']:
    D[f'breakpoint/{s}'] = f'Mốc chiều rộng màn hình {s.upper()}.'
D.update({
    'size/control/xs': 'Chiều cao control rất nhỏ.',
    'size/control/sm': 'Chiều cao control nhỏ.',
    'size/control/base': 'Chiều cao control chuẩn: nút, ô nhập, select.',
    'size/control/lg': 'Chiều cao control lớn.',
    'space/padding-inline/container': 'Khoảng đệm ngang của vùng nội dung.',
    'space/padding-inline/container-sm': 'Khoảng đệm ngang của vùng nội dung, bản nhỏ.',
    'space/padding-inline/container-lg': 'Khoảng đệm ngang của vùng nội dung, bản lớn.',
    'space/padding-block/container': 'Khoảng đệm dọc của vùng nội dung.',
    'space/padding-block/container-sm': 'Khoảng đệm dọc của vùng nội dung, bản nhỏ.',
    'space/padding-block/container-lg': 'Khoảng đệm dọc của vùng nội dung, bản lớn.',
    'radius/base': 'Bo góc của control: nút, ô nhập, select.',
    'radius/lg': 'Bo góc của bề mặt: card, modal, drawer.',
    'radius/sm': 'Bo góc của tag, tooltip, popover.',
    'radius/xs': 'Bo góc rất nhỏ cho chi tiết như mũi tên popover.',
})

colors = {'leaf': leaf_colors, 'desc': {k: v for k, v in D.items() if k.startswith(('color/', 'global/'))}}
dims = {'leaf': leaf_dims, 'desc': {k: v for k, v in D.items() if not k.startswith(('color/', 'global/'))}}
missing_c = [n for n in leaf_colors.values() if n not in D and not n.startswith('global/')]
missing_d = [n for n in leaf_dims.values() if n not in D]
print('colors leaf', len(leaf_colors), 'desc', len(colors['desc']), 'no-desc', missing_c)
print('dims leaf', len(leaf_dims), 'desc', len(dims['desc']), 'no-desc', missing_d)
open('docs-colors.json', 'w', encoding='utf-8').write(json.dumps(colors, ensure_ascii=False, separators=(',', ':')))
open('docs-dims.json', 'w', encoding='utf-8').write(json.dumps(dims, ensure_ascii=False, separators=(',', ':')))
