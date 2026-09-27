/**
 * The FABi CMS icon set.
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
 * Untitled UI icons default to 24px; every icon here is wrapped to default to
 * 16px instead, which is the size the Figma components use inside controls.
 * Pass `size` to override.
 */
import type { FC, SVGProps } from 'react'
import * as UI from '@untitledui-pro/icons/line'

export type IconProps = SVGProps<SVGSVGElement> & { size?: number; color?: string }

function sized(Cmp: FC<IconProps>, defaultSize = 16): FC<IconProps> {
  return function Icon({ size = defaultSize, className, ...rest }: IconProps) {
    // Untitled UI renders a bare <svg>, which keeps the browser default
    // `display: inline; vertical-align: baseline` and sits a few px above
    // true centre next to text. The `.fabi-icon` class makes every icon
    // `display: block` (see index.css). It stays a zero-specificity class,
    // never an inline style, so a component can still set its own display.
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

// Control chrome: check marks, close / clear, calendar, clock, spinners, status.
export const Check = sized(UI.Check, 14)
export const XClose = sized(UI.XClose) // close / remove / clear: 16px everywhere
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

// More control chrome: password toggle, overflow menus, close buttons.
export const EyeOff = sized(UI.EyeOff)
export const DotsHorizontal = sized(UI.DotsHorizontal)
export const X = sized(UI.X)

// fc components (waves 3–5): overlays, navigation, data display, data entry.
export const ChevronLeft = sized(UI.ChevronLeft, 12)
export const ChevronUp = sized(UI.ChevronUp, 12)
export const ChevronLeftDouble = sized(UI.ChevronLeftDouble, 12)
export const ChevronRightDouble = sized(UI.ChevronRightDouble, 12)
export const ChevronSelectorVertical = sized(UI.ChevronSelectorVertical, 12)
export const ArrowDown = sized(UI.ArrowDown, 12)
export const ArrowLeft = sized(UI.ArrowLeft)
export const ArrowRight = sized(UI.ArrowRight)
export const DotsVertical = sized(UI.DotsVertical)
export const Minus = sized(UI.Minus)
export const Copy01 = sized(UI.Copy01)
export const Save01 = sized(UI.Save01)
export const Send01 = sized(UI.Send01)
export const Download01 = sized(UI.Download01)
export const RefreshCw01 = sized(UI.RefreshCw01)
export const FilterLines = sized(UI.FilterLines)
export const Link01 = sized(UI.Link01)
export const LogOut01 = sized(UI.LogOut01)
export const Lock01 = sized(UI.Lock01)
export const Phone = sized(UI.Phone)
export const Receipt = sized(UI.Receipt)
export const BarChart01 = sized(UI.BarChart01)
export const File02 = sized(UI.File02)
export const Image01 = sized(UI.Image01)
export const Package = sized(UI.Package)
export const Truck01 = sized(UI.Truck01)
export const Gift01 = sized(UI.Gift01)
export const Coins01 = sized(UI.Coins01)
export const Wallet02 = sized(UI.Wallet02)
export const CreditCard01 = sized(UI.CreditCard01)
export const Globe01 = sized(UI.Globe01)
export const Map01 = sized(UI.Map01)
export const Hash01 = sized(UI.Hash01)
export const List = sized(UI.List)
export const LayoutGrid01 = sized(UI.LayoutGrid01)
export const ClockRewind = sized(UI.ClockRewind)
export const Sun = sized(UI.Sun)
export const Moon01 = sized(UI.Moon01)
// Image preview toolbar.
export const ZoomIn = sized(UI.ZoomIn)
export const ZoomOut = sized(UI.ZoomOut)
export const RefreshCcw01 = sized(UI.RefreshCcw01)
export const SwitchHorizontal01 = sized(UI.SwitchHorizontal01)
export const SwitchVertical01 = sized(UI.SwitchVertical01)
// App shell (header, sidebar) and Search Modal.
export const Menu01 = sized(UI.Menu01)
export const LayoutAlt02 = sized(UI.LayoutAlt02)
export const ArrowNarrowLeft = sized(UI.ArrowNarrowLeft)
export const CornerDownLeft = sized(UI.CornerDownLeft)
export const SearchSm = sized(UI.SearchSm)
export const Bell02 = sized(UI.Bell02)
export const Settings02 = sized(UI.Settings02)
export const FaceSmile = sized(UI.FaceSmile)
export const FilterFunnel01 = sized(UI.FilterFunnel01, 12)
export const Inbox01 = sized(UI.Inbox01)
export const ImagePlus = sized(UI.ImagePlus)
export const Paperclip = sized(UI.Paperclip)
export const FaceFrown = sized(UI.FaceFrown)
export const Folder = sized(UI.Folder)
export const MinusSquare = sized(UI.MinusSquare)
export const PlusSquare = sized(UI.PlusSquare)
