import React, { useState, useEffect } from 'react';
import { Search, PackageOpen } from 'lucide-react';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import styles from './Home.module.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const fetchCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Error cargando categorías:', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;

      const data = await api.getProducts(params);
      setProducts(data.products || []);
    } catch (err) {
      console.error('Error cargando productos:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Descubre Productos Increíbles al Mejor Precio</h1>
        <p className={styles.heroSubtitle}>
          Tu tienda de confianza con envíos rápidos, pagos seguros y catálogo actualizado.
        </p>
      </section>

      {/* Filter and Search Bar */}
      <div className={styles.filterBar}>
        <div className={styles.categoriesList}>
          <button
            className={`${styles.categoryBtn} ${selectedCategory === '' ? styles.categoryBtnActive : ''}`}
            onClick={() => setSelectedCategory('')}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`${styles.categoryBtn} ${selectedCategory === cat.slug ? styles.categoryBtnActive : ''}`}
              onClick={() => setSelectedCategory(cat.slug)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className={styles.searchBox}>
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className={styles.loading}>
          <p>Cargando catálogo de productos...</p>
        </div>
      ) : products.length === 0 ? (
        <div className={styles.empty}>
          <PackageOpen size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3>No se encontraron productos</h3>
          <p>Intenta con otra búsqueda o selecciona una categoría diferente.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
