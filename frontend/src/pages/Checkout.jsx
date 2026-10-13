import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, CheckCircle2, ShieldCheck, MapPin, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import styles from './Checkout.module.css';

const Checkout = () => {
  const { items, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState(user?.address || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [recipientName, setRecipientName] = useState(user?.name || '');
  
  const [paymentMethod, setPaymentMethod] = useState('SIMULATED');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(null);

  if (items.length === 0 && !orderSuccess) {
    return (
      <div className={`container ${styles.checkoutContainer}`}>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h2>No hay productos en el carrito para procesar</h2>
          <Link to="/" style={{ color: 'var(--primary)', marginTop: '1rem', display: 'inline-block' }}>
            Regresar al catálogo
          </Link>
        </div>
      </div>
    );
  }

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      navigate('/auth?redirect=/checkout');
      return;
    }

    if (!address.trim()) {
      setError('Por favor indica una dirección completa de entrega.');
      return;
    }

    setLoading(true);

    try {
      // 1. Simular validación del pago
      await api.simulatePayment({
        amount: totalAmount,
        cardNumber
      });

      // 2. Crear pedido en la base de datos
      const orderPayload = {
        shippingAddress: `${address} (Contacto: ${recipientName}, Tel: ${phone})`,
        paymentMethod,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity
        }))
      };

      const res = await api.createOrder(orderPayload);
      clearCart();
      setOrderSuccess(res.order);
    } catch (err) {
      setError(err.message || 'Error al procesar la compra.');
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="container">
        <div className={styles.successCard}>
          <CheckCircle2 size={64} className={styles.successIcon} />
          <h2>¡Felicitaciones! Tu pedido fue confirmado</h2>
          <p>Hemos recibido tu compra y ya estamos preparando el envío.</p>

          <div className={styles.orderNumber}>
            Orden #{orderSuccess.id}
          </div>

          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Total abonado: <strong>${parseFloat(orderSuccess.totalAmount).toFixed(2)}</strong>
          </p>

          <Link to="/" className={styles.submitBtn} style={{ maxWidth: '300px', margin: '0 auto' }}>
            Continuar Comprando
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`container ${styles.checkoutContainer}`}>
      <h1 className={styles.title}>Finalizar Compra</h1>

      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleCheckout} className={styles.layout}>
        <div>
          {/* Información de Envío */}
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>
              <MapPin size={20} color="var(--primary)" /> Datos de Entrega
            </h2>

            <div className={styles.formGrid}>
              <div>
                <label className={styles.label}>Nombre de quien recibe</label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className={styles.input}
                  placeholder="Ej. Juan Pérez"
                />
              </div>

              <div>
                <label className={styles.label}>Teléfono de contacto</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={styles.input}
                  placeholder="Ej. +57 300 000 0000"
                />
              </div>

              <div className={styles.fullWidth}>
                <label className={styles.label}>Dirección exacta (calle, número, ciudad)</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={styles.input}
                  placeholder="Ej. Av. Principal 123, Depto 4B"
                />
              </div>
            </div>
          </div>

          {/* Método de Pago */}
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>
              <CreditCard size={20} color="var(--primary)" /> Método de Pago
            </h2>

            <div className={styles.paymentTabs}>
              <div
                className={`${styles.paymentTab} ${paymentMethod === 'SIMULATED' ? styles.paymentTabActive : ''}`}
                onClick={() => setPaymentMethod('SIMULATED')}
              >
                Pasarela Simulada (Test)
              </div>
              <div
                className={`${styles.paymentTab} ${paymentMethod === 'MERCADOPAGO' ? styles.paymentTabActive : ''}`}
                onClick={() => setPaymentMethod('MERCADOPAGO')}
              >
                Mercado Pago (Sandbox)
              </div>
            </div>

            <div>
              <label className={styles.label}>Número de Tarjeta de Prueba</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className={styles.input}
              />
              <p className={styles.hint}>
                ℹ️ Tip de prueba: Cualquier número funciona. Si termina en <code>0000</code> simulará un rechazo bancario.
              </p>
            </div>
          </div>
        </div>

        {/* Resumen lateral */}
        <div className={styles.card}>
          <h3 className={styles.sectionTitle}>
            <ShieldCheck size={20} color="var(--success)" /> Resumen de Compra
          </h3>

          <div style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem' }}>
            {items.map(({ product, quantity }) => (
              <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                <span>{product.name} x{quantity}</span>
                <span>${(parseFloat(product.price) * quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
            <span>Envío</span>
            <span style={{ color: 'var(--success)', fontWeight: 600 }}>Gratis</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 800, margin: '1rem 0' }}>
            <span>Total</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={styles.submitBtn}
          >
            {loading ? 'Procesando pago...' : `Pagar $${totalAmount.toFixed(2)}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
