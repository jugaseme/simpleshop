import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.content}`}>
        <div className={styles.brand}>
          <h3>ShopSimple</h3>
          <p>
            Plataforma de e-commerce moderna y segura. Gestiona productos, pedidos y pagos con la máxima eficiencia y velocidad.
          </p>
        </div>

        <div className={styles.linksCol}>
          <h4>Navegación</h4>
          <ul>
            <li><a href="/">Inicio</a></li>
            <li><a href="/cart">Carrito de Compras</a></li>
            <li><a href="/auth">Mi Cuenta</a></li>
          </ul>
        </div>

        <div className={styles.linksCol}>
          <h4>Soporte</h4>
          <ul>
            <li><a href="#">Términos y Condiciones</a></li>
            <li><a href="#">Política de Privacidad</a></li>
            <li><a href="#">Preguntas Frecuentes</a></li>
          </ul>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>&copy; {new Date().getFullYear()} ShopSimple. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
