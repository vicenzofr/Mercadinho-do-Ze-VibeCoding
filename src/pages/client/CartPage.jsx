import { useNavigate } from 'react-router-dom'
import { useStore, cartTotal } from '../../store/useStore'
import styles from './CartPage.module.css'

export default function CartPage() {
  const { cart, updateQty, removeFromCart, clearCart, user } = useStore()
  const navigate = useNavigate()
  const total = cartTotal(cart)

  const handleCheckout = () => {
    if (!user) { navigate('/login'); return }
    alert(`Pedido realizado! Total: R$ ${total.toFixed(2)}. Obrigado, ${user.name}!`)
    clearCart()
    navigate('/')
  }

  if (cart.length === 0) return (
    <div className={styles.empty}>
      <span>🛒</span>
      <p>Seu carrinho está vazio</p>
      <button onClick={() => navigate('/')}>Voltar à loja</button>
    </div>
  )

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/')}>← Voltar</button>
        <h1>Meu carrinho</h1>
      </div>
      <div className={styles.layout}>
        <div className={styles.items}>
          {cart.map(item => (
            <div key={item.id} className={styles.item}>
              <div className={styles.itemEmoji}>{item.emoji}</div>
              <div className={styles.itemInfo}>
                <p className={styles.itemName}>{item.name}</p>
                <p className={styles.itemUnit}>R$ {item.price.toFixed(2)} / un.</p>
              </div>
              <div className={styles.qtyControl}>
                <button onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
              </div>
              <p className={styles.itemTotal}>R$ {(item.price * item.qty).toFixed(2)}</p>
              <button className={styles.remove} onClick={() => removeFromCart(item.id)}>✕</button>
            </div>
          ))}
        </div>
        <div className={styles.summary}>
          <h2>Resumo do pedido</h2>
          <div className={styles.summaryRows}>
            <div className={styles.row}><span>Subtotal</span><span>R$ {total.toFixed(2)}</span></div>
            <div className={styles.row}><span>Entrega</span><span className={styles.free}>Grátis</span></div>
          </div>
          <div className={styles.totalRow}>
            <span>Total</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
          <button className={styles.checkoutBtn} onClick={handleCheckout}>
            {user ? 'Finalizar pedido' : 'Entrar para finalizar'}
          </button>
          <button className={styles.clearBtn} onClick={clearCart}>Limpar carrinho</button>
        </div>
      </div>
    </div>
  )
}
