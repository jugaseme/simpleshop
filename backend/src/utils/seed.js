import prisma from '../config/db.js';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Iniciando carga de datos iniciales (Seed)...');

  // 1. Crear usuario Administrador inicial si no existe
  const adminEmail = 'admin@shopsimple.com';
  let admin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!admin) {
    const passwordHash = await bcrypt.hash('admin123456', 10);
    admin = await prisma.user.create({
      data: {
        name: 'Administrador ShopSimple',
        email: adminEmail,
        passwordHash,
        role: 'ADMIN',
        phone: '+57 300 123 4567',
        address: 'Oficina Principal 101'
      }
    });
    console.log('✅ Usuario Administrador creado: admin@shopsimple.com (Contraseña: admin123456)');
  }

  // 2. Crear categorías
  const tech = await prisma.category.upsert({
    where: { slug: 'tecnologia' },
    update: {},
    create: {
      name: 'Tecnología',
      slug: 'tecnologia',
      description: 'Dispositivos, gadgets y accesorios electrónicos',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60'
    }
  });

  const fashion = await prisma.category.upsert({
    where: { slug: 'ropa-moda' },
    update: {},
    create: {
      name: 'Ropa & Moda',
      slug: 'ropa-moda',
      description: 'Ropa moderna y accesorios de vestir',
      imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&auto=format&fit=crop&q=60'
    }
  });

  const home = await prisma.category.upsert({
    where: { slug: 'hogar-decoracion' },
    update: {},
    create: {
      name: 'Hogar & Decoración',
      slug: 'hogar-decoracion',
      description: 'Mobiliario, iluminación y accesorios del hogar',
      imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=500&auto=format&fit=crop&q=60'
    }
  });

  // 3. Crear productos de prueba
  const sampleProducts = [
    {
      name: 'Auriculares Inalámbricos Noise Cancelling Pro',
      slug: 'auriculares-inalambricos-pro',
      description: 'Auriculares de alta fidelidad con cancelación de ruido activa y batería de 30 horas continuas.',
      price: 149.99,
      stock: 25,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      categoryId: tech.id
    },
    {
      name: 'Reloj Inteligente Smartwatch Fitness',
      slug: 'reloj-inteligente-smartwatch',
      description: 'Monitor de frecuencia cardíaca, resistencia al agua y GPS integrado para tus entrenamientos.',
      price: 89.50,
      stock: 40,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      categoryId: tech.id
    },
    {
      name: 'Teclado Mecánico RGB Minimalista',
      slug: 'teclado-mecanico-rgb',
      description: 'Switches táctiles mecánicos de alta durabilidad, retroiluminación personalizable y conexión tipo C.',
      price: 65.00,
      stock: 18,
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
      categoryId: tech.id
    },
    {
      name: 'Mochila Urbana Impermeable',
      slug: 'mochila-urbana-impermeable',
      description: 'Compartimiento para laptop de hasta 16 pulgadas, material repelente al agua y diseño ergonómico.',
      price: 45.00,
      stock: 30,
      imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
      categoryId: fashion.id
    },
    {
      name: 'Lámpara de Escritorio LED Táctil',
      slug: 'lampara-escritorio-led-tactil',
      description: '3 temperaturas de luz cálida a fría, regulador de intensidad y puerto de carga rápida USB.',
      price: 29.99,
      stock: 50,
      imageUrl: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=800&auto=format&fit=crop&q=80',
      categoryId: home.id
    }
  ];

  for (const item of sampleProducts) {
    await prisma.product.upsert({
      where: { slug: item.slug },
      update: {},
      create: item
    });
  }

  console.log(`✅ ${sampleProducts.length} productos de prueba inicializados correctamente.`);
  console.log('🎉 Seed completado con éxito.');
}

main()
  .catch((e) => {
    console.error('Error ejecutando seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
