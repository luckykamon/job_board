-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : mer. 14 oct. 2020 à 10:15
-- Version du serveur :  5.7.31
-- Version de PHP : 7.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `polemploi`
--

-- --------------------------------------------------------

--
-- Structure de la table `besoin`
--

DROP TABLE IF EXISTS `besoin`;
CREATE TABLE IF NOT EXISTS `besoin` (
  `besoin_id` int(11) NOT NULL AUTO_INCREMENT,
  `offre_id` int(11) DEFAULT NULL,
  `compe_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`besoin_id`),
  KEY `offre_id` (`offre_id`),
  KEY `compe_id` (`compe_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `candidature`
--

DROP TABLE IF EXISTS `candidature`;
CREATE TABLE IF NOT EXISTS `candidature` (
  `cand_id` int(11) NOT NULL AUTO_INCREMENT,
  `cand_date_creation` datetime DEFAULT NULL,
  `cand_titre` varchar(50) NOT NULL,
  `cand_notes` varchar(255) DEFAULT NULL,
  `cand_description` varchar(255) NOT NULL,
  `cand_etat` int(11) DEFAULT NULL,
  `offre_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`cand_id`),
  KEY `offre_id` (`offre_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `candidature`
--

INSERT INTO `candidature` (`cand_id`, `cand_date_creation`, `cand_titre`, `cand_notes`, `cand_description`, `cand_etat`, `offre_id`, `user_id`) VALUES
(23, NULL, 'Formateur data analyst', NULL, 'Etant formateur data analyst je postule pour votre offre.', NULL, 15, 11),
(24, NULL, 'En reconversion', NULL, 'Etant en reconversion professionnelle, je recherche une alternance dans votre entreprise.', NULL, 13, 27),
(25, NULL, 'Expert en Data', NULL, 'Travaillant depuis plusieurs années dans l\'analyse de Data, je recherche actuellement un emploi dans votre entreprise.', NULL, 13, 26),
(26, NULL, 'En reconversion', NULL, 'En reconversion, je cherche à découvrir de nouvelles entreprises.', NULL, 14, 24);

-- --------------------------------------------------------

--
-- Structure de la table `competences`
--

DROP TABLE IF EXISTS `competences`;
CREATE TABLE IF NOT EXISTS `competences` (
  `compe_id` int(11) NOT NULL AUTO_INCREMENT,
  `compe_nom` varchar(50) NOT NULL,
  PRIMARY KEY (`compe_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `competences`
--

INSERT INTO `competences` (`compe_id`, `compe_nom`) VALUES
(1, 'C++'),
(2, 'SQL'),
(3, 'Python'),
(4, 'Javascript'),
(5, 'C');

-- --------------------------------------------------------

--
-- Structure de la table `doit_avoir`
--

DROP TABLE IF EXISTS `doit_avoir`;
CREATE TABLE IF NOT EXISTS `doit_avoir` (
  `avoir_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `compe_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`avoir_id`),
  KEY `user_id` (`user_id`),
  KEY `compe_id` (`compe_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `employer`
--

DROP TABLE IF EXISTS `employer`;
CREATE TABLE IF NOT EXISTS `employer` (
  `emploi_id` int(11) NOT NULL AUTO_INCREMENT,
  `societe_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `emploi_access` int(11) DEFAULT NULL,
  PRIMARY KEY (`emploi_id`),
  KEY `societe_id` (`societe_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `employer`
--

INSERT INTO `employer` (`emploi_id`, `societe_id`, `user_id`, `emploi_access`) VALUES
(5, 2, 11, 2),
(6, 2, 24, 2),
(7, 3, 24, 0),
(8, 5, 11, 0);

-- --------------------------------------------------------

--
-- Structure de la table `gerer_offre`
--

DROP TABLE IF EXISTS `gerer_offre`;
CREATE TABLE IF NOT EXISTS `gerer_offre` (
  `gerer_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `offre_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`gerer_id`),
  KEY `offre_id` (`offre_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `offre_emploi`
--

DROP TABLE IF EXISTS `offre_emploi`;
CREATE TABLE IF NOT EXISTS `offre_emploi` (
  `offre_id` int(11) NOT NULL AUTO_INCREMENT,
  `offre_titre` varchar(50) NOT NULL,
  `offre_notes` varchar(255) DEFAULT NULL,
  `offre_date_creation` datetime DEFAULT NULL,
  `offre_salaire` varchar(50) DEFAULT NULL,
  `offre_date_modif` datetime DEFAULT NULL,
  `offre_description` text NOT NULL,
  `offre_date_limite` datetime DEFAULT NULL,
  `offre_lieu` varchar(50) NOT NULL,
  `type_id` int(11) DEFAULT NULL,
  `societe_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`offre_id`),
  KEY `societe_id` (`societe_id`),
  KEY `type_id` (`type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `offre_emploi`
--

INSERT INTO `offre_emploi` (`offre_id`, `offre_titre`, `offre_notes`, `offre_date_creation`, `offre_salaire`, `offre_date_modif`, `offre_description`, `offre_date_limite`, `offre_lieu`, `type_id`, `societe_id`) VALUES
(13, 'Alternance Data Analyste', NULL, NULL, '2500', NULL, 'Alternance disponible à partir', NULL, 'Paris', 4, 2),
(14, 'Découverte de l\'entreprise', NULL, NULL, '0', NULL, 'Stage dans l\'objectif de découvrir notre société', NULL, 'Paris', 1, 2),
(15, 'Professeur', NULL, NULL, '4000', NULL, 'Nous recherchons un nouveau professeur pour notre école', NULL, 'Rennes', 2, 3);

-- --------------------------------------------------------

--
-- Structure de la table `societe`
--

DROP TABLE IF EXISTS `societe`;
CREATE TABLE IF NOT EXISTS `societe` (
  `societe_id` int(11) NOT NULL AUTO_INCREMENT,
  `societe_siren` int(9) NOT NULL,
  `societe_nom` varchar(50) NOT NULL,
  `societe_notes` varchar(255) DEFAULT NULL,
  `societe_description` varchar(50) NOT NULL,
  PRIMARY KEY (`societe_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `societe`
--

INSERT INTO `societe` (`societe_id`, `societe_siren`, `societe_nom`, `societe_notes`, `societe_description`) VALUES
(2, 130005481, 'Pole emploi', NULL, 'Le Pôle emploi '),
(3, 423855196, 'Epitech', NULL, 'Ecole en informatique'),
(5, 309954006, 'RATIER-FIGEAC', NULL, 'Société d\'Aéronautique');

-- --------------------------------------------------------

--
-- Structure de la table `type_offre`
--

DROP TABLE IF EXISTS `type_offre`;
CREATE TABLE IF NOT EXISTS `type_offre` (
  `type_id` int(11) NOT NULL AUTO_INCREMENT,
  `type_nom` varchar(50) NOT NULL,
  PRIMARY KEY (`type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `type_offre`
--

INSERT INTO `type_offre` (`type_id`, `type_nom`) VALUES
(1, 'Stage'),
(2, 'CDD'),
(3, 'CDI'),
(4, 'Alternance');

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
CREATE TABLE IF NOT EXISTS `utilisateur` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_username` varchar(50) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `user_phone` varchar(20) DEFAULT NULL,
  `user_nom` varchar(50) NOT NULL,
  `user_prenom` varchar(50) NOT NULL,
  `user_biographie` varchar(255) NOT NULL,
  `user_cv` text,
  `user_lettre_motivation` text,
  `user_password` text NOT NULL,
  `user_droit_acces` int(11) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`user_id`, `user_username`, `user_email`, `user_phone`, `user_nom`, `user_prenom`, `user_biographie`, `user_cv`, `user_lettre_motivation`, `user_password`, `user_droit_acces`) VALUES
(11, 'cc', 'git@git.fr', '0675987620', 'Cc', 'Cc', 'Il s\'agit d\'un compte admin de test.', NULL, NULL, 'sha1$7f806d18$1$4ce1216474a3f2e26c6ff65c86dbe664d3ddb91e', 1),
(24, 'l', 'git@git.fr', '0612345678', 'b', 'l', 'Compte admin du site pour Lucas.', NULL, NULL, 'sha1$1674458e$1$41af6e5946570cba2b21c4d8cd5390251cca8a79', 1),
(25, 'j', 'git@git.fr', '0637698971', 'h', 'j', 'Compte admin du site pour Jean-Baptiste.', NULL, NULL, 'sha1$10d667e5$1$aad280c7e833d1e546615045e60a6f7e68e271be', 0),
(26, 'r', 'git@git.fr', '0623546298', 'h', 'r', 'Je viens de m\'inscrire sur cette plateforme.', NULL, NULL, 'sha1$39bdbed5$1$d250aad97099387efaf7a81b951481f83574cc72', 0),
(27, 't', 'git@git.fr', '0623456309', 't', 'a', 'En recherche d\'emploi.', NULL, NULL, 'sha1$9dc7556d$1$2e15cef6ecea90d9ff5a9f5f4774e761d59396e8', NULL);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `besoin`
--
ALTER TABLE `besoin`
  ADD CONSTRAINT `besoin_ibfk_1` FOREIGN KEY (`offre_id`) REFERENCES `offre_emploi` (`offre_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `besoin_ibfk_2` FOREIGN KEY (`compe_id`) REFERENCES `competences` (`compe_id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `candidature`
--
ALTER TABLE `candidature`
  ADD CONSTRAINT `candidature_ibfk_1` FOREIGN KEY (`offre_id`) REFERENCES `offre_emploi` (`offre_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `candidature_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `utilisateur` (`user_id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `doit_avoir`
--
ALTER TABLE `doit_avoir`
  ADD CONSTRAINT `doit_avoir_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `utilisateur` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `doit_avoir_ibfk_2` FOREIGN KEY (`compe_id`) REFERENCES `competences` (`compe_id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `employer`
--
ALTER TABLE `employer`
  ADD CONSTRAINT `employer_ibfk_1` FOREIGN KEY (`societe_id`) REFERENCES `societe` (`societe_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `employer_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `utilisateur` (`user_id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `gerer_offre`
--
ALTER TABLE `gerer_offre`
  ADD CONSTRAINT `gerer_offre_ibfk_1` FOREIGN KEY (`offre_id`) REFERENCES `offre_emploi` (`offre_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `gerer_offre_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `utilisateur` (`user_id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `offre_emploi`
--
ALTER TABLE `offre_emploi`
  ADD CONSTRAINT `offre_emploi_ibfk_1` FOREIGN KEY (`societe_id`) REFERENCES `societe` (`societe_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `offre_emploi_ibfk_2` FOREIGN KEY (`type_id`) REFERENCES `type_offre` (`type_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
