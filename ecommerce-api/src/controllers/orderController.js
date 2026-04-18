import Order from '../models/order.js';
import Product from '../models/product.js';

// 1. Obtener todas las órdenes (Admin)
async function getOrders(req, res, next) {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('products.productId')
      .populate('paymentMethod')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
}

// 2. Obtener una orden por ID (Propietario o Admin)
async function getOrderById(req, res, next) {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate('user', 'name email')
      .populate('products.productId')
      .populate('paymentMethod');

    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    // Seguridad: Solo el dueño de la orden o un admin pueden verla
    const isOwner = order.user && order.user._id.toString() === req.user.userId;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'No tienes permiso para ver esta orden' });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
}

// 3. Obtener órdenes de un usuario específico
async function getOrdersByUser(req, res, next) {
  try {
    const userId = req.user.userId;
    const orders = await Order.find({ user: userId })
      .populate('products.productId')
      .populate('paymentMethod')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    next(error);
  }
}

// 4. Crear una nueva orden (Corregido para evitar Error 400)
async function createOrder(req, res, next) {
  try {
    const {
      user,
      products,
      paymentMethod,
      shippingCost = 0
    } = req.body;

    // Validación de campos requeridos
    if (!user || !products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Usuario y productos son requeridos' });
    }

    if (!paymentMethod) {
      return res.status(400).json({ error: 'El método de pago es requerido' });
    }

    // Validación de estructura interna de productos (Clave para tu error actual)
    for (const item of products) {
      if (!item.productId || !item.price) {
        return res.status(400).json({
          error: 'Cada producto debe tener productId y price'
        });
      }
    }

    // Cálculo automático de total
    const subtotal = products.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
    const totalPrice = subtotal + Number(shippingCost);

    const newOrder = await Order.create({
      user,
      products,
      paymentMethod,
      shippingCost,
      totalPrice,
      status: 'pending',
      paymentStatus: 'pending'
    });

    await newOrder.populate([
      { path: 'user', select: 'name email' },
      { path: 'products.productId' },
      { path: 'paymentMethod' }
    ]);

    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
}

// 5. Actualizar datos generales de la orden (Admin)
async function updateOrder(req, res, next) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, { new: true })
      .populate('user products.productId paymentMethod');

    if (!updatedOrder) return res.status(404).json({ message: 'Orden no encontrada' });
    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
}

// 6. Actualizar estado de la orden (Admin)
async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true })
      .populate('user products.productId paymentMethod');

    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
}

// 7. Actualizar estado de pago
async function updatePaymentStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({ error: 'Estado de pago inválido' });
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, { paymentStatus }, { new: true })
      .populate('user products.productId paymentMethod');

    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
}

// 8. Cancelar orden (Usuario o Admin)
async function cancelOrder(req, res, next) {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) return res.status(404).json({ message: 'Orden no encontrada' });
    if (order.status === 'delivered') {
      return res.status(400).json({ message: 'No se puede cancelar una orden ya entregada' });
    }

    order.status = 'cancelled';
    await order.save();
    res.json(order);
  } catch (error) {
    next(error);
  }
}

// 9. Eliminar orden (Solo Admin y si está cancelada)
async function deleteOrder(req, res, next) {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) return res.status(404).json({ message: 'Orden no encontrada' });
    if (order.status !== 'cancelled' && req.user.role !== 'admin') {
      return res.status(400).json({ message: 'Solo se pueden eliminar órdenes canceladas' });
    }

    await Order.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export {
  getOrders,
  getOrderById,
  getOrdersByUser,
  createOrder,
  updateOrder,
  cancelOrder,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder,
};