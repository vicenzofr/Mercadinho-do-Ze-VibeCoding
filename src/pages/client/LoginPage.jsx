import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { MOCK_USERS } from '../../data/mockData'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useStore()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    const found = MOCK_USERS.find(u => u.email === email && u.password === password)
    if (found) {
      login(found)
      navigate(found.role === 'admin' ? '/admin' : '/')
    } else {
      setError('E-mail ou senha incorretos.')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoArea}>
          <span className={styles.dot} />
          <span className={styles.logoText}>Mercadinho do Zé</span>
        </div>
        <h1 className={styles.title}>Boas-vindas!</h1>
        <p className={styles.sub}>Entre para continuar comprando</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>
          <div className={styles.field}>
            <label>Senha</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••"
              required
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.btn}>Entrar</button>
        </form>

        <div className={styles.hint}>
          <p>Contas de teste:</p>
          <code>joao@email.com / 123</code>
          <code>admin@email.com / admin</code>
        </div>
      </div>
    </div>
  )
}
