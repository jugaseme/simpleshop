import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import styles from './ProductCard.module.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const isOutOfStock = product.stock <= 0;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  return (
    <div className={styles.card}>
      <Link to={`/product/${product.id}`} className={styles.imageWrapper}>
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
          alt={product.name}
          className={styles.image}
          loading="lazy"
        />
        {product.category && (
          <span className={styles.categoryTag}>{product.category.name}</span>
        )}
      </Link>

      <div className={styles.info}>
        <Link to={`/product/${product.id}`}>
          <h3 className={styles.title}>{product.name}</h3>
        </Link>
        <p className={styles.description}>{product.description}</p>

        <div className={styles.bottomRow}>
          <div>
            <div className={styles.price}>${parseFloat(product.price).toFixed(2)}</div>
            {isOutOfStock && <span className={styles.stockOut}>Agotado</span>}
          </div>

          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={styles.addButton}
            title={isOutOfStock ? 'Sin stock' : 'Agregar al carrito'}
          >
            <ShoppingCart size={16} />
            <span>Agregar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
