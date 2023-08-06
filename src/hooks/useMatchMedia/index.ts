import { useCallback, useLayoutEffect, useState } from 'react'
import { IMediaQuery, IMatchedMedia } from './types'

export function useMatchMedia(
  queries: IMediaQuery,
  defaultValues: IMatchedMedia = []
): IMatchedMedia {
  const initialValues = defaultValues.length
    ? defaultValues
    : Array(queries.length).fill(false)

  const mediaQueryLists = queries.map((q) => window.matchMedia(q))
  const getValue = useCallback((): IMatchedMedia => {
    const matchedQueries = mediaQueryLists.map((mql) => mql.matches)
    return matchedQueries
  }, [mediaQueryLists])

  const [value, setValue] = useState(getValue)

  useLayoutEffect(() => {
    const handler = (): void => setValue(getValue)
    mediaQueryLists.forEach((mql) => mql.addListener(handler))
    return (): void =>
      mediaQueryLists.forEach((mql) => mql.removeListener(handler))
  }, [getValue, mediaQueryLists])

  if (typeof window === 'undefined') return initialValues

  return value
}
