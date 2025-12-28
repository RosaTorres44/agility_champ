-- Script de Creación de Base de Datos (Schema)
-- Generado basado en las Entidades de TypeORM (Actualizado)

SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- 1. Tablas Independientes (Maastros)
-- ----------------------------

DROP TABLE IF EXISTS `system_settings`;

CREATE TABLE `system_settings` (
    `id` int NOT NULL AUTO_INCREMENT,
    `key` varchar(255) NOT NULL,
    `value` text NOT NULL,
    `description` varchar(255) DEFAULT NULL,
    `flg_activo` tinyint(1) DEFAULT '1',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uniq_key` (`key`)
);

DROP TABLE IF EXISTS `tipo_persona`;

CREATE TABLE `tipo_persona` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `cod` varchar(255) NOT NULL,
    `nombre` varchar(255) NOT NULL,
    `flg_activo` tinyint(1) DEFAULT '1',
    `fec_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `fec_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uniq_cod` (`cod`)
);

DROP TABLE IF EXISTS `organizacion`;

CREATE TABLE `organizacion` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `nombre` varchar(255) NOT NULL,
    `flg_activo` tinyint(1) DEFAULT '1',
    `fec_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `fec_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `grado`;

CREATE TABLE `grado` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `cod` varchar(255) NOT NULL,
    `nombre` varchar(255) NOT NULL,
    `orden` int NOT NULL,
    `flg_activo` tinyint(1) DEFAULT '1',
    `fec_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `fec_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uniq_cod` (`cod`)
);

DROP TABLE IF EXISTS `categoria_talla`;

CREATE TABLE `categoria_talla` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `cod` varchar(255) NOT NULL,
    `nombre` varchar(255) NOT NULL,
    `orden` int DEFAULT '0',
    `flg_activo` tinyint(1) DEFAULT '1',
    `fec_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `fec_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uniq_cod` (`cod`)
);

DROP TABLE IF EXISTS `raza`;

CREATE TABLE `raza` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `descripcion` varchar(255) NOT NULL,
    `flg_activo` tinyint(1) DEFAULT '1',
    `fec_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `fec_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
);

DROP TABLE IF EXISTS `tipo_pista`;

CREATE TABLE `tipo_pista` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `cod` varchar(255) NOT NULL,
    `nombre` varchar(255) NOT NULL,
    `flg_activo` tinyint(1) DEFAULT '1',
    `fec_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `fec_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uniq_cod` (`cod`)
);

-- ----------------------------
-- 2. Tablas Dependientes Nivel 1
-- ----------------------------

DROP TABLE IF EXISTS `persona`;

CREATE TABLE `persona` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `id_tipo_persona` bigint NOT NULL,
    `nombres` varchar(255) NOT NULL,
    `apellidos` varchar(255) NOT NULL,
    `email` varchar(255) DEFAULT NULL,
    `telefono` varchar(255) DEFAULT NULL,
    `flg_activo` tinyint(1) DEFAULT '1',
    `fec_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `fec_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uniq_email` (`email`),
    KEY `fk_persona_tipo` (`id_tipo_persona`),
    CONSTRAINT `fk_persona_tipo` FOREIGN KEY (`id_tipo_persona`) REFERENCES `tipo_persona` (`id`)
);

DROP TABLE IF EXISTS `competencia`;

CREATE TABLE `competencia` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `nombre` varchar(255) NOT NULL,
    `descripcion` text,
    `fecha_inicio` date NOT NULL,
    `flg_homologada` tinyint NOT NULL DEFAULT '1',
    `numero` int DEFAULT NULL,
    `anio` int DEFAULT NULL,
    `id_organizacion` bigint DEFAULT NULL,
    `id_juez` bigint DEFAULT NULL,
    `flg_activo` tinyint(1) DEFAULT '1',
    `fec_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `fec_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `fk_competencia_org` (`id_organizacion`),
    KEY `fk_competencia_juez` (`id_juez`),
    CONSTRAINT `fk_competencia_org` FOREIGN KEY (`id_organizacion`) REFERENCES `organizacion` (`id`),
    CONSTRAINT `fk_competencia_juez` FOREIGN KEY (`id_juez`) REFERENCES `persona` (`id`)
);

DROP TABLE IF EXISTS `perro`;

CREATE TABLE `perro` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `nombre` varchar(255) NOT NULL,
    `fecha_nacimiento` date DEFAULT NULL,
    `chip` varchar(255) DEFAULT NULL,
    `id_categoria_talla` bigint NOT NULL,
    `id_grado_actual` bigint NOT NULL,
    `id_raza` bigint DEFAULT NULL,
    `observaciones` varchar(255) DEFAULT NULL,
    `flg_activo` tinyint(1) DEFAULT '1',
    `fec_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `fec_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `fk_perro_categoria` (`id_categoria_talla`),
    KEY `fk_perro_grado` (`id_grado_actual`),
    KEY `fk_perro_raza` (`id_raza`),
    CONSTRAINT `fk_perro_categoria` FOREIGN KEY (`id_categoria_talla`) REFERENCES `categoria_talla` (`id`),
    CONSTRAINT `fk_perro_grado` FOREIGN KEY (`id_grado_actual`) REFERENCES `grado` (`id`),
    CONSTRAINT `fk_perro_raza` FOREIGN KEY (`id_raza`) REFERENCES `raza` (`id`)
);

-- ----------------------------
-- 3. Tablas Dependientes Nivel 2
-- ----------------------------

DROP TABLE IF EXISTS `competencia_organizacion`;

CREATE TABLE `competencia_organizacion` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `id_competencia` bigint NOT NULL,
    `id_organizacion` bigint NOT NULL,
    `flg_activo` tinyint(1) DEFAULT '1',
    `fec_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `fec_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `fk_co_competencia` (`id_competencia`),
    KEY `fk_co_organizacion` (`id_organizacion`),
    CONSTRAINT `fk_co_competencia` FOREIGN KEY (`id_competencia`) REFERENCES `competencia` (`id`),
    CONSTRAINT `fk_co_organizacion` FOREIGN KEY (`id_organizacion`) REFERENCES `organizacion` (`id`)
);

DROP TABLE IF EXISTS `dupla`;

CREATE TABLE `dupla` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `id_perro` bigint NOT NULL,
    `id_guia_persona` bigint NOT NULL,
    `flg_activo` tinyint(1) DEFAULT '1',
    `fec_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `fec_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `fk_dupla_perro` (`id_perro`),
    KEY `fk_dupla_guia` (`id_guia_persona`),
    CONSTRAINT `fk_dupla_perro` FOREIGN KEY (`id_perro`) REFERENCES `perro` (`id`),
    CONSTRAINT `fk_dupla_guia` FOREIGN KEY (`id_guia_persona`) REFERENCES `persona` (`id`)
);

DROP TABLE IF EXISTS `pista`;

CREATE TABLE `pista` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `id_competencia` bigint NOT NULL,
    `id_tipo_pista` bigint NOT NULL,
    `id_grado_base` bigint NOT NULL,
    `id_juez_persona` bigint DEFAULT NULL,
    `longitud_m` decimal(10, 2) DEFAULT NULL,
    `obstaculos` int NOT NULL DEFAULT 15,
    `velocidad_elegida_ms` decimal(10, 2) DEFAULT NULL,
    `tsr_seg` decimal(10, 2) DEFAULT NULL,
    `tmr_seg` decimal(10, 2) DEFAULT NULL,
    `estado` enum(
        'creada',
        'armada',
        'en_curso',
        'finalizada'
    ) DEFAULT 'creada',
    `flg_perro_mas_rapido` tinyint(1) DEFAULT '0',
    `modo_tsr` varchar(255) DEFAULT NULL,
    `velocidad_nt_ms` decimal(10, 2) DEFAULT NULL,
    `mejor_tiempo_ref_seg` decimal(10, 2) DEFAULT NULL,
    `velocidad_calculada_ms` decimal(10, 2) DEFAULT NULL,
    `flg_activo` tinyint(1) DEFAULT '1',
    `fec_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `fec_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `fk_pista_competencia` (`id_competencia`),
    KEY `fk_pista_tipo` (`id_tipo_pista`),
    KEY `fk_pista_grado` (`id_grado_base`),
    KEY `fk_pista_juez` (`id_juez_persona`),
    CONSTRAINT `fk_pista_competencia` FOREIGN KEY (`id_competencia`) REFERENCES `competencia` (`id`),
    CONSTRAINT `fk_pista_tipo` FOREIGN KEY (`id_tipo_pista`) REFERENCES `tipo_pista` (`id`),
    CONSTRAINT `fk_pista_grado` FOREIGN KEY (`id_grado_base`) REFERENCES `grado` (`id`),
    CONSTRAINT `fk_pista_juez` FOREIGN KEY (`id_juez_persona`) REFERENCES `persona` (`id`)
);

