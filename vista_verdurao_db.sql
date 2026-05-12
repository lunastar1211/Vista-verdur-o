CREATE DATABASE  IF NOT EXISTS `db_vv` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `db_vv`;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: db_vv
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alerta_produto`
--

DROP TABLE IF EXISTS `alerta_produto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alerta_produto` (
  `id_alerta` int NOT NULL AUTO_INCREMENT,
  `dias_sem_v` int DEFAULT NULL,
  `status_alerta` varchar(100) DEFAULT NULL,
  `data_deteccao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `id_var` int DEFAULT NULL,
  `id_estoque` int DEFAULT NULL,
  PRIMARY KEY (`id_alerta`),
  UNIQUE KEY `id_alerta` (`id_alerta`),
  KEY `id_var` (`id_var`),
  KEY `id_estoque` (`id_estoque`),
  CONSTRAINT `alerta_produto_ibfk_1` FOREIGN KEY (`id_var`) REFERENCES `variacoes_produto` (`id_var`),
  CONSTRAINT `alerta_produto_ibfk_2` FOREIGN KEY (`id_estoque`) REFERENCES `estoque` (`id_Estoque`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alerta_produto`
--

LOCK TABLES `alerta_produto` WRITE;
/*!40000 ALTER TABLE `alerta_produto` DISABLE KEYS */;
/*!40000 ALTER TABLE `alerta_produto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `base_conhecimento`
--

DROP TABLE IF EXISTS `base_conhecimento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `base_conhecimento` (
  `id_conhecimento` int NOT NULL AUTO_INCREMENT,
  `tipo` varchar(100) NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `conteudo` text NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_conhecimento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `base_conhecimento`
--

LOCK TABLES `base_conhecimento` WRITE;
/*!40000 ALTER TABLE `base_conhecimento` DISABLE KEYS */;
/*!40000 ALTER TABLE `base_conhecimento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente` (
  `id_cliente` int NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(200) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_cliente`),
  UNIQUE KEY `id_cliente` (`id_cliente`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estoque`
--

DROP TABLE IF EXISTS `estoque`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estoque` (
  `id_Estoque` int NOT NULL AUTO_INCREMENT,
  `id_var` int DEFAULT NULL,
  `localizacao` varchar(100) NOT NULL,
  `saldo_disponivel` int NOT NULL,
  `uptaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_Estoque`),
  UNIQUE KEY `id_Estoque` (`id_Estoque`),
  KEY `id_var` (`id_var`),
  CONSTRAINT `estoque_ibfk_1` FOREIGN KEY (`id_var`) REFERENCES `variacoes_produto` (`id_var`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estoque`
--

LOCK TABLES `estoque` WRITE;
/*!40000 ALTER TABLE `estoque` DISABLE KEYS */;
/*!40000 ALTER TABLE `estoque` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_venda`
--

DROP TABLE IF EXISTS `item_venda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_venda` (
  `id_item` int NOT NULL AUTO_INCREMENT,
  `quantidade` int NOT NULL,
  `preco` decimal(10,2) NOT NULL,
  `id_venda` int DEFAULT NULL,
  `id_var` int DEFAULT NULL,
  PRIMARY KEY (`id_item`),
  KEY `id_venda` (`id_venda`),
  KEY `id_var` (`id_var`),
  CONSTRAINT `item_venda_ibfk_1` FOREIGN KEY (`id_venda`) REFERENCES `venda` (`id_venda`),
  CONSTRAINT `item_venda_ibfk_2` FOREIGN KEY (`id_var`) REFERENCES `variacoes_produto` (`id_var`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_venda`
--

LOCK TABLES `item_venda` WRITE;
/*!40000 ALTER TABLE `item_venda` DISABLE KEYS */;
/*!40000 ALTER TABLE `item_venda` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log_auditoria`
--

DROP TABLE IF EXISTS `log_auditoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `log_auditoria` (
  `id_log` int NOT NULL AUTO_INCREMENT,
  `tipo_evento` varchar(100) NOT NULL,
  `id_referencia` int DEFAULT NULL,
  `score_confianca` int DEFAULT NULL,
  `motivo` varchar(500) DEFAULT NULL,
  `contexto` varchar(500) DEFAULT NULL,
  `id_usuario` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_log`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `log_auditoria_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log_auditoria`
--

LOCK TABLES `log_auditoria` WRITE;
/*!40000 ALTER TABLE `log_auditoria` DISABLE KEYS */;
/*!40000 ALTER TABLE `log_auditoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificacao`
--

DROP TABLE IF EXISTS `notificacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificacao` (
  `id_notificacao` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `tipo` varchar(100) NOT NULL,
  `mensagem` varchar(500) NOT NULL,
  `lida` tinyint(1) DEFAULT '0',
  `data_criacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_notificacao`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `notificacao_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificacao`
--

LOCK TABLES `notificacao` WRITE;
/*!40000 ALTER TABLE `notificacao` DISABLE KEYS */;
/*!40000 ALTER TABLE `notificacao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `previsao_tendencia`
--

DROP TABLE IF EXISTS `previsao_tendencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `previsao_tendencia` (
  `id_previsao` int NOT NULL AUTO_INCREMENT,
  `periodo_ref` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `vendas_previstas` int NOT NULL,
  `calc_mae` int NOT NULL,
  `data_geracao` datetime NOT NULL,
  `id_var` int DEFAULT NULL,
  PRIMARY KEY (`id_previsao`),
  UNIQUE KEY `id_previsao` (`id_previsao`),
  KEY `id_var` (`id_var`),
  CONSTRAINT `previsao_tendencia_ibfk_1` FOREIGN KEY (`id_var`) REFERENCES `variacoes_produto` (`id_var`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `previsao_tendencia`
--

LOCK TABLES `previsao_tendencia` WRITE;
/*!40000 ALTER TABLE `previsao_tendencia` DISABLE KEYS */;
/*!40000 ALTER TABLE `previsao_tendencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produto`
--

DROP TABLE IF EXISTS `produto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produto` (
  `SKU` int NOT NULL,
  `nome` varchar(100) NOT NULL,
  `categoria` varchar(100) NOT NULL,
  PRIMARY KEY (`SKU`),
  UNIQUE KEY `SKU` (`SKU`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produto`
--

LOCK TABLES `produto` WRITE;
/*!40000 ALTER TABLE `produto` DISABLE KEYS */;
/*!40000 ALTER TABLE `produto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `relatorio_ia`
--

DROP TABLE IF EXISTS `relatorio_ia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `relatorio_ia` (
  `id_relatorio` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `conteudo` text NOT NULL,
  `data_geracao` datetime NOT NULL,
  PRIMARY KEY (`id_relatorio`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `relatorio_ia_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `relatorio_ia`
--

LOCK TABLES `relatorio_ia` WRITE;
/*!40000 ALTER TABLE `relatorio_ia` DISABLE KEYS */;
/*!40000 ALTER TABLE `relatorio_ia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sugestao_promo`
--

DROP TABLE IF EXISTS `sugestao_promo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sugestao_promo` (
  `id_sugestao` int NOT NULL AUTO_INCREMENT,
  `desconto_sugerido` decimal(5,2) NOT NULL,
  `justificativa` varchar(500) NOT NULL,
  `score_confianca` int NOT NULL,
  `status_decisao` varchar(200) NOT NULL,
  `data_geracao` datetime NOT NULL,
  `data_decisao` datetime NOT NULL,
  `id_alerta` int DEFAULT NULL,
  `id_usuario` int DEFAULT NULL,
  PRIMARY KEY (`id_sugestao`),
  UNIQUE KEY `id_sugestao` (`id_sugestao`),
  KEY `id_alerta` (`id_alerta`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `sugestao_promo_ibfk_1` FOREIGN KEY (`id_alerta`) REFERENCES `alerta_produto` (`id_alerta`),
  CONSTRAINT `sugestao_promo_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sugestao_promo`
--

LOCK TABLES `sugestao_promo` WRITE;
/*!40000 ALTER TABLE `sugestao_promo` DISABLE KEYS */;
/*!40000 ALTER TABLE `sugestao_promo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha_hash` varchar(200) NOT NULL,
  `tipo` enum('GESTOR','ANALISTA') NOT NULL,
  `provider` enum('LOCAL','GOOGLE') NOT NULL,
  `ativo` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `id_usuario` (`id_usuario`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `variacoes_produto`
--

DROP TABLE IF EXISTS `variacoes_produto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `variacoes_produto` (
  `id_var` int NOT NULL AUTO_INCREMENT,
  `SKU` int DEFAULT NULL,
  `tamanho` enum('PP','P','M','G','GG') NOT NULL,
  `cor` varchar(100) NOT NULL,
  `preco` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id_var`),
  KEY `SKU` (`SKU`),
  CONSTRAINT `variacoes_produto_ibfk_1` FOREIGN KEY (`SKU`) REFERENCES `produto` (`SKU`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variacoes_produto`
--

LOCK TABLES `variacoes_produto` WRITE;
/*!40000 ALTER TABLE `variacoes_produto` DISABLE KEYS */;
/*!40000 ALTER TABLE `variacoes_produto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venda`
--

DROP TABLE IF EXISTS `venda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `venda` (
  `id_venda` int NOT NULL AUTO_INCREMENT,
  `id_cliente` int DEFAULT NULL,
  `numero_pedido` int NOT NULL,
  `data_venda` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `canal` enum('site','presencial') NOT NULL,
  `status` varchar(100) NOT NULL,
  PRIMARY KEY (`id_venda`),
  UNIQUE KEY `id_venda` (`id_venda`),
  KEY `id_cliente` (`id_cliente`),
  CONSTRAINT `venda_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venda`
--

LOCK TABLES `venda` WRITE;
/*!40000 ALTER TABLE `venda` DISABLE KEYS */;
/*!40000 ALTER TABLE `venda` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-11 23:11:13
