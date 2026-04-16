import { useParams } from "react-router-dom";
import CourseDetail from "../components/CourseDetails/CourseDetail";

export default function Course() {
  const { courseId } = useParams();

  return <CourseDetail courseId={courseId} />;
}