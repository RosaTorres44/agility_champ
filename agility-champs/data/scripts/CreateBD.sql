-- Modelo de Base de Datos para Gestión de Competencias

DROP TABLE IF EXISTS persona;
CREATE TABLE `persona` (
  `id_persona` int NOT NULL AUTO_INCREMENT,
  `des_nombres` varchar(100) NOT NULL,
  `des_apellidos` varchar(100) NOT NULL,
  `fec_nacimiento` DATE,
  `flg_sexo` tinyint(1),
  `des_correo` varchar(255) NOT NULL,
  `hash_password` varchar(255) NOT NULL,
  `des_rol` enum('Usuario','Juez') NOT NULL,
  `fec_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `flg_activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_persona`),
  UNIQUE KEY `des_correo` (`des_correo`)
)  


-- Tabla de razas
DROP TABLE IF EXISTS raza;
CREATE TABLE `raza` (
  `id_raza` int NOT NULL AUTO_INCREMENT,
  `des_raza` varchar(100) NOT NULL,
  `fec_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `flg_activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_raza`) 
);

-- Tabla de Perros
DROP TABLE IF EXISTS perro;
CREATE TABLE `perro` (
  `id_perro` int NOT NULL AUTO_INCREMENT,
  `des_nombres` varchar(100) NOT NULL,
  `fec_nacimiento` DATE,
  `flg_sexo` tinyint(1),
  `des_chip` INT NOT NULL,
  `id_raza` INT NOT NULL,
  `fec_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `flg_activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_perro`),
  UNIQUE KEY `des_chip` (`des_chip`),
  FOREIGN KEY (id_raza) REFERENCES raza(id_raza)
);


-- Tabla de Escuelas
DROP TABLE IF EXISTS escuela;
CREATE TABLE escuela (
   `id_escuela`  int NOT NULL AUTO_INCREMENT,
   `des_escuela` varchar(100) NOT NULL,
    `fec_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `flg_activo` tinyint(1) DEFAULT '1',
   PRIMARY KEY (`id_escuela`)
);


-- Tabla de Grados
DROP TABLE IF EXISTS grado;
CREATE TABLE grado (
   `id_grado`  int NOT NULL AUTO_INCREMENT,
   `des_grado` varchar(100) NOT NULL,
    `fec_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `flg_activo` tinyint(1) DEFAULT '1',
    PRIMARY KEY (`id_grado`)
);

-- Tabla de Categorías
DROP TABLE IF EXISTS categoria;
CREATE TABLE categoria (
   `id_categoria`  int NOT NULL AUTO_INCREMENT,
   `des_categoria` varchar(100) NOT NULL,
    `fec_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `flg_activo` tinyint(1) DEFAULT '1',
    PRIMARY KEY (`id_categoria`)
);


-- Tabla de Duplas
DROP TABLE IF EXISTS dupla;
CREATE TABLE dupla (
   `id_dupla` int NOT NULL AUTO_INCREMENT,
   `id_perro` INT NOT NULL,
   `id_persona` INT NOT NULL,
   `id_grado` INT NOT NULL,
   `id_categoria` INT NOT NULL,
    `fec_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `flg_activo` tinyint(1) DEFAULT '1',
    PRIMARY KEY (`id_dupla`),
    FOREIGN KEY (id_perro) REFERENCES perro(id_perro),
    FOREIGN KEY (id_persona) REFERENCES persona(id_persona),
    FOREIGN KEY (id_grado) REFERENCES grado(id_grado) ,
    FOREIGN KEY (id_categoria) REFERENCES cate(id_categoria) 

);


-- Tabla de detalle perro escuela
DROP TABLE IF EXISTS detalle_perro_escuela;
CREATE TABLE detalle_perro_escuela (
   `id_perro` INT NOT NULL,
   `id_escuela` INT NOT NULL,
    `fec_inicio` timestamp NULL,
    `fec_fin` timestamp NULL,
    `fec_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `flg_activo` tinyint(1) DEFAULT '1',
    PRIMARY KEY (`id_perro`, `id_escuela`),
    FOREIGN KEY (id_perro) REFERENCES perro(id_perro),
    FOREIGN KEY (id_escuela) REFERENCES escuela(id_escuela) 
);

