import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { cartCount } from '../../store/cartUtils'
import styles from './Navbar.module.css'
import { useCart } from '../../store/CartContext'

export default function Navbar() {
  const user = useStore((state) => state.user)
  const logout = useStore((state) => state.logout)
  const { cart } = useCart()

  const navigate = useNavigate()
  const count = cartCount(cart)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        <span className={styles.dot} />
        Mercadinho do Zé
      </Link>

      <div className={styles.right}>
        {user ? (
          <>
            <span className={styles.greeting}>Olá, {user.name.split(' ')[0]}</span>

            {user.role === 'admin' && (
              <Link to="/admin" className={styles.adminBtn}>
                Painel Admin
              </Link>
            )}

            <Link to="/cart" className={styles.cartBtn}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              Carrinho
              {count > 0 && <span className={styles.badge}>{count}</span>}
            </Link>

            <button onClick={handleLogout} className={styles.logoutBtn}>
              Sair
            </button>
          </>
        ) : (
          <Link to="/login" className={styles.loginBtn}>
            Entrar / Criar Conta
          </Link>
        )}
      </div>
    </nav>
  )
}