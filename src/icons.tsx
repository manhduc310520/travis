/**
 * The FABi icon set.
 *
 * The Figma file carries 2,361 icons on the `🍑 Icon` page, named
 * `align-bottom-01`, `layers-three-01`, `layout-alt-01` and so on — that is
 * Untitled UI Icons. This module maps the ones the system uses onto the
 * official React package so design and code draw from the same set.
 *
 * Sourced from `@untitledui-pro/icons/line` (the purchased PRO package, line
 * style — the same style the free `@untitledui/icons` package shipped, just a
 * larger catalog: 1,174 icons vs ~1,100) rather than the free package. Every
 * name already used here was confirmed present in the PRO set before
 * switching (checked programmatically, not by eye) — same PascalCase names,
 * same component shape (`size`/`color` + standard SVG props), so this was a
 * drop-in swap with no call-site changes anywhere else in the project.
 *
 * Untitled UI icons default to 24px. Ant Design sizes its own icons at `1em`,
 * so every icon here is wrapped to default to 16px instead, which is the size
 * the Figma components use inside controls. Pass `size` to override.
 */
import type { FC, SVGProps } from 'react'
import * as UI from '@untitledui-pro/icons/line'

export type IconProps = SVGProps<SVGSVGElement> & { size?: number; color?: string }

function sized(Cmp: FC<IconProps>, defaultSize = 16): FC<IconProps> {
  return function Icon({ size = defaultSize, className, ...rest }: IconProps) {
    // Untitled UI renders a bare <svg> with no wrapper span, so it keeps the
    // browser default `display: inline; vertical-align: baseline`. Sitting
    // next to anything else inline (Avatar, text, another icon) inside a
    // block-level container — `.ant-space-item` is `display: block`, not
    // flex — that baseline sits a few px above true vertical center. The
    // `.fabi-icon` class makes every icon `display: block` (see index.css).
    // It must stay a zero-specificity class, never an inline style: Ant
    // Design's own `> svg` rules (Tag, Breadcrumb, Collapse, Segmented, Tabs)
    // switch a bare svg back to inline-block, and an inline `display: block`
    // overrode them — which dropped Tag's close icon onto its own line.
    return <Cmp size={size} className={className ? `fabi-icon ${className}` : 'fabi-icon'} {...rest} />
  }
}

// Navigation
export const Home01 = sized(UI.Home01)
export const Building02 = sized(UI.Building02)
export const BookOpen01 = sized(UI.BookOpen01)
export const Tag01 = sized(UI.Tag01)
export const Printer = sized(UI.Printer)
export const Users01 = sized(UI.Users01)
export const PieChart01 = sized(UI.PieChart01)
export const Settings01 = sized(UI.Settings01)

// Chrome
export const SearchMd = sized(UI.SearchMd)
export const Bell01 = sized(UI.Bell01)
export const User01 = sized(UI.User01)
export const LayoutLeft = sized(UI.LayoutLeft)
export const Menu02 = sized(UI.Menu02)
export const Columns03 = sized(UI.Columns03)

// Chevrons and arrows
export const ChevronDown = sized(UI.ChevronDown, 12)
export const ChevronRight = sized(UI.ChevronRight, 12)
export const ArrowUp = sized(UI.ArrowUp, 12)

// Actions
export const Plus = sized(UI.Plus)
export const Edit01 = sized(UI.Edit01)
export const Trash01 = sized(UI.Trash01)
export const Eye = sized(UI.Eye)
export const Upload01 = sized(UI.Upload01)
export const UploadCloud01 = sized(UI.UploadCloud01, 32)
export const HelpCircle = sized(UI.HelpCircle)
export const Heart = sized(UI.Heart)
export const Share01 = sized(UI.Share01)

// Icons Ant Design renders inside its own components. Overridden per component
// through ConfigProvider so the internal chrome matches the Figma icon set too.
export const Check = sized(UI.Check, 14)
export const XClose = sized(UI.XClose, 12)
export const Calendar = sized(UI.Calendar, 14)
export const Clock = sized(UI.Clock, 14)
export const Loading02 = sized(UI.Loading02, 14)
export const AlertCircle = sized(UI.AlertCircle)
export const InfoCircle = sized(UI.InfoCircle)
export const AlertTriangle = sized(UI.AlertTriangle)
export const XCircle = sized(UI.XCircle)
export const CheckCircle = sized(UI.CheckCircle)
export const Star01 = sized(UI.Star01, 20)

// App shell navigation — real icon names read directly off the Figma
// instances (Components/App Shells/Menu), not guessed.
export const Home03 = sized(UI.Home03)
export const LayoutAlt03 = sized(UI.LayoutAlt03)
export const Tag03 = sized(UI.Tag03)
export const PieChart04 = sized(UI.PieChart04)
export const Grid01 = sized(UI.Grid01)
export const ShoppingCart01 = sized(UI.ShoppingCart01)
export const FileSearch02 = sized(UI.FileSearch02)
export const Monitor03 = sized(UI.Monitor03)
export const Mail01 = sized(UI.Mail01)
export const File06 = sized(UI.File06)
export const CheckCircleBroken = sized(UI.CheckCircleBroken)

// More Ant Design internal-chrome overrides (Menu submenu arrow, Modal/
// Drawer/Notification/Tag close buttons, Tabs, Breadcrumb, password toggle).
export const EyeOff = sized(UI.EyeOff)
export const DotsHorizontal = sized(UI.DotsHorizontal)
export const X = sized(UI.X)
