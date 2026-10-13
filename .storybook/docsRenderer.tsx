import { Component, type ReactNode } from 'react'
import { MDXProvider } from '@mdx-js/react'
import { renderElement, unmountElement } from '@storybook/react-dom-shim'
import { AnchorMdx, CodeOrSourceMdx, Docs, HeadersMdx } from '@storybook/addon-docs/blocks'

type DocsProps = Parameters<typeof Docs>[0]

class ErrorBoundary extends Component<{ showException: (err: Error) => void; children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(err: Error) {
    this.props.showException(err)
  }

  render() {
    return this.state.hasError ? null : this.props.children
  }
}

/**
 * Storybook's DocsRenderer (@storybook/addon-docs), with one change: a docs page keeps its React tree when it
 * re-renders. Storybook re-renders the docs page on every toolbar change (Brand, Mode, Language) and gives the
 * error boundary a new random key each time, which remounts the whole page. The stories on the page are then torn
 * down while they are still re-rendering for the same change, and Storybook reloads the preview: the page jumps to
 * the top and Playground control edits are lost. Here the key changes only after an error, to reset the boundary.
 */
export class FabiDocsRenderer {
  private key = 0
  private failed = false

  render = async (context: DocsProps['context'], docsParameter: DocsProps['docsParameter'], element: HTMLElement) => {
    const components = { code: CodeOrSourceMdx, a: AnchorMdx, ...HeadersMdx, ...(docsParameter?.components as object) }
    if (this.failed) {
      this.key += 1
      this.failed = false
    }
    return new Promise<void>((resolve, reject) => {
      const showException = (err: Error) => {
        this.failed = true
        reject(err)
      }
      renderElement(
        <ErrorBoundary key={this.key} showException={showException}>
          <MDXProvider components={components}>
            <Docs context={context} docsParameter={docsParameter} />
          </MDXProvider>
        </ErrorBoundary>,
        element,
      ).then(() => resolve())
    })
  }

  unmount = (element: HTMLElement) => {
    unmountElement(element)
  }
}
