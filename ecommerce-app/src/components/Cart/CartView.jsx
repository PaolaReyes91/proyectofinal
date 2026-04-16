import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import Button from "../common/Button/Button";
import Icon from "../common/Icon/Icon";
import "./CartView.css";

export default function CartView() {
  const { cartItems, removeFromCart } = useCart();

  return (
    <div className="cart-view">
      {cartItems.length === 0 ? (
        <div className="empty-cart-message">
          <Icon name="shoppingCart" size={48} />
          <h3>Tu carrito está vacío</h3>
          <p className="muted">Explora nuestros cursos y añade tus favoritos.</p>
          <Link to="/" className="primary-link">
            Ir a la página principal
          </Link>
        </div>
      ) : (
        <div className="cart-content-layout">
          <div className="cart-items-list">
            {cartItems.map((item) => {
              // DEBUG: Esto nos dirá exactamente qué tiene el objeto en el carrito
              console.log("CONTENIDO DE ITEM:", item);

              const itemPrice = item.price || 0;
              const itemQuantity = item.quantity || 1;

              /**
               * SOLUCIÓN SEGÚN TU INSPECTOR:
               * Intentamos obtener la ruta de varias formas por si el objeto cambió 
               * al pasar por el Context.
               */
              const imageSource = 
                (Array.isArray(item.imagesUrl) ? item.imagesUrl[0] : item.imagesUrl) || 
                item.imageUrl || 
                item.image || 
                "/img/courses/placeholder.svg";

              return (
                <div className="cart-item" key={item.id || item._id}>
                  <div className="cart-item-image">
                    <img 
                      src={imageSource} 
                      alt={item.name} 
                      loading="lazy"
                      onError={(e) => {
                        // Si la ruta que viene del JSON no carga, ponemos el placeholder
                        if (e.target.src !== window.location.origin + "/img/courses/placeholder.svg") {
                          e.target.src = "/img/courses/placeholder.svg";
                        }
                      }}
                    />
                  </div>

                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p className="cart-item-price">
                      {`$${itemPrice.toFixed(2)}`}
                    </p>
                  </div>

                  <div className="cart-item-total">
                    <span className="total-label">Subtotal:</span>
                    <span className="price-value">${(itemPrice * itemQuantity).toFixed(2)}</span>
                  </div>

                  <Button
                    variant="ghost"
                    className="danger"
                    size="sm"
                    onClick={() => removeFromCart(item.id || item._id)}
                    title="Eliminar artículo"
                  >
                    <Icon name="trash" size={16} />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}