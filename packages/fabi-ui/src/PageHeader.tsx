// PageHeader: the top of every CMS page: breadcrumb, back, title (h1), tags, description and the page actions
// (user 2026-10-13: list / form / detail templates). antd 5 removed its PageHeader; this one is built from
// Breadcrumb + Typography + Flex + Button. Actions wrap under the title on narrow screens.
// Without `title` (the FABi list / form pages): breadcrumb and actions share one row, and the last breadcrumb
// item is the page's h1 for screen readers.
import { Breadcrumb, Button, Flex, Typography, theme as antdTheme } from 'antd'
import type { BreadcrumbProps } from 'antd'
import type { CSSProperties, ReactNode } from 'react'
import { ArrowLeftLine } from './fabi-icons.js'
import { useFabiLang } from './useFabiLang.js'

export interface PageHeaderProps {
  /** Page title (the page's h1). Leave it out to show the breadcrumb and the actions on one row */
  title?: ReactNode
  /** Where the page sits, e.g. [{ title: 'Home' }, { title: 'Restaurants' }, { title: 'Restaurant list' }] */
  breadcrumb?: BreadcrumbProps['items']
  /** Shows a back button before the title (detail pages) */
  onBack?: () => void
  /** Next to the title, e.g. a status Tag */
  tags?: ReactNode
  /** One line under the title */
  description?: ReactNode
  /** Page actions at the end: one primary action at most (CLAUDE.md), the rest default buttons */
  extra?: ReactNode
  /** Content under the header row, e.g. Tabs or a FilterBar */
  footer?: ReactNode
  className?: string
  style?: CSSProperties
}

export function PageHeader({ title, breadcrumb, onBack, tags, description, extra, footer, className, style }: PageHeaderProps) {
  const { token } = antdTheme.useToken()
  const en = useFabiLang() === 'en'
  const crumbs = breadcrumb && breadcrumb.length > 0 ? <Breadcrumb items={breadcrumb} /> : null
  const last = breadcrumb?.[breadcrumb.length - 1]?.title
  const back = onBack && <Button type="text" icon={<ArrowLeftLine />} aria-label={en ? 'Back' : 'Quay lại'} onClick={onBack} />
  const actions = extra ? <Flex gap="small" wrap>{extra}</Flex> : null
  return (
    // a div, not <header>: the app header is the page banner landmark
    <div
      className={className}
      style={{
        padding: `${token.paddingSM}px ${token.padding}px ${footer ? 0 : token.paddingSM}px`,
        background: token.colorBgContainer,
        borderBottom: `${token.lineWidth}px solid ${token.colorBorderSecondary}`,
        ...style,
      }}
    >
      {title ? (
        <>
          {crumbs && <div style={{ marginBottom: token.marginXS }}>{crumbs}</div>}
          <Flex justify="space-between" align="center" gap="middle" wrap>
            <Flex align="center" gap="small" wrap style={{ minWidth: 0 }}>
              {back}
              {/* the page h1, at the Heading 4 size */}
              <Typography.Title level={1} style={{ margin: 0, fontSize: token.fontSizeHeading4, lineHeight: token.lineHeightHeading4 }}>{title}</Typography.Title>
              {tags}
            </Flex>
            {actions}
          </Flex>
        </>
      ) : (
        <Flex justify="space-between" align="center" gap="middle" wrap style={{ minHeight: token.controlHeight }}>
          <Flex align="center" gap="small" wrap style={{ minWidth: 0 }}>
            {back}
            {crumbs}
            {typeof last === 'string' && <h1 className="fabi-sr-only">{last}</h1>}
            {tags}
          </Flex>
          {actions}
        </Flex>
      )}
      {description && <Typography.Paragraph type="secondary" style={{ margin: `${token.marginXXS}px 0 0` }}>{description}</Typography.Paragraph>}
      {footer && <div style={{ marginTop: token.marginSM }}>{footer}</div>}
    </div>
  )
}
