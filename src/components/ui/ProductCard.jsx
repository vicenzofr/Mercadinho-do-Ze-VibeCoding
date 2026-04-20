import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }) {
  const { addToCart, cart, user } = useStore()
  const navigate = useNavigate()
  const inCart = cart.find(i => i.id === product.id)

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
          className={`${styles.btn} ${inCart ? styles.added : ''}`}
          onClick={handleAdd}
        >
          {inCart ? `✓ No carrinho (${inCart.qty})` : '+ Adicionar'}
        </button>
      </div>
    </div>
  )
}
