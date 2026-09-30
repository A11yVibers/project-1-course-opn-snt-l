// Loads and parses immutable source data from project-assets/.
// These files are treated as read-only inputs; this module only reads and
// derives structured application data from them.
import Papa from 'papaparse'

import coursesCsv from '../project-assets/history_courses.csv?raw'
import classesCsv from '../project-assets/history_classes.csv?raw'
import materialsCsv from '../project-assets/course_materials.csv?raw'
import instructorsCsv from '../project-assets/history_instructors.csv?raw'

// Binary/media materials (pdf, video, etc.) are exposed as built asset URLs.
const materialUrls = import.meta.glob('../project-assets/materials/*', {
  eager: true,
  query: '?url',
  import: 'default',
})

// Markdown materials are exposed as raw text so they can be rendered inline.
const materialRaw = import.meta.glob('../project-assets/materials/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

function urlForPath(filePath) {
  // filePath values look like "materials/silk_roads_class_01_lecture.pdf"
  const key = Object.keys(materialUrls).find((k) => k.endsWith('/' + filePath))
  return key ? materialUrls[key] : null
}

function rawForPath(filePath) {
  const key = Object.keys(materialRaw).find((k) => k.endsWith('/' + filePath))
  return key ? materialRaw[key] : null
}

function parseCsv(text) {
  const result = Papa.parse(text.trim(), { header: true, skipEmptyLines: true })
  return result.data
}

const rawCourses = parseCsv(coursesCsv)
const rawClasses = parseCsv(classesCsv)
const rawMaterials = parseCsv(materialsCsv)
const rawInstructors = parseCsv(instructorsCsv)

export const instructors = Object.fromEntries(
  rawInstructors.map((i) => [i.instructor_id, i])
)

// Materials grouped by class_id, in display order.
const materialsByClass = {}
for (const m of rawMaterials) {
  if (!materialsByClass[m.class_id]) materialsByClass[m.class_id] = []
  const isRemote = m.material_type === 'youtube'
  materialsByClass[m.class_id].push({
    ...m,
    display_order: Number(m.display_order),
    url: isRemote ? m.file_path : urlForPath(m.file_path),
    raw: m.material_type === 'md' ? rawForPath(m.file_path) : null,
  })
}
for (const classId of Object.keys(materialsByClass)) {
  materialsByClass[classId].sort((a, b) => a.display_order - b.display_order)
}

// Classes grouped by course_id, in week/date order.
const classesByCourse = {}
for (const c of rawClasses) {
  if (!classesByCourse[c.course_id]) classesByCourse[c.course_id] = []
  classesByCourse[c.course_id].push({
    ...c,
    week_number: Number(c.week_number),
    materials: materialsByClass[c.class_id] || [],
  })
}
for (const courseId of Object.keys(classesByCourse)) {
  classesByCourse[courseId].sort((a, b) => a.class_id.localeCompare(b.class_id))
}

export const courses = rawCourses.map((c) => ({
  ...c,
  number_of_classes: Number(c.number_of_classes),
  number_of_weeks: Number(c.number_of_weeks),
  instructor: instructors[c.instructor_id] || null,
  classes: classesByCourse[c.course_id] || [],
}))

export function getCourseById(courseId) {
  return courses.find((c) => c.course_id === courseId) || null
}
