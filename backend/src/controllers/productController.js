import prisma from '../config/db.js';

// Helper para generar slug
const createSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-') + '-' + Date.now();
};

export const getProducts = async (req, res) => {
  try {
    const { category, search, activeOnly } = req.query;

    const where = {};
    if (activeOnly !== 'false') {
      where.isActive = true;
    }

    if (category) {
      where.category = {
        slug: category
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: { id: true, name: true, slug: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ products });
  } catch (error) {
    console.error('Error al listar productos:', error);
    return res.status(500).json({ error: 'Error al obtener la lista de productos.' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      return res.status(400).json({ error: 'ID de producto inválido.' });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    return res.json({ product });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    return res.status(500).json({ error: 'Error al obtener detalle del producto.' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, imageUrl, categoryId } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: 'El nombre y el precio son obligatorios.' });
    }

    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock, 10) || 0;

    if (isNaN(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({ error: 'El precio debe ser un número positivo.' });
    }

    const slug = createSlug(name);

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug,
        description: description ? description.trim() : null,
        price: parsedPrice,
        stock: Math.max(0, parsedStock),
        imageUrl: imageUrl ? imageUrl.trim() : null,
        categoryId: categoryId ? parseInt(categoryId, 10) : null
      },
      include: {
        category: true
      }
    });

    return res.status(201).json({
      message: 'Producto creado exitosamente.',
      product
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    return res.status(500).json({ error: 'Error al registrar el producto.' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id, 10);
    const { name, description, price, stock, imageUrl, categoryId, isActive } = req.body;

    if (isNaN(productId)) {
      return res.status(400).json({ error: 'ID de producto inválido.' });
    }

    const existing = await prisma.product.findUnique({ where: { id: productId } });
    if (!existing) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    const data = {};
    if (name !== undefined) data.name = name.trim();
    if (description !== undefined) data.description = description.trim();
    if (price !== undefined) data.price = parseFloat(price);
    if (stock !== undefined) data.stock = Math.max(0, parseInt(stock, 10));
    if (imageUrl !== undefined) data.imageUrl = imageUrl.trim();
    if (categoryId !== undefined) data.categoryId = categoryId ? parseInt(categoryId, 10) : null;
    if (isActive !== undefined) data.isActive = Boolean(isActive);

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data,
      include: { category: true }
    });

    return res.json({
      message: 'Producto actualizado exitosamente.',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    return res.status(500).json({ error: 'Error al actualizar el producto.' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      return res.status(400).json({ error: 'ID de producto inválido.' });
    }

    // Eliminación lógica (isActive: false) para no romper integridad referencial con órdenes pasadas
    await prisma.product.update({
      where: { id: productId },
      data: { isActive: false }
    });

    return res.json({ message: 'Producto desactivado exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return res.status(500).json({ error: 'Error al eliminar el producto.' });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    return res.json({ categories });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return res.status(500).json({ error: 'Error al obtener categorías.' });
  }
};
