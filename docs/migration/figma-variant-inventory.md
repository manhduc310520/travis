# Figma variant inventory (2026-09-26)

Read from the FABi CMS Figma file with the Plugin API. For every component page:
**Sets** = component sets and their variant / boolean properties; **Examples** = the instances
placed in the page's docs section ("Light Mode" example frame), with only the properties that
differ from the component's defaults (`(default)` = all defaults). Storybook must show every
example below and every variant option that makes sense in code.

## General

### Button
- Sets: `Button / Basic`: Type[Primary|Default|Dashed|Text|Link] Size[Default|Large|Small] State[Default|Hover|Focused|Pressed|Disabled] Content[Basic|Icon Only] Ghost[False|True] Danger[False|True] Shape[Default|Round] Icon Start? Icon End?
- `Button / Color (optional)`: Variant[Solid|Outlined|Dashed|Filled|Text|Link] Color[Default|Primary|Danger|Pink|Purple|Cyan] Icon[None|Start|End|Only]
- `Button Group Compact`: Type[Primary|Default] Size[Default|Small|Large] Direction[Horizontal|Vertical]
- Examples: Primary / Default / Text / Link / Dashed; Round × (Link, Default, Primary, Dashed, Text); Danger × (Primary, Default, Text, Link, Dashed); Ghost primary; Icon Only × (Primary, Default, Text, Link, Dashed); Color: Solid/Outlined/Dashed/Filled/Text default with start icon; Solid × Primary/Cyan/Purple/Pink/Danger; Button Group Compact primary/default × horizontal/vertical.

### FloatButton
- Sets: `FloatButton`: Type[Default|Primary] State[Default|Hover] Shape[Square|Circle] Badge[None|Dot|Small] Description? Icon? Tooltip?; `FloatButton Group`: Type[Square|Circle] Direction[Vertical|Horizontal]; `FloatButton Menu`: Open[No|Yes] Placement[-|Top|Bottom|Right|Left]
- Examples: default; Badge=Small; Group; Type=Primary (+Badge); Shape=Circle (+Badge); Menu open right; Primary circle (+Badge); Menu open top; Group circle horizontal.

### Typography
- Sets: `Title`: Level[1–5] Editable?; `Text`: Type[Default|Secondary|Success|Warning|Danger|Mark|Disabled] Style[Default|Underline|Delete|Italic|Strong] Size[Base|LG|SM]; `Link`: Underlined[No|Yes]
- Examples: Title 1–5; Text default, Strong, Underline, Secondary, Success, Warning, Danger, Disabled, Mark, Delete, Italic; Link; Code; Keyboard.

## Layout

### Divider
- Sets: `Divider Horizontal`: Variant[Solid|Dashed|Dotted] Orientation[Center|Left|None|Right] Text Type[None|Plain|Title]
- Examples: default; text Left / Center / Right (plain); Divider Vertical.

### Grid
- Sets: `Grid`: Columns[1|2|3|4|6|8]
- Examples: 1, 2, 3, 4, 6 columns.

### Space
- Sets: `Space`: Slots[1–8|12] Space[Middle|Small|Large|None] Orientation[Vertical|Horizontal] Split?
- Examples: vertical 1–8 and 12 slots; horizontal 1–7 slots.

### Masonry
- Sets: `Masonry`: Columns[2|3|4] Type[1|2|3]. Examples: 2, 3, 4 columns.

### Splitter
- Sets: `Splitter`: Orientation[Vertical|Horizontal] Collapsible?; collapse button; bar dragger (default/hover/active/disabled)
- Examples: Vertical, Horizontal, Multiple Panels, Complex.

### Layout (App shells)
- Sets: App shell with Filter / Breadcrumb / Tabs × Breakpoint[Laptop|Tablet|Mobile]. Examples: App shell with Filter at Laptop, Tablet, Mobile.

## Navigation

### Anchor
- Sets: `Anchor`: Direction[Vertical|Horizontal]; items Level[1|2]. Examples: vertical, horizontal.

### Breadcrumb
- Sets: `Breadcrumb`: Type[Basic|Dropdown|Icon]; link State[Default|Hover|Current] Icon? Label?
- Examples: Basic, Dropdown, Icon.

### Dropdown
- Sets: `Dropdown`: Open Menu[No|Yes] Type[Basic Inline|Button Basic|Button Twofold] Placement[-|Bottom Left|Bottom Right|Bottom|Top Right|Top|Top Left]; `Dropdown Menu`: Arrow[…] Submenu? Button?; menu item: State[Default|Hover|Disabled|Selected] Danger Icon? Submenu? Extra?
- Examples: inline trigger open at Bottom / Bottom Right / Bottom Left / Top Right / Top / Top Left; closed inline; Button Basic open at the six placements + closed; Button Twofold (split button) closed + open Bottom Right / Top Left.

