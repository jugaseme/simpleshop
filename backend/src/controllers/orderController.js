import prisma from '../config/db.js';

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, shippingAddress, paymentMethod = 'SIMULATED' } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'El carrito no contiene productos.' });
    }

    if (!shippingAddress || shippingAddress.trim() === '') {
      return res.status(400).json({ error: 'La dirección de envío es obligatoria.' });
    }

    // Ejecutamos la creación del pedido en una transacción para asegurar consistencia de stock y precios
    const orderResult = await prisma.$transaction(async (tx) => {
      let calculatedTotal = 0;
      const orderItemsData = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: parseInt(item.productId, 10) }
        });

        if (!product || !product.isActive) {
          throw new Error(`El producto con ID ${item.productId} ya no está disponible.`);
        }

        const quantity = parseInt(item.quantity, 10);
        if (quantity <= 0) {
          throw new Error(`Cantidad inválida para el producto: ${product.name}`);
        }

        if (product.stock < quantity) {
          throw new Error(`Stock insuficiente para "${product.name}". Disponible: ${product.stock}, Solicitado: ${quantity}`);
        }

        const unitPrice = parseFloat(product.price);
        const subtotal = unitPrice * quantity;
        calculatedTotal += subtotal;

        // Descontamos stock
        await tx.product.update({
          where: { id: product.id },
          data: { stock: product.stock - quantity }
        });

        orderItemsData.push({
          productId: product.id,
          quantity,
          unitPrice,
          subtotal
        });
      }

      // Creamos la orden con sus items
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount: calculatedTotal,
          status: 'PENDING',
          paymentStatus: paymentMethod === 'SIMULATED' ? 'APPROVED' : 'PENDING',
          paymentMethod,
          shippingAddress: shippingAddress.trim(),
          items: {
            create: orderItemsData
          }
        },
        include: {
          items: {
            include: {
              product: {
                select: { id: true, name: true, imageUrl: true }
              }
            }
          }
        }
      });

      return newOrder;
    });

    return res.status(201).json({
      message: '¡Pedido creado exitosamente!',
      order: orderResult
    });
  } catch (error) {
    console.error('Error al procesar pedido:', error.message);
    return res.status(400).json({ error: error.message || 'Error al procesar el pedido.' });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, imageUrl: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ orders });
  } catch (error) {
    console.error('Error al obtener pedidos del usuario:', error);
    return res.status(500).json({ error: 'Error al obtener los pedidos.' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true }
        },
        items: {
          include: {
            product: {
              select: { id: true, name: true, imageUrl: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ orders });
  } catch (error) {
    console.error('Error al obtener todos los pedidos (Admin):', error);
    return res.status(500).json({ error: 'Error al listar los pedidos.' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;
    const orderId = parseInt(id, 10);

    const validStatuses = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Estado de pedido inválido.' });
    }

    const data = {};
    if (status) data.status = status;
    if (paymentStatus) data.paymentStatus = paymentStatus;

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data,
      include: {
        user: { select: { name: true, email: true } },
        items: true
      }
    });

    return res.json({
      message: 'Estado del pedido actualizado.',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Error al actualizar estado del pedido:', error);
    return res.status(500).json({ error: 'Error al actualizar pedido.' });
  }
};
