import { useNavigate } from 'react-router-dom'
import { useCart } from '../../store/CartContext'
import { useStore } from '../../store/useStore'
import { useEffect, useState } from 'react'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }) {
  const { addToCart, cart } = useCart()
  const user = useStore((state) => state.user)
  const navigate = useNavigate()
  const [isAdded, setIsAdded] = useState(false)

  useEffect(() => {
    const found = cart.find(item => String(item.id) === String(product.id))
    setIsAdded(found !== undefined)
  }, [cart, product.id])

  const handleAdd = () => {
    if (!user) { navigate('/login'); return }
    addToCart(product)
  }

  return (
    <div className={styles.card}>
      <div className={styles.imgArea}>
        {product.image
          ? <img src={product.image} alt={product.name} className={styles.img} />
          : <span className={styles.emoji}>{product.emoji}</span>
        }
      </div>
      <div className={styles.body}>
        <p className={styles.name}>{product.name}</p>
        <p className={styles.price}>R$ {product.price.toFixed(2)}</p>
        <button
          className={`${styles.btn} ${isAdded ? styles.added : ''}`}
          onClick={handleAdd}
        >
          {isAdded ? `✓ No carrinho (${cart.find(item => String(item.id) === String(product.id))?.qty ?? 1})` : '+ Adicionar'}
        </button>
      </div>
    </div>
  )
}