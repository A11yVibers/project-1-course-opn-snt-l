import { Link } from 'react-router-dom'

export default function CourseCard({ course }) {
  return (
    <Link to={`/course/${course.course_id}`} className="course-card">
      <div className="course-card-image">
        <img src={course.image_url} alt={course.name} loading="lazy" />
      </div>
      <div className="course-card-body">
        <h3>{course.name}</h3>
        <p>{course.short_description}</p>
        <div className="course-card-meta">
          <span>{course.number_of_weeks} weeks</span>
          <span>{course.number_of_classes} classes</span>
        </div>
        {course.instructor && (
          <div className="course-card-instructor">
            <img src={course.instructor.photo_url} alt={course.instructor.name} />
            <span>{course.instructor.name}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
