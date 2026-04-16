import { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Icon from "../components/common/Icon/Icon";
import "./OrderConfirmation.css";

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};
  const { clearCart } = useCart();
  const clearedRef = useRef(false);

  useEffect(() => {
    if (!order) {
      navigate("/");
      return;
    }

    if (!clearedRef.current) {
      try {
        clearCart();
      } catch (e) {
        console.error("Error al limpiar carrito:", e);
      }
      clearedRef.current = true;
    }
  }, [order, navigate, clearCart]);

  if (!order) return null;

  const money = (v) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    }).format(v || 0);

  // Mapeo de datos del backend
  const orderId = order._id || "N/A";
  const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Reciente";
  const products = order.products || [];
  
  // --- LÓGICA DE PRECIOS (Precio base + IVA) ---
  const subtotal = order.totalPrice || 0; 
  const tax = subtotal * 0.16;
  const grandTotal = subtotal + tax; // Usamos grandTotal para evitar duplicar nombre de variable

  return (
    <div className="order-confirmation">
      <div className="confirmation-content">
        <div className="confirmation-icon">
          <Icon name="checkCircle" size={64} className="success" />
        </div>

        <h1>¡Gracias por tu compra!</h1>
        <p className="confirmation-message">
          Tu pedido <strong>#{orderId}</strong> ha sido confirmado con éxito.
        </p>

        <div className="confirmation-details">
          <h2>Detalles de tu pedido:</h2>
          <div className="order-info">
            <p><strong>Fecha:</strong> {date}</p>
            <p><strong>Estado del pago:</strong> {order.paymentStatus?.toUpperCase() || 'PAID'}</p>

            <h3>Productos adquiridos:</h3>
            <ul className="order-items">
              {products.map((item, index) => (
                <li key={item._id || index} className="order-item-row">
                  <div className="item-main">
                    <span>{item.productId?.name || "Curso seleccionado"}</span>
                    <span className="item-price">{money(item.price)}</span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>{money(subtotal)}</span>
              </div>
              <div className="total-row">
                <span>IVA (16%):</span>
                <span>{money(tax)}</span>
              </div>
              <hr />
              <div className="total-row highlight">
                <strong>Total:</strong>
                <strong>{money(grandTotal)}</strong>
              </div>
            </div>
          </div>
          
          <p className="notice">
            Hemos enviado un correo con los accesos a tus cursos. 
            Ya puedes encontrarlos en tu sección de "Mis Cursos".
          </p>
        </div>

        <div className="confirmation-actions">
          <Link to="/" className="button primary">
            <Icon name="home" size={20} />
            <span>Volver al inicio</span>
          </Link>
          <Link to="/orders" className="button secondary">
            <Icon name="package" size={20} />
            <span>Ver mis pedidos</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 