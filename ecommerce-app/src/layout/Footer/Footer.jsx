import { Link } from "react-router-dom";
import "./Footer.css";
import Icon from "../../components/common/Icon/Icon";

const Footer = () => {
  return (
    <footer className="footer-style">
      <div className="columns-style">
        {/* Columna 1: Enlaces Rápidos */}
        <div className="col-style">
          <h4 className="col-heading-style">Acerca de</h4>
          <a href="/aboutus" className="footer-link-style">Quienes Somos</a>
          <a href="/faqs" className="footer-link-style">Preguntas Frecuentes</a>
          <a href="/contact" className="footer-link-style">Contacto</a>
          <a href="/terminos" className="footer-link-style">Términos y Condiciones</a>
        </div>

        {/* Columna 2: Redes Sociales */}
        <div className="col-style">
          <h4 className="col-heading-style">Síguenos</h4>
          <div className="social-icons-container">
            <Link to="#" aria-label="Facebook">
            <Icon name="facebook" size={20} />
            </Link>
            <Link to="#" aria-label="Twitter">
            <Icon name="twitter" size={20} />
            </Link>
            <Link to="#" aria-label="Instagram">
            <Icon name="instagram" size={20} />
            </Link>
            <Link to="#" aria-label="LinkedIn">
            <Icon name="linkedin" size={20} />
            </Link>
          </div>
        </div>

        {/* Columna 3: Legal */}
        <div className="col-style">
          <h4 className="col-heading-style">Aspectos Legales</h4>
          {/* Usarías íconos de redes, aquí solo texto */}
          <a href="/aboutus" className="footer-link-style">Declaración de Accesibilidad</a>
          <a href="/faqs" className="footer-link-style">Política de Privacidad</a>
          <a href="/contact" className="footer-link-style">Mapa del Sitio</a>
        </div>
      </div>
      
      {/* Derechos de Autor */}
      <p className="copy-right-style">
        &copy; {new Date().getFullYear()} She Leads Academy. Todos los derechos reservados.
      </p>
    </footer>
  );
};



export default Footer;