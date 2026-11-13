import type { ReactNode } from 'react'

type Marker = 'highlight' | 'privacyPolicy' | 'boatName'
type Renderers = Partial<Record<Marker, (content: string, key: number) => ReactNode>>

// Translators control the order, spacing, and punctuation of the whole message.
// Only fixed translation markers are parsed. User text is passed to a renderer,
// never parsed as a translation.
const MARKER = /<(highlight|privacyPolicy)>([^<>]*)<\/\1>|<boatName\/>/g

export const renderFormattedMessage = (message: string, renderers: Renderers): ReactNode[] => {
  const output: ReactNode[] = []
  let from = 0
  let match: RegExpExecArray | null
  MARKER.lastIndex = 0

  while ((match = MARKER.exec(message)) !== null) {
    if (match.index > from) {
      output.push(message.slice(from, match.index))
    }
    const marker = (match[1] || 'boatName') as Marker
    const render = renderers[marker]
    output.push(render ? render(match[2] || '', output.length) : match[0])
    from = MARKER.lastIndex
  }
  if (from < message.length) {
    output.push(message.slice(from))
  }
  return output
}
