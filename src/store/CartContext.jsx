import { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
    const [cart, setCart] = useState([])

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => String(item.id) === String(product.id))
            if (existing) {
                return prev.map(item =>
                    String(item.id) === String(product.id)
                        ? { ...item, qty: item.qty + 1 }
                        : item
                )
            }
            return [...prev, { ...product, id: String(product.id), qty: 1 }]
        })
    }

    const updateQty = (id, qty) => {
        const newQty = Number(qty)
        if (newQty <= 0) {
            setCart(prev => prev.filter(item => String(item.id) !== String(id)))
        } else {
            setCart(prev => prev.map(item =>
                String(item.id) === String(id) ? { ...item, qty: newQty } : item
            ))
        }
    }

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => String(item.id) !== String(id)))
    }

    const clearCart = () => setCart([])

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQty, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)