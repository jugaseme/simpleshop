import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import styles from './Cart.module.css';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalAmount, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className={`container ${styles.cartContainer}`}>
        <div className={styles.emptyState}>
          <ShoppingBag size={56} style={{ color: '#94a3b8' }} />
          <h2>Tu carrito está vacío</h2>
          <p>Explora nuestro catálogo y descubre productos ideales para ti.</p>
          <Link to="/" className={styles.shopBtn}>
            Ver Catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`container ${styles.cartContainer}`}>
      <h1 className={styles.title}>Carrito de Compras ({totalItems} items)</h1>

      <div className={styles.layout}>
        <div className={styles.itemsList}>
          {items.map(({ product, quantity }) => {
            const price = parseFloat(product.price);
            const subtotal = price * quantity;

            return (
              <div key={product.id} className={styles.itemRow}>
                <img
                  src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80'}
                  alt={product.name}
                  className={styles.thumbnail}
                />

                <div className={styles.itemDetails}>
                  <Link to={`/product/${product.id}`} className={styles.itemName}>
                    {product.name}
                  </Link>
                  <div className={styles.itemPrice}>
                    ${price.toFixed(2)} c/u
                  </div>
                </div>

                <div className={styles.controls}>
                  <div className={styles.qtyWrapper}>
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className={styles.qtyBtn}
                    >
                      -
                    </button>
                    <span className={styles.qtyValue}>{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className={styles.qtyBtn}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>

                  <div className={styles.subtotal}>
                    ${subtotal.toFixed(2)}
                  </div>

                  <button
                    onClick={() => removeFromCart(product.id)}
                    className={styles.removeBtn}
                    title="Eliminar producto"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Resumen del Pedido */}
        <div className={styles.summaryCard}>
          <h2 className={styles.summaryTitle}>Resumen del Pedido</h2>

          <div className={styles.summaryRow}>
            <span>Subtotal de productos</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>

          <div className={styles.summaryRow}>
            <span>Costo de envío</span>
            <span style={{ color: 'var(--success)', fontWeight: 600 }}>Gratis</span>
          </div>

          <div className={styles.summaryTotal}>
            <span>Total a Pagar</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>

          <Link to="/checkout" className={styles.checkoutBtn}>
            Proceder al Checkout <ArrowRight size={16} style={{ display: 'inline', marginLeft: '6px' }} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
