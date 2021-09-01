import { DirectiveBinding } from 'vue'

export const focus = {
  mounted(el: HTMLElement, binding: DirectiveBinding<boolean>): void {
    const value = binding.value === undefined ? true : binding.value
    if (value) {
      if (el?.tagName === 'INPUT') {
        el.focus()
      } else {
        const input = el.getElementsByTagName('input')[0]
        input?.focus()
      }
    }
  },
}

export const uppercase = {
  updated(el: HTMLInputElement): void {
    const sourceValue = el.value
    const newValue = sourceValue.toUpperCase()

    if (sourceValue !== newValue) {
      el.value = newValue
      el.dispatchEvent(new Event('input', { bubbles: true }))
    }
  },
}
