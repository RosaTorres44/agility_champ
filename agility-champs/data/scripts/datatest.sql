-- Insertar datos de prueba
select * from Usuarios ; 
-- Usuarios
INSERT INTO Usuarios (Nombre, CorreoElectronico, ContraseñaHash, Rol) VALUES
('Juan Pérez', 'juan.perez@example.com', 'hash1', 'Usuario'),
('Ana Gómez', 'ana.gomez@example.com', 'hash2', 'Juez'),
('Carlos Ruiz', 'carlos.ruiz@example.com', 'hash3', 'Usuario'),
('Luisa Fernández', 'luisa.fernandez@example.com', 'hash4', 'Juez'),
('Pedro Sánchez', 'pedro.sanchez@example.com', 'hash5', 'Usuario'),
('María López', 'maria.lopez@example.com', 'hash6', 'Juez'),
('José Torres', 'jose.torres@example.com', 'hash7', 'Usuario'),
('Elena Díaz', 'elena.diaz@example.com', 'hash8', 'Juez'),
('Raúl Martínez', 'raul.martinez@example.com', 'hash9', 'Usuario'),
('Clara Vargas', 'clara.vargas@example.com', 'hash10', 'Juez');

-- Escuelas
select * from Escuelas ; 
INSERT INTO Escuelas (Nombre) VALUES
('Escuela Canina Lima'),
('Escuela Canina Arequipa'),
('Escuela Canina Trujillo'),
('Escuela Canina Cusco'),
('Escuela Canina Piura'),
('Escuela Canina Tacna'),
('Escuela Canina Chiclayo'),
('Escuela Canina Huancayo'),
('Escuela Canina Ica'),
('Escuela Canina Juliaca');

-- Grados
INSERT INTO Grados (Nombre) VALUES
('Grado 0'),
('Grado 1'),
('Grado 2'),
('Grado 3');

-- Categorías

INSERT INTO Categorias (Nombre) VALUES
('Small'),
('Medium'),
('Intermediate'),
('Large');

-- Duplas
select * from Duplas ; 
INSERT INTO Duplas (UsuarioID, EscuelaID, NombrePerro, Raza, FechaNacimiento, GradoID, CategoriaID, flag_activo) VALUES
(1, 1, 'Rex', 'Border Collie', '2020-05-15', 1, 1, TRUE),
(2, 2, 'Max', 'Golden Retriever', '2019-03-22', 2, 2, TRUE),
(3, 3, 'Bella', 'Labrador Retriever', '2018-08-10', 3, 3, TRUE),
(4, 4, 'Rocky', 'Schnauzer', '2021-01-25', 1, 1, FALSE),
(5, 5, 'Daisy', 'Poodle', '2020-11-10', 2, 2, TRUE),
(6, 6, 'Coco', 'Beagle', '2021-07-20', 3, 3, TRUE),
(7, 7, 'Luna', 'Shih Tzu', '2019-04-15', 1, 1, TRUE),
(8, 8, 'Simba', 'Doberman', '2017-12-05', 2, 2, TRUE),
(9, 9, 'Milo', 'Cocker Spaniel', '2020-02-28', 3, 3, TRUE),
(10, 10, 'Nala', 'Husky', '2018-09-09', 1, 1, TRUE);

-- Competencias
INSERT INTO Competencias (Nombre, FechaInicio, FechaFin) VALUES
('Campeonato Nacional 2025', '2025-03-01', '2025-03-05'),
('Campeonato Regional 2025', '2025-04-10', '2025-04-12'),
('Campeonato Internacional 2025', '2025-06-15', '2025-06-20'),
('Torneo Primavera 2025', '2025-09-01', '2025-09-03'),
('Torneo Otoño 2025', '2025-10-10', '2025-10-12');

-- Pistas
INSERT INTO Pistas (CompetenciaID,  Nombre, Longitud, VelocidadMaxima, VelocidadMinima, Tipo) VALUES
(1, 'Pista 1', 120.5, 5.5, 3.2, 'Jumping'),
(1, 'Pista 2', 140.0, 6.0, 3.8, 'Agility'),
(2, 'Pista 3', 150.0, 6.5, 4.0, 'Jumping'),
(2, 'Pista 4', 160.0, 7.0, 4.5, 'Agility'),
(3, 'Pista 5', 170.0, 7.5, 5.0, 'Jumping'),
(3, 'Pista 6', 180.0, 8.0, 5.5, 'Agility'),
(4, 'Pista 7', 190.0, 8.5, 6.0, 'Jumping'),
(4, 'Pista 8', 200.0, 9.0, 6.5, 'Agility'),
(5, 'Pista 9', 210.0, 9.5, 7.0, 'Jumping'),
(5, 'Pista 10', 220.0, 10.0, 7.5, 'Agility');

-- Resultados
INSERT INTO Resultados (DuplaID, PistaID, Tiempo, reuses, faltas, Posicion) VALUES
(1, 1, 35.2, 0, 0, 1),
(2, 2, 40.5, 1, 1, 2),
(3, 3, 45.0, 2, 0, 3),
(4, 4, 38.7, 0, 2, 4),
(5, 5, 36.3, 1, 1, 5),
(6, 6, 39.9, 0, 0, 6),
(7, 7, 37.5, 2, 0, 7),
(8, 8, 34.8, 1, 1, 8),
(9, 9, 33.1, 0, 0, 9),
(10, 10, 32.4, 1, 0, 10);

-- Competencias-Escuelas
select * from CompetenciasEscuelas ;
-- Ensure the table CompetenciasEscuelas exists and the column names are correct
INSERT INTO CompetenciasEscuelas (CompetenciaID, EscuelaID) VALUES
(1, 1),
(1, 2),
(2, 3);
