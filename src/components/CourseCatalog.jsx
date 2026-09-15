import { useMemo, useState } from 'react'

function CourseCard({ course, onSelect }) {
  return (
    <button className="course-card" onClick={() => onSelect(course.id)}>
      <div className="course-card__image" style={{ backgroundImage: `url(${course.imageUrl})` }} />
      <div className="course-card__body">
        <h3 className="course-card__title">{course.name}</h3>
        <p className="course-card__desc">{course.shortDescription}</p>
        <div className="course-card__meta">
          <span>{course.numberOfWeeks} weeks</span>
          <span>&middot;</span>
          <span>{course.numberOfClasses} classes</span>
          {course.instructor && (
            <>
              <span>&middot;</span>
              <span>{course.instructor.name}</span>
            </>
          )}
        </div>
      </div>
    </button>
  )
}

export default function CourseCatalog({ courses, onSelectCourse }) {
  const [query, setQuery] = useState('')
  const [instructorFilter, setInstructorFilter] = useState('all')
  const [durationFilter, setDurationFilter] = useState('all')

  const instructorOptions = useMemo(() => {
    const map = new Map()
    for (const course of courses) {
      if (course.instructor) map.set(course.instructor.instructor_id, course.instructor.name)
    }
    return Array.from(map.entries())
  }, [courses])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return courses.filter((course) => {
      const matchesQuery =
        !q ||
        course.name.toLowerCase().includes(q) ||
        course.shortDescription.toLowerCase().includes(q) ||
        course.longDescription.toLowerCase().includes(q)
      const matchesInstructor = instructorFilter === 'all' || course.instructorId === instructorFilter
      const matchesDuration =
        durationFilter === 'all' ||
        (durationFilter === 'short' && course.numberOfWeeks <= 5) ||
        (durationFilter === 'medium' && course.numberOfWeeks > 5 && course.numberOfWeeks <= 7) ||
        (durationFilter === 'long' && course.numberOfWeeks > 7)
      return matchesQuery && matchesInstructor && matchesDuration
    })
  }, [courses, query, instructorFilter, durationFilter])

  return (
    <div className="catalog">
      <header className="catalog__header">
        <h1 className="catalog__title">Chronicle — History Learning Platform</h1>
        <p className="catalog__subtitle">
          Twelve courses spanning ancient civilizations to the modern world. Explore, search, and start learning.
        </p>
      </header>

      <div className="catalog__controls">
        <input
          className="catalog__search"
          type="search"
          placeholder="Search courses by name or topic…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search courses"
        />
        <select
          className="catalog__filter"
          value={instructorFilter}
          onChange={(e) => setInstructorFilter(e.target.value)}
          aria-label="Filter by instructor"
        >
          <option value="all">All instructors</option>
          {instructorOptions.map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
        <select
          className="catalog__filter"
          value={durationFilter}
          onChange={(e) => setDurationFilter(e.target.value)}
          aria-label="Filter by duration"
        >
          <option value="all">Any length</option>
          <option value="short">5 weeks or less</option>
          <option value="medium">6–7 weeks</option>
          <option value="long">8+ weeks</option>
        </select>
      </div>

      <p className="catalog__count">
        {filtered.length} of {courses.length} course{courses.length === 1 ? '' : 's'}
      </p>

      <div className="catalog__grid">
        {filtered.map((course) => (
          <CourseCard key={course.id} course={course} onSelect={onSelectCourse} />
        ))}
        {filtered.length === 0 && <p className="catalog__empty">No courses match your search.</p>}
      </div>
    </div>
  )
}
