-- Active: 1765669909409@@127.0.0.1@3306@agility_champ2
-- 1. Tablas maestras / catálogos

CREATE TABLE IF NOT EXISTS categoria_talla (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cod VARCHAR(30) UNIQUE NOT NULL, -- SMALL, MEDIUM, INTERMEDIO, LARGE
    nombre VARCHAR(100) NOT NULL,
    flg_activo BOOLEAN DEFAULT TRUE,
    fec_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fec_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS grado (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cod VARCHAR(10) UNIQUE NOT NULL, -- G0, G1, G2, G3
    nombre VARCHAR(100) NOT NULL,
    orden INT NOT NULL,
    flg_activo BOOLEAN DEFAULT TRUE,
    fec_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fec_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tipo_pista (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cod VARCHAR(30) UNIQUE NOT NULL, -- AGILITY, JUMPING, REQUISITO
    nombre VARCHAR(100) NOT NULL,
    flg_activo BOOLEAN DEFAULT TRUE,
    fec_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fec_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tipo_persona (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cod VARCHAR(30) UNIQUE NOT NULL, -- JUEZ, GUIA, ADMINISTRADOR
    nombre VARCHAR(60) NOT NULL,
    flg_activo TINYINT DEFAULT 1,
    fec_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fec_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Personas y Perros

CREATE TABLE IF NOT EXISTS persona (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_tipo_persona BIGINT NOT NULL,
    nombres VARCHAR(120) NOT NULL,
    apellidos VARCHAR(120) NOT NULL,
    email VARCHAR(190) UNIQUE,
    telefono VARCHAR(40),
    flg_activo TINYINT DEFAULT 1,
    fec_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fec_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_tipo_persona) REFERENCES tipo_persona (id)
);

CREATE TABLE IF NOT EXISTS perro (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    fecha_nacimiento DATE,
    chip VARCHAR(80),
    id_categoria_talla BIGINT NOT NULL,
    id_grado_actual BIGINT NOT NULL,
    observaciones VARCHAR(255),
    flg_activo TINYINT DEFAULT 1,
    fec_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fec_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_categoria_talla) REFERENCES categoria_talla (id),
    FOREIGN KEY (id_grado_actual) REFERENCES grado (id)
);

CREATE TABLE IF NOT EXISTS perro_grado_historico (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_perro BIGINT NOT NULL,
    id_grado_anterior BIGINT,
    id_grado_nuevo BIGINT NOT NULL,
    fecha_cambio DATE NOT NULL,
    motivo VARCHAR(120),
    observacion VARCHAR(255),
    id_usuario_registro BIGINT NOT NULL,
    flg_activo TINYINT DEFAULT 1,
    fec_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fec_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_perro) REFERENCES perro (id),
    FOREIGN KEY (id_grado_anterior) REFERENCES grado (id),
    FOREIGN KEY (id_grado_nuevo) REFERENCES grado (id),
    FOREIGN KEY (id_usuario_registro) REFERENCES persona (id)
);

CREATE TABLE IF NOT EXISTS dupla (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_perro BIGINT NOT NULL,
    id_guia_persona BIGINT NOT NULL,
    flg_activo BOOLEAN DEFAULT TRUE,
    fec_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fec_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_perro) REFERENCES perro (id),
    FOREIGN KEY (id_guia_persona) REFERENCES persona (id)
);

-- 3. Organización

CREATE TABLE IF NOT EXISTS organizacion (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL, -- EQUIPO, FILIAL, CNA
    nombre VARCHAR(150) NOT NULL,
    flg_activo BOOLEAN DEFAULT TRUE,
    fec_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fec_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS competencia (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    flg_activo BOOLEAN DEFAULT TRUE,
    fec_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fec_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS competencia_organizacion (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_competencia BIGINT NOT NULL,
    id_organizacion BIGINT NOT NULL,
    flg_activo BOOLEAN DEFAULT TRUE,
    fec_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fec_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_competencia) REFERENCES competencia (id),
    FOREIGN KEY (id_organizacion) REFERENCES organizacion (id)
);

CREATE TABLE IF NOT EXISTS competencia_fecha (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_competencia BIGINT NOT NULL,
    dia_codigo VARCHAR(10) NOT NULL, -- SAT, SUN
    fecha DATE NOT NULL,
    flg_activo BOOLEAN DEFAULT TRUE,
    fec_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fec_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_competencia) REFERENCES competencia (id)
);

-- 4. Pistas y Resultados

CREATE TABLE IF NOT EXISTS pista (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_competencia BIGINT NOT NULL,
    id_competencia_fecha BIGINT NOT NULL,
    id_tipo_pista BIGINT NOT NULL,
    id_grado_base BIGINT NOT NULL,
    id_juez_persona BIGINT,
    longitud_m DECIMAL(10, 2),
    tsr_seg DECIMAL(10, 2),
    tmr_seg DECIMAL(10, 2),
    modo_tsr VARCHAR(20), -- NT, MEJOR_TIEMPO
    velocidad_nt_ms DECIMAL(10, 2),
    mejor_tiempo_ref_seg DECIMAL(10, 2),
    velocidad_calculada_ms DECIMAL(10, 2),
    flg_activo BOOLEAN DEFAULT TRUE,
    fec_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fec_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_competencia) REFERENCES competencia (id),
    FOREIGN KEY (id_competencia_fecha) REFERENCES competencia_fecha (id),
    FOREIGN KEY (id_tipo_pista) REFERENCES tipo_pista (id),
    FOREIGN KEY (id_grado_base) REFERENCES grado (id),
    FOREIGN KEY (id_juez_persona) REFERENCES persona (id)
);

CREATE TABLE IF NOT EXISTS resultado_pista (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_pista BIGINT NOT NULL,
    id_dupla BIGINT NOT NULL,
    id_perro BIGINT NOT NULL,
    categoria_competitiva VARCHAR(20), -- REGULAR, SENIOR
    tiempo_cronometrado_seg DECIMAL(10, 2),
    faltas INT DEFAULT 0,
    rehuses INT DEFAULT 0,
    penalidad_total_seg DECIMAL(10, 2) DEFAULT 0.00,
    tiempo_total_seg DECIMAL(10, 2) DEFAULT 0.00,
    es_eli BOOLEAN DEFAULT FALSE,
    es_elegible_podio BOOLEAN DEFAULT TRUE,
    es_elegible_ranking BOOLEAN DEFAULT TRUE,
    puesto INT,
    puntos_ranking INT DEFAULT 0,
    flg_activo BOOLEAN DEFAULT TRUE,
    fec_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fec_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pista) REFERENCES pista (id),
    FOREIGN KEY (id_dupla) REFERENCES dupla (id),
    FOREIGN KEY (id_perro) REFERENCES perro (id)
);

-- 5. Ranking

CREATE TABLE IF NOT EXISTS temporada (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    anio INT NOT NULL,
    nombre VARCHAR(100),
    flg_activo BOOLEAN DEFAULT TRUE,
    fec_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fec_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ranking_puntaje (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_temporada BIGINT NOT NULL,
    id_resultado_pista BIGINT NOT NULL,
    id_dupla BIGINT NOT NULL,
    puntos INT NOT NULL,
    motivo VARCHAR(255),
    flg_activo BOOLEAN DEFAULT TRUE,
    fec_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fec_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_temporada) REFERENCES temporada (id),
    FOREIGN KEY (id_resultado_pista) REFERENCES resultado_pista (id),
    FOREIGN KEY (id_dupla) REFERENCES dupla (id)
);