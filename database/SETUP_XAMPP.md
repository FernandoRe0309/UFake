# Configuracion de EduPlatform con XAMPP y MySQL

## Paso 1: Preparar XAMPP

1. Abre XAMPP Control Panel
2. Inicia **Apache** y **MySQL**
3. Abre phpMyAdmin en: http://localhost/phpmyadmin

## Paso 2: Importar la Base de Datos

1. En phpMyAdmin, ve a la pestaña **Import**
2. Selecciona el archivo `database/schema.sql`
3. Click en **Go** para ejecutar
4. Repite con `database/seed.sql` para datos de ejemplo

## Paso 3: Crear archivo .env.local

Crea un archivo `.env.local` en la raiz del proyecto:

```env
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_NAME=eduplatform
```

## Paso 4: Instalar dependencias para MySQL

```bash
npm install mysql2
```

## Paso 5: Crear conexion a la base de datos

Crea el archivo `lib/db.ts`:

```typescript
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;
```

## Paso 6: Ejemplo de API Route

Crea `app/api/courses/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM courses WHERE is_published = TRUE'
    );
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
```

## Paso 7: Ejecutar el proyecto

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## Notas Importantes

- El proyecto actualmente usa localStorage para demo
- Para usar MySQL, debes modificar el store (`lib/store.ts`) para hacer fetch a las API routes
- Las passwords en seed.sql son placeholders - usa bcrypt para hashear en produccion

## Estructura de Tablas

- `users` - Administradores y estudiantes
- `teachers` - Profesores/instructores
- `courses` - Cursos disponibles
- `lessons` - Lecciones de cada curso
- `enrollments` - Inscripciones de estudiantes
- `lesson_progress` - Progreso por leccion
- `certificates` - Certificados emitidos