### Menu
- Sets: `Menu`: Theme[Light|Dark] Mode[Inline|Vertical] Collapsed[No|Yes] Logo?; items with icon, submenu, group title, Status[Default|Error], disabled
- Examples: inline, inline collapsed, dark inline, vertical, dark vertical, vertical collapsed, dark vertical collapsed.

### Pagination
- Sets: `Pagination`: Variant[Basic|Jumper|Mini|Mini Jumper|More|Simple|Prev and next]; items Size[Default|Small|Large], disabled
- Examples: Basic, Jumper, Mini, Mini Jumper, More, Simple, Prev and next.

### Steps
- Sets: `Steps`: Type[Basic|Custom Icon|Dot|Navigation|Inline] Size[Medium|Small] Direction[Horizontal|Vertical|Steps] Time? Description?; item Status[Finish|Process|Wait|Error], progress icon; `Panel Steps`: Type[1|2]
- Examples: basic, small, custom icon, dot, inline, small vertical, vertical, dot vertical, navigation small, navigation, Panel steps type 1 and 2.

### Tabs
- Sets: `Tabs / Basic`: Placement[Bottom|Left|Right|Top] Size[Default|Large|Small]; `Tabs / Card`: Size; `Tabs / Container`: Size; items Icon? Badge? Closeable? + add button
- Examples: basic top/bottom/left/right; card default/large/small; container (editable card) default/large/small.

## Data Entry

### Search Modal
- Sets: `Search Modal`: State[Default|Focused|Typing|Filled|Empty|History]. Example: default. (App-level pattern, not an antd component.)

### Affix
- No component set; the example shows content pinned above a scrolling list.

### AutoComplete
- Sets: `AutoComplete`: Active[No|Yes] Size[Default|Small|Large] Type[Default|Borderless]; `AutoComplete / With Button`: Type[Button Default|Button Primary]; menu Type[Default|With Groups|Empty]
- Examples: default, borderless, open, open borderless; with button (primary / default), open.

### Checkbox
- Sets: `Checkbox`: Status[Active|Inactive|Indeterminate] State[Default|Hover|Focused|Disabled] Label? Tooltip?
- Examples: without label; unchecked; checked; indeterminate.

### ColorPicker
- Sets: trigger State[Default|Active|Disabled] Size[Medium|Large|Small] Show Text? Show Icon?; popup Direction, Gradient, Allow Clear?, Presets?, Segmented?
- Examples: closed, open.

### DatePicker
- Sets: `DatePicker`: Active Size; menu Type[Date and Time|Day|Month|Year] Range? Preset?; inputs Outlined / Borderless / Underlined / Filled × Status[Default|Warning|Error] × Range × Size, Multiple, prefix
- Examples: closed, open.

### TimePicker
- Sets: `TimePicker`: Active Size; inputs Outlined / Borderless / Underlined / Filled × Status × Range × Size, prefix
- Examples: closed, open.

### Form
- Sets: `Form / Basic`: Layout[Horizontal|Inline|Vertical] Size[Default|Large|Small]; `Form / Login`: MD|SM; form items for Text, Password, Phone, Textarea, Select, DatePicker, InputNumber, Switch, Currency, Slider, Rate, Drag and Drop, Radio Buttons, Radio Group, Checkbox Group, TimePicker, Upload Picture, Tree Select; label Mark[None|Optional|Required] Tooltip?
- Examples: vertical items, horizontal items, basic horizontal / inline / vertical, login form, inline login.

### Input
- Sets: Outlined Status[Default|Error|Warning|Success] Size State Icon Left/Right? Prefix? Suffix? Show Count?; Underlined; Borderless; Filled Status[Default|Error|Warning]; Textarea (Show Count?); Password Hide[True|False]; Search Button Type[Default|Primary with Icon|Primary with Text]; Pre Post Tab (addons) Type[Basic|Icon|Select]; OTP Length[4|6|8] separator?; caption Status; show count Max?
- Examples: outlined small/default/large; error/warning/success; underlined; borderless; filled (default/error/warning); textarea; password; search (default / primary icon / primary text); pre+post tab, post only, pre only; OTP 4/6/8; OTP error/warning.

### Cascader
- Sets: `Cascader`: Active Size Placement[-|Bottom Left|Bottom Right|Top Right|Top Left]; menu item Type[Default|Checkbox] disabled
- Examples: closed; open at the four placements.

### Select
- Sets: `Select`: Active Size Placement[-|Bottom|Top]; inputs Outlined / Borderless / Underlined / Filled × Type[Basic|Multiple|Search] × Status × Size, prefix, max count; menu empty
- Examples: closed; open bottom; open top.

