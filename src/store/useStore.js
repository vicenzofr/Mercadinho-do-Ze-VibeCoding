import { create } from 'zustand'

export const useStore = create((set, get) => ({
  user: null,
  cart: [],

  login: (userData) => set({ user: userData }),
  logout: () => set({ user: null, cart: [] }),

  addToCart: (product) => {
    const cart = get().cart
    const existing = cart.find(i => i.id === product.id)
    if (existing) {
      set({ cart: cart.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i) })
    } else {
      set({ cart: [...cart, { ...product, qty: 1 }] })
    }
  },

  removeFromCart: (id) => set({ cart: get().cart.filter(i => i.id !== id) }),

  updateQty: (id, qty) => {
    if (qty <= 0) {
      set({ cart: get().cart.filter(i => i.id !== id) })
    } else {
      set({ cart: get().cart.map(i => i.id === id ? { ...i, qty } : i) })
    }
  },

  clearCart: () => set({ cart: [] }),
}))

export const cartTotal = (cart) => cart.reduce((sum, i) => sum + i.price * i.qty, 0)
export const cartCount = (cart) => cart.reduce((sum, i) => sum + i.qty, 0)
