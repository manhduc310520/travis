"""Swap Ant Design icon imports for the Untitled UI set in src/icons.tsx.

The Figma file's icon page is Untitled UI (names like `layers-three-01`), so the
code should draw from the same library rather than Ant Design's own set.
"""
import io
import os
import re

MAP = {
    'ArrowUpOutlined': 'ArrowUp',
    'BellOutlined': 'Bell01',
    'BookOutlined': 'BookOpen01',
    'DeleteOutlined': 'Trash01',
    'DownOutlined': 'ChevronDown',
    'EditOutlined': 'Edit01',
    'EyeOutlined': 'Eye',
    'HomeOutlined': 'Home01',
    'InboxOutlined': 'UploadCloud01',
    'MenuFoldOutlined': 'LayoutLeft',
    'MenuUnfoldOutlined': 'Menu02',
    'PieChartOutlined': 'PieChart01',
    'PlusOutlined': 'Plus',
    'PrinterOutlined': 'Printer',
    'QuestionCircleOutlined': 'HelpCircle',
    'RightOutlined': 'ChevronRight',
    'SearchOutlined': 'SearchMd',
    'SettingOutlined': 'Settings01',
    'ShopOutlined': 'Building02',
    'TableOutlined': 'Columns03',
    'TagOutlined': 'Tag01',
    'TeamOutlined': 'Users01',
    'UploadOutlined': 'Upload01',
    'UserOutlined': 'User01',
}

IMPORT_RE = re.compile(r"import\s*\{([^}]*)\}\s*from\s*'@ant-design/icons'\s*\n")

changed = []
problems = []

for root, _dirs, files in os.walk('src'):
    for name in files:
        if not name.endswith(('.tsx', '.ts')):
            continue
        path = os.path.join(root, name)
        src = io.open(path, encoding='utf-8').read()
        if '@ant-design/icons' not in src:
            continue
        match = IMPORT_RE.search(src)
        if not match:
            problems.append('odd import form: ' + path)
            continue

        names = [n.strip() for n in match.group(1).split(',') if n.strip()]
        mapped = []
        for n in names:
            if n in MAP:
                mapped.append(MAP[n])
            else:
                problems.append('unmapped icon ' + n + ' in ' + path)
                mapped.append(n)

        rel = os.path.relpath('src', root).replace(os.sep, '/')
        module = './icons' if rel == '.' else rel + '/icons'
        replacement = "import { " + ', '.join(sorted(set(mapped))) + " } from '" + module + "'\n"
        src = IMPORT_RE.sub(replacement, src, count=1)
        for old, new in MAP.items():
            src = re.sub(r'\b' + old + r'\b', new, src)

        io.open(path, 'w', encoding='utf-8').write(src)
        changed.append(path)

print('files changed:', len(changed))
for c in sorted(changed):
    print('  ' + c)
if problems:
    print('problems:')
    for p in problems:
        print('  ' + p)
