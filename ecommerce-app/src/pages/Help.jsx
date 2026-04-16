import { Link } from "react-router-dom";
import Button from "../components/common/Button/Button";
import "./Help.css";

export default function Help() {
  return (
    <div className="help-container">
      <h2>Centro de Ayuda</h2>
      <div className="help-content">
        <h3>Preguntas Frecuentes</h3>
        <details className="help-details">
          <summary>¿Cómo puedo acceder a mis cursos comprados?</summary>
          <p>Una vez completada la compra, tus cursos estarán disponibles en "Mi Cuenta" &gt; "Mis Cursos"</p>
        </details>
        <details className="help-details">
          <summary>¿Cuántas veces puedo accesar a un curso, una vez que lo termine?</summary>
          <p>Puedes acceder a tu contenido las veces que desees.</p>
        </details>
        <details className="help-details">
          <summary>¿Cómo contacto al soporte?</summary>
          <p>Puedes usar nuestro formulario de contacto o escribirnos a soporte@sheleadsacademy.com</p>
        </details>
      </div>
      <Link to="/contact">
        <Button variant="primary" className="help-button">Contactar Soporte</Button>
      </Link>
    </div>
  );
}
