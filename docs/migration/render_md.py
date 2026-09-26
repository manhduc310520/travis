import json
rows = json.load(open('fc-rename-map.json', encoding='utf-8'))
out = []
w = out.append
w('# Bảng đổi tên `fc` — giai đoạn 1 (chờ duyệt)\n')
w('> Tài liệu tạm thời. Xóa khi hoàn tất chuyển đổi. Sinh từ `build_map.py`.\n')
w('342 biến thuộc 4 collection: đổi tên 331, xóa 11. Không trùng tên. '
  'Collection `5. Components` chưa đổi ở giai đoạn này.\n')
w('## Tên collection\n')
w('| Hiện tại | Mới |\n|---|---|')
for c in ['1. Brand', '2. Colors', '3. Dimensions', '4. Typography']:
    w(f'| `{c}` | `fc · {c}` |')
w('')
w('## Dải màu gốc (120 biến đổi tên theo quy tắc, 10 biến xóa)\n')
w('`Colors/Base/{Dải}/{n}` → `global/color/{dải}-{n}`, n = 1…10.\n')
w('| Dải hiện tại | Tên mới | Ghi chú |\n|---|---|---|')
seen = []
for r in rows:
    if r['old'].startswith('Colors/Base/') and r['old'].endswith('/1'):
        hue = r['old'].split('/')[2]
        new = 'XÓA' if r['new'] == 'XÓA' else '`' + r['new'].rsplit('-', 1)[0] + '-{n}`'
        w(f"| {hue} | {new} | {r['note']} |")
w('')
sections = [
    ('Màu — chữ và icon (`color/content`)', lambda r: r['new'].startswith('color/content/')),
    ('Màu — nền (`color/background`)', lambda r: r['new'].startswith('color/background/')),
    ('Màu — solid (`color/solid`)', lambda r: r['new'].startswith('color/solid/')),
    ('Màu — viền (`color/border`)', lambda r: r['new'].startswith('color/border/')),
    ('Màu — fill (`color/fill`)', lambda r: r['new'].startswith('color/fill/')),
    ('Màu — outline, seed, global lẻ', lambda r: r['new'].startswith(('color/outline/', 'color/seed/', 'global/color/white', 'global/color/transparent'))),
    ('Xóa', lambda r: r['new'] == 'XÓA' and not r['old'].startswith('Colors/Base/')),
    ('Brand (`fc · 1. Brand`)', lambda r: r['collection'] == '1. Brand'),
    ('Kích thước (`fc · 3. Dimensions`)', lambda r: r['collection'] == '3. Dimensions'),
    ('Chữ (`fc · 4. Typography`)', lambda r: r['collection'] == '4. Typography'),
]
used = set()
for title, f in sections:
    sel = [r for r in rows if f(r) and id(r) not in used and not (r['old'].startswith('Colors/Base/'))]
    if not sel:
        continue
    w(f'## {title}\n')
    w('| Tên hiện tại | Tên mới | Ghi chú |\n|---|---|---|')
    for r in sel:
        used.add(id(r))
        old = r['old'].replace('Colors/', '', 1) if r['old'].startswith('Colors/') else r['old']
        note = r['note']
        if note.startswith('CẦN XEM'):
            note = '**' + note + '**'
        w(f"| `{old}` | `{r['new']}` | {note} |")
    w('')
left = [r for r in rows if id(r) not in used and not r['old'].startswith('Colors/Base/')]
assert not left, left
open('fc-rename-map.md', 'w', encoding='utf-8').write('\n'.join(out) + '\n')
print('ok', sum(1 for r in rows if r['note'].startswith('CẦN XEM')), 'rows need review')
