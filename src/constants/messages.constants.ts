/**
 * Constantes de messages
 */

// Messages de succès
export const SUCCESS_MESSAGES = {
  // Général
  SAVED: 'Enregistrement réussi',
  UPDATED: 'Modification réussie',
  DELETED: 'Suppression réussie',
  CREATED: 'Création réussie',

  // Étudiants
  STUDENT_CREATED: 'Étudiant créé avec succès',
  STUDENT_UPDATED: 'Informations de l\'étudiant mises à jour',
  STUDENT_DELETED: 'Étudiant supprimé',
  STUDENT_APPROVED: 'Étudiant approuvé avec succès',
  STUDENT_REJECTED: 'Demande rejetée',

  // Groupes
  GROUPS_CREATED: 'Groupes créés avec succès',
  GROUP_UPDATED: 'Groupe mis à jour',
  GROUP_DELETED: 'Groupe supprimé',

  // Année académique
  ACADEMIC_YEAR_CREATED: 'Année académique créée',
  ACADEMIC_YEAR_UPDATED: 'Année académique mise à jour',
  ACADEMIC_YEAR_ACTIVATED: 'Année académique activée',

  // Export
  EXPORT_SUCCESS: 'Export réussi',
  DOWNLOAD_SUCCESS: 'Téléchargement réussi',

  // Import
  IMPORT_SUCCESS: 'Import réussi',
  DATA_IMPORTED: 'Données importées avec succès',
} as const

// Messages d'erreur
export const ERROR_MESSAGES = {
  // Général
  GENERIC_ERROR: 'Une erreur est survenue',
  NETWORK_ERROR: 'Erreur de connexion au serveur',
  UNAUTHORIZED: 'Accès non autorisé',
  FORBIDDEN: 'Action interdite',
  NOT_FOUND: 'Ressource non trouvée',
  SERVER_ERROR: 'Erreur serveur',

  // Validation
  VALIDATION_ERROR: 'Erreur de validation',
  REQUIRED_FIELDS: 'Veuillez remplir tous les champs requis',
  INVALID_DATA: 'Données invalides',

  // Étudiants
  STUDENT_NOT_FOUND: 'Étudiant non trouvé',
  STUDENT_ALREADY_EXISTS: 'Cet étudiant existe déjà',
  STUDENT_LOAD_ERROR: 'Impossible de charger les données de l\'étudiant',
  STUDENT_SAVE_ERROR: 'Échec de l\'enregistrement',

  // Groupes
  GROUP_CREATION_ERROR: 'Échec de la création des groupes',
  NO_STUDENTS_SELECTED: 'Aucun étudiant sélectionné',
  GROUPS_LOAD_ERROR: 'Impossible de charger les groupes',

  // Export/Import
  EXPORT_ERROR: 'Échec de l\'export',
  IMPORT_ERROR: 'Échec de l\'import',
  FILE_ERROR: 'Erreur lors du traitement du fichier',

  // Année académique
  ACADEMIC_YEAR_ERROR: 'Erreur avec l\'année académique',
  INVALID_PERIOD: 'Période invalide',
} as const

// Messages de confirmation
export const CONFIRMATION_MESSAGES = {
  // Suppression
  CONFIRM_DELETE: 'Êtes-vous sûr de vouloir supprimer ?',
  CONFIRM_DELETE_STUDENT: 'Voulez-vous vraiment supprimer cet étudiant ?',
  CONFIRM_DELETE_GROUP: 'Voulez-vous vraiment supprimer ce groupe ?',
  CONFIRM_DELETE_YEAR: 'Voulez-vous vraiment supprimer cette année académique ?',

  // Modification
  CONFIRM_UPDATE: 'Confirmer les modifications ?',
  UNSAVED_CHANGES: 'Vous avez des modifications non enregistrées. Voulez-vous quitter ?',

  // Actions
  CONFIRM_APPROVE: 'Confirmer l\'approbation ?',
  CONFIRM_REJECT: 'Confirmer le rejet ?',
  CONFIRM_ACTIVATE: 'Activer cette année académique ?',
  CONFIRM_DEACTIVATE: 'Désactiver cette année académique ?',

  // Groupes
  CANCEL_GROUP_CREATION: 'Annuler la création de groupes ?',
  CANCEL_GROUP_CREATION_WARNING: 'Tous les groupes en cours seront perdus.',
} as const

