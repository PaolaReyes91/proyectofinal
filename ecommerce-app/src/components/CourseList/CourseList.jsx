import CourseCard from "../CourseCard/CourseCard";
import "./CourseList.css";

export default function courseList  ({
    courses = [],
    title = "Nuestros Cursos",
    layout = "grid",
}) {

  const validCourses = courses.filter(
    // Filtrar elementos que no son objetos o que no tienen una propiedad 'id'
    (course) => course && typeof course === 'object' && course.id
  );

  if (validCourses.length === 0) {
    return (
      <div className="listSectioStyle">
        <h1 className="listHeadingStyle">{title}</h1>
        <p className="muted">No hay cursos disponibles para mostrar.</p>
      </div>
    );
  }

  const renderCourses = (list) => (
    list.map((course) => (
      <CourseCard
        key={course.id}
        product={course}
        orientation="vertical"
        className="list-item"
      />
    ))
  );

  return (
    <div className="listSectioStyle">
      <div>
        <h1 className="listHeadingStyle">{title}</h1>
      </div>
      {layout === "grid" ? (
        <div className="gridContainerStyle">
          {renderCourses(validCourses)}
        </div>
      ) : (
        <div className="list-vertical">
          {renderCourses(validCourses)}
        </div>
      )}
    </div>
  );
};


