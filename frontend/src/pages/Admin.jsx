import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ShieldAlert, Package, ShoppingBag, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import styles from './Admin.module.css';

const Admin = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState('products'); // 'products' o 'orders'
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal de Crear / Editar Producto
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    categoryId: ''
  });
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin, activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'products') {
        const [prodRes, catRes] = await Promise.all([
          api.getProducts({ activeOnly: 'false' }),
          api.getCategories()
        ]);
        setProducts(prodRes.products || []);
        setCategories(catRes.categories || []);
      } else {
        const orderRes = await api.getAllOrders();
        setOrders(orderRes.orders || []);
      }
    } catch (err) {
      console.error('Error cargando datos de administración:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    setActionError('');
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        stock: product.stock,
        imageUrl: product.imageUrl || '',
        categoryId: product.categoryId || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        imageUrl: '',
        categoryId: categories[0]?.id || ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setActionError('');

    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, formData);
      } else {
        await api.createProduct(formData);
      }
      handleCloseModal();
      loadData();
    } catch (err) {
      setActionError(err.message || 'Error al guardar el producto.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas desactivar este producto?')) {
      try {
        await api.deleteProduct(id);
        loadData();
      } catch (err) {
        alert(err.message || 'No se pudo eliminar el producto.');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      alert(err.message || 'Error al actualizar estado del pedido.');
    }
  };

  if (authLoading) {
    return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Cargando permisos...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
        <ShieldAlert size={56} color="var(--danger)" style={{ margin: '0 auto 1rem' }} />
        <h2>Acceso Restringido</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Esta sección es exclusiva para administradores de ShopSimple.
        </p>
      </div>
    );
  }

  return (
    <div className={`container ${styles.adminContainer}`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Panel de Administración</h1>
          <p style={{ color: 'var(--text-muted)' }}>Gestiona tu inventario, catálogo y pedidos en tiempo real.</p>
        </div>

        {activeTab === 'products' && (
          <button onClick={() => handleOpenModal()} className={styles.newBtn}>
            <Plus size={18} /> Nuevo Producto
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'products' ? styles.activeTabBtn : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <Package size={16} style={{ display: 'inline', marginRight: '6px' }} />
          Productos ({products.length})
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'orders' ? styles.activeTabBtn : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <ShoppingBag size={16} style={{ display: 'inline', marginRight: '6px' }} />
          Pedidos ({orders.length})
        </button>
      </div>

      {/* Contenido Tabla */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '3rem' }}>Cargando datos...</p>
      ) : activeTab === 'products' ? (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <img
                      src={p.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=80'}
                      alt={p.name}
                      className={styles.productThumb}
                    />
                  </td>
                  <td>
                    <strong>{p.name}</strong>
                  </td>
                  <td>{p.category?.name || 'General'}</td>
                  <td>${parseFloat(p.price).toFixed(2)}</td>
                  <td>
                    <span className={p.stock > 0 ? 'badge badge-success' : 'badge badge-danger'}>
                      {p.stock} u.
                    </span>
                  </td>
                  <td>
                    {p.isActive ? (
                      <span className="badge badge-success">Activo</span>
                    ) : (
                      <span className="badge badge-danger">Inactivo</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => handleOpenModal(p)}
                      className={styles.actionBtn}
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      title="Desactivar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th># Pedido</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Items</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td><strong>#{o.id}</strong></td>
                  <td>
                    <div>{o.user?.name}</div>
                    <small style={{ color: 'var(--text-muted)' }}>{o.user?.email}</small>
                  </td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td>{o.items?.length || 0} productos</td>
                  <td><strong>${parseFloat(o.totalAmount).toFixed(2)}</strong></td>
                  <td>
                    <select
                      value={o.status}
                      onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                      className={styles.statusSelect}
                    >
                      <option value="PENDING">Pendiente</option>
                      <option value="PAID">Pagado</option>
                      <option value="PROCESSING">En Preparación</option>
                      <option value="SHIPPED">Enviado</option>
                      <option value="DELIVERED">Entregado</option>
                      <option value="CANCELLED">Cancelado</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Crear / Editar Producto */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
              </h3>
              <button onClick={handleCloseModal} className={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>

            {actionError && (
              <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                {actionError}
              </div>
            )}

            <form onSubmit={handleSaveProduct} className={styles.formGrid}>
              <div className={styles.fullSpan}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Nombre del Producto *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={styles.input}
                    placeholder="Ej. Teclado Mecánico RGB"
                  />
                </div>
              </div>

              <div className={styles.fullSpan}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Descripción</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={styles.textarea}
                    placeholder="Describe las características principales..."
                  />
                </div>
              </div>

              <div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Precio ($ USD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className={styles.input}
                  />
                </div>
              </div>

              <div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Stock Disponible *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.fullSpan}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Categoría</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className={styles.select}
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.fullSpan}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>URL de la Imagen</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className={styles.input}
                    placeholder="https://ejemplo.com/foto.jpg"
                  />
                </div>
              </div>

              <div className={`${styles.fullSpan} ${styles.modalActions}`}>
                <button type="button" onClick={handleCloseModal} className={styles.cancelBtn}>
                  Cancelar
                </button>
                <button type="submit" className={styles.saveBtn}>
                  {editingProduct ? 'Actualizar Producto' : 'Crear Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
