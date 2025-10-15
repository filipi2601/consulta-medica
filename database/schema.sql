-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema Modelo_Logico
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema Modelo_Logico
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `Modelo_Logico` DEFAULT CHARACTER SET utf8 ;
USE `Modelo_Logico` ;

-- -----------------------------------------------------
-- Table `Modelo_Logico`.`Pacientes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Modelo_Logico`.`Pacientes` (
  `idPaciente` INT NOT NULL AUTO_INCREMENT,
  `nomePaciente` VARCHAR(100) NOT NULL,
  `cpfPaciente` VARCHAR(20) NOT NULL,
  `data_nascimentoPaciente` DATE NOT NULL,
  `telefonePaciente` VARCHAR(25) NULL,
  `emailPaciente` VARCHAR(50) NULL,
  PRIMARY KEY (`idPaciente`),
  UNIQUE INDEX `idPacientes_UNIQUE` (`idPaciente` ASC) VISIBLE,
  UNIQUE INDEX `emailPaciente_UNIQUE` (`emailPaciente` ASC) VISIBLE,
  UNIQUE INDEX `cpfPaciente_UNIQUE` (`cpfPaciente` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Modelo_Logico`.`Especialidades`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Modelo_Logico`.`Especialidades` (
  `idEspecialidade` INT NOT NULL AUTO_INCREMENT,
  `nomeEspecialidade` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`idEspecialidade`),
  UNIQUE INDEX `idEspecialidades_UNIQUE` (`idEspecialidade` ASC) VISIBLE,
  UNIQUE INDEX `nomeEspecialidade_UNIQUE` (`nomeEspecialidade` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Modelo_Logico`.`Medicos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Modelo_Logico`.`Medicos` (
  `idMedico` INT NOT NULL AUTO_INCREMENT,
  `nomeMedico` VARCHAR(100) NOT NULL,
  `crmMedico` VARCHAR(15) NOT NULL,
  `emailMedico` VARCHAR(50) NULL,
  PRIMARY KEY (`idMedico`),
  UNIQUE INDEX `idMedico_UNIQUE` (`idMedico` ASC) VISIBLE,
  UNIQUE INDEX `crmMedico_UNIQUE` (`crmMedico` ASC) VISIBLE,
  UNIQUE INDEX `emailMedico_UNIQUE` (`emailMedico` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Modelo_Logico`.`Medico_Especialidade`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Modelo_Logico`.`Medico_Especialidade` (
  `id_medico` INT NOT NULL,
  `id_especialidade` INT NOT NULL,
  PRIMARY KEY (`id_medico`, `id_especialidade`),
  INDEX `fk_medico_especialidade_especialidades_idx` (`id_especialidade` ASC) VISIBLE,
  CONSTRAINT `fk_medico_especialidade_medicos`
    FOREIGN KEY (`id_medico`)
    REFERENCES `Modelo_Logico`.`Medicos` (`idMedico`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_medico_especialidade_especialidades`
    FOREIGN KEY (`id_especialidade`)
    REFERENCES `Modelo_Logico`.`Especialidades` (`idEspecialidade`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Modelo_Logico`.`Consultas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Modelo_Logico`.`Consultas` (
  `idConsulta` INT NOT NULL AUTO_INCREMENT,
  `idPaciente` INT NOT NULL,
  `idMedico` INT NOT NULL,
  `data_agendamentoConsulta` DATETIME NOT NULL,
  `statusConsulta` ENUM('Agendada', 'Cancelada', 'Realizada') NOT NULL DEFAULT 'Agendada',
  `observacoesConsulta` VARCHAR(200) NULL,
  PRIMARY KEY (`idConsulta`),
  UNIQUE INDEX `idx_medico_horario_unico` (`idMedico` ASC, `data_agendamentoConsulta` ASC) VISIBLE,
  UNIQUE INDEX `idConsulta_UNIQUE` (`idConsulta` ASC) VISIBLE,
  CONSTRAINT `fk_Consultas_Pacientes`
    FOREIGN KEY (`idPaciente`)
    REFERENCES `Modelo_Logico`.`Pacientes` (`idPaciente`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Consultas_Medicos`
    FOREIGN KEY (`idMedico`)
    REFERENCES `Modelo_Logico`.`Medicos` (`idMedico`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;