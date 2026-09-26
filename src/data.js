import { parseCSV } from './lib/csv.js'

// Raw CSV text, imported directly from the immutable project-assets source data.
const courseFiles = import.meta.glob('../project-assets/history_courses.csv', { query: '?raw', import: 'default', eager: true })
const classFiles = import.meta.glob('../project-assets/history_classes.csv', { query: '?raw', import: 'default', eager: true })
const instructorFiles = import.meta.glob('../project-assets/history_instructors.csv', { query: '?raw', import: 'default', eager: true })
const materialFiles = import.meta.glob('../project-assets/course_materials.csv', { query: '?raw', import: 'default', eager: true })

// Built asset URLs for every file inside project-assets/materials, keyed by their
// path as referenced in course_materials.csv (e.g. "materials/foo.pdf").
const materialAssetUrls = import.meta.glob('../project-assets/materials/*', { query: '?url', import: 'default', eager: true })

function resolveMaterialUrl(filePath) {
  // filePath in the CSV looks like "materials/silk_roads_class_01_lecture.pdf"
  const fileName = filePath.split('/').pop()
  const match = Object.entries(materialAssetUrls).find(([key]) => key.endsWith(fileName))
  return match ? match[1] : filePath
}

function readCSV(globResult) {
  const [raw] = Object.values(globResult)
  return parseCSV(raw)
}

const rawCourses = readCSV(courseFiles)
const rawClasses = readCSV(classFiles)
const rawInstructors = readCSV(instructorFiles)
const rawMaterials = readCSV(materialFiles)

export const instructorsById = Object.fromEntries(
  rawInstructors.map((instructor) => [instructor.instructor_id, instructor])
)

// Materials grouped by class_id, sorted by display order.
const materialsByClass = {}
for (const material of rawMaterials) {
  const list = materialsByClass[material.class_id] || (materialsByClass[material.class_id] = [])
  list.push({
    ...material,
    display_order: Number(material.display_order),
    url: /^https?:\/\//.test(material.file_path)
      ? material.file_path
      : resolveMaterialUrl(material.file_path),
  })
}
for (const list of Object.values(materialsByClass)) {
  list.sort((a, b) => a.display_order - b.display_order)
}

// Classes grouped by course_id, each with its materials attached, sorted by
// week number then date.
const classesByCourse = {}
for (const cls of rawClasses) {
  const list = classesByCourse[cls.course_id] || (classesByCourse[cls.course_id] = [])
  list.push({
    ...cls,
    week_number: Number(cls.week_number),
    materials: materialsByClass[cls.class_id] || [],
  })
}
for (const list of Object.values(classesByCourse)) {
  list.sort((a, b) => (a.week_number - b.week_number) || a.date.localeCompare(b.date))
}

export const courses = rawCourses.map((course) => ({
  ...course,
  number_of_classes: Number(course.number_of_classes),
  number_of_weeks: Number(course.number_of_weeks),
  instructor: instructorsById[course.instructor_id] || null,
  classes: classesByCourse[course.course_id] || [],
}))

export function getCourseById(courseId) {
  return courses.find((course) => course.course_id === courseId) || null
}

export const MATERIAL_TYPE_LABELS = {
  pdf: 'PDF Reading',
  video: 'Lecture Video',
  youtube: 'Video',
  md: 'Assignment',
  pptx: 'Lecture Slides',
  ppt: 'Lecture Slides',
  doc: 'Document',
  docx: 'Document',
  link: 'Resource',
}
