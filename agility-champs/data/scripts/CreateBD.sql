-- Modelo de Base de Datos para Gestión de Competencias

DROP TABLE IF EXISTS Usuarios;
CREATE TABLE `Usuarios` (
  `UsuarioID` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(100) NOT NULL,
  `CorreoElectronico` varchar(255) NOT NULL,
  `ContraseñaHash` varchar(255) NOT NULL,
  `Rol` enum('Usuario','Juez') NOT NULL,
  `FechaCreacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `FLG_ACTIVO` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`UsuarioID`),
  UNIQUE KEY `CorreoElectronico` (`CorreoElectronico`)
)  

-- Tabla de Escuelas
DROP TABLE IF EXISTS Escuelas;
CREATE TABLE Escuelas (
    EscuelaID INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(100) NOT NULL UNIQUE
);

-- Tabla de Grados
DROP TABLE IF EXISTS Grados;
CREATE TABLE Grados (
    GradoID INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Tabla de Categorías
DROP TABLE IF EXISTS Categorias;
CREATE TABLE Categorias (
    CategoriaID INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Tabla de Duplas
DROP TABLE IF EXISTS Duplas;
CREATE TABLE Duplas (
    DuplaID INT PRIMARY KEY AUTO_INCREMENT,
    UsuarioID INT NOT NULL,
    EscuelaID INT NOT NULL,
    NombrePerro VARCHAR(100) NOT NULL,
    Raza VARCHAR(100),
    FechaNacimiento DATE,
    GradoID INT NOT NULL,
    CategoriaID INT NOT NULL,
    flag_activo BOOLEAN, 
    FotoURL VARCHAR(255),
    FOREIGN KEY (UsuarioID) REFERENCES Usuarios(UsuarioID),
    FOREIGN KEY (EscuelaID) REFERENCES Escuelas(EscuelaID),
    FOREIGN KEY (GradoID) REFERENCES Grados(GradoID),
    FOREIGN KEY (CategoriaID) REFERENCES Categorias(CategoriaID)
);

 






-- Tabla de Competencias
DROP TABLE IF EXISTS Competencias;
CREATE TABLE Competencias (
    CompetenciaID INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(100) NOT NULL,
    FechaInicio DATE NOT NULL,
    FechaFin DATE NOT NULL
);

-- Tabla de Pistas
DROP TABLE IF EXISTS Pistas;
CREATE TABLE Pistas (
    PistaID INT PRIMARY KEY AUTO_INCREMENT,
    CompetenciaID INT NOT NULL,
    Nombre VARCHAR(100) NOT NULL,
    Longitud DECIMAL(5, 2) NOT NULL,
    VelocidadMaxima DECIMAL(5, 2) NOT NULL,
    VelocidadMinima DECIMAL(5, 2) NOT NULL,
    Tipo ENUM('Jumping', 'Agility') NOT NULL,
    FOREIGN KEY (CompetenciaID) REFERENCES Competencias(CompetenciaID)
);



-- Tabla de Resultados
DROP TABLE IF EXISTS Resultados;
CREATE TABLE Resultados (
    ResultadoID INT PRIMARY KEY AUTO_INCREMENT,
    DuplaID INT NOT NULL,
    PistaID INT NOT NULL,
    Tiempo DECIMAL(5, 2) NOT NULL,
    reuses INT NOT NULL,
    faltas INT NOT NULL,
    Posicion INT NOT NULL,
    FOREIGN KEY (DuplaID) REFERENCES Duplas(DuplaID),
    FOREIGN KEY (PistaID) REFERENCES Pistas(PistaID)
);

-- Tabla de Competencias-Escuelas (Relación)
DROP TABLE IF EXISTS CompetenciasEscuelas;
CREATE TABLE CompetenciasEscuelas (
    CompetenciaID INT NOT NULL,
    EscuelaID INT NOT NULL,
    PRIMARY KEY (CompetenciaID, EscuelaID),
    FOREIGN KEY (CompetenciaID) REFERENCES Competencias(CompetenciaID),
    FOREIGN KEY (EscuelaID) REFERENCES Escuelas(EscuelaID)
);
