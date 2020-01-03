
export default {
	language: 'Français',
	'$vuetify': {
		close: 'Fermer',
		dataIterator: {
			noResultsText: 'Aucun enregistrement correspondant trouvé',
			loadingText: "Chargement de l'élément..."
		},
		dataTable: {
			itemsPerPageText: 'Lignes par page:',
			ariaLabel: {
				sortDescending: ': Tri décroissant. Activer pour supprimer le tri.',
				sortAscending: ': Tri croissant. Activer pour trier par ordre décroissant.',
				sortNone: ': Non trié. Activer pour trier par ordre croissant.'
			},
			sortBy: 'Trier par'
		},
		dataFooter: {
			itemsPerPageText: 'Élements par page:',
			itemsPerPageAll: 'Tous',
			nextPage: 'Page suivante',
			prevPage: 'Page précédente',
			firstPage: 'Première page',
			lastPage: 'Dernière page',
			pageText: '{0}-{1} de {2}'
		},
		datePicker: {
			itemsSelected: '{0} sélectionnés'
		},
		noDataText: 'Aucune donnée disponible',
		carousel: {
			prev: 'Visuel précédent',
			next: 'Visuel suivant'
		},
		calendar: {
			moreEvents: '{0} plus'
		},
		fileInput: {
			counter: '{0} fichiers',
			counterSize: '{0} fichiers ({1} au total)'
		},
		timePicker: {
			am: 'AM',
			pm: 'PM'
		}
	},
	button: {
		add: {
			caption: 'Ajouter'
		},
		parkHead: {
			caption: 'Abaisser la tête'
		},
		connect: {
			connect: 'Connecter',
			connecting: 'Connexion...',
			disconnect: 'Se déconnecter',
			disconnecting: 'Déconnexion...'
		},
		login: {
			login: 'S\'identifier',
			loggingin: 'Connexion...',
			logout: 'Se déconnecter',
			loggingout: 'Déconnexion...'
		},
		emergencyStop: {
			caption: 'Arrêt D\'Urgence',
			title: 'Forcer un redémarrage logiciel immédiat (M112+M999)'
		},
		home: {
			caption: 'Origine {0}',
			captionAll: 'Tout aux Origines',
			title: 'Déplace l\'axe {0} à son origine (G28 {0})',
			titleAll: 'Déplace tout les axes aux origines (G28)'
		},
		newDirectory: {
			caption: 'Nouveau Dossier'
		},
		newFilament: {
			caption: 'Nouveau Filament'
		},
		newLiquid: {
			caption: 'Nouveau Liquide'
		},
		newFile: {
			caption: 'Nouveau Fichier'
		},
		refresh: {
			caption: 'Rafraîchir'
		},
		preloadPrime: {
			caption: 'Charger/Amorcer',
			preload: 'Précharger {0}',
			prime: 'Amorcer {0}',
			unload: 'Décharger {0}',
		},
		upload: {
			gcodes: {
				caption: 'Envoyer Fichier(s) G-Code',
				title: 'Envoyer un ou plusieurs fichiers G-Code (le glisser/déposer est supporté)'
			},
			start: {
				caption: 'Envoyer & Lancer',
				title: 'Envoyer & lancer un fichier G-Code (le glisser/déposer est supporté)'
			},
			macros: {
				caption: 'Envoyer Fichier(s) Macro',
				title: 'Envoyer un ou plusieurs fichiers macros (le glisser/déposer est supporté)'
			},
			filaments: {
				caption: 'Envoyer Configs Filament',
				title: 'Envoyer une ou plusieures configuration de filament (le glisser/déposer est supporté)'
			},
			filaments: {
				caption: 'Envoyer Configs Liquide',
				title: 'Envoyer une ou plusieures configuration de liquide (le glisser/déposer est supporté)'
			},
			display: {
				caption: 'Envoyer Fichiers Menu',
				title: 'Envoyer un ou plusieurs fichiers menu (le glisser/déposer est supporté)'
			},
			sys: {
				caption: 'Envoyer Fichiers Système',
				title: 'Envoyer un ou plusieurs fichiers système (le glisser/déposer est supporté)'
			},
			www: {
				caption: 'Envoyer Fichiers Web',
				title: 'Envoyer un ou plusieurs fichiers web (le glisser/déposer est supporté)'
			},
			update: {
				caption: 'Envoyer Mise à Jour',
				title: 'Envoyer un paquet de mise à jour (le glisser/déposer est supporté)'
			}
		}
	},
	chart: {
		layer: {
			caption: 'Graphique de Couche',
			layerTime: 'Temps de Couche',

			showLastLayers: 'Afficher les {0} dernières Couches',
			showAllLayers: 'Afficher Toutes les Couches',

			layer: 'Couche {0}',
			layerDuration: 'Durée: {0}',
			layerHeight: 'Hauteur de Couche: {0}',
			filamentUsage: 'Utilisation de Filament: {0}',
			fractionPrinted: 'Progrès du Fichier: {0}'
		},
		temperature: {
			caption: 'Graphique de Température',
			heater: 'Résistance {0}',
			noData: 'Aucune donnée'
		}
	},
	dialog: {
		changeMoveStep: {
			title: 'Modifier distance de mouvement',
			prompt: 'Merci d\'entrer une nouvelle valeur pour le bouton de mouvement cliqué:'
		},
		configUpdated: {
			title: 'Redémarrer la machine?',
			prompt: 'Voulez-vous redémarrer la machine pour appliquer la mise à jour de la configuration?'
		},
		connect: {
			title: 'Connecter à la Machine',
			prompt: 'Merci d\'entrer le nom d\'hôte et le mot de passe de la machine à laquelle vous voulez vouz connecter:',
			hostPlaceholder: 'Nom d\'Hôte',
			hostRequired: 'Nom d\'Hôte requis',
			passwordPlaceholderOptional: 'Mot de Passe (optionnel)',
			passwordPlaceholder: 'Mot de Passe',
			passwordRequired: 'Mot de Passe requis',
			connect: 'Connexion'
		},
		connection: {
			connecting: 'Connexion...',
			disconnecting: 'Déconnexion...',
			updating: 'Veuillez patienter pendant l\'installation des mises à jour....',
			reconnecting: 'Connexion perdue, tentative de reconnexion...',
			standBy: 'Merci de patienter...'
		},
		editExtrusionAmount: {
			title: 'Modifier quantité d\'extrusion',
			prompt: 'Merci d\'enter une nouvelle quantité pour le bouton cliqué:'
		},
		editExtrusionFeedrate: {
			title: 'Modifier vitesse d\'extrusion',
			prompt: 'Merci d\'entrer une nouvelle vitesse pour le bouton cliqué:'
		},
		factoryReset: {
			title: 'Effectuer restauration des paramètres d\'usine?',
			prompt: 'Etes-vous sûr de vouloir restaurer des paramètres d\'usine ? Tout les paramètres sauvegardés seront perdus.'
		},
		filament: {
			titleChange: 'Changer Filament',
			titleLoad: 'Charger Filament',
			prompt: 'Merci de choisir un filament:'
		},
		fileEdit: {
			gcodeReference: 'Références G-Code',
			menuReference: 'Référence Menu',
			save: 'Sauvegarder',
			confirmClose: 'Le fichier a été modifié. Si vous continuez, vos modifications seront perdues.'
		},
		meshEdit: {
			title: 'Définir Paramètres de Maillage',
			radius: 'Rayon de Palpage',
			spacing: 'Espacement',
			startCoordinate: 'Coordonnée de démarrage dans la direction {0}',
			endCoordinate: 'Coordonnée de fin dans la direction {0}',
			spacingDirection: 'Espacement dans la direction {0}'
		},
		newDirectory: {
			title: 'Nouveau Dossier',
			prompt: 'Merci d\'entrer un nom de nouveau dossier:'
		},
		newFilament: {
			title: 'Nouveau Filament',
			prompt: 'Merci d\'entrer un nom pour le nouveau filament:'
		},
		newFile: {
			title: 'Nouveau Fichier',
			prompt: 'Merci d\'entrer un nom de nouveau fichier:'
		},
		renameFile: {
			title: 'Renommer un Fichier ou Dossier',
			prompt: 'Merci d\'entrer un nouveau nom:'
		},
		resetHeaterFault: {
			title: 'Réinitialiser Défaut de Résistance',
			prompt: 'Un défaut de chauffage s\'est produit sur le chauffage {0}. Il est fortement recommandé d\'éteindre la machine maintenant et vérifier votre câblage avant de continuer. Si vous êtes absolument sûr qu\'il n\'y a pas de problème physique, vous pouvez réinitialiser le défaut <span style="color: red; font-weight: bold;">A VOS RISQUES ET PERILS</span>. Soyez conscient que ce n\'est <span style="color: red; font-weight: bold;">PAS RECOMMANDÉ</span> et peut provoquer plus de problèmes. Comment voulez-vous proceder?',
			resetFault: 'Réinitialiser Défaut'
		},
		runMacro: {
			title: 'Lancer {0}',
			prompt: 'Voulez-vous lancer {0}?'
		},
		startJob: {
			title: 'Démarrer {0}',
			prompt: 'Voulez-vous démarrer {0}?'
		},
		delete: {
			title: 'Supprimer {0}',
			prompt: 'Voulez vous vraiment supprimer {0}?'
		},
		update: {
			title: 'Installer Mise à Jour?',
			prompt: 'Vous avez envoyé au moins une mise à jour logiciel. Voulez-vous les installer maintenant?'
		},
		inputRequired: 'Merci d\'entrer une nouvelle valeur',
		numberRequired: 'Merci d\'entrer un nombre valide'
	},
	directory: {
		display: 'Répertoire Menu',
		filaments: 'Répertoire Filaments',
		gcodes: 'Répertoire G-Codes',
		macros: 'Répertoire Macros',
		sys: 'Répertoire Systeme',
		www: 'Répertoire WWW'
	},
	error: {
		notImplemented: '{0} n\'est pas implémenté',
		invalidPassword: 'Mauvais mot de passe!',
		noFreeSession: 'Plus de sessions libre!',
		connect: 'Échec de la connexion à {0}',
		disconnect: 'Impossible de se déconnecter correctement de {0}',
		disconnected: 'Impossible de compléter l\'action car la connexion s\'est terminée',
		cancelled: 'Opération annulée',
		network: 'Erreur réseau',
		timeout: 'Réquête HTTP expirée',
		driveUnmounted: 'Le lecteur cible est démonté',
		directoryNotFound: 'Répertoire {0} introuvable',
		fileNotFound: 'Fichier {0} introuvable',
		invalidHeightmap: 'Carte de compensation Invalide',
		operationFailed: 'Échec de l\'opération (Raison: {0})',
		uploadStartWrongFileCount: 'Seulement un fichier peut être envoyé & démarré',
		uploadNoSingleZIP: 'Seulement un fichier ZIP peut être envoyé à la fois',
		uploadNoFiles: 'Ce ZIP ne contient aucun fichier utilisable',
		uploadDecompressionFailed: 'Échec de la décompression du fichier ZIP',
		codeResponse: 'Impossible d\'exécuter le code car une mauvaise réponse a été reçue',
		codeBuffer: 'Impossible d\'exécuter le code car l\'espace tampon est épuisé',
		enterValidNumber: 'Merci d\'entrer un nombre valide',
		turnOffEverythingFailed: 'Impossible de tout éteindre',
		filelistRequestFailed: 'Impossible d\'obtenir la liste des fichiers',
		fileinfoRequestFailed: 'Impossible d\'obtenir les informations du fichier pour {0}',
		filamentsLoadFailed: 'Impossible de charger le filament',
		move: 'Impossible de déplacer {0} à {1}'
	},
	events: {
		connected: 'Connecté à {0}',
		connectionLost: 'N\'a pas réussi à maintenir la connexion à {0}',
		emergencyStop: 'Arrêt d\'urgence, tentative de reconnexion...',
		reconnecting: 'Connexion interrompue, tentative de reconnexion...',
		reconnected: 'Connexion établie',
		disconnected: 'Déconnecté de {0}'
	},
	generic: {
		ok: 'OK',
		cancel: 'Annuler',
		yes: 'Oui',
		no: 'Non',
		close: 'Fermer',
		reset: 'Réinitialiser',
		noValue: 'n/a',
		loading: 'Chargement',
		error: 'Erreur',
		edit: 'Modifier',
		info: 'Info',
		warning: 'Attention',
		success: 'Succès',
		print: 'Imprimer',
		showBuildplate: 'Afficher plateau',
		showPreview: 'Afficher pièce',
		preload: 'Précharger {0}',
		unload: 'Décharger {0}',
		heaterStates: [
			'off',
			'veille',
			'actif',
			'défaut',
			'réglage',
			'offline'
		],
		status: {
			updating: 'Mise à Jour...',
			off: 'Off',
			halted: 'Interrompu',
			pausing: 'Mise en Pause',
			paused: 'Pause',
			resuming: 'Reprise',
			printing: 'Impression',
			processing: 'Traitement',
			simulating: 'Simulation',
			busy: 'Occupé',
			changingTool: 'Changement d\'Outil',
			idle: 'Au repos',
			unknown: 'Inconnu'
		},
		rpm: 'TPM',
		sdCard: 'Carte SD {0}',
		mounted: 'monté',
		notMounted: 'non monté',
		extracting: 'Extraction',
		uploading: 'Envoi en Cours',
		active: 'Actif',
		standby: 'Veille'
	},
	input: {
		code: {
			send: 'Envoyer',
			placeholder: 'Envoyer Code...'
		},
		addTemperature: 'Valeur de la nouvelle température',
		addRPM: 'Valeur du nouveau preset'
	},
	jobProgress: {
		simulating: 'Simulation {0}, {1} complète',
		simulated: 'Simulation {0}, 100 % complète',
		processing: 'Traitement {0}, {1} complet',
		processed: 'Traitement {0}, 100 % complet',
		printing: 'Impression {0}, {1} complète',
		printed: 'Impression {0}, 100 % complète',
		noJob: 'Aucun Travail en Cours.',
		layer: 'Couche {0} sur {1}',
		filament: 'Utilisation de Filament: {0}',
		filamentRemaining: '{0} restant'
	},
	list: {
		baseFileList: {
			fileName: 'Nom',
			size: 'Taille',
			lastModified: 'Dernière modification',
			download: 'Télécharger',
			edit: 'Modifier',
			rename: 'Renommer',
			delete: 'Supprimer',
			downloadZIP: 'Télécharger en ZIP',
			noFiles: 'Aucun Fichiers ou Répertoires',
			driveUnmounted: 'La carte n\'est pas monté',
			goUp: 'Remonter',
			showMore: 'Voir plus'
		},
		display: {
			noFiles: 'Aucun Fichier d\'Affichage'
		},
		eventLog: {
			date: 'Date',
			type: 'Type',
			message: 'Événement',
			noEvents: 'Aucun Événement',
			clear: 'Effacer',
			downloadText: 'Télécharger en Texte',
			downloadCSV: 'Télécharger en CSV'
		},
		filament: {
			noFilaments: 'Aucun Filaments'
		},
		liquid: {
			noLiquids: 'Aucun Liquides'
		},
		macro: {
			caption: 'Macros',
			noMacros: 'Aucune Macros',
			run: 'Lancer Macro',
			root: 'Source'
		},
		gcode: {
			caption: 'Gcodes',
			noGcodes: 'Aucun Gcodes',
			run: 'Lancer Gcode',
			root: 'Source'
		},
		jobs: {
			height: 'Hauteur Objet',
			layerHeight: 'Hauteur de Couche',
			filament: 'Utilisation de Filament',
			printTime: 'Temps d\'Impression',
			simulatedTime: 'Temps Simulé',
			generatedBy: 'Généré par',

			noJobs: 'Aucun Gcodes',
			start: 'Lancer Fichier',
			simulate: 'Simuler Fichier'
		},
		sys: {
			noFiles: 'Aucun Fichiers Système',
			configToolNote: 'éditer via l\'outil de configuration'
		}
	},
	menu: {
		control: {
			caption: 'Contrôle de la Machine',
			dashboard: 'Tableau de Bord',
			console: 'Console',
			heightmap: 'Carte de compensation'
		},
		job: {
			caption: 'Travail',
			status: 'Status',
			webcam: 'Webcam',
			visualiser: 'Visualiser'
		},
		files: {
			caption: 'Gestion de Fichiers',
			jobs: 'GCodes',
			filaments: 'Filaments',
			macros: 'Macros',
			display: 'Affichage',
			system: 'Système',
			web: 'Web'
		},
		material: {
			materials: 'Materiaux',
			filaments: 'Filaments',
			liquids: 'Liquides',
			paste: 'Pates',
			pellets: 'Pellets',
			fibers: 'Fibres',
			hybrids: 'Hybrides',
		},
		settings: {
			caption: 'Paramètres',
			general: 'Général',
			machine: 'Spécifique à la Machine',
			update: 'Mise à Jour'
		},
		lynx: {
			control: 'Contrôles',
			calibrate: 'Calibration',
		}
	},
	notification: {
		compress: {
			title: 'Compression des fichiers...',
			message: 'Merci de patienter pendant que vos fichiers se font compresser...',
			errorTitle: 'Échec de la compression des fichiers'
		},
		delete: {
			errorTitle: 'Impossible de supprimer {0}',
			errorMessageDirectory: 'Merci de vous assurez que ce dossier est vide',
			success: '{0} supprimé avec succès',
			successMultiple: '{0} objets supprimé avec succès'
		},
		deleteFilament: {
			errorTitle: 'Impossible de supprimer le(s) filament(s)',
			errorStillLoaded: 'Au moins un des filaments séléctionné est toujours chargé. Merci de les décharger avant de procéder',
			errorSubDirectories: 'Le filament {0} contient des sous-dossiers. Merci de les supprimer manuellement et réessayer.'
		},
		download: {
			title: 'Téléchargement {0} @ {1}, {2}% complet',
			message: 'Veuillez patienter pendant que le fichier est en téléchargement...',
			success: 'Téléchargement de {0} réussi après {1}',
			successMulti: 'Téléchargement de {0} fichiers réussi',
			error: 'Échec du téléchargement de {0}'
		},
		loadingFile: {
			title: 'Chargement du fichier',
			message: 'Ce fichier est relativement gros alors cela peut prendre du temps avant qu\'il s\'affiche.'
		},
		message: 'Message',
		mount: {
			successTitle: 'Carte SD Montée',
			errorTitle: 'Impossible de monter la carte SD'
		},
		newDirectory: {
			errorTitle: 'Échec de la création du dossier',
			successTitle: 'Dossier créé',
			successMessage: 'Création du dossier {0} réussi'
		},
		newFilament: {
			errorTitle: 'Échec de la création du filament',
			errorTitleMacros: 'Échec de la création des macros de filament',
			successTitle: 'Filament créé',
			successMessage: 'Création du filament {0} réusssi'
		},
		rename: {
			success: 'Renommage de {0} en {1} réussi',
			error: 'Échec du renommage de {0} en {1}',
		},
		renameFilament: {
			errorTitle: 'Échec du renommage du filament',
			errorStillLoaded: 'Ce filament est toujours chargé. Merci de le décharger avant de procéder'
		},
		responseTooLong: 'Réponse trop longue, voir la Console',
		upload: {
			title: 'Envoi {0} @ {1}, {2}% complet',
			message: 'Veuillez patienter pendant que le fichier est envoyé...',
			success: 'Envoi de {0} réussi après {1}',
			successMulti: 'Envoi de {0} fichiers réusssi',
			error: 'Échec de l\'envoi de {0}'
		},
		parse: {
			title: 'Parsing {0} {2}% complete eta: {3}',
			message: 'Please stand by while the file is being parsed...',
			success: 'Parsing of {0} successful after {1}',
			successMulti: 'Successfully parsed {0} files',
			error: 'Failed to parse {0}'
		}
	},
	panel: {
		atx: {
			caption: 'Contrôle de l\'alim',
			on: 'On',
			off: 'Off'
		},
		babystepping: {
			caption: 'Z Babystepping',
			current: 'Décalage Actuel: {0}'
		},
		extrude: {
			caption: 'Contrôle de l\'Extrusion',
			mix: 'Mix',
			mixRatio: 'Mix Ratio:',
			amount: 'Avance en {0}:',
			feedrate: 'Vitesse en {0}:',
			retract: 'Rétracter',
			extrude: 'Extruder'
		},
		extrusionFactors: {
			caption: 'Facteurs d\'Extrusion',
			changeVisibility: 'Changer Visibilité',
			extruder: 'Extruder {0}',
			noExtruders: 'Aucun Extruders'
		},
		fan: {
			caption: 'Contrôle des Ventilateurs',
			selection: 'Séléction du ventilateur:',
			toolFan: 'Ventilateur Outil',
			fan: 'Ventilateur {0}'
		},
		fans: {
			caption: 'Ventilateurs',
			changeVisibility: 'Changer Visibilité',
			toolFan: 'Ventilateur Outil',
			fan: 'Ventilateur {0}',
			noFans: 'Aucun Ventilateur'
		},
		heightmap: {
			scale: 'Échelle:',
			orMore: 'ou plus',
			orLess: 'ou moins',
			axes: 'Axes:',
			notAvailable: 'Machine de Hauteur non disponible',
			numPoints: 'Nombre de points: {0}',
			radius: 'Rayon de palpage: {0}',
			area: 'Zone de palpage: {0}',
			maxDeviations: 'Maximum déviations: {0} / {1}',
			biasError: 'Erreur moyenne: {0}',
			meanError: 'Erreur absolue: {0}',
			rmsError: 'Erreur RMS: {0}',
			topView: 'Vue du dessus',
			perspective: 'Vue Perspective',
			colorScheme: 'Schéma couleur:',
			terrain: 'Terrain',
			heat: 'Chaleur',
			reload: 'Recharger',
			probing: {
				perfect: 'Parfait',
				valid: 'Valide',
				danger: 'Danger',
				reprobe: 'Repalper'
			}
		},
		jobControl: {
			caption: 'Contrôle du Travail',
			cancelJob: 'Annuler Travail',
			cancelPrint: 'Annuler Impression',
			cancelSimulation: 'Annuler Simulation',
			pauseJob: 'Pause Travail',
			pausePrint: 'Pause Impression',
			pauseSimulation: 'Pause Simulation',
			resumeJob: 'Reprendre  Travail',
			resumePrint: 'Reprendre Impression',
			resumeSimulation: 'Reprendre Simulation',
			repeatJob: 'Recommencer',
			repeatPrint: 'Réimprimer',
			repeatSimulation: 'Simuler à Nouveau',
			autoSleep: 'Activer Veille Automatique'
		},
		jobData: {
			caption: 'Données Collectés',
			warmUpDuration: 'Temps de Chauffe',
			currentLayerTime: 'Durée de la Couche Actuelle',
			lastLayerTime: 'Durée de la Dernière Couche',
			jobDuration: 'Durée du Travail'
		},
		jobEstimations: {
			caption: 'Estimations basée sur',
			filament: 'Utilisation de Filament',
			file: 'Progrès du Fichier',
			layer: 'Durée de la Dernière Couche',
			slicer: 'Trancheur',
			simulation: 'Simulation'
		},
		jobInfo: {
			caption: 'Information du Travail',
			height: 'Hauteur:',
			layerHeight: 'Hauteur de Couche:',
			filament: 'Utilisation de Filament:',
			generatedBy: 'Généré par:'
		},
		movement: {
			caption: 'Mouvement Machine',
			compensation: 'Compensation & Calibration',
			runBed: 'Calibration du Plateau (G32)',
			runDelta: 'Calibration Delta (G32)',
			compensationInUse: 'Compensation en utilisation: {0}',
			disableBedCompensation: 'Désactiver Compensation (M561)',
			disableMeshCompensation: 'Désactiver Mesh Compensation (G29 S2)',
			editMesh: 'Définir Zone pour la Compensation (M557)',
			runMesh: 'Lancer Mesh Compensation (G29)',
			loadMesh: 'Charger Compensation Depuis la SD (G29 S1)',
			axesNotHomed: 'L\'axe suivant  n\'a pas été à son origine:|Les axes suivantss n\'ont pas été à leur origine:',
			noAxes: 'Pas d\'axes',
			runNozzleHeight: 'Calibration hauteur buses',
			showHeightmap: "Afficher la Carte"
		},
		settingsAbout: {
			caption: 'À propos',
			developedBy: 'Interface web dévelopée par',
			updatededBy: 'mis a jour par',
			lxVersion: "Version Lynxter: ",
			buildDate: "Compilé le: ",
			for: 'pour',
			licensedUnder: 'Sous licence selon les termes de la'
		},
		settingsAppearance: {
			caption: 'Apparence',
			darkTheme: 'Thème Sombre',
			language: 'Langage',
			binaryFileSizes: 'Utiliser des tailles de fichiers binaires',
			binaryFileSizesTitle: 'Les tailles de fichier sont affichées avec une base de 1024 (IEC) au lieu de 1000 (SI)',
			disableAutoComplete: 'Disable auto-complete',
			disableAutoCompleteTitle: 'Do not show auto-complete list when typing in code or temperature inputs'
		},
		settingsCommunication: {
			caption: 'Communication',
			pingInterval: 'Intervalle PING au repos ({0})',
			ajaxRetries: 'Nombre maximal de tentatives AJAX',
			updateInterval: 'Intervalle de mise à jour ({0})',
			extendedUpdateEvery: 'Intervalle de mise à jour du statut étendu',
			fileTransferRetryThreshold: 'Limite d\'essais pour le transfert de fichiers ({0})',
			crcUploads: 'Utiliser les sommes de contrôle CRC32 pour les téléchargements',
			unavailable: 'Aucun réglage disponible.',
		},
		settingsElectronics: {
			caption: 'Électronique',
			diagnostics: 'Diagnostiquer',
			board: 'Carte: {0}',
			firmware: 'Microprogramme: {0} ({1})',
			dwsFirmware: 'Version Duet WiFi Server: {0}',
			updateNote: 'Remarque: Vous pouvez installer les mises à jour sur la page Système.'
		},
		settingsEndstops: {
			caption: 'Interrupteur de position',
			index: 'Index',
			triggered: 'Déclenché'
		},
		settingsGeneral: {
			caption: 'Général',
			factoryReset: 'Revenir aux paramètres d\'usine',
			settingsStorageLocal: 'Sauvegarder les paramètres dans le stockage local',
			settingsSaveDelay: 'Délai de mise à jour pour les modifications de paramètres ({0})',
			cacheStorageLocal: 'Sauvegarder le cache dans le stockage local',
			cacheSaveDelay: 'Délai de mise à jour pour les modifications du cache ({0})'
		},
		settingsListItems: {
			caption: 'Liste des Éléments',
			toolTemperatures: 'Températures de l\'Outil',
			bedTemperatures: 'Températures du Plateau',
			chamberTemperatures: 'Températures de la Chambre',
			spindleRPM: 'TPM de l\'axe'
		},
		settingsMachine: {
			caption: 'Machine-Spécifique',
			revertDWC: 'Revenir à DWC1',
			babystepAmount: 'Longeur Babystep ({0})',
			moveFeedrate: 'Vitesse pour les boutons de mouvement ({0})'
		},
		settingsNetwork: {
			caption: 'Paramètres réseaux',
			publicIP: 'Addresse machine',
			advanced: 'Avancé',
			netmask: 'Masque',
			gateway: 'Passerelle',
			dns: 'Adresses DNS'
		},
		settingsNotifications: {
			caption: 'Notifications',
			notificationErrorsPersistent: 'Ne pas fermer les messages d\'erreur automatiquement',
			notificationTimeout: 'Délais d\'affichage des notifications par défaut ({0})'
		},
		settingsWebcam: {
			caption: 'Caméra',
			webcamURL: 'URL de la caméra (optionnel)',
			webcamUpdateInterval: 'Intervale de màj de la Webcam ({0})',
			webcamFix: 'Ne pas ajouter de qualificatif HTTP supplémentaire lors du rechargement d\'images',
			webcamEmbedded: 'Incorporer l\'image de la caméra dans un iframe',
			webcamRotation: 'Pivoter l\'image de la caméra',
			webcamFlip: 'Retourner l\'image de la caméra',
			flipNone: 'Non',
			flipX: 'Retourner X',
			flipY: 'Retourner Y',
			flipBoth: 'Retourner les deux'
		},
		speedFactor: {
			caption: 'Facteur de Vitesse'
		},
		status: {
			caption: 'Status',
			mode: 'Mode: {0}',
			toolPosition: 'Position Outil',
			machinePosition: 'Position Machine',
			extruders: 'Extrudeuse',
			extruderDrive: 'Moteur {0}',
			speeds: 'Vitesses',
			requestedSpeed: 'Vitesse Demandée',
			topSpeed: 'Vitesses de Pointe',
			sensors: 'Capteurs',
			cpuTemp: 'Température CPU',
			cpuTempTitle: 'Minimum: {0}, Maximum: {1}',
			mcuTemp: 'Température MCU',
			mcuTempTitle: 'Minimum: {0}, Maximum: {1}',
			vIn: 'Vin',
			vInTitle: 'Minimum: {0}, Maximum {1}',
			fanRPM: 'TPM Ventilateur',
			probe: 'Sonde-Z|Sondes-Z',
			noStatus: 'Pas de Statut'
		},
		tools: {
			caption: 'Outils',
			controlAll: 'Tout Contrôler',
			turnEverythingOff: 'Tout Éteindre',
			allActiveTemperatures: 'Définir toutes les températures actives',
			allStandbyTemperatures: 'Définir toutes les températures de veille',
			tool: 'Outil {0}',
			loadFilament: 'Charger Filament',
			changeFilament: 'Changer Filament',
			unloadFilament: 'Décharger Filament',
			heater: 'Résistance {0}',
			current: 'Actuel',
			active: 'Actif',
			standby: 'Veille',
			target: 'Cible',
			bed: 'Plateau {0}',
			chamber: 'Chambre {0}',
			extra: {
				caption: 'Extra',
				sensor: 'Capteur',
				value: 'Valeur',
				showInChart: 'Afficher dans le Graphique',
				noItems: 'Pas de Résistance supplémentaire'
			},
			noTools: 'Pas d\'Outils'
		},
		webcam: {
			caption: 'Caméra de surveillance',
			alt: '(image caméra)'
		},
		toolOffset: {
			captionXY: 'Décalage entre outils',
			captionZ: 'Décalage de la sonde Z',
			tool: 'Outil',
			offset: 'Décalage <b>{0}</b> :',
			toolTrigHeight: 'Hauteur de la sonde',
			bbStepping: 'Babystepping usuel'
		},
		toolAngle: {
			caption: 'Calibration angle outil',
			angle: 'Angle <b>{0}</b>',
			active: 'Angle actif',
			standby: 'Angle veille'
		},
		tiltCompensation: {
			caption: 'Compensation de l\'Inclinaison',
			tilt: 'Inclinaison <b>{0}</b>',
			offset: 'Décalage <b>{0}</b>',
			tooltip: 'Décalage sur l\'axe {0}',
			switch: 'Afficher l\'inclinaison comme :',
			rotation: 'Rotation autour de {0}',
			buttonCaption: {
				decrease: 'Diminuer l\'inclinaison autour de l\'axe {0} (M666 {1}xxx)',
				increase: 'Augmenter l\'inclinaison autour de l\'axe {0} (M666 {1}xxx)',
			}
		},
		toolPID: {
			caption: 'Calibration PID',
			tool: 'Outil',
			pid: 'Calibration PID <b>{0}</b>',
			calibration: 'T° calibration',
			pwm: 'calibration PWM'
		},
	}
}