### TreeSelect
- Sets: `TreeSelect`: Active Size Placement; menu Type[Basic|Checkable]. Examples: closed, open.

### Rate
- Sets: `Rate`: Rate[0–5 in 0.5 steps] Text?; star Size[Default|Small|Large]. Examples: every value 0 → 4.5 (+ default 5).

### InputNumber
- Sets: Basic (Size, State); Prefix Suffix (Status); Pre Post Tab; Underlined; Borderless; Filled (Status); Spinner Type[Outlined|Filled]
- Examples: default, hover, large, small; prefix/suffix default/error/warning; pre+post tab, post only, pre only; underlined; filled default/error/warning; borderless; spinner outlined, spinner filled.

### Mentions
- Sets: `Mentions`: Size State[Default|Focused] Placement[Default|Bottom|Top]. Examples: default; open bottom; open top; large/small open.

### Radio
- Sets: `Radio`: Checked State Label?; `Radio Group`: Size[Default|Large|Small] Style[Outlined|Solid] Block[Off|On]; `Radio Button`: Position Size State Style
- Examples: without label; unchecked; checked; hover; button group default / large / small / solid / block.

### Slider
- Sets: `Slider / Basic`: Vertical Reverse; handle / track (Range) / rail (Marks) / mark
- Examples: basic, vertical, with icons, with InputNumber.

### Switch
- Sets: `Switch / Basic`: Size[Medium|Small] State[Default|Pressed|Loading|Disabled] Active; `Switch / Number and Icon`: Type[Icon|Number]
- Examples: on, off, pressed on/off, loading on/off; with text/number inside on/off, loading.

### Transfer
- Sets: `Transfer`: Search[No|Yes]; panel Status[Default|Warning|Error] Disabled Search? Footer?. Examples: default, with search.

### Upload
- Sets: button (Size, State incl Loading/Disabled); list item Basic (Error); Picture (Status[Error|Upload|Uploaded] Type[Card|Circle]); Picture card (Error|Loading|Upload)
- Examples: button; drag and drop; picture list (uploading / error / uploaded) × card / circle; picture card (uploaded / error / upload button).

## Data Display

### Avatar
- Sets: `Avatar`: Type[Icon|Image|Text] Size[Custom|Default|Large|Small] Shape[Circle|Square] Badge?; `Avatar Group`: Size
- Examples: image × small/default/large/custom × circle/square; the same with badge; group default/large/small.

### Badge
- Sets: `Badge / Basic`: Type[Medium|Small|Dot]; `Badge / Status`: Status[Default|Error|Processing|Success|Warning] Label?; `Badge / Ribbon`: Color[Volcano|Daybreak Blue|Magenta|Dust Red|Cyan|Polar Green|Golden Purple]
- Examples: basic dot, medium, small; status success / default / error / processing / warning; ribbon default + six colours.

### Calendar
- Sets: `Calendar / Basic`: Year?; `Calendar / Card`: Year? Custom Header?; show week (Mini|Full); cells with notice
- Examples: basic month, basic year; card with custom header, card, card year, card year + custom header.

### Card
- Sets: `Card / Basic`: Size[Medium|Small] Borderless Tabs; `Card / Advanced`: Type[Advanced|Simple] Image?; `Card / Grid`: Columns[4|3|2]
- Examples: basic, borderless, borderless with tabs, with tabs, advanced (cover + meta + actions), simple, grid 4 / 3 / 2.

### Carousel
- Sets: `Carousel`: Dot Placement[Bottom|Top|Start|End] Arrows?. Examples: dots bottom / top / start / end.

### Collapse
- Sets: `Collapse`: Type[Basic|Borderless|Ghost] Size[Default|Small|Large]; item Expand Icon Placement[Left|Right] Disabled Extra Node?
- Examples: basic, borderless, ghost.

### Descriptions
- Sets: `Descriptions`: Size[Large|Medium|Small]; bordered items (label / content / status)
- Examples: basic, bordered large / medium / small.

### Empty
- Sets: `Empty / Image`: Image[1|2]; `Empty`: Size[MD|SM]. Examples: image 1, image 2 (simple), default.

### Image
- Sets: `Image`: Error State[Default|Hover]; fixed ratio images; `Image Preview`: Breakpoint[Desktop|Mobile]
- Examples: image, hover (preview mask), preview desktop, preview mobile.

### Popover
- Sets: `Popover`: Placement[12 placements] Arrow?. Examples: without arrow; all 12 placements.

### QRCode
- Sets: `QR Code`: Type[Basic|Popover|Loading|Expired]. Examples: basic, in a popover, loading, expired.

### Segmented
- Sets: `Segmented`: Size Block Vertical Shape[Default|Round]; item Icon? Label? Disabled
- Examples: block, round, default, block vertical.

