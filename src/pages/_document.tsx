import { inter } from '@/lib/fonts'
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en" className="dark">
      <Head />
      <body className={`${inter.variable} font-sans bg-bg text-fg`}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
