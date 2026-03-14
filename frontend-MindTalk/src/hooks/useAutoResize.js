import { useEffect } from 'react'

/**
 * useAutoResize — auto-expands a textarea ref as the user types.
 * Pass the ref and the current value; the hook handles height updates.
 *
 * @param {React.RefObject} ref - ref attached to the <textarea>
 * @param {string} value       - current textarea value (triggers resize)
 * @param {number} maxHeight   - optional max height in px (default: 200)
 */
export function useAutoResize(ref, value, maxHeight = 200) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, maxHeight) + 'px'
  }, [ref, value, maxHeight])
}
