import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import ProductCard from '../../components/ui/ProductCard'
import { PRODUCTS, CATEGORIES } from '../../data/mockData'
import styles from './StorePage.module.css'

export default function StorePage() {
  const [category, setCategory] = useState('Todos')
  const [search, setSearch] = useState('')
  const { user } = useStore()
  const navigate = useNavigate()

  const filtered = PRODUCTS.filter(p => {
    const matchCat = category === 'Todos' || p.category === category
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div>
          <h1>{user ? `Olá, ${user.name.split(' ')[0]}! 👋` : 'Bem-vindo ao Mercadinho do Zé 👋'}</h1>
          <p>{user ? 'O que você precisa hoje?' : 'Navegue à vontade, entre para comprar'}</p>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.searchBox}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {/* {!user && (
            <button className={styles.heroLoginBtn} onClick={() => navigate('/login')}>
              Entrar / Criar conta
            </button>
          )} */}
        </div>
      </div>

      <div className={styles.cats}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`${styles.catBtn} ${category === cat ? styles.active : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        <p className={styles.sectionTitle}>
          {category === 'Todos' ? 'Todos os produtos' : category}
          <span>{filtered.length} itens</span>
        </p>
        {filtered.length === 0 ? (
          <div className={styles.empty}><p>Nenhum produto encontrado.</p></div>
        ) : (
          <div className={styles.grid}>
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
