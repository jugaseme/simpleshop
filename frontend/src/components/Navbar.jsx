import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.navContainer}`}>
        <Link to="/" className={styles.logo}>
          <ShoppingBag size={28} />
          <span>ShopSimple</span>
        </Link>

        <nav className={styles.navLinks}>
          <Link to="/" className={styles.navLink}>Catálogo</Link>
          {isAdmin && (
            <Link to="/admin" className={`${styles.navLink} ${styles.adminBadge}`}>
              <Shield size={14} style={{ display: 'inline', marginRight: '4px' }} />
              Panel Admin
            </Link>
          )}
        </nav>

        <div className={styles.actions}>
          <Link to="/cart" className={styles.cartButton} title="Ver Carrito">
            <ShoppingCart size={22} />
            {totalItems > 0 && <span className={styles.cartBadge}>{totalItems}</span>}
          </Link>

          {user ? (
            <div className={styles.userMenu}>
              <span className={styles.userName}>Hola, {user.name.split(' ')[0]}</span>
              <button onClick={handleLogout} className={styles.logoutBtn} title="Cerrar Sesión">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/auth" className={styles.loginBtn}>
              <User size={16} style={{ display: 'inline', marginRight: '6px' }} />
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
