export const getItemQty = (item) => {
    const qty = Number(item.qty)
    return Number.isFinite(qty) && qty > 0 ? qty : 1
}

export const getItemPrice = (item) => {
    const price = Number(item.price ?? item.preco ?? 0)
    return Number.isFinite(price) ? price : 0
}

export const cartTotal = (cart) =>
    cart.reduce((sum, item) => sum + getItemPrice(item) * getItemQty(item), 0)

export const cartCount = (cart) =>
    cart.reduce((sum, item) => sum + getItemQty(item), 0)