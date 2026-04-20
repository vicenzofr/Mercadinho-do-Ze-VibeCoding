export let PRODUCTS = [
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

export const CATEGORIES = ['Todos', 'Bebidas', 'Laticínios', 'Padaria', 'Grãos', 'Snacks', 'Mercearia', 'Carnes', 'Hortifruti', 'Limpeza']

export const MOCK_USERS = [
  { id: 1, name: 'João Silva', email: 'joao@email.com', password: '123', role: 'user' },
  { id: 2, name: 'Maria Souza', email: 'maria@email.com', password: '123', role: 'user' },
  { id: 3, name: 'Admin', email: 'admin@email.com', password: 'admin', role: 'admin' },
]

export const MOCK_ORDERS = [
  { id: 1042, user: 'João Silva', total: 43.78, status: 'pendente', date: '2025-04-19' },
  { id: 1041, user: 'Maria Souza', total: 89.20, status: 'pago', date: '2025-04-18' },
  { id: 1040, user: 'Pedro Lima', total: 21.50, status: 'pago', date: '2025-04-15' },
  { id: 1039, user: 'Ana Costa', total: 67.00, status: 'cancelado', date: '2025-04-10' },
  { id: 1038, user: 'Carlos Rocha', total: 112.30, status: 'pago', date: '2025-03-28' },
  { id: 1037, user: 'João Silva', total: 55.00, status: 'pago', date: '2025-03-20' },
  { id: 1036, user: 'Maria Souza', total: 34.90, status: 'pago', date: '2025-03-15' },
  { id: 1035, user: 'Pedro Lima', total: 78.40, status: 'pago', date: '2025-03-05' },
  { id: 1034, user: 'Ana Costa', total: 22.10, status: 'cancelado', date: '2025-02-25' },
  { id: 1033, user: 'Carlos Rocha', total: 95.60, status: 'pago', date: '2025-02-14' },
  { id: 1032, user: 'João Silva', total: 47.30, status: 'pago', date: '2025-02-08' },
  { id: 1031, user: 'Maria Souza', total: 130.00, status: 'pago', date: '2025-01-30' },
  { id: 1030, user: 'Pedro Lima', total: 29.90, status: 'pago', date: '2025-01-20' },
  { id: 1029, user: 'Ana Costa', total: 61.50, status: 'pago', date: '2025-01-10' },
]