### Statistic
- Sets: `Statistic`: Type[Basic|Down|Up] Show Icon?; `Statistic / Card`: Type[Down|Up]; `Statistic / Countdown`: Type[1|2]
- Examples: basic, without icon, down, up; card up / down; countdown 1 / 2.

### Table
- Sets: `Table`: Size[Default|Medium|Small] Bordered Title? Footer? Pagination?; header Sort? Filter? Search?; cells Text / Badge / Tag / Action / Dropdown / Rate / Switch / Progress / Action Button, Avatar; row controls checkbox / radio / expand
- Examples: without title/footer/pagination; default; bordered; medium bordered; small bordered.

### Tag
- Sets: `Tag / Basic`: Variant[Add New|Closeable|Default]; `Tag / Colorful`: Preset[Blue|Cyan|Geekblue|Gold|Green|Lime|Magenta|Orange|Purple|Red|Volcano] Type[Solid|Filled|Outlined]; `Tag / Checkable`: Checked; `Tag / Status`: Status[Default|Error|Processing|Success|Warning] Type[Outlined|Filled|Solid] Icon?; `Tag / Icon`: Type[Twitter|Youtube|Facebook|LinkedIn]
- Examples: basic, add new, closeable; all 11 presets; checkable off / on; status default / error / processing / success / warning; icon tags.

### Timeline
- Sets: `Timeline`: Text Placement[Alternate|Left|Right]; items Color[Blue|Gray|Green|Red], custom; `Timeline / Horizontal`: Text Placement[Top|Center|Bottom]
- Examples: horizontal top / center / bottom (vertical left/right/alternate exist as variants).

### Tooltip
- Sets: `Tooltip`: Placement[12 placements] Arrow?; `Tooltip / Color Preset`: Type[Default|Blue|Cyan|Geekblue|Gold|Green|Lime|Magenta|Orange|Purple|Red|Volcano|Yellow|Custom]
- Examples: without arrow; default; left, left top, bottom, right, top; 13 colour presets + custom.

### Tour
- Sets: `Tour`: Type[Non-modal|Basic] Placement[12] Image?; indicator Number|Slider
- Examples: without image; basic; non-modal; non-modal bottom right / left bottom / top.

### Tree
- Sets: `Tree`: Type[Basic|Checkbox|Icon|Leaf|Draggable] Line[False|True]
- Examples: checkbox (default), basic, icon, leaf (show line + leaf icon), draggable.

## Feedback

### Alert
- Sets: `Alert`: Type[Error|Info|Success|Warning] Banner Description Custom Actions? Close Text? Close Icon?
- Examples: four types; four types with description; custom actions (info with description, success); banner; warning banner.

### Drawer
- Sets: `Drawer`: Placement[Right|Top|Bottom|Left] Close Icon? Button Outline? Button Primary? Footer?
- Examples: right, top, bottom, left.

### Message
- Sets: `Message`: Type[Error|Loading|Normal|Success|Warning]. Examples: all five.

### Notification
- Sets: `Notification`: Type[Basic|Error|Info|Success|Warning] Buttons? Show Icon?. Examples: all five.

### Modal
- Sets: `Modal / Basic`: Type[Text|Slot]; `Modal / Information`: Status[Error|Info|Success|Warning]
- Examples: basic; information info / error / success / warning; confirmation; with overlay.

### Progress
- Sets: Standard / Circle / Dashboard × Size[Medium|Small|Custom] × Status[Normal|Exception|Success] × strokeLinecap[Round|Square] × showInfo?; Steps; gradient standard / circle / dashboard; circular custom (segments); Value Position Position[Outside|Inside] Placement[Start|End|Center|Bottom]
- Examples: line small / default / custom width, exception, success; circle normal / exception / success; steps normal / exception / success; gradient line (custom, small, default), gradient circle normal / success; circular (segmented) normal / success / error; value position outside end / bottom, success, inside start / end / center.

### Result
- Sets: `Result`: Status[Info|Success|Warning|Error|403|404|500|Custom icon]. Examples: all eight.

### Popconfirm
- Sets: `Popconfirm`: Placement[12]. Examples: all 12 placements.

### Skeleton
- Sets: `Skeleton`: Type[Basic|Complex] Images? Input? Button?; input Size; button Shape[Circle|Default|Round] Size; image Type[Dot Chart|Image]; avatar Shape Size
- Examples: basic; with input + image; complex with input; complex with image + input; complex; image + button; complex with input + button.

### Spin
- Sets: `Spin`: Size[Medium|Large|Small] Tip?. Examples: small / medium / large with and without tip; inside a container.

### Watermark
- No component set. Example: watermarked content.
