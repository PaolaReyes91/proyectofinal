import Cart from '../models/cart.js';
import Product from '../models/product.js';
import errorHandler from '../middlewares/errorHandler.js';

// 1. Obtener todos los carritos (Solo Admin)
async function getCarts(req, res, next) {
  try {
    const carts = await Cart.find().populate('user').populate('products.product');
    res.json(carts);
  } catch (error) {
    next(error);
  }
}

// 2. Obtener carrito por ID
async function getCartById(req, res, next) {
  try {
    const id = req.params.id;
    const cart = await Cart.findById(id).populate('user').populate('products.product');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.json(cart);
  } catch (error) {
    next(error);
  }
}

/**
 * 3. Obtener carrito por Usuario (CORREGIDO)
 * En lugar de lanzar 404, devolvemos un objeto vacío para no romper el Frontend.
 */
async function getCartByUser(req, res, next) {
  try {
    const userId = req.params.id;
    const cart = await Cart.findOne({ user: userId })
      .populate('user')
      .populate('products.product');

    // SI NO HAY CARRITO: Devolvemos un estado 200 con estructura vacía
    if (!cart) {
      return res.status(200).json({ 
        user: userId, 
        products: [], 
        message: 'No active cart' 
      });
    }

    res.json(cart);
  } catch (error) {
    next(error);
  }
}

// 4. Crear carrito manualmente
async function createCart(req, res, next) {
  try {
    const { user, products } = req.body;
    if (!user || !products || !Array.isArray(products)) {
      return res.status(400).json({ error: 'User and products array are required' });
    }

    const newCart = await Cart.create({ user, products });
    await newCart.populate(['user', 'products.product']);

    res.status(201).json(newCart);
  } catch (error) {
    next(error);
  }
}

// 5. Actualizar carrito
async function updateCart(req, res, next) {
  try {
    const { id } = req.params;
    const { products } = req.body;

    const updatedCart = await Cart.findByIdAndUpdate(
      id,
      { products },
      { new: true }
    ).populate(['user', 'products.product']);

    if (!updatedCart) return res.status(404).json({ message: 'Cart not found' });
    res.status(200).json(updatedCart);
  } catch (error) {
    next(error);
  }
}

// 6. Eliminar carrito
async function deleteCart(req, res, next) {
  try {
    const { id } = req.params;
    const deletedCart = await Cart.findByIdAndDelete(id);
    if (!deletedCart) return res.status(404).json({ message: 'Cart not found' });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

/**
 * 7. Agregar producto al carrito (CORREGIDO)
 * Ajustado para que el Frontend de React reciba la estructura esperada.
 */
async function addProductToCart(req, res, next) {
  try {
    const { userId, productId, quantity = 1 } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ error: 'User ID and product ID are required' });
    }

    const productExists = await Product.findById(productId);
    if (!productExists) return res.status(404).json({ message: 'Product not found' });

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Si no existe, lo creamos automáticamente
      cart = new Cart({
        user: userId,
        products: [{ product: productId, quantity }]
      });
    } else {
      const existingProductIndex = cart.products.findIndex(
        item => item.product.toString() === productId
      );

      if (existingProductIndex >= 0) {
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }
    }

    await cart.save();
    await cart.populate(['user', 'products.product']);

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
}

export {
  getCarts,
  getCartById,
  getCartByUser,
  createCart,
  updateCart,
  deleteCart,
  addProductToCart,
};