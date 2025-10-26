SET FOREIGN_KEY_CHECKS = 0; 


TRUNCATE TABLE `Modelo_Logico`.`Consultas`;
TRUNCATE TABLE `Modelo_Logico`.`Medico_Especialidade`;
TRUNCATE TABLE `Modelo_Logico`.`Medicos`;
TRUNCATE TABLE `Modelo_Logico`.`Pacientes`;
TRUNCATE TABLE `Modelo_Logico`.`Especialidades`; 

SET FOREIGN_KEY_CHECKS = 1; 

INSERT INTO `Especialidades` (nome) VALUES
('Cardiologia'), ('Dermatologia'), ('Ortopedia'), ('Pediatria'), ('Ginecologia'), ('Clínica Geral');


INSERT INTO `Pacientes` (nome, cpf, data_nascimento, telefone, email) VALUES
('Ana Silva', '111.111.111-11', '1990-05-15', '(11) 91111-1111', 'ana.silva@email.com'),
('Bruno Costa', '222.222.222-22', '1985-02-20', '(11) 92222-2222', 'bruno.costa@email.com'),
('Carla Dias', '333.333.333-33', '2000-11-30', NULL, 'carla.dias@email.com'),
('Daniel Moreira', '444.444.444-44', '1995-08-01', '(11) 94444-4444', 'daniel.moreira@email.com'),
('Elisa Fernandes', '555.555.555-55', '1988-12-10', '(11) 95555-5555', 'elisa.fernandes@email.com');

INSERT INTO `Medicos` (nome, crm, email) VALUES
('Dr. Carlos Oliveira', '12345-SP', 'carlos.oliveira@clinica.com'),
('Dra. Sofia Martins', '67890-RJ', 'sofia.martins@clinica.com'),
('Dr. Lucas Almeida', '11223-MG', 'lucas.almeida@clinica.com'),
('Dra. Beatriz Santos', '44556-SP', 'beatriz.santos@clinica.com'),
('Dr. Rafael Pereira', '77889-BA', 'rafael.pereira@clinica.com');


INSERT INTO `Medico_Especialidade` (id_medico, id_especialidade) VALUES
(1, 1), (2, 2), (3, 3), (4, 4), (4, 6), (5, 5);