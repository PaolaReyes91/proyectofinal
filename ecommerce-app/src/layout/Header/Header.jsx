import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../../components/common/Icon/Icon";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

export default function Header() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  const navigate = useNavigate();
  const { user, isAuth, logout } = useAuth();

  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
        setIsMobileSearchOpen(false);
      }
    };

    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    navigate(query.length === 0 ? "/search" : `/search?q=${encodeURIComponent(query)}`);
    setIsMobileSearchOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleAuthAction = () => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const getUserInitials = (userData) => {
    if (!userData) return "U";
    const name = userData.displayName || userData.name || userData.email || "Usuario";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getDisplayName = (userData) => {
    if (!userData) return "Usuario";
    return userData.displayName || userData.name || userData.email.split('@')[0] || "Usuario";
  };

  return (
    <header className="header">
      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="mobile-search-overlay">
          <div className="mobile-search-container">
            <form className="mobile-search-form" onSubmit={handleSearch}>
              <button type="button" className="mobile-search-back" onClick={() => setIsMobileSearchOpen(false)}>
                <Icon name="arrowLeft" size={20} />
              </button>
              <input
                ref={searchInputRef}
                type="text"
                className="mobile-search-input"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="mobile-search-btn">
                <Icon name="search" size={20} />
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="header-main">
        <div className="container">
          <div className="header-content">
            <button className="mobile-menu-btn mobile-only" onClick={() => setIsMobileMenuOpen(true)}>
              <Icon name="menu" size={20} />
            </button>

            <Link to="/" className="logo">SheLeadsAcademy</Link>

            <div className="search-container desktop-only">
              <form className="search-form" onSubmit={handleSearch}>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Buscar cursos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-btn">
                  <Icon name="search" size={18} />
                </button>
              </form>
            </div>

            <div className="header-actions">
              <button className="mobile-search-trigger mobile-only" onClick={() => setIsMobileSearchOpen(true)}>
                <Icon name="search" size={20} />
              </button>

              <div className="user-menu-container desktop-only" ref={userMenuRef}>
                {/* BOTÓN DE USUARIO (Donde van los textos en negro) */}
                <button
                  className={`user-info ${isUserMenuOpen ? "active" : ""}`}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <div className="user-avatar">
                    <span className="user-initials">
                      {isAuth ? getUserInitials(user) : <Icon name="user" size={16} />}
                    </span>
                  </div>
                  <div className="user-text">
                    <span className="greeting">
                      {isAuth ? `Hola, ${getDisplayName(user)}` : "Hola, Inicia sesión"}
                    </span>
                    <span className="account-text">
                      {isAuth ? "Mi Cuenta" : "Cuenta y Listas"}
                    </span>
                  </div>
                  <Icon name="chevronDown" size={14} className={`dropdown-arrow ${isUserMenuOpen ? "rotated" : ""}`} />
                </button>

                {/* DROPDOWN (Panel de inicio) */}
                {isUserMenuOpen && (
                  <div className="user-dropdown">
                    {!isAuth ? (
                      <div className="auth-section">
                        <div className="auth-header">
                          <Icon name="user" size={20} />
                          <span>Accede a tu cuenta</span>
                        </div>
                        <Link to="/login" className="auth-btn primary" onClick={handleAuthAction}>
                          <Icon name="logIn" size={16} />
                          Iniciar Sesión
                        </Link>
                        <Link to="/register" className="auth-btn secondary" onClick={handleAuthAction}>
                          <Icon name="userPlus" size={16} />
                          Crear Cuenta
                        </Link>
                      </div>
                    ) : (
                      <div className="user-section">
                        <div className="user-profile">
                          <div className="user-avatar large">
                            <span className="user-initials">{getUserInitials(user)}</span>
                          </div>
                          <div className="user-details">
                            <span className="user-name">{getDisplayName(user)}</span>
                            <span className="user-email">{user?.email}</span>
                          </div>
                        </div>
                        <div className="user-links">
                          <Link to="/profile" className="user-link"><Icon name="user" size={16} /> Mi Cuenta</Link>
                          <Link to="/orders" className="user-link"><Icon name="book" size={16} /> Mis Cursos</Link>
                          <Link to="/wishlist" className="user-link"><Icon name="heart" size={16} /> Lista de Deseos</Link>
                        </div>
                        <div className="logout-section">
                          <button className="logout-btn" onClick={handleLogout}>
                            <Icon name="logOut" size={16} /> Cerrar Sesión
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Link to="/cart" className="cart-btn">
                <Icon name="shoppingCart" size={24} />
                <span className="cart-badge">{totalItems}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-menu-content" ref={mobileMenuRef} onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <span className="logo">She Leads Academy</span>
              <button className="mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)}>
                <Icon name="x" size={24} />
              </button>
            </div>

            <div className="mobile-menu-body">
              <div className="mobile-user-section">
                {!isAuth ? (
                  <div className="mobile-auth-section">
                    <div className="mobile-auth-header">
                      <Icon name="user" size={32} />
                      <div>
                        <h3>¡Hola!</h3>
                        <p>Inicia sesión para una mejor experiencia</p>
                      </div>
                    </div>
                    <div className="mobile-auth-buttons">
                      <Link to="/login" className="mobile-auth-btn primary" onClick={handleAuthAction}>
                        Iniciar Sesión
                      </Link>
                      <Link to="/register" className="mobile-auth-btn secondary" onClick={handleAuthAction}>
                        Crear Cuenta
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="mobile-user-info">
                    <div className="mobile-user-avatar">
                      <span className="user-initials">{getUserInitials(user)}</span>
                    </div>
                    <div className="mobile-user-details">
                      <span className="mobile-user-name">{getDisplayName(user)}</span>
                      <span className="mobile-user-email">{user?.email}</span>
                    </div>
                  </div>
                )}
              </div>

              {isAuth && (
                <nav className="mobile-main-nav">
                  <h4>Mi Cuenta</h4>
                  <Link to="/profile" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Mi Perfil</Link>
                  <Link to="/orders" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Mis Cursos</Link>
                </nav>
              )}

              <nav className="mobile-support-nav">
                <h4>Ayuda</h4>
                <Link to="/help" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Centro de Ayuda</Link>
              </nav>

              {isAuth && (
                <div className="mobile-logout-section">
                  <button className="mobile-logout-btn" onClick={handleLogout}>Cerrar Sesión</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}