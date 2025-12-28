-- Script de Limpieza de Datos (Data Cleanup)
-- Ordenado por dependencias de Claves Primarias (PK) / Claves Foráneas (FK)

SET FOREIGN_KEY_CHECKS = 0;

-- limpiar logs
TRUNCATE TABLE audit_log;

-- LIMPIAR MAESTRAS
TRUNCATE TABLE tipo_pista;

ALTER TABLE tipo_pista AUTO_INCREMENT = 1;

TRUNCATE TABLE tipo_persona;

ALTER TABLE tipo_persona AUTO_INCREMENT = 1;

TRUNCATE TABLE organizacion;

ALTER TABLE organizacion AUTO_INCREMENT = 1;

TRUNCATE TABLE raza;

ALTER TABLE raza AUTO_INCREMENT = 1;

TRUNCATE TABLE categoria_talla;

ALTER TABLE categoria_talla AUTO_INCREMENT = 1;

TRUNCATE TABLE grado;

ALTER TABLE grado AUTO_INCREMENT = 1;

-- LIMMIAR RESULTADOS Y COMPETENCIAS
TRUNCATE TABLE ranking_puntaje;

ALTER TABLE ranking_puntaje AUTO_INCREMENT = 1;

TRUNCATE TABLE resultado_pista;

ALTER TABLE resultado_pista AUTO_INCREMENT = 1;

TRUNCATE TABLE inscripcion;

ALTER TABLE inscripcion AUTO_INCREMENT = 1;

TRUNCATE TABLE pista;

ALTER TABLE pista AUTO_INCREMENT = 1;

TRUNCATE TABLE competencia;

ALTER TABLE competencia AUTO_INCREMENT = 1;

TRUNCATE TABLE competencia_organizacion;

ALTER TABLE competencia_organizacion AUTO_INCREMENT = 1;

TRUNCATE TABLE organizacion;

ALTER TABLE organizacion AUTO_INCREMENT = 1;

-- LIMPIAR USUARIOS
TRUNCATE TABLE dupla;

ALTER TABLE dupla AUTO_INCREMENT = 1;

TRUNCATE TABLE perro;

ALTER TABLE perro AUTO_INCREMENT = 1;

TRUNCATE TABLE persona;

ALTER TABLE persona AUTO_INCREMENT = 1;

TRUNCATE TABLE perro_grado_historico;

ALTER TABLE perro_grado_historico AUTO_INCREMENT = 1;

SET FOREIGN_KEY_CHECKS = 1;

SELECT 'Limpieza de datos completada.' as status;

-- ingreso de informacion

-- Script para insertar datos iniciales (Seed Data)
-- Restaura Tipo de Persona y Usuario Admin inicial

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Insertar Tipos de Persona
-- Aseguramos que existan los roles básicos requeridos por la lógica del sistema
INSERT INTO
    tipo_persona (id, cod, nombre, flg_activo)
VALUES (
        1,
        'ADMIN',
        'Administrador',
        1
    ),
    (2, 'GUIA', 'Guía', 1),
    (3, 'JUEZ', 'Juez', 1)
ON DUPLICATE KEY UPDATE
    nombre = VALUES(nombre);

-- 2. Insertar Usuario Admin Inicial (ID 1)
-- Este usuario debe existir para que la aplicación tenga un super-admin por defecto.
-- Ajustar el email según corresponda.
INSERT INTO
    persona (
        id,
        id_tipo_persona,
        nombres,
        apellidos,
        email,
        flg_activo
    )
VALUES (
        1,
        1,
        'Admin',
        'System',
        'admin@gmail.com',
        1
    )
ON DUPLICATE KEY UPDATE
    email = VALUES(email);

-- Ajustar Auto-Increment para no solapar
ALTER TABLE tipo_persona AUTO_INCREMENT = 4;

ALTER TABLE persona AUTO_INCREMENT = 2;
-- O el siguiente disponible

-- Insert Grados
INSERT INTO
    grado (
        cod,
        nombre,
        orden,
        flg_activo,
        fec_creacion,
        fec_actualizacion
    )
VALUES (
        'G0',
        'Iniciantes',
        0,
        1,
        NOW(),
        NOW()
    ),
    (
        'G1',
        'Grado 1',
        1,
        1,
        NOW(),
        NOW()
    ),
    (
        'G2',
        'Grado 2',
        2,
        1,
        NOW(),
        NOW()
    ),
    (
        'G3',
        'Grado 3',
        3,
        1,
        NOW(),
        NOW()
    )
ON DUPLICATE KEY UPDATE
    nombre = VALUES(nombre),
    orden = VALUES(orden);

-- Insert Categorias (Tallas - FCI Standards)
INSERT INTO
    categoria_talla (
        cod,
        nombre,
        orden,
        flg_activo,
        fec_creacion,
        fec_actualizacion
    )
VALUES (
        'S',
        'Small',
        1,
        1,
        NOW(),
        NOW()
    ),
    (
        'M',
        'Medium',
        2,
        1,
        NOW(),
        NOW()
    ),
    (
        'I',
        'Intermediate',
        3,
        1,
        NOW(),
        NOW()
    ),
    (
        'L',
        'Large',
        4,
        1,
        NOW(),
        NOW()
    )
ON DUPLICATE KEY UPDATE
    nombre = VALUES(nombre),
    orden = VALUES(orden);

-- Verify
SELECT * FROM grado;

SELECT * FROM categoria_talla;

SET FOREIGN_KEY_CHECKS = 1;

SELECT 'Datos iniciales insertados correctamente.' as status;