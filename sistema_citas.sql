-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 23-08-2026 a las 02:25:40
-- Versión del servidor: 8.0.46-0ubuntu0.24.04.3
-- Versión de PHP: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sistema_citas`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `citas`
--

CREATE TABLE `citas` (
  `cod` int NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `cupos_totales` int NOT NULL,
  `cupos_disponibles` int NOT NULL,
  `cod_usuario_prestador` int NOT NULL,
  `fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `citas`
--

INSERT INTO `citas` (`cod`, `descripcion`, `cupos_totales`, `cupos_disponibles`, `cod_usuario_prestador`, `fecha`) VALUES
(1, 'cita1', 5, 4, 1, '2026-08-23'),
(2, 'EDwin cita 2', 5, 4, 3, '2026-09-03');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cupos`
--

CREATE TABLE `cupos` (
  `cod_cita` int NOT NULL,
  `cod_usuario_solicitante` int NOT NULL,
  `usuarios_rolescod_rol` int NOT NULL DEFAULT '1',
  `cod_usuario_solicitante_fk` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `cupos`
--

INSERT INTO `cupos` (`cod_cita`, `cod_usuario_solicitante`, `usuarios_rolescod_rol`, `cod_usuario_solicitante_fk`) VALUES
(1, 2, 1, 2),
(2, 2, 1, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `cod` int NOT NULL,
  `descripcion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`cod`, `descripcion`) VALUES
(1, 'Solicitante'),
(2, 'Prestador');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitantes`
--

CREATE TABLE `solicitantes` (
  `cod_usuario` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `solicitantes`
--

INSERT INTO `solicitantes` (`cod_usuario`) VALUES
(2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `cod` int NOT NULL,
  `usuario` varchar(255) NOT NULL,
  `clave` varchar(255) NOT NULL,
  `razon_social` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`cod`, `usuario`, `clave`, `razon_social`) VALUES
(1, 'edwinbb', '$2b$10$uyYsdtVeIHzxfClRwx5qduf.TAtgoFa95plOzRP.V4QaX1Ov/Ap5y', NULL),
(2, 'edwinsoli', '$2b$10$zBLzKwcrk28jiM0FTE0hI.lDyhiqUTOc.HqGGbc8jJtcBgDupL9Pa', NULL),
(3, 'Pedwin', '$2b$10$MPwb226QNFbz9F0GdTPTAeB6qFXTWZakrQ6s3eMSDP/c1x4bTD6Um', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios_roles`
--

CREATE TABLE `usuarios_roles` (
  `cod_usuario` int NOT NULL,
  `cod_rol` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `usuarios_roles`
--

INSERT INTO `usuarios_roles` (`cod_usuario`, `cod_rol`) VALUES
(2, 1),
(1, 2),
(3, 2);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `citas`
--
ALTER TABLE `citas`
  ADD PRIMARY KEY (`cod`),
  ADD KEY `cod_usuario_prestador` (`cod_usuario_prestador`);

--
-- Indices de la tabla `cupos`
--
ALTER TABLE `cupos`
  ADD PRIMARY KEY (`cod_cita`,`cod_usuario_solicitante`),
  ADD KEY `cod_usuario_solicitante` (`cod_usuario_solicitante`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`cod`);

--
-- Indices de la tabla `solicitantes`
--
ALTER TABLE `solicitantes`
  ADD PRIMARY KEY (`cod_usuario`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`cod`),
  ADD UNIQUE KEY `usuario` (`usuario`);

--
-- Indices de la tabla `usuarios_roles`
--
ALTER TABLE `usuarios_roles`
  ADD PRIMARY KEY (`cod_usuario`,`cod_rol`),
  ADD KEY `cod_rol` (`cod_rol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `citas`
--
ALTER TABLE `citas`
  MODIFY `cod` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `cod` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `cod` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cupos`
--
ALTER TABLE `cupos`
  ADD CONSTRAINT `cupos_ibfk_1` FOREIGN KEY (`cod_cita`) REFERENCES `citas` (`cod`) ON DELETE CASCADE,
  ADD CONSTRAINT `cupos_ibfk_2` FOREIGN KEY (`cod_usuario_solicitante`) REFERENCES `solicitantes` (`cod_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `solicitantes`
--
ALTER TABLE `solicitantes`
  ADD CONSTRAINT `solicitantes_ibfk_1` FOREIGN KEY (`cod_usuario`) REFERENCES `usuarios` (`cod`) ON DELETE CASCADE;

--
-- Filtros para la tabla `usuarios_roles`
--
ALTER TABLE `usuarios_roles`
  ADD CONSTRAINT `usuarios_roles_ibfk_1` FOREIGN KEY (`cod_usuario`) REFERENCES `usuarios` (`cod`) ON DELETE CASCADE,
  ADD CONSTRAINT `usuarios_roles_ibfk_2` FOREIGN KEY (`cod_rol`) REFERENCES `roles` (`cod`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
