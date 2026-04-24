const getValidNumber = (value) => {
    const n = Number(value)
    return Number.isFinite(n) ? n : null
}

export const getItemQty = (item) => {
    const candidates = [
        getValidNumber(item.qty),
        getValidNumber(item.qtd),
        getValidNumber(item.quantity),
    ].filter((n) => n !== null && n > 0)

    return candidates.length > 0 ? Math.max(...candidates) : 1
}

export const getItemPrice = (item) => {
    const candidates = [
        getValidNumber(item.price),
        getValidNumber(item.preco),
    ].filter((n) => n !== null)

    return candidates.length > 0 ? candidates[0] : 0
}

export const cartTotal = (cart) =>
    cart.reduce((sum, item) => sum + getItemPrice(item) * getItemQty(item), 0)

export const cartCount = (cart) =>
    cart.reduce((sum, item) => sum + getItemQty(item), 0)