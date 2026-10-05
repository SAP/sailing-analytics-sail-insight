import { Platform } from 'react-native'

/**
 * Scroll `scrollView` so that `field` sits near its top. Used when a field with
 * a dropdown (boat class suggestions) is focused, so the suggestions are not
 * hidden behind the keyboard. On Android the window is resized when the
 * keyboard opens; wait for it so the scroll range is large enough.
 */
export const scrollFieldToTop = (scrollView: any, field: any, topMargin = 16) => {
  const scroll = () => {
    if (!scrollView || !field || !scrollView.getInnerViewNode || !field.measureLayout) {
      return
    }
    field.measureLayout(
      scrollView.getInnerViewNode(),
      (_x: number, y: number) => scrollView.scrollTo({ y: Math.max(y - topMargin, 0), animated: true }),
      () => undefined,
    )
  }
  Platform.OS === 'android' ? setTimeout(scroll, 300) : scroll()
}

// Room below the last field so the scroll view can be scrolled far enough
// to show a dropdown of 5 suggestions above the keyboard.
export const SUGGESTIONS_BOTTOM_PADDING = 220
