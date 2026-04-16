import { useEffect, useState } from "react";
import BannerCarousel from "../components/BannerCarousel/BannerCarousel";
import CourseList from "../components/CourseList/CourseList";
import ErrorMessage from "../components/common/ErrorMessage/ErrorMessage";
import Loading from "../components/common/Loading/Loading"; 
import homeImages from "../data/homeImages.json"
import { fetchCourses } from "../services/courseService";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const coursesData = await fetchCourses();
        setCourses(coursesData);
      } catch (err) {
        setError("No se pudieron cargar los cursos. Intenta más tarde.");
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);


  return (
    <div>
        <BannerCarousel banners={homeImages} />
        {loading ? (
          <Loading>Cargando nuestros Cursos</Loading> )
          : error ? (
            <ErrorMessage>{error}</ErrorMessage>
          ) : courses.length > 0 ? (
            <CourseList
              title= "Explora nuestros cursos"
              courses = {courses}
              layout = "grid" />
          ) : (
            <ErrorMessage>No hay cursos disponbiles</ErrorMessage>
          )}
    </div>
  ); 
}
