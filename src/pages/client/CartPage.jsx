import { useNavigate } from 'react-router-dom'
import { useCart } from '../../store/CartContext'
import { useStore } from '../../store/useStore'
import styles from './CartPage.module.css'
import { getItemPrice } from '../../store/cartUtils'

export default function CartPage() {
  const { cart, updateQty, removeFromCart, clearCart } = useCart()
  const user = useStore((state) => state.user)
  const navigate = useNavigate()

  if (cart.length === 0) {
    return (
      <div className={styles.empty}>
        <span>🛒</span>
        <p>Seu carrinho está vazio</p>
        <button onClick={() => navigate('/')}>Voltar à loja</button>
      </div>
    )
  }

  const handleCheckout = () => {
    if (!user) { navigate('/login'); return }
    const total = cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty) || 0), 0)
    alert(`Pedido realizado! Total: R$ ${total.toFixed(2)}. Obrigado, ${user.name}!`)
    clearCart()
    navigate('/')
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/')}>← Voltar</button>
        <h1>Meu carrinho</h1>
      </div>
      <div className={styles.layout}>
        <div className={styles.items}>
          {cart.map((item) => {
            const itemPrice = getItemPrice(item)
            const itemQty = Number(item.qty || 0)
            const itemTotal = itemPrice * itemQty
            return (
              <div key={`${item.id}-${item.qty}`} className={styles.item}>
                <div className={styles.itemEmoji}>{item.emoji}</div>
                <div className={styles.itemInfo}>
                  <p className={styles.itemName}>{item.name ?? item.nome}</p>
                  <p className={styles.itemUnit}>R$ {itemPrice.toFixed(2)} / un.</p>
                </div>
                <div className={styles.qtyControl}>
                  <button onClick={() => updateQty(item.id, itemQty - 1)}>−</button>
                  <span>{itemQty}</span>
                  <button onClick={() => updateQty(item.id, itemQty + 1)}>+</button>
                </div>
                <p className={styles.itemTotal}>R$ {itemTotal.toFixed(2)}</p>
                <button className={styles.remove} onClick={() => removeFromCart(item.id)}>✕</button>
              </div>
            )
          })}
        </div>
        <CartSummary cart={cart} onCheckout={handleCheckout} onClear={clearCart} user={user} />
      </div>
    </div>
  )
}

function CartSummary({ onCheckout, onClear, user }) {
  const { cart } = useCart()  // ← busca direto do contexto
  const total = cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty) || 0), 0)

  return (
    <div className={styles.summary}>
      <h2>Resumo do pedido</h2>
      <div className={styles.summaryRows}>
        <div className={styles.row}><span>Subtotal</span><span>R$ {total.toFixed(2)}</span></div>
        <div className={styles.row}><span>Entrega</span><span className={styles.free}>Grátis</span></div>
      </div>
      <div className={styles.totalRow}><span>Total</span><span>R$ {total.toFixed(2)}</span></div>
      <button className={styles.checkoutBtn} onClick={onCheckout}>{user ? 'Finalizar pedido' : 'Entrar para finalizar'}</button>
      <button className={styles.clearBtn} onClick={onClear}>Limpar carrinho</button>
    </div>
  )

}