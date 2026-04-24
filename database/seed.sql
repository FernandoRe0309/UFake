-- EduPlatform Seed Data
-- Ejecutar despues de schema.sql

USE eduplatform;

-- Usuario administrador (password: admin123 - en produccion usar hash bcrypt)
INSERT INTO users (id, email, password, name, role) VALUES
('admin-001', 'admin@eduplatform.com', '$2a$10$hash_admin123', 'Administrador', 'admin');

-- Profesores de ejemplo
INSERT INTO teachers (id, name, email, bio, specialty) VALUES
('teacher-001', 'Carlos Rodriguez', 'carlos@eduplatform.com', 'Desarrollador web con 10 años de experiencia', 'Desarrollo Web'),
('teacher-002', 'Maria Garcia', 'maria@eduplatform.com', 'Experta en diseño UI/UX', 'Diseño'),
('teacher-003', 'Juan Martinez', 'juan@eduplatform.com', 'Especialista en bases de datos', 'Backend');

-- Cursos de ejemplo
INSERT INTO courses (id, title, description, teacher_id, category, level, duration, is_published) VALUES
('course-001', 'Introduccion a JavaScript', 'Aprende los fundamentos de JavaScript desde cero', 'teacher-001', 'Programacion', 'beginner', 180, TRUE),
('course-002', 'Diseño UI/UX Moderno', 'Principios de diseño para interfaces atractivas', 'teacher-002', 'Diseño', 'intermediate', 240, TRUE),
('course-003', 'MySQL desde Cero', 'Aprende a manejar bases de datos relacionales', 'teacher-003', 'Base de Datos', 'beginner', 150, TRUE);

-- Lecciones del curso de JavaScript
INSERT INTO lessons (id, course_id, title, description, duration, order_index) VALUES
('lesson-001', 'course-001', 'Variables y Tipos de Datos', 'Conoce las variables let, const y var', 15, 1),
('lesson-002', 'course-001', 'Funciones', 'Aprende a crear y usar funciones', 20, 2),
('lesson-003', 'course-001', 'Arrays y Objetos', 'Estructuras de datos en JavaScript', 25, 3),
('lesson-004', 'course-001', 'DOM Manipulation', 'Interactua con el HTML desde JavaScript', 30, 4);

-- Lecciones del curso de Diseño
INSERT INTO lessons (id, course_id, title, description, duration, order_index) VALUES
('lesson-005', 'course-002', 'Teoria del Color', 'Principios basicos de colorimetria', 20, 1),
('lesson-006', 'course-002', 'Tipografia', 'Seleccion y uso de fuentes', 25, 2),
('lesson-007', 'course-002', 'Layouts y Grids', 'Estructuras de diseño responsive', 30, 3);

-- Lecciones del curso de MySQL
INSERT INTO lessons (id, course_id, title, description, duration, order_index) VALUES
('lesson-008', 'course-003', 'Instalacion de XAMPP', 'Configura tu entorno de desarrollo', 15, 1),
('lesson-009', 'course-003', 'CREATE y INSERT', 'Crea tablas e inserta datos', 25, 2),
('lesson-010', 'course-003', 'SELECT y WHERE', 'Consultas basicas', 20, 3),
('lesson-011', 'course-003', 'JOIN y Relaciones', 'Une tablas relacionadas', 30, 4);

-- Usuario estudiante de ejemplo (password: student123)
INSERT INTO users (id, email, password, name, role) VALUES
('student-001', 'estudiante@example.com', '$2a$10$hash_student123', 'Estudiante Demo', 'student');

-- Inscripcion de ejemplo
INSERT INTO enrollments (id, user_id, course_id) VALUES
('enroll-001', 'student-001', 'course-001');
