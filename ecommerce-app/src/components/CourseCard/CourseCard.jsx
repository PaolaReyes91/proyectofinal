import { Link, useNavigate } from "react-router-dom";
import { useCart} from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import Badge from "../common/Badge/Badge";
import Button from "../common/Button/Button";
import Icon from "../common/Icon/Icon";
import "./CourseCard.css";

export default function CourseCard({ product, orientation = "vertical" }) {
  const { addToCart } = useCart(); 
  const { isAuth } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate(); 
  const { name, description, price, imagesUrl, id, discount } = product;
  

  if (!product) {
    return (
      <div className="course-card course-card-unavailable">
        <p className="muted">Curso no disponible</p>
      </div>
    );
  }

  const productId = product._id || product.id;
  const inWishlist = isAuth && isInWishlist(productId);
  const hasDiscount = discount && discount > 0;
  const courseLink = `/course/${productId}`;
  const cardClass = `course-card course-card--${orientation}`;

  const handleAction = (e) => {
    e.preventDefault();
    
    if (isAuth) {
      addToCart(product, 1);
    } else {
      navigate("/login");
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuth) {
      navigate("/login");
      return;
    }

    try {
      if (inWishlist) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(product);
      }
    } catch (err) {
      console.error("Error toggling wishlist:", err);
    }
  };

  return (
    <div className={cardClass}>
      <Link to={courseLink} className="course-card-image-link">
        <img
          src={imagesUrl ? imagesUrl[0] : "/img/products/placeholder.svg"}
          alt={name}
          className="course-card-image"
          onError={(event) => {
            event.target.src = "/img/products/placeholder.svg";
          }}
        />
        <button 
          className={`course-card-wishlist-btn ${inWishlist ? 'active' : ''}`}
          onClick={handleWishlistToggle}
          title={inWishlist ? "Quitar de favoritos" : "Agregar a favoritos"}
          disabled={!isAuth}
        >
          <Icon 
            name="heart" 
            size={20} 
            fill={inWishlist ? "currentColor" : "none"} 
          />
        </button>
      </Link>
      <div className="course-card-content">
        <h3 className="course-card-title">
          <Link to={courseLink} className="course-card-title-link">
            {name}
          </Link>
        </h3>
        {description && (
          <p className="muted course-card-description">
            {description.length > 60
              ? `${description.substring(0, 60)}...`
              : description}
          </p>
        )}
        <div className="course-card-price">${price}</div>
      </div>
      <div className="course-card-actions">
        <div className="course-card-badge-container">
          {hasDiscount && <Badge text={`-${discount}%`} variant="warning" />}
        </div>
        
        <Button
          variant={isAuth ? "primary" : "outline"}
          size="sm"
          onClick={handleAction}
        >
          {isAuth ? "Agregar al carrito" : "Inicia sesión para adquirir este material"}
        </Button>
      </div>
    </div>
  );
}
