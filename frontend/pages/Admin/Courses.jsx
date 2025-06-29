import CourseList from '../../src/components/Courses/CourseList';

const AdminCourses = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-purple-700">Manage Courses</h1>
      <CourseList />
    </div>
  );
};

export default AdminCourses;