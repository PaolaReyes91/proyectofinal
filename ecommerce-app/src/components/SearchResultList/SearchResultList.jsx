import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {fetchCourses} from "../../services/courseService";
import CourseList from "../CourseList/CourseList";
import "./SearchResultList.css";

export default function SearchResultsList() {
  const [searchParams] = useSearchParams();
  const [course, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const query = (searchParams.get("q") || "").trim();

  useEffect(() => {
    let isMounted = true;
    const loadCourses = async () => {
      try {
        setLoading(true);
        const data = await fetchCourses();
        if (isMounted) setCourses(data);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadCourses();
    return () => {
      isMounted = false;
    };
  }, []);

  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const filteredCourses = useMemo(() => {
    if (!query) return [];
    const normalizedQuery = query.toLowerCase();
    let result = course.filter((course) => {
      const matchesName = course.name.toLowerCase().includes(normalizedQuery);
      const matchesDescription = course.description
        ?.toLowerCase()
        .includes(normalizedQuery);
      const matchesCategory = course.category?.name
        ?.toLowerCase()
        .includes(normalizedQuery);
      return matchesName || matchesDescription || matchesCategory;
    });
    // Ordenar
    result = result.sort((a, b) => {
      let valA = sortBy === "price" ? a.price : a.name.toLowerCase();
      let valB = sortBy === "price" ? b.price : b.name.toLowerCase();
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [course, query, sortBy, sortOrder]);

  const hasQuery = query.length > 0;
  const showNoResults = hasQuery && !loading && filteredCourses.length === 0;

  return (
    <div className="search-results-fullwidth">
      <header className="search-results-header">
        <div>
          <h1 className="search-results-title">
            {hasQuery
              ? `Resultados para "${query}"`
              : "Explora nuestro catálogo"}
          </h1>
          <p className="search-results-description">
            {hasQuery
              ? "Estos son los productos que encontramos basados en tu búsqueda."
              : "Usa la barra de búsqueda para encontrar rápidamente lo que necesitas."}
          </p>
        </div>
        {hasQuery && (
          <div className="search-results-controls">
            <label>Ordenar por:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name">Nombre</option>
              <option value="price">Precio</option>
            </select>
            <button
              type="button"
              className="sort-btn"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? "Ascendente" : "Descendente"}
            </button>
          </div>
        )}
      </header>
      {loading && (
        <div className="search-results-message">
          <h3>Buscando productos...</h3>
          <p>Esto puede tomar unos segundos.</p>
        </div>
      )}
      {!loading && showNoResults && (
        <div className="search-results-message">
          <h3>No encontramos coincidencias</h3>
          <p>
            Prueba con otros términos o recorre nuestras{" "}
            <Link to="/offers">ofertas destacadas</Link>.
          </p>
        </div>
      )}
      {!loading && hasQuery && !showNoResults && (
        <CourseList
          courses={filteredCourses}
          layout="vertical"
          title={`Resultados para "${query}"`}
        />
      )}
      {!loading && !hasQuery && (
        <div className="search-results-message">
          <h3>¿Buscas algo en especial?</h3>
          <p>
            Comienza a escribir en la barra de búsqueda y te mostraremos los
            resultados aquí mismo.
          </p>
        </div>
      )}
    </div>
  );
}