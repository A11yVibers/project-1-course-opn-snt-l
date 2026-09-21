export default function CourseCard({ course, onSelect }) {
  return (
    <article className="course-card">
      <button type="button" className="course-card__button" onClick={() => onSelect(course.id)}>
        <img className="course-card__image" src={course.imageUrl} alt={`Illustration for ${course.name}`} />
        <div className="course-card__body">
          <h3 className="course-card__title">{course.name}</h3>
          <p className="course-card__description">{course.shortDescription}</p>
          <dl className="course-card__meta">
            <div>
              <dt>Weeks</dt>
              <dd>{course.numberOfWeeks}</dd>
            </div>
            <div>
              <dt>Classes</dt>
              <dd>{course.numberOfClasses}</dd>
            </div>
          </dl>
          {course.instructor && (
            <p className="course-card__instructor">
              <img
                className="course-card__instructor-photo"
                src={course.instructor.photo_url}
                alt=""
                aria-hidden="true"
              />
              {course.instructor.name}
            </p>
          )}
        </div>
      </button>
    </article>
  )
}
