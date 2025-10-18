CREATE TABLE IF NOT EXISTS `Modelo_Logico`.`Pacientes` (
  `idPaciente` INT NOT NULL AUTO_INCREMENT,
  `nomePaciente` VARCHAR(100) NOT NULL,
  `cpfPaciente` VARCHAR(20) NOT NULL,
  `data_nascimentoPaciente` DATE NOT NULL,
  `telefonePaciente` VARCHAR(25) NULL DEFAULT NULL,
  `emailPaciente` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`idPaciente`),
  UNIQUE INDEX `emailPaciente_UNIQUE` (`emailPaciente` ASC) VISIBLE,
  UNIQUE INDEX `cpfPaciente_UNIQUE` (`cpfPaciente` ASC) VISIBLE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `Modelo_Logico`.`Especialidades` (
  `idEspecialidade` INT NOT NULL AUTO_INCREMENT,
  `nomeEspecialidade` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`idEspecialidade`),
  UNIQUE INDEX `nomeEspecialidade_UNIQUE` (`nomeEspecialidade` ASC) VISIBLE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `Modelo_Logico`.`Medicos` (
  `idMedico` INT NOT NULL AUTO_INCREMENT,
  `nomeMedico` VARCHAR(100) NOT NULL,
  `crmMedico` VARCHAR(15) NOT NULL,
  `emailMedico` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`idMedico`),
  UNIQUE INDEX `crmMedico_UNIQUE` (`crmMedico` ASC) VISIBLE,
  UNIQUE INDEX `emailMedico_UNIQUE` (`emailMedico` ASC) VISIBLE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `Modelo_Logico`.`Medico_Especialidade` (
  `id_medico` INT NOT NULL,
  `id_especialidade` INT NOT NULL,
  PRIMARY KEY (`id_medico`, `id_especialidade`),
  INDEX `fk_medico_especialidade_especialidades_idx` (`id_especialidade` ASC) VISIBLE,
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
  `idConsulta` INT NOT NULL AUTO_INCREMENT,
  `idPaciente` INT NOT NULL,
  `idMedico` INT NOT NULL,
  `data_agendamentoConsulta` DATETIME NOT NULL,
  `statusConsulta` ENUM('Agendada', 'Cancelada', 'Realizada') NOT NULL DEFAULT 'Agendada',
  `observacoesConsulta` VARCHAR(200) NULL DEFAULT NULL,
  PRIMARY KEY (`idConsulta`),
  UNIQUE INDEX `idx_medico_horario_unico` (`idMedico` ASC, `data_agendamentoConsulta` ASC) VISIBLE,
  CONSTRAINT `fk_Consultas_Pacientes`
    FOREIGN KEY (`idPaciente`)
    REFERENCES `Modelo_Logico`.`Pacientes` (`idPaciente`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_Consultas_Medicos`
    FOREIGN KEY (`idMedico`)
    REFERENCES `Modelo_Logico`.`Medicos` (`idMedico`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;