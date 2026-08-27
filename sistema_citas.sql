

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


CREATE TABLE `citas` (
  `cod` int NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `cupos_totales` int NOT NULL,
  `cupos_disponibles` int NOT NULL,
  `cod_usuario_prestador` int NOT NULL,
  `fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


INSERT INTO `citas` (`cod`, `descripcion`, `cupos_totales`, `cupos_disponibles`, `cod_usuario_prestador`, `fecha`) VALUES
(1, 'cita1', 5, 4, 1, '2026-08-23'),
(2, 'EDwin cita 2', 5, 4, 3, '2026-09-03');



CREATE TABLE `cupos` (
  `cod_cita` int NOT NULL,
  `cod_usuario_solicitante` int NOT NULL,
  `usuarios_rolescod_rol` int NOT NULL DEFAULT '1',
  `cod_usuario_solicitante_fk` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


INSERT INTO `cupos` (`cod_cita`, `cod_usuario_solicitante`, `usuarios_rolescod_rol`, `cod_usuario_solicitante_fk`) VALUES
(1, 2, 1, 2),
(2, 2, 1, 2);



CREATE TABLE `roles` (
  `cod` int NOT NULL,
  `descripcion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



INSERT INTO `roles` (`cod`, `descripcion`) VALUES
(1, 'Solicitante'),
(2, 'Prestador');



CREATE TABLE `solicitantes` (
  `cod_usuario` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



INSERT INTO `solicitantes` (`cod_usuario`) VALUES
(2);



CREATE TABLE `usuarios` (
  `cod` int NOT NULL,
  `usuario` varchar(255) NOT NULL,
  `clave` varchar(255) NOT NULL,
  `razon_social` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



INSERT INTO `usuarios` (`cod`, `usuario`, `clave`, `razon_social`) VALUES
(1, 'edwinbb', '$2b$10$uyYsdtVeIHzxfClRwx5qduf.TAtgoFa95plOzRP.V4QaX1Ov/Ap5y', NULL),
(2, 'edwinsoli', '$2b$10$zBLzKwcrk28jiM0FTE0hI.lDyhiqUTOc.HqGGbc8jJtcBgDupL9Pa', NULL),
(3, 'Pedwin', '$2b$10$MPwb226QNFbz9F0GdTPTAeB6qFXTWZakrQ6s3eMSDP/c1x4bTD6Um', NULL);


CREATE TABLE `usuarios_roles` (
  `cod_usuario` int NOT NULL,
  `cod_rol` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


INSERT INTO `usuarios_roles` (`cod_usuario`, `cod_rol`) VALUES
(2, 1),
(1, 2),
(3, 2);


ALTER TABLE `citas`
  ADD PRIMARY KEY (`cod`),
  ADD KEY `cod_usuario_prestador` (`cod_usuario_prestador`);


ALTER TABLE `cupos`
  ADD PRIMARY KEY (`cod_cita`,`cod_usuario_solicitante`),
  ADD KEY `cod_usuario_solicitante` (`cod_usuario_solicitante`);


ALTER TABLE `roles`
  ADD PRIMARY KEY (`cod`);

--
-- Indices de la tabla `solicitantes`
--
ALTER TABLE `solicitantes`
  ADD PRIMARY KEY (`cod_usuario`);


ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`cod`),
  ADD UNIQUE KEY `usuario` (`usuario`);


ALTER TABLE `usuarios_roles`
  ADD PRIMARY KEY (`cod_usuario`,`cod_rol`),
  ADD KEY `cod_rol` (`cod_rol`);


ALTER TABLE `citas`
  MODIFY `cod` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;


ALTER TABLE `roles`
  MODIFY `cod` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;


ALTER TABLE `usuarios`
  MODIFY `cod` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;


ALTER TABLE `cupos`
  ADD CONSTRAINT `cupos_ibfk_1` FOREIGN KEY (`cod_cita`) REFERENCES `citas` (`cod`) ON DELETE CASCADE,
  ADD CONSTRAINT `cupos_ibfk_2` FOREIGN KEY (`cod_usuario_solicitante`) REFERENCES `solicitantes` (`cod_usuario`) ON DELETE CASCADE;


ALTER TABLE `solicitantes`
  ADD CONSTRAINT `solicitantes_ibfk_1` FOREIGN KEY (`cod_usuario`) REFERENCES `usuarios` (`cod`) ON DELETE CASCADE;


ALTER TABLE `usuarios_roles`
  ADD CONSTRAINT `usuarios_roles_ibfk_1` FOREIGN KEY (`cod_usuario`) REFERENCES `usuarios` (`cod`) ON DELETE CASCADE,
  ADD CONSTRAINT `usuarios_roles_ibfk_2` FOREIGN KEY (`cod_rol`) REFERENCES `roles` (`cod`) ON DELETE CASCADE;



CREATE TABLE `prestadores` (
  `cod_usuario` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



INSERT INTO `prestadores` (`cod_usuario`)
SELECT `cod_usuario` FROM `usuarios_roles` WHERE `cod_rol` = 2;

ALTER TABLE `prestadores`
  ADD PRIMARY KEY (`cod_usuario`);

ALTER TABLE `prestadores`
  ADD CONSTRAINT `prestadores_ibfk_1` FOREIGN KEY (`cod_usuario`) REFERENCES `usuarios` (`cod`) ON DELETE CASCADE;


ALTER TABLE `citas`
  ADD CONSTRAINT `citas_ibfk_1` FOREIGN KEY (`cod_usuario_prestador`) REFERENCES `prestadores` (`cod_usuario`) ON DELETE CASCADE;

--
-- Estructura de tabla para la tabla `solicitantes_prestadores`
--

CREATE TABLE `solicitantes_prestadores` (
  `cod_usuario_solicitante` int NOT NULL,
  `cod_usuario_prestador` int NOT NULL,
  `creado_en` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE `solicitantes_prestadores`
  ADD PRIMARY KEY (`cod_usuario_solicitante`,`cod_usuario_prestador`),
  ADD KEY `cod_usuario_prestador` (`cod_usuario_prestador`);

ALTER TABLE `solicitantes_prestadores`
  ADD CONSTRAINT `solicitantes_prestadores_ibfk_1` FOREIGN KEY (`cod_usuario_solicitante`) REFERENCES `solicitantes` (`cod_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `solicitantes_prestadores_ibfk_2` FOREIGN KEY (`cod_usuario_prestador`) REFERENCES `prestadores` (`cod_usuario`) ON DELETE CASCADE;


INSERT INTO `solicitantes_prestadores` (`cod_usuario_solicitante`, `cod_usuario_prestador`) VALUES
(2, 1),
(2, 3);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