-- ----------------------------
-- 4. Tablas Operacionales (Inscripciones, Resultados, Ranking)
-- ----------------------------

DROP TABLE IF EXISTS `inscripcion`;

CREATE TABLE `inscripcion` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `id_pista` bigint NOT NULL,
    `id_dupla` bigint NOT NULL,
    `flg_activo` tinyint(1) DEFAULT '1',
    `fec_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `fec_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `fk_inscripcion_pista` (`id_pista`),
    KEY `fk_inscripcion_dupla` (`id_dupla`),
    CONSTRAINT `fk_inscripcion_pista` FOREIGN KEY (`id_pista`) REFERENCES `pista` (`id`),
    CONSTRAINT `fk_inscripcion_dupla` FOREIGN KEY (`id_dupla`) REFERENCES `dupla` (`id`)
);

DROP TABLE IF EXISTS `resultado_pista`;

CREATE TABLE `resultado_pista` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `id_inscripcion` bigint DEFAULT NULL,
    `id_pista` bigint NOT NULL,
    `id_dupla` bigint NOT NULL,
    `id_perro` bigint NOT NULL,
    `categoria_competitiva` varchar(255) DEFAULT NULL,
    `tiempo_cronometrado_seg` decimal(10, 2) DEFAULT NULL,
    `faltas` int NOT NULL DEFAULT '0',
    `rehuses` int NOT NULL DEFAULT '0',
    `penalidad_total_seg` decimal(10, 2) DEFAULT '0.00',
    `tiempo_total_seg` decimal(10, 2) DEFAULT '0.00',
    `es_eli` tinyint(1) NOT NULL DEFAULT '0',
    `es_elegible_podio` tinyint(1) NOT NULL DEFAULT '1',
    `es_elegible_ranking` tinyint(1) NOT NULL DEFAULT '1',
    `puesto` int DEFAULT NULL,
    `puntos_ranking` int NOT NULL DEFAULT '0',
    `flg_activo` tinyint(1) DEFAULT '1',
    `fec_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `fec_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `fk_resultado_inscripcion` (`id_inscripcion`),
    KEY `fk_resultado_pista` (`id_pista`),
    KEY `fk_resultado_dupla` (`id_dupla`),
    KEY `fk_resultado_perro` (`id_perro`),
    CONSTRAINT `fk_resultado_inscripcion` FOREIGN KEY (`id_inscripcion`) REFERENCES `inscripcion` (`id`),
    CONSTRAINT `fk_resultado_pista` FOREIGN KEY (`id_pista`) REFERENCES `pista` (`id`),
    CONSTRAINT `fk_resultado_dupla` FOREIGN KEY (`id_dupla`) REFERENCES `dupla` (`id`),
    CONSTRAINT `fk_resultado_perro` FOREIGN KEY (`id_perro`) REFERENCES `perro` (`id`)
);

DROP TABLE IF EXISTS `ranking_puntaje`;

CREATE TABLE `ranking_puntaje` (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `anio` int NOT NULL DEFAULT '2024',
    `id_resultado_pista` bigint NOT NULL,
    `id_dupla` bigint NOT NULL,
    `puntos` int NOT NULL,
    `motivo` varchar(255) DEFAULT NULL,
    `flg_activo` tinyint(1) DEFAULT '1',
    `fec_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `fec_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uniq_ranking_composite` (
        `anio`,
        `id_dupla`,
        `id_resultado_pista`
    ),
    KEY `fk_ranking_resultado` (`id_resultado_pista`),
    KEY `fk_ranking_dupla` (`id_dupla`),
    CONSTRAINT `fk_ranking_dupla` FOREIGN KEY (`id_dupla`) REFERENCES `dupla` (`id`),
    CONSTRAINT `fk_ranking_resultado` FOREIGN KEY (`id_resultado_pista`) REFERENCES `resultado_pista` (`id`)
);

SET FOREIGN_KEY_CHECKS = 1;

SELECT 'Base de datos generada correctamente.' as status;