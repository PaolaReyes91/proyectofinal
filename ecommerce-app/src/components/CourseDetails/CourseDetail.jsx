import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import  categoriesData from "../../data/categories.json";
import Breadcrumb from "../../layout/Breadcrumb/Breadcrumb";
import { getCourseById } from "../../services/courseService";
import Loading from "../common/Loading/Loading";
import ErrorMessage from "../common/ErrorMessage/ErrorMessage";
import Button from "../common/Button/Button";
import "./CourseDetail.css";



export default function CourseDetail ({courseId})  {

  const {addToCart} = useCart ();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState (true);
  const [error, setError] = useState (null);

  useEffect (() => {
    setLoading (true);
    setError (null);
    getCourseById(courseId)
      .then((foundCourse) => {
        if (!foundCourse) {
          setError("Curso no Disponible");
        } else {
          setCourse (foundCourse);
        }
      })
      .catch(() => setError("Ocurrió un error al cargar el producto."))
      .finally(() => setLoading(false));
  }, [courseId]);

  const resolvedCategory = useMemo(() => {
    if (!course?.category) return null;
    return (
      categoriesData.find((cat) => cat.id === course.category.id) ||
      categoriesData.find (
        (cat) => cat.name.toLowerCase () === course.category.name?.toLowerCase ()
      ) ||
      null
    );
  }, [course]);
  const categorySlug = resolvedCategory?.id || course?.category?.name || null;

  const handleAddToCart = () =>{
    if (course) addToCart(course, 1);
  };

  if (loading) {
    return (
      <div className="course-details-container">
        <Loading message ="Cargando contenido" />
      </div>
    );
  }
   
  if (error) {
    return (
      <div className="course-details-container">
        <ErrorMessage message={error}>
          <p className="muted">
            Explora en nuestra <Link to="/">página principal</Link> 
            y descubre nuestras categorías
          </p>
        </ErrorMessage>
      </div>
    );
  }
  if (!course) return null;

  const { name, description, price, imagesUrl, category } = course;

  return (
    <div className="course-details-container">
      <Breadcrumb
        items={[
          { label: "Inicio", to: "/" },
          categorySlug
            ? {
                label: resolvedCategory?.name || category?.name || "Categoría",
                to: `/category/${categorySlug}`,
              }
            : { label: "Categoría" },
          { label: name },
        ]}
      />
      <div className="course-details-main">
        <div className="course-details-image">
          <img
            src={imagesUrl?.[0] || "/img/courses/placeholder.svg"}
            alt={name}
            onError={(event) => {
              event.target.src = "/img/courses/placeholder.svg";
            }}
          />
        </div>
        <div className="course-details-info">
          <div className="course-details-title">
            <h1 className="h1">{name}</h1>
            {(resolvedCategory?.name || category?.name) && (
              <span className="course-details-category">
                {resolvedCategory?.name || category?.name}
              </span>
            )}
          </div>
          <p className="course-details-description">{description}</p>
          <div className="course-details-price">${price}</div>
          <div className="course-details-actions">
            <Link to="/cart" >
            <Button
              variant="primary"
              size="lg"
              onClick={handleAddToCart}
            >
              Agregar al carrito
            </Button>
            </Link>
            <Link to="/cart" className="btn btn-outline btn-lg">
              Ver carrito
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}