-- Tabla de detalle perro grado
DROP TABLE IF EXISTS detalle_perro_grado;
CREATE TABLE detalle_perro_grado (
   `id_perro` INT NOT NULL,
   `id_grado` INT NOT NULL,
    `fec_inicio` timestamp NULL,
    `fec_fin` timestamp NULL,
    `fec_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `flg_activo` tinyint(1) DEFAULT '1',
    PRIMARY KEY (`id_perro`, `id_grado`),
    FOREIGN KEY (id_perro) REFERENCES perro(id_perro),
    FOREIGN KEY (id_grado) REFERENCES grado(id_grado) 
);

-- Tabla de detalle perro categoria
DROP TABLE IF EXISTS detalle_perro_categoria;
CREATE TABLE detalle_perro_categoria (
   `id_perro` INT NOT NULL,
   `id_categoria` INT NOT NULL,
    `fec_inicio` timestamp NULL,
    `fec_fin` timestamp NULL,
    `fec_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `flg_activo` tinyint(1) DEFAULT '1',
    PRIMARY KEY (`id_perro`, `id_categoria`),
    FOREIGN KEY (id_perro) REFERENCES perro(id_perro),
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria) 
);

-- Tabla de Competencias
DROP TABLE IF EXISTS competencia;
CREATE TABLE competencia (
        `id_competencia` int NOT NULL AUTO_INCREMENT,
        `des_competencia` varchar(100) NOT NULL,
        `id_escuela` INT NOT NULL,
        `fec_inicio` timestamp NOT NULL,
        `fec_fin` timestamp NOT NULL,
        `fec_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        `flg_activo` tinyint(1) DEFAULT '1', 
         PRIMARY KEY (`id_competencia`),
         FOREIGN KEY (id_escuela) REFERENCES escuela(id_escuela)
);

-- Tabla de Pistas
DROP TABLE IF EXISTS pista;
CREATE TABLE pista (
    `id_pista` int NOT NULL AUTO_INCREMENT,
    `des_pista` varchar(100) NOT NULL,
    `id_competencia` INT NOT NULL,
    `id_grado`  INT NOT NULL,
    `id_categoria` INT NOT NULL,
    `id_persona`  INT NOT NULL,
    `num_obstaculos` INT NOT NULL,
    `num_longitud` DECIMAL(5, 2) NOT NULL,
    `num_velocidad_maxima` DECIMAL(5, 2) NOT NULL,
    `num_velocidad_minima` DECIMAL(5, 2) NOT NULL,
    `num_tiempo_maximo` DECIMAL(5, 2) NOT NULL,
    `num_tiempo_minimo` DECIMAL(5, 2) NOT NULL,
    `des_tipo` ENUM('Jumping', 'Agility') NOT NULL,
    `fec_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `flg_activo` tinyint(1) DEFAULT '1', 
    PRIMARY KEY (`id_pista`),
    FOREIGN KEY (id_competencia) REFERENCES competencia(id_competencia),
    FOREIGN KEY (id_grado) REFERENCES grado(id_grado),
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria),
    FOREIGN KEY (id_persona) REFERENCES persona(id_persona)
);


-- Tabla de resultados
DROP TABLE IF EXISTS resultados;
CREATE TABLE resultados (
    `id_resultado` int NOT NULL AUTO_INCREMENT,
    `id_pista`  INT NOT NULL,
    `id_dupla` INT NOT NULL,  
    `num_tiempo` DECIMAL(5, 2) NOT NULL,
    `num_rehuse` INT NOT NULL,
    `num_faltas` INT NOT NULL,
    `num_posicion` INT NOT NULL,
    `num_penalizacion_recorrido` INT NOT NULL,
    `num_penalizacion_tiempo` INT NOT NULL,
    `num_total_penalizaciones` INT NOT NULL,
    `num_velocidad` DECIMAL(5, 2) NOT NULL,
    `flg_medalla` tinyint(1), 
    `flg_mejor_velocidad` tinyint(1), 
    `fec_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `flg_activo` tinyint(1) DEFAULT '1',
    PRIMARY KEY (`id_resultado`),
    FOREIGN KEY (id_pista) REFERENCES pista(id_pista),
    FOREIGN KEY (id_dupla) REFERENCES dupla(id_dupla)
);
 