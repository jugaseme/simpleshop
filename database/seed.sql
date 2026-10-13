-- Seed data para ShopSimple
INSERT INTO categories (name, slug, description, image_url) VALUES
('Tecnología', 'tecnologia', 'Dispositivos, gadgets y accesorios electrónicos', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60'),
('Ropa & Moda', 'ropa-moda', 'Ropa moderna y accesorios de vestir', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&auto=format&fit=crop&q=60'),
('Hogar & Decoración', 'hogar-decoracion', 'Mobiliario, iluminación y accesorios del hogar', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=60')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, slug, description, price, stock, image_url, category_id) VALUES
('Auriculares Inalámbricos Noise Cancelling Pro', 'auriculares-inalambricos-pro', 'Auriculares de alta fidelidad con cancelación de ruido activa y batería de 30 horas.', 149.99, 25, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', 1),
('Reloj Inteligente Smartwatch Fitness', 'reloj-inteligente-smartwatch', 'Monitor de frecuencia cardíaca, resistencia al agua y GPS integrado.', 89.50, 40, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80', 1),
('Teclado Mecánico RGB Minimalista', 'teclado-mecanico-rgb', 'Switches táctiles mecánicos, retroiluminación personalizable y conexión tipo C.', 65.00, 18, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80', 1),
('Mochila Urbana Impermeable', 'mochila-urbana-impermeable', 'Compartimiento para laptop de hasta 16 pulgadas, material repelente al agua y diseño ergonómico.', 45.00, 30, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80', 2),
('Lámpara de Escritorio LED Táctil', 'lampara-escritorio-led-tactil', '3 temperaturas de luz, regulador de intensidad y puerto de carga USB.', 29.99, 50, 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=800&auto=format&fit=crop&q=80', 3)
ON CONFLICT (slug) DO NOTHING;