// Messages d'information
export const INFO_MESSAGES = {
  // Général
  LOADING: 'Chargement en cours...',
  SAVING: 'Enregistrement en cours...',
  PROCESSING: 'Traitement en cours...',

  // Vide
  NO_DATA: 'Aucune donnée disponible',
  NO_RESULTS: 'Aucun résultat trouvé',
  NO_STUDENTS: 'Aucun étudiant trouvé',
  NO_GROUPS: 'Aucun groupe créé',

  // Filtres
  SELECT_FILTERS: 'Sélectionnez des filtres pour affiner la recherche',
  APPLY_FILTERS: 'Appliquer des filtres pour voir les résultats',

  // Sélection requise
  SELECT_YEAR: 'Veuillez sélectionner une année académique',
  SELECT_DEPARTMENT: 'Veuillez sélectionner une filière',
  SELECT_LEVEL: 'Veuillez sélectionner un niveau',
  SELECT_REQUIRED: 'Sélection requise',
} as const

// Messages d'avertissement
export const WARNING_MESSAGES = {
  // Général
  ATTENTION: 'Attention',
  BE_CAREFUL: 'Soyez prudent',

  // Actions
  CANNOT_UNDO: 'Cette action ne peut pas être annulée',
  PERMANENT_ACTION: 'Cette action est permanente',

  // Données
  DATA_WILL_BE_LOST: 'Les données seront perdues',
  UNSAVED_DATA: 'Données non enregistrées',

  // Filtres
  FILTER_REQUIRED: 'Veuillez d\'abord appliquer des filtres',
  SELECT_CLASS_FIRST: 'Veuillez d\'abord sélectionner une classe',

  // Groupes
  NO_APPROVED_STUDENTS: 'Aucun étudiant approuvé trouvé pour cette classe',
  SELECT_AT_LEAST_ONE: 'Veuillez sélectionner au moins un étudiant',
} as const

// Titres de modals/alertes
export const TITLES = {
  SUCCESS: 'Succès',
  ERROR: 'Erreur',
  WARNING: 'Attention',
  INFO: 'Information',
  CONFIRM: 'Confirmation',
  DELETE: 'Suppression',
  UPDATE: 'Modification',
  CREATE: 'Création',
} as const

// Labels de boutons
export const BUTTON_LABELS = {
  // Actions principales
  SAVE: 'Enregistrer',
  CANCEL: 'Annuler',
  CLOSE: 'Fermer',
  DELETE: 'Supprimer',
  EDIT: 'Modifier',
  CREATE: 'Créer',
  ADD: 'Ajouter',
  REMOVE: 'Retirer',

  // Confirmation
  CONFIRM: 'Confirmer',
  YES: 'Oui',
  NO: 'Non',
  OK: 'OK',

  // Navigation
  NEXT: 'Suivant',
  PREVIOUS: 'Précédent',
  BACK: 'Retour',
  CONTINUE: 'Continuer',

  // Recherche/Filtres
  SEARCH: 'Rechercher',
  FILTER: 'Filtrer',
  RESET: 'Réinitialiser',
  CLEAR: 'Effacer',

  // Export/Import
  EXPORT: 'Exporter',
  IMPORT: 'Importer',
  DOWNLOAD: 'Télécharger',
  UPLOAD: 'Téléverser',

  // Sélection
  SELECT_ALL: 'Tout sélectionner',
  DESELECT_ALL: 'Tout désélectionner',
  SELECT: 'Sélectionner',

  // Vue
  VIEW_DETAILS: 'Voir les détails',
  HIDE_DETAILS: 'Masquer les détails',
  SHOW_MORE: 'Voir plus',
  SHOW_LESS: 'Voir moins',
} as const
