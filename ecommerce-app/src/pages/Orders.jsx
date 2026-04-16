import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/common/Button/Button";
import Icon from "../components/common/Icon/Icon";
import Loading from "../components/common/Loading/Loading";
import { getMyOrders } from "../services/orderService";
import "./Orders.css";

const formatMoney = (value = 0) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value);

const formatDate = (isoString) => {
  if (!isoString) return "Reciente";
  try {
    return new Date(isoString).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch (error) {
    return "Fecha inválida";
  }
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getMyOrders();
        
        // El backend ahora devuelve el array directamente gracias al controlador corregido
        const ordersList = Array.isArray(response) ? response : response.orders || [];

        setOrders(ordersList);
        
        if (ordersList.length > 0) {
          setSelectedOrderId(ordersList[0]._id);
        }
      } catch (err) {
        console.error("Error al cargar pedidos:", err);
        setError("No pudimos sincronizar tus pedidos con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const selectedOrder = useMemo(
    () => orders.find((order) => order._id === selectedOrderId) || null,
    [orders, selectedOrderId]
  );

  if (loading) {
    return (
      <div className="orders-page">
        <Loading message="Cargando tu historial de She Leads Academy..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page orders-empty">
        <Icon name="alert-circle" size={48} />
        <h1>Hubo un problema</h1>
        <p>{error}</p>
        <Button onClick={() => window.location.reload()}>Reintentar</Button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-page orders-empty">
        <Icon name="package" size={48} />
        <h1>Aún no tienes cursos</h1>
        <p>Tus órdenes aparecerán aquí después de tu primera compra.</p>
        <Link to="/" className="orders-link">
          <Button>Explorar Catálogo</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <div>
          <p className="eyebrow">Panel de Estudiante</p>
          <h1>Mis Cursos</h1>
          <p className="muted">
            {orders.length === 1 ? "1 pedido realizado" : `${orders.length} pedidos realizados`}
          </p>
        </div>
      </div>

      <div className="orders-content">
        {/* LISTADO LATERAL DE ÓRDENES */}
        <div className="orders-list card">
          <div className="orders-list-body">
            {orders.map((order) => {
              const isActive = selectedOrderId === order._id;
              const status = order.paymentStatus || 'pending';
              
              return (
                <button
                  key={order._id}
                  className={`order-card${isActive ? " active" : ""}`}
                  onClick={() => setSelectedOrderId(order._id)}
                >
                  <div className="order-card-head">
                    <span className="order-id">#{order._id.slice(-6).toUpperCase()}</span>
                    <span className={`order-status order-status-${status}`}>
                      {status === 'paid' ? 'Pagado' : status === 'pending' ? 'Pendiente' : status}
                    </span>
                  </div>
                  <p className="order-date">{formatDate(order.createdAt)}</p>
                  <div className="order-card-meta">
                    <span>{order.products?.length || 0} cursos</span>
                    <strong>{formatMoney(order.totalPrice || 0)}</strong>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* DETALLE DE LA ORDEN SELECCIONADA */}
        <div className="orders-detail card">
          {selectedOrder ? (
            <>
              <div className="order-detail-header">
                <div>
                  <p className="eyebrow">DETALLE DE TRANSACCIÓN</p>
                  <h2>{formatMoney(selectedOrder.totalPrice || 0)}</h2>
                  <p className="muted">
                    ID: {selectedOrder._id} <br />
                    Fecha: {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
              </div>

              <div className="order-section">
                <h3>Resumen</h3>
                <ul className="order-summary-list">
                  <li>
                    <span>Estado del pago</span>
                    <span className={`status-badge ${selectedOrder.paymentStatus}`}>
                      {selectedOrder.paymentStatus?.toUpperCase()}
                    </span>
                  </li>
                  <li>
                    <span>Método de Pago</span>
                    <span>{selectedOrder.paymentMethod?.name || "Tarjeta"}</span>
                  </li>
                </ul>
              </div>

              <div className="order-section">
                <h3>Cursos incluidos</h3>
                <ul className="order-items">
                  {selectedOrder.products?.map((item, index) => (
                    <li key={item._id || index}>
                      <div className="item-info">
                        <p className="item-name">
                          {/* Leemos el título desde el objeto poblado productId */}
                          {item.productId?.title || item.productId?.name || `Curso ID: ...${item.productId?.toString().slice(-4)}`}
                        </p>
                        <span className="item-qty">Acceso permanente</span>
                      </div>
                      <strong className="item-price">{formatMoney(item.price || 0)}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="orders-empty-state">
              <p>Selecciona una orden para ver los detalles del pago y cursos.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}