// Local material files supplied in project-assets/materials. Vite resolves these
// to hashed, servable asset URLs (or raw text for markdown) at build time.
// Only the files that exist in project-assets/materials are referenced here.
import silkRoadsClass01LecturePdfUrl from '../../project-assets/materials/silk_roads_class_01_lecture.pdf?url'
import silkRoadsClass01LectureVideoUrl from '../../project-assets/materials/silk_roads_class_01_lecture.mp4?url'
import silkRoadsClass02AssignmentMd from '../../project-assets/materials/silk_roads_class_02_assignment.md?raw'

// Maps the file_path column from course_materials.csv to the resolved asset.
export const LOCAL_MATERIAL_FILES = Object.freeze({
  'materials/silk_roads_class_01_lecture.pdf': { url: silkRoadsClass01LecturePdfUrl },
  'materials/silk_roads_class_01_lecture.mp4': { url: silkRoadsClass01LectureVideoUrl },
  'materials/silk_roads_class_02_assignment.md': { url: null, text: silkRoadsClass02AssignmentMd },
})
