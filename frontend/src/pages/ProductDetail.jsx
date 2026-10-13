import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import styles from './ProductDetail.module.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await api.getProductById(id);
      setProduct(data.product);
    } catch (err) {
      setError(err.message || 'No se pudo cargar el producto.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    addToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  if (loading) {
    return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Cargando detalles...</div>;
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error || 'Producto no encontrado.'}</p>
        <button onClick={() => navigate('/')} className={styles.backBtn}>
          <ArrowLeft size={16} /> Volver al catálogo
        </button>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div className={`container ${styles.detailContainer}`}>
      <button onClick={() => navigate(-1)} className={styles.backBtn}>
        <ArrowLeft size={16} /> Volver
      </button>

      <div className={styles.layout}>
        <div className={styles.imageSection}>
          <img
            src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'}
            alt={product.name}
            className={styles.image}
          />
        </div>

        <div className={styles.infoSection}>
          {product.category && (
            <span className={styles.categoryTag}>{product.category.name}</span>
          )}
          <h1 className={styles.title}>{product.name}</h1>
          <div className={styles.price}>${parseFloat(product.price).toFixed(2)}</div>

          <p className={styles.description}>{product.description}</p>

          <div className={styles.stockStatus}>
            {isOutOfStock ? (
              <span className="badge badge-danger">Agotado temporalmente</span>
            ) : (
              <span className="badge badge-success">{product.stock} unidades disponibles</span>
            )}
          </div>

          <div className={styles.actions}>
            {!isOutOfStock && (
              <div className={styles.quantitySelector}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className={styles.qtyBtn}
                >
                  -
                </button>
                <span className={styles.qtyValue}>{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className={styles.qtyBtn}
                >
                  +
                </button>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={styles.addToCartBtn}
            >
              {addedNotice ? (
                <>
                  <Check size={18} /> ¡Agregado al Carrito!
                </>
              ) : (
                <>
                  <ShoppingCart size={18} /> {isOutOfStock ? 'Agotado' : 'Agregar al Carrito'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
