
USE agilitychamp;

-- 🔹 Eliminar datos previos en orden correcto
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE resultados;
TRUNCATE TABLE pista;
TRUNCATE TABLE competencia;
TRUNCATE TABLE detalle_perro_categoria;
TRUNCATE TABLE detalle_perro_grado;
TRUNCATE TABLE detalle_perro_escuela;
TRUNCATE TABLE dupla;
TRUNCATE TABLE categoria;
TRUNCATE TABLE grado;
TRUNCATE TABLE escuela;
TRUNCATE TABLE perro;
TRUNCATE TABLE raza;
TRUNCATE TABLE persona;

SET FOREIGN_KEY_CHECKS = 1;

-- 🔹 Insertar personas (Handlers y Jueces)
INSERT INTO persona (des_nombres, des_apellidos, fec_nacimiento, flg_sexo, des_correo, hash_password, des_rol) VALUES
('Laura', 'Rodríguez', '1987-03-10', 0, 'laura.rodriguez@email.com', 'pass123', 'Usuario'),
('Mario', 'Fernández', '1995-09-25', 1, 'mario.fernandez@email.com', 'pass456', 'Usuario'),
('Sofía', 'Martínez', '1982-06-15', 0, 'sofia.martinez@email.com', 'pass789', 'Juez');

-- 🔹 Insertar razas de perros
INSERT INTO raza (des_raza) VALUES
('Border Collie'),
('Golden Retriever'),
('Jack Russell Terrier'),
('Pastor Belga Malinois');

-- 🔹 Insertar perros
INSERT INTO perro (des_nombres, fec_nacimiento, flg_sexo, des_chip, id_raza) VALUES
('Luna', '2020-07-22', 0, 3001, 1),
('Rex', '2021-10-10', 1, 3002, 2),
('Bruno', '2019-12-15', 1, 3003, 3),
('Maya', '2018-05-05', 0, 3004, 4);

-- 🔹 Insertar escuelas
INSERT INTO escuela (des_escuela) VALUES
('Agility Top Training'),
('Speed Runners Club');

-- 🔹 Insertar grados
INSERT INTO grado (des_grado) VALUES
('Grado 1'),
('Grado 2'),
('Grado 3');

-- 🔹 Insertar categorías
INSERT INTO categoria (des_categoria) VALUES
('Pequeños'),
('Medianos'),
('Grandes');

-- 🔹 Asignar perros a escuelas
INSERT INTO detalle_perro_escuela (id_perro, id_escuela, fec_inicio) VALUES
(1, 1, '2023-01-15'),
(2, 1, '2023-03-10'),
(3, 2, '2023-05-20'),
(4, 2, '2023-07-30');

-- 🔹 Asignar perros a grados
INSERT INTO detalle_perro_grado (id_perro, id_grado, fec_inicio) VALUES
(1, 1, '2023-02-01'),
(2, 2, '2023-04-05'),
(3, 2, '2023-06-10'),
(4, 3, '2023-08-15');

-- 🔹 Asignar perros a categorías
INSERT INTO detalle_perro_categoria (id_perro, id_categoria, fec_inicio) VALUES
(1, 2, '2023-02-10'),
(2, 1, '2023-04-12'),
(3, 3, '2023-06-15'),
(4, 2, '2023-08-18');

-- 🔹 Crear duplas
INSERT INTO dupla (id_perro, id_persona, id_categoria, id_grado) VALUES
(1, 1, 1,1),
(2, 2, 2,2),
(3, 1, 2,3),
(4, 2, 3,2);

-- 🔹 Crear competencias
INSERT INTO competencia (des_competencia, id_escuela, fec_inicio, fec_fin) VALUES
('Copa Nacional Agility 2024', 1, '2024-06-10', '2024-06-11'),
('Open Speed Runners', 2, '2024-07-15', '2024-07-16');
('Copa Kay', 2, '2025-04-01', '2025-04-02');

-- 🔹 Crear pistas en competencias
INSERT INTO pista (des_pista, id_competencia, id_grado, id_categoria, id_persona, num_obstaculos, num_longitud, num_velocidad_maxima, num_velocidad_minima, num_tiempo_maximo, num_tiempo_minimo, des_tipo) VALUES
('Pista de Saltos', 1, 1, 2, 3, 12, 110.00, 5.80, 2.90, 38.00, 18.00, 'Jumping'),
('Pista Técnica', 2, 2, 3, 3, 15, 130.00, 5.50, 2.75, 42.00, 22.00, 'Agility');

-- 🔹 Insertar resultados de competencias
INSERT INTO resultados (id_pista, id_dupla, num_tiempo, num_rehuse, num_faltas, num_posicion, num_penalizacion_recorrido, num_penalizacion_tiempo, num_total_penalizaciones, num_velocidad, flg_medalla, flg_mejor_velocidad) VALUES
(1, 1, 27.80, 1, 0, 1, 0, 0, 0, 5.20, 1, 1),
(1, 2, 31.90, 2, 1, 2, 5, 0, 5, 4.40, 0, 0),
(2, 3, 36.40, 1, 2, 3, 0, 10, 10, 3.95, 0, 0),
(2, 4, 35.20, 0, 0, 1, 0, 0, 0, 4.85, 1, 1);
