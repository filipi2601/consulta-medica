CREATE TABLE IF NOT EXISTS `Modelo_Logico`.`Pacientes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `cpf` VARCHAR(20) NOT NULL,
  `data_nascimento` DATE NOT NULL,
  `telefone` VARCHAR(25) NULL DEFAULT NULL,
  `email` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC),
  UNIQUE INDEX `cpf_UNIQUE` (`cpf` ASC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `Modelo_Logico`.`Especialidades` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `nome_UNIQUE` (`nome` ASC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `Modelo_Logico`.`Medicos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `crm` VARCHAR(15) NOT NULL,
  `email` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `crm_UNIQUE` (`crm` ASC),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `Modelo_Logico`.`Medico_Especialidade` (
  `id_medico` INT NOT NULL,
  `id_especialidade` INT NOT NULL,
  PRIMARY KEY (`id_medico`, `id_especialidade`),
  INDEX `fk_medico_especialidade_especialidades_idx` (`id_especialidade` ASC),
  CONSTRAINT `fk_medico_especialidade_medicos`
    FOREIGN KEY (`id_medico`)
    REFERENCES `Modelo_Logico`.`Medicos` (`idMedico`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_medico_especialidade_especialidades`
    FOREIGN KEY (`id_especialidade`)
    REFERENCES `Modelo_Logico`.`Especialidades` (`idEspecialidade`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `Modelo_Logico`.`Consultas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `idPaciente` INT NOT NULL,
  `idMedico` INT NOT NULL,
  `data_agendamento` DATETIME NOT NULL,
  `status` ENUM('Agendada', 'Cancelada', 'Realizada') NOT NULL DEFAULT 'Agendada',
  `observacoes` VARCHAR(200) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_medico_horario_unico` (`idMedico` ASC, `data_agendamento` ASC),
  CONSTRAINT `fk_Consultas_Pacientes`
    FOREIGN KEY (`idPaciente`)
    REFERENCES `Modelo_Logico`.`Pacientes` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_Consultas_Medicos`
    FOREIGN KEY (`idMedico`)
    REFERENCES `Modelo_Logico`.`Medicos` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;