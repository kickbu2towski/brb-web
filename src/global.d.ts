import * as React from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'em-emoji': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        id?: string
        shortcodes?: string
        native?: string
        size?: string | number
        fallback?: string
        set?: 'native' | 'apple' | 'facebook' | 'google' | 'twitter'
        skin?: string | number
      }
    }
  }
}
