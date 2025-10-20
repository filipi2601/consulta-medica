-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema Modelo_Logico
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `Modelo_Logico` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `Modelo_Logico`;

-- -----------------------------------------------------
-- Table `Pacientes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Pacientes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `cpf` VARCHAR(20) NOT NULL,
  `data_nascimento` DATE NOT NULL,
  `telefone` VARCHAR(25) NULL,
  `email` VARCHAR(50) NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cpf_UNIQUE` (`cpf`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `Especialidades`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Especialidades` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nome_UNIQUE` (`nome`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `Medicos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Medicos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `crm` VARCHAR(15) NOT NULL,
  `email` VARCHAR(50) NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `crm_UNIQUE` (`crm`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `Medico_Especialidade`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Medico_Especialidade` (
  `id_medico` INT NOT NULL,
  `id_especialidade` INT NOT NULL,
  PRIMARY KEY (`id_medico`, `id_especialidade`),
  KEY `fk_medico_especialidade_especialidades_idx` (`id_especialidade`),
  CONSTRAINT `fk_medico_especialidade_medicos`
    FOREIGN KEY (`id_medico`) REFERENCES `Medicos` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_medico_especialidade_especialidades`
    FOREIGN KEY (`id_especialidade`) REFERENCES `Especialidades` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `Consultas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Consultas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `idPaciente` INT NOT NULL,
  `idMedico` INT NOT NULL,
  `data_agendamento` DATETIME NOT NULL,
  `status` ENUM('Agendada', 'Cancelada', 'Realizada') NOT NULL DEFAULT 'Agendada',
  `observacoes` VARCHAR(200) NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_medico_horario_unico` (`idMedico`, `data_agendamento`),
  CONSTRAINT `fk_Consultas_Pacientes`
    FOREIGN KEY (`idPaciente`) REFERENCES `Pacientes` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_Consultas_Medicos`
    FOREIGN KEY (`idMedico`) REFERENCES `Medicos` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Restore settings
-- -----------------------------------------------------
SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;