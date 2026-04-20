import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { MOCK_ORDERS, MOCK_USERS, CATEGORIES } from '../../data/mockData'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import styles from './AdminPage.module.css'

const STATUS_LABEL = { pago: 'Pago', pendente: 'Pendente', cancelado: 'Cancelado' }
const STATUS_CLASS = { pago: styles.green, pendente: styles.amber, cancelado: styles.red }

const MONTH_NAMES = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

function buildChartData(orders) {
  const map = {}
  orders.forEach(o => {
    const d = new Date(o.date)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    const label = `${MONTH_NAMES[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`
    if (!map[key]) map[key] = { label, receita: 0, pedidos: 0, month: d.getMonth(), year: d.getFullYear() }
    if (o.status === 'pago') map[key].receita += o.total
    map[key].pedidos += 1
  })
  return Object.values(map).sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month)
}

export default function AdminPage() {
  const [tab, setTab] = useState('dashboard')
  const [products, setProducts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('admin_products')) || getDefaultProducts() }
    catch { return getDefaultProducts() }
  })
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const { user } = useStore()
  const navigate = useNavigate()

  if (!user || user.role !== 'admin') { navigate('/'); return null }

  const saveProducts = (updated) => {
    setProducts(updated)
    try { localStorage.setItem('admin_products', JSON.stringify(updated)) } catch {}
  }

  const handleDelete = (id) => {
    if (confirm('Excluir este produto?')) saveProducts(products.filter(p => p.id !== id))
  }

  const handleSave = (product) => {
    if (editProduct) {
      saveProducts(products.map(p => p.id === product.id ? product : p))
    } else {
      saveProducts([...products, { ...product, id: Date.now() }])
    }
    setShowModal(false)
    setEditProduct(null)
  }

  const openEdit = (p) => { setEditProduct(p); setShowModal(true) }
  const openNew = () => { setEditProduct(null); setShowModal(true) }

  const revenue = MOCK_ORDERS.filter(o => o.status === 'pago').reduce((s, o) => s + o.total, 0)
  const chartData = buildChartData(MOCK_ORDERS)

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sideHeader}><span className={styles.dot} /><span>Admin</span></div>
        {[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'products', label: 'Produtos' },
          { id: 'orders', label: 'Pedidos' },
          { id: 'users', label: 'Usuários' },
        ].map(item => (
          <button key={item.id}
            className={`${styles.sideItem} ${tab === item.id ? styles.sideActive : ''}`}
            onClick={() => setTab(item.id)}>
            {item.label}
          </button>
        ))}
        <button className={styles.sideStore} onClick={() => navigate('/')}>← Ver loja</button>
      </aside>

      <main className={styles.main}>

        {tab === 'dashboard' && (
          <div>
            <h1 className={styles.pageTitle}>Dashboard</h1>
            <div className={styles.stats}>
              <div className={styles.stat}><p>Pedidos totais</p><span>{MOCK_ORDERS.length}</span></div>
              <div className={styles.stat}><p>Receita confirmada</p><span className={styles.statGreen}>R$ {revenue.toFixed(2)}</span></div>
              <div className={styles.stat}><p>Produtos cadastrados</p><span>{products.length}</span></div>
              <div className={styles.stat}><p>Pedidos pendentes</p><span className={styles.statAmber}>{MOCK_ORDERS.filter(o => o.status === 'pendente').length}</span></div>
            </div>

            <div className={styles.chartsGrid}>
              <div className={styles.chartCard}>
                <h2>Receita mensal (R$)</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                    <Tooltip formatter={(v) => [`R$ ${v.toFixed(2)}`, 'Receita']} />
                    <Bar dataKey="receita" fill="#22c55e" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className={styles.chartCard}>
                <h2>Pedidos por mês</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chartData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                    <Tooltip formatter={(v) => [v, 'Pedidos']} />
                    <Line type="monotone" dataKey="pedidos" stroke="#16a34a" strokeWidth={2} dot={{ fill: '#16a34a', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <h2 className={styles.subTitle}>Pedidos recentes</h2>
            <OrdersTable orders={MOCK_ORDERS.slice(0, 5)} styles={styles} STATUS_LABEL={STATUS_LABEL} STATUS_CLASS={STATUS_CLASS} />
          </div>
        )}

        {tab === 'products' && (
          <div>
            <div className={styles.titleRow}>
              <h1 className={styles.pageTitle}>Produtos</h1>
              <button className={styles.addBtn} onClick={openNew}>+ Novo produto</button>
            </div>
            <div className={styles.table}>
              <table>
                <thead><tr><th>Produto</th><th>Categoria</th><th>Preço</th><th>Estoque</th><th>Ações</th></tr></thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td>
                        <div className={styles.prodCell}>
                          {p.image
                            ? <img src={p.image} alt={p.name} className={styles.prodThumb} />
                            : <span className={styles.prodEmoji}>{p.emoji}</span>
                          }
                          {p.name}
                        </div>
                      </td>
                      <td><span className={styles.catTag}>{p.category}</span></td>
                      <td>R$ {p.price.toFixed(2)}</td>
                      <td>{p.stock} un.</td>
                      <td>
                        <button className={styles.editBtn} onClick={() => openEdit(p)}>Editar</button>
                        <button className={styles.delBtn} onClick={() => handleDelete(p.id)}>Excluir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'orders' && (
          <div>
            <h1 className={styles.pageTitle}>Todos os pedidos</h1>
            <OrdersTable orders={MOCK_ORDERS} styles={styles} STATUS_LABEL={STATUS_LABEL} STATUS_CLASS={STATUS_CLASS} />
          </div>
        )}

        {tab === 'users' && (
          <div>
            <h1 className={styles.pageTitle}>Usuários</h1>
            <div className={styles.table}>
              <table>
                <thead><tr><th>Nome</th><th>E-mail</th><th>Tipo</th><th>Ações</th></tr></thead>
                <tbody>
                  {MOCK_USERS.map(u => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td><span className={u.role === 'admin' ? styles.tagAdmin : styles.tagUser}>{u.role === 'admin' ? 'Admin' : 'Usuário'}</span></td>
                      <td>{u.role !== 'admin' && <button className={styles.delBtn}>Excluir</button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {showModal && (
        <ProductModal
          product={editProduct}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditProduct(null) }}
          styles={styles}
        />
      )}
    </div>
  )
}

function ProductModal({ product, onSave, onClose, styles }) {
  const isEdit = !!product
  const [form, setForm] = useState(product || { name: '', price: '', category: 'Bebidas', stock: '', emoji: '🛍️', image: null })
  const fileRef = useRef()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => set('image', ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ ...form, price: parseFloat(form.price), stock: parseInt(form.stock) })
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{isEdit ? 'Editar produto' : 'Novo produto'}</h2>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.imageUpload} onClick={() => fileRef.current.click()}>
            {form.image
              ? <img src={form.image} alt="preview" className={styles.imagePreview} />
              : (
                <div className={styles.imagePlaceholder}>
                  <span style={{ fontSize: 36 }}>{form.emoji}</span>
                  <p>Clique para adicionar foto</p>
                </div>
              )
            }
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImage} />
          </div>

          {!form.image && (
            <div className={styles.field}>
              <label>Emoji (se não usar foto)</label>
              <input value={form.emoji} onChange={e => set('emoji', e.target.value)} maxLength={2} />
            </div>
          )}

          {form.image && (
            <button type="button" className={styles.removeImg} onClick={() => set('image', null)}>
              Remover foto
            </button>
          )}

          <div className={styles.field}>
            <label>Nome do produto *</label>
            <input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ex: Leite integral 1L" />
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label>Preço (R$) *</label>
              <input required type="number" step="0.01" min="0" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0.00" />
            </div>
            <div className={styles.field}>
              <label>Estoque *</label>
              <input required type="number" min="0" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="0" />
            </div>
          </div>

          <div className={styles.field}>
            <label>Categoria *</label>
            <select value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.filter(c => c !== 'Todos').map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
            <button type="submit" className={styles.saveBtn}>{isEdit ? 'Salvar alterações' : 'Adicionar produto'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function OrdersTable({ orders, styles, STATUS_LABEL, STATUS_CLASS }) {
  return (
    <div className={styles.table}>
      <table>
        <thead><tr><th>#</th><th>Cliente</th><th>Total</th><th>Data</th><th>Status</th></tr></thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td className={styles.orderId}>#{o.id}</td>
              <td>{o.user}</td>
              <td>R$ {o.total.toFixed(2)}</td>
              <td>{new Date(o.date).toLocaleDateString('pt-BR')}</td>
              <td><span className={`${styles.badge} ${STATUS_CLASS[o.status]}`}>{STATUS_LABEL[o.status]}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function getDefaultProducts() {
  return [
    { id: 1, name: 'Leite Integral 1L', price: 4.99, category: 'Laticínios', emoji: '🥛', stock: 50, image: null },
    { id: 2, name: 'Refrigerante Cola 2L', price: 8.90, category: 'Bebidas', emoji: '🥤', stock: 30, image: null },
    { id: 3, name: 'Pão de Forma 500g', price: 6.50, category: 'Padaria', emoji: '🍞', stock: 25, image: null },
    { id: 4, name: 'Arroz Tipo 1 — 5kg', price: 24.90, category: 'Grãos', emoji: '🍚', stock: 40, image: null },
    { id: 5, name: 'Feijão Carioca 1kg', price: 7.80, category: 'Grãos', emoji: '🫘', stock: 35, image: null },
    { id: 6, name: 'Biscoito Cream Cracker', price: 3.20, category: 'Snacks', emoji: '🍪', stock: 60, image: null },
    { id: 7, name: 'Óleo de Soja 900ml', price: 5.40, category: 'Mercearia', emoji: '🫙', stock: 45, image: null },
    { id: 8, name: 'Macarrão Espaguete', price: 3.90, category: 'Mercearia', emoji: '🍝', stock: 55, image: null },
    { id: 9, name: 'Frango Inteiro 2kg', price: 18.90, category: 'Carnes', emoji: '🍗', stock: 20, image: null },
    { id: 10, name: 'Banana Prata (kg)', price: 4.20, category: 'Hortifruti', emoji: '🍌', stock: 30, image: null },
    { id: 11, name: 'Sabão em Pó 1kg', price: 12.90, category: 'Limpeza', emoji: '🧺', stock: 28, image: null },
    { id: 12, name: 'Café Torrado 500g', price: 14.50, category: 'Bebidas', emoji: '☕', stock: 40, image: null },
  ]
}
