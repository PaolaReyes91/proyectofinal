import products from '../data/courses.json';

export const fetchCourses = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products);
    }, 2000);
  });
};

export const searchCourses = async (query) => {
  const lowerQuery = query.trim().toLowerCase();
  return fetchCourses().then((data) =>
    data.filter(
      (course) =>
        course.name.toLowerCase().includes(lowerQuery) ||
        course.description?.toLowerCase().includes(lowerQuery)
    )
  );
};

export const getCoursesByCategory = async (categoryId) => {
  return fetchCourses().then((data) =>
    data.filter((course) => course.category?._id === categoryId)
  );
};

export async function getCourseById(id) {
  // Simulación de delay y búsqueda en mock data
  await new Promise((res) => setTimeout(res, 300));
  const courses = await fetchCourses();
  return courses.find((c) => String(c.id) === id);
}