const CART_KEY = 'vinobook_cart'

export const loadCart = () => {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const saved = window.localStorage.getItem(CART_KEY)
    return saved ? JSON.parse(saved) : []
  } catch (error) {
    console.warn('Не вдалося прочитати кошик із localStorage:', error)
    return []
  }
}

export const saveCart = (cartItems) => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(CART_KEY, JSON.stringify(cartItems))
  } catch (error) {
    console.warn('Не вдалося зберегти кошик у localStorage:', error)
  }
}
