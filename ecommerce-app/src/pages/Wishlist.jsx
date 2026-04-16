import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import Button from "../components/common/Button/Button";
import Loading from "../components/common/Loading/Loading";
import Icon from "../components/common/Icon/Icon";
import "./Wishlist.css";

export default function Wishlist() {
  const { isAuth } = useAuth();
  
  if (!isAuth) {
    return (
      <div className="wishlist-container">
        <h2>Mi Lista de Deseos</h2>
        <div className="wishlist-empty">
          <Icon name="heart" size={64} className="muted" />
          <p className="muted">Debes iniciar sesión para ver tu lista de deseos.</p>
          <Link to="/login">
            <Button variant="primary">Iniciar Sesión</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <WishlistContent />;
}

function WishlistContent() {
  const { wishlistItems, loading, error, removeFromWishlist, moveToCart, clearWishlist } = useWishlist();
  const navigate = useNavigate();

  if (loading) return <Loading message="Cargando tu lista de deseos..." />;

  if (error) {
    return (
      <div className="wishlist-container">
        <div className="wishlist-error">
          <p>Error al cargar la lista: {error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>Reintentar</Button>
        </div>
      </div>
    );
  }

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="wishlist-container">
        <h2>Mi Lista de Deseos</h2>
        <div className="wishlist-empty">
          <Icon name="heart" size={64} className="muted" />
          <h3>Tu lista está vacía</h3>
          <Link to="/"><Button variant="primary">Explorar Cursos</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <h2>Mi Lista de Deseos</h2>
        <span className="wishlist-count">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'producto' : 'productos'}
        </span>
      </div>
      
      <div className="wishlist-actions">
        <Button variant="outline" size="sm" onClick={() => {
          if(window.confirm("¿Vaciar lista?")) clearWishlist();
        }}>
          <Icon name="trash" size={16} /> Limpiar todo
        </Button>
      </div>

      <div className="wishlist-grid">
        {wishlistItems.map((product) => {
          const productId = product.id || product._id;
          
          /**
           * LÓGICA DE IMAGEN (LA QUE FUNCIONÓ EN EL CARRITO)
           * Accedemos al primer elemento del array imagesUrl
           */
          const imageSource = (Array.isArray(product.imagesUrl) ? product.imagesUrl[0] : product.imagesUrl) 
            || "/img/courses/placeholder.svg";

          return (
            <div key={productId} className="wishlist-item">
              <Link to={`/course/${productId}`} className="wishlist-item-image">
                <img 
                  src={imageSource} 
                  alt={product.name}
                  onError={(e) => { e.target.src = "/img/courses/placeholder.svg"; }}
                />
              </Link>
              
              <div className="wishlist-item-info">
                <h3>{product.name}</h3>
                <p className="wishlist-item-price">${Number(product.price).toFixed(2)}</p>
              </div>
              
              <div className="wishlist-item-actions">
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    moveToCart(product);
                    navigate("/cart");
                  }}
                >
                  <Icon name="shoppingCart" size={16} /> Mover al Carrito
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromWishlist(productId);
                  }}
                >
                  <Icon name="heart" size={16} fill="currentColor" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}