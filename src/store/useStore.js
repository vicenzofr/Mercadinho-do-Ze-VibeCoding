import { create } from 'zustand'
// import { subscribeWithSelector } from 'zustand/middleware'

const normalizeId = (id) => String(id)
const normalizePrice = (price) => Number(price ?? 0)

const normalizeProduct = (product) => ({
  ...product,
  id: normalizeId(product.id),
  price: normalizePrice(product.price ?? product.preco),
})

export const useStore = create(((set) => ({
  user: null,
  cart: [],

  login: (userData) => set({ user: userData }),
  logout: () => set({ user: null, cart: [] }),

  addToCart: (product) =>
    set((state) => {
      const normalized = normalizeProduct(product)
      const existing = state.cart.find(
        (item) => normalizeId(item.id) === normalizeId(normalized.id)
      )

      if (existing) {
        return {
          cart: state.cart.map((item) =>
            normalizeId(item.id) === normalizeId(normalized.id)
              ? { ...item, qty: item.qty + 1 }
              : item
          ),
        }
      }

      return {
        cart: [...state.cart, { ...normalized, qty: 1 }],
      }
    }),

  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter(
        (item) => normalizeId(item.id) !== normalizeId(id)
      ),
    })),

  updateQty: (id, qty) =>
    set((state) => {
      const newQty = Number(qty)

      if (newQty <= 0) {
        return {
          cart: state.cart.filter((item) => normalizeId(item.id) !== normalizeId(id))
        }
      }

      return {
        cart: state.cart.map((item) =>
          normalizeId(item.id) === normalizeId(id)
            ? { ...item, qty: newQty }
            : item
        )
      }
    }),

  clearCart: () => set({ cart: [] }),
}))
)