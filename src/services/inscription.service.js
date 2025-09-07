import HttpService from './http.service'

class InscriptionService {
  /**
   * Récupère les statistiques générales : Nombre d'étudiants inscrits au CAP (toutes années confondues),
   * Dossiers en attente pour l'année courante, Année académique courante, Nombre de filières.
   * @returns {Promise<Object>} Un objet avec les stats (ex: { inscritsCap: number, dossiersAttente: number, anneeAcademique: string, nombreFilieres: number }).
   */
  stats = async () => {
    const statsEndpoint = '/stats'
    // return await HttpService.get(statsEndpoint);
    return Promise.resolve({
      inscritsCap: 1500,
      dossiersAttente: 120,
      anneeAcademique: '2024-2025',
      nombreFilieres: 8, // Mock
    })
  }

  /**
   * Récupère les données pour les graphes : Nombre d'inscrits par filière par année académique,
   * et les statuts admis/rejetés par année académique.
   * @param {string} annee - L'année académique en query param (ex: '2024-2025').
   * @returns {Promise<Object>} Un objet avec les données (ex: { inscritsParFiliere: Array<{filiere: string, count: number}>, admis: number, rejetes: number }).
   */
  graphes = async (annee) => {
    const graphesEndpoint = `/graphes?annee=${annee}`
    // return await HttpService.get(graphesEndpoint);
    return Promise.resolve({
      inscritsParFiliere: [
        { filiere: 'Informatique', count: 300 },
        { filiere: 'Gestion', count: 200 },
        { filiere: 'Droit', count: 150 },
        { filiere: 'Médecine', count: 100 },
        { filiere: 'Ingénierie', count: 250 },
        { filiere: 'Économie', count: 180 },
        { filiere: 'Arts', count: 120 },
        { filiere: 'Sciences', count: 200 },
      ],
      admis: 800,
      rejetes: 200,
    })
  }

  /**
   * Récupère les années académiques avec leur date de début, date de fin, et périodes de dépôt associées.
   * @param {string} mode - Query param : 'some' pour les 4 dernières années, 'all' pour toutes.
   * @returns {Promise<Array<Object>>} Un tableau d'objets (ex: [{ annee: string, debut: string, fin: string, periodesDepot: string }]).
   */
  academicYears = async (mode = 'some') => {
    const academicYearsEndpoint = `/academic-years?mode=${mode}`
    // return await HttpService.get(academicYearsEndpoint);
    return Promise.resolve([
      // Mock (4 dernières pour 'some')
      {
        annee: '2024-2025',
        debut: '01/09/2024',
        fin: '30/06/2025',
        periodesDepot: '01/07/2024 - 31/08/2024',
      },
      {
        annee: '2023-2024',
        debut: '01/09/2023',
        fin: '30/06/2024',
        periodesDepot: '01/07/2023 - 31/08/2023',
      },
      {
        annee: '2022-2023',
        debut: '01/09/2022',
        fin: '30/06/2023',
        periodesDepot: '01/07/2022 - 31/08/2022',
      },
      {
        annee: '2021-2022',
        debut: '01/09/2021',
        fin: '30/06/2022',
        periodesDepot: '01/07/2021 - 31/08/2021',
      },
    ])
  }

  /**
   * Récupère les étudiants en attente avec pagination et recherche
   * @param {string} mode - 'some' pour les 10 derniers, 'all' pour tous avec filtres
   * @param {string} filiere - Filtre par filière
   * @param {string} year - Filtre par année académique
   * @param {string} entryDiploma - Filtre par diplôme d'entrée
   * @param {string} statut - Filtre par statut
   * @param {number} page - Numéro de la page (1-based)
   * @param {string} search - Terme de recherche
   * @returns {Promise<Object>} Un objet avec les données paginées et le total
   */
  pendingStudents = async (
    mode = 'some',
    filiere = 'all',
    year = 'all',
    entryDiploma = 'all',
    statut = 'all',
    page = 1,
    search = '',
  ) => {
    const itemsPerPage = 10
    const pendingStudentsEndpoint =
      mode === 'some'
        ? `/pending-students?mode=${mode}&page=${page}&search=${encodeURIComponent(search)}`
        : `/pending-students?mode=${mode}&filiere=${filiere}&year=${year}&entryDiploma=${entryDiploma}&statut=${statut}&page=${page}&search=${encodeURIComponent(search)}`
    // return await HttpService.get(pendingStudentsEndpoint);
    const fullData = [
      {
        id: 1,
        nomPrenoms: 'Doe John',
        sexe: 'Homme',
        filiere: 'Informatique',
        dateDepot: '15/08/2024',
        statut: 'En attente',
        opinionCuca: 'Favorable',
        commentaireCuca: 'Dossier complet',
        opinionCuo: 'En cours',
        mailCucaEnvoye: 'Oui',
        mailCuoEnvoye: 'Non',
        pieces: ['CNI', 'Diplôme', 'Relevé'],
      },
      {
        id: 2,
        nomPrenoms: 'Smith Jane',
        sexe: 'Femme',
        filiere: 'Gestion',
        dateDepot: '20/08/2024',
        statut: 'Rejeté',
        opinionCuca: 'Défavorable',
        commentaireCuca: 'Pièces manquantes',
        opinionCuo: 'Rejeté',
        mailCucaEnvoye: 'Oui',
        mailCuoEnvoye: 'Oui',
        pieces: ['CNI', 'Photo'],
      },
      {
        id: 3,
        nomPrenoms: 'Martin Paul',
        sexe: 'Homme',
        filiere: 'Droit',
        dateDepot: '25/08/2024',
        statut: 'Approuvé',
        opinionCuca: 'Favorable',
        commentaireCuca: 'Validé',
        opinionCuo: 'Approuvé',
        mailCucaEnvoye: 'Oui',
        mailCuoEnvoye: 'Oui',
        pieces: ['CNI', 'Diplôme', 'Relevé', 'Photo'],
      },
      {
        id: 4,
        nomPrenoms: 'Dupont Marie',
        sexe: 'Femme',
        filiere: 'Médecine',
        dateDepot: '10/08/2024',
        statut: 'En attente',
        opinionCuca: 'En cours',
        commentaireCuca: 'En attente de validation',
        opinionCuo: 'En cours',
        mailCucaEnvoye: 'Non',
        mailCuoEnvoye: 'Non',
        pieces: ['CNI', 'Relevé'],
      },
      {
        id: 5,
        nomPrenoms: 'Leroy Jean',
        sexe: 'Homme',
        filiere: 'Ingénierie',
        dateDepot: '05/08/2024',
        statut: 'En attente',
        opinionCuca: 'Favorable',
        commentaireCuca: 'Dossier complet',
        opinionCuo: 'En cours',
        mailCucaEnvoye: 'Oui',
        mailCuoEnvoye: 'Non',
        pieces: ['CNI', 'Diplôme'],
      },
      {
        id: 6,
        nomPrenoms: 'Bernard Sophie',
        sexe: 'Femme',
        filiere: 'Économie',
        dateDepot: '30/07/2024',
        statut: 'Rejeté',
        opinionCuca: 'Défavorable',
        commentaireCuca: 'Manque diplôme',
        opinionCuo: 'Rejeté',
        mailCucaEnvoye: 'Oui',
        mailCuoEnvoye: 'Oui',
        pieces: ['CNI', 'Photo'],
      },
      {
        id: 7,
        nomPrenoms: 'Garcia Luis',
        sexe: 'Homme',
        filiere: 'Arts',
        dateDepot: '01/08/2024',
        statut: 'Approuvé',
        opinionCuca: 'Favorable',
        commentaireCuca: 'Validé',
        opinionCuo: 'Approuvé',
        mailCucaEnvoye: 'Oui',
        mailCuoEnvoye: 'Oui',
        pieces: ['CNI', 'Diplôme', 'Relevé'],
      },
      {
        id: 8,
        nomPrenoms: 'Martinez Anna',
        sexe: 'Femme',
        filiere: 'Sciences',
        dateDepot: '12/08/2024',
        statut: 'En attente',
        opinionCuca: 'En cours',
        commentaireCuca: 'En attente',
        opinionCuo: 'En cours',
        mailCucaEnvoye: 'Non',
        mailCuoEnvoye: 'Non',
        pieces: ['CNI', 'Relevé'],
      },
      {
        id: 9,
        nomPrenoms: 'Petit Thomas',
        sexe: 'Homme',
        filiere: 'Informatique',
        dateDepot: '18/08/2024',
        statut: 'En attente',
        opinionCuca: 'Favorable',
        commentaireCuca: 'Dossier complet',
        opinionCuo: 'En cours',
        mailCucaEnvoye: 'Oui',
        mailCuoEnvoye: 'Non',
        pieces: ['CNI', 'Diplôme', 'Photo'],
      },
      {
        id: 10,
        nomPrenoms: 'Robert Emma',
        sexe: 'Femme',
        filiere: 'Gestion',
        dateDepot: '22/08/2024',
        statut: 'Approuvé',
        opinionCuca: 'Favorable',
        commentaireCuca: 'Validé',
        opinionCuo: 'Approuvé',
        mailCucaEnvoye: 'Oui',
        mailCuoEnvoye: 'Oui',
        pieces: ['CNI', 'Diplôme', 'Relevé', 'Photo'],
      },
      // Plus d'éléments pour tester la pagination
      {
        id: 11,
        nomPrenoms: 'Moreau Claire',
        sexe: 'Femme',
        filiere: 'Informatique',
        dateDepot: '23/08/2024',
        statut: 'En attente',
        opinionCuca: 'En cours',
        commentaireCuca: 'En attente',
        opinionCuo: 'En cours',
        mailCucaEnvoye: 'Non',
        mailCuoEnvoye: 'Non',
        pieces: ['CNI', 'Relevé'],
      },
      {
        id: 12,
        nomPrenoms: 'Roux Pierre',
        sexe: 'Homme',
        filiere: 'Gestion',
        dateDepot: '24/08/2024',
        statut: 'Approuvé',
        opinionCuca: 'Favorable',
        commentaireCuca: 'Validé',
        opinionCuo: 'Approuvé',
        mailCucaEnvoye: 'Oui',
        mailCuoEnvoye: 'Oui',
        pieces: ['CNI', 'Diplôme'],
      },
    ]

    // Appliquer les filtres et la recherche
    let filteredData = fullData

    if (mode === 'all') {
      if (filiere !== 'all') {
        filteredData = filteredData.filter((item) => item.filiere === filiere)
      }
      if (year !== 'all') {
        filteredData = filteredData.filter((item) => item.dateDepot.includes(year.split('-')[0]))
      }
      if (entryDiploma !== 'all') {
        filteredData = filteredData.filter((item) => item.pieces.includes(entryDiploma))
      }
      if (statut !== 'all') {
        filteredData = filteredData.filter((item) => item.statut === statut)
      }
      if (search) {
        const searchLower = search.toLowerCase()
        filteredData = filteredData.filter(
          (item) =>
            item.nomPrenoms.toLowerCase().includes(searchLower) ||
            item.sexe.toLowerCase().includes(searchLower) ||
            item.filiere.toLowerCase().includes(searchLower) ||
            item.dateDepot.toLowerCase().includes(searchLower) ||
            item.statut.toLowerCase().includes(searchLower) ||
            item.opinionCuca.toLowerCase().includes(searchLower) ||
            item.commentaireCuca.toLowerCase().includes(searchLower) ||
            item.opinionCuo.toLowerCase().includes(searchLower) ||
            item.mailCucaEnvoye.toLowerCase().includes(searchLower) ||
            item.mailCuoEnvoye.toLowerCase().includes(searchLower),
        )
      }
    } else {
      // Mode 'some' : retourner les 10 premiers après filtrage
      filteredData = filteredData.slice(0, 10)
    }

    // Pagination
    const totalItems = filteredData.length
    const startIndex = (page - 1) * itemsPerPage
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

    return Promise.resolve({
      data: paginatedData,
      total: totalItems,
      page,
      totalPages: Math.ceil(totalItems / itemsPerPage),
    })
  }

  /**
 * Récupère les options de filtre pour les étudiants (années, filières, diplômes, niveaux, statuts).
 * @param {string} mode Mode de filtre (par défaut: 'pending').
 * @returns {Promise<Object>} Options de filtre.
 */
  filterOptions = async (mode = 'pending') => {
    const endpoint = `/filter-options?${mode}`
    // return await HttpService.get(endpoint);
    return Promise.resolve({
      years: ['2024-2025', '2023-2024', '2022-2023', '2021-2022'],
      filieres: [
        'Informatique',
        'Gestion',
        'Droit',
        'Médecine',
        'Ingénierie',
        'Économie',
        'Arts',
        'Sciences',
      ],
      entryDiplomas: ['Baccalauréat', 'BTS', 'Licence', 'Master'],
      statuts: ['En attente', 'Validé', 'Rejeté'],
      niveaux: {
        Informatique: ['INFO1', 'INFO2', 'INFO3'],
        Gestion: ['GC1', 'GC2', 'GC3'],
        Droit: ['DR1', 'DR2', 'DR3'],
        Médecine: ['MED1', 'MED2', 'MED3', 'MED4', 'MED5'],
        Ingénierie: ['ING1', 'ING2', 'ING3'],
        Économie: ['ECO1', 'ECO2', 'ECO3'],
        Arts: ['ART1', 'ART2', 'ART3'],
        Sciences: ['SCI1', 'SCI2', 'SCI3'],
      },
    })
  }


  /**
   * Envoie un ou plusieurs mails
   */
  sendMail = async (studentsData) => {
    const sendMailEndpoint = '/send-mail'
    // return await HttpService.post(sendMailEndpoint, studentsData);
    return Promise.resolve({ success: true })
  }

  /**
   * Exporte les données dans le format spécifié
   */
  exportData = async (endpoint) => {
    // return await HttpService.get(endpoint);
    return Promise.resolve({
      success: true,
      url: `http://example.com/export_${endpoint.split('/')[2]}`,
    })
  }

  /**
   * Récupère la liste des filières (fixe)
   * @returns {Promise<Array<string>>} Un tableau de filières.
   */
  getFilieres = async () => {
    const filieresEndpoint = '/filieres'
    // return await HttpService.get(filieresEndpoint);
    return Promise.resolve([
      'Informatique',
      'Gestion',
      'Droit',
      'Médecine',
      'Ingénierie',
      'Économie',
      'Arts',
      'Sciences',
    ])
  }

  /**
   * Crée une nouvelle année académique
   * @param {Date} start - Date de début.
   * @param {Date} end - Date de fin.
   * @returns {Promise<Object>} { success: boolean, year: Object }.
   */
  createAcademicYear = async (start, end) => {
    const createEndpoint = '/academic-years'
    // return await HttpService.post(createEndpoint, { start, end });
    return Promise.resolve({
      success: true,
      year: {
        id: Math.floor(Math.random() * 1000),
        annee: `${new Date(start).getFullYear()}-${new Date(end).getFullYear() + 1}`,
        debut: start.toLocaleDateString('fr-FR'),
        fin: end.toLocaleDateString('fr-FR'),
      },
    })
  }

  /**
   * Ajoute une période à une année académique
   * @param {number} yearId - ID de l'année.
   * @param {string} type - 'depot' ou 'reclamation'.
   * @param {Date} startDate - Date de début.
   * @param {Date} startTime - Heure de début.
   * @param {Date} endDate - Date de fin.
   * @param {Date} endTime - Heure de fin.
   * @param {Array<string>} filieres - Tableau de filières.
   * @returns {Promise<Object>} { success: boolean, error?: string }.
   */
  addPeriod = async (yearId, type, startDate, startTime, endDate, endTime, filieres) => {
    const addPeriodEndpoint = `/academic-years/${yearId}/periods`
    // return await HttpService.post(addPeriodEndpoint, { type, startDate, startTime, endDate, endTime, filieres });

    // Simulation de validation pour réclamation
    if (type === 'reclamation') {
      // Simuler la récupération des périodes de dépôt existantes
      const existingPeriods = await this.getPeriods(yearId)
      const depotPeriods = existingPeriods.filter((p) => p.type === 'depot')
      if (depotPeriods.length === 0) {
        return Promise.resolve({
          success: false,
          error: "Aucune période de dépôt définie. Impossible d'ajouter une réclamation.",
        })
      }
      const latestDepotEnd = depotPeriods.reduce(
        (max, p) => (new Date(p.end) > max ? new Date(p.end) : max),
        new Date(0),
      )
      const reclamationStart = new Date(startDate)
      reclamationStart.setHours(startTime.getHours(), startTime.getMinutes())
      if (reclamationStart <= latestDepotEnd) {
        return Promise.resolve({
          success: false,
          error:
            'La date de début de réclamation doit être postérieure à la date de fin du dépôt le plus tardif.',
        })
      }
    }

    return Promise.resolve({ success: true })
  }

  /**
   * Récupère les périodes pour une année académique
   * @param {number} yearId - ID de l'année.
   * @returns {Promise<Array<Object>>} Un tableau de périodes (ex: [{ type: string, start: string, end: string, filieres: Array<string> }]).
   */
  getPeriods = async (yearId) => {
    const getPeriodsEndpoint = `/academic-years/${yearId}/periods`
    // return await HttpService.get(getPeriodsEndpoint);
    return Promise.resolve([
      {
        type: 'depot',
        start: '01/07/2024 09:00',
        end: '31/08/2024 18:00',
        filieres: ['Informatique', 'Gestion'],
      },
      {
        type: 'depot',
        start: '01/09/2024 09:00',
        end: '15/09/2024 18:00',
        filieres: ['Droit', 'Médecine'],
      },
      {
        type: 'reclamation',
        start: '16/09/2024 09:00',
        end: '30/09/2024 18:00',
        filieres: ['Informatique', 'Gestion', 'Droit'],
      },
    ])
  }

  /**
   * Récupère la liste des étudiants avec pagination et filtres.
   * @param {string} year - Année académique.
   * @param {string} filiere - Filière.
   * @param {string} entryDiploma - Diplôme d'entrée.
   * @param {string} redoublant - 'oui' ou 'non'.
   * @param {number} page - Numéro de page.
   * @param {string} search - Terme de recherche.
   * @returns {Promise<Object>} { data: Array, total: number, totalPages: number }.
   */
  studentsList = async (
    year = 'all',
    filiere = 'all',
    entryDiploma = 'all',
    redoublant = 'all',
    niveau = 'all',
    page = 1,
    search = '',
  ) => {
    const itemsPerPage = 10
    const endpoint = `/students?year=${year}&filiere=${filiere}&entryDiploma=${entryDiploma}&redoublant=${redoublant}&niveau=${niveau}&page=${page}&search=${encodeURIComponent(search)}`
    // return await HttpService.get(endpoint);
    const fullData = [
      {
        id: 1,
        matricule: 'MAT001',
        nomPrenoms: 'Doe John',
        sexe: 'Homme',
        redoublant: 'non',
        dateNaissance: '15/05/2000',
        filiere: 'Informatique',
        annee: '2024-2025',
        entryDiploma: 'Baccalauréat',
        statut: 'Actif',
        email: 'john.doe@example.com',
        telephone: '123456789',
        niveau: 'INFO1',
      },
      {
        id: 2,
        matricule: 'MAT002',
        nomPrenoms: 'Smith Jane',
        sexe: 'Femme',
        redoublant: 'oui',
        dateNaissance: '20/06/1999',
        filiere: 'Gestion',
        annee: '2024-2025',
        entryDiploma: 'BTS',
        statut: 'Actif',
        email: 'jane.smith@example.com',
        telephone: '987654321',
        niveau: 'GC2',
      },
      {
        id: 3,
        matricule: 'MAT003',
        nomPrenoms: 'Martin Paul',
        sexe: 'Homme',
        redoublant: 'non',
        dateNaissance: '25/07/2001',
        filiere: 'Droit',
        annee: '2023-2024',
        entryDiploma: 'Licence',
        statut: 'Inactif',
        email: 'paul.martin@example.com',
        telephone: '456789123',
        niveau: 'DR1',
      },
      {
        id: 4,
        matricule: 'MAT004',
        nomPrenoms: 'Dupont Marie',
        sexe: 'Femme',
        redoublant: 'oui',
        dateNaissance: '10/08/2000',
        filiere: 'Médecine',
        annee: '2024-2025',
        entryDiploma: 'Baccalauréat',
        statut: 'Actif',
        email: 'marie.dupont@example.com',
        telephone: '321654987',
        niveau: 'MED3',
      },
      {
        id: 5,
        matricule: 'MAT005',
        nomPrenoms: 'Leroy Jean',
        sexe: 'Homme',
        redoublant: 'non',
        dateNaissance: '05/09/1998',
        filiere: 'Ingénierie',
        annee: '2024-2025',
        entryDiploma: 'BTS',
        statut: 'Actif',
        email: 'jean.leroy@example.com',
        telephone: '654321789',
        niveau: 'ING2',
      },
      {
        id: 6,
        matricule: 'MAT006',
        nomPrenoms: 'Bernard Sophie',
        sexe: 'Femme',
        redoublant: 'oui',
        dateNaissance: '30/10/2002',
        filiere: 'Économie',
        annee: '2023-2024',
        entryDiploma: 'Licence',
        statut: 'Inactif',
        email: 'sophie.bernard@example.com',
        telephone: '789123456',
        niveau: 'ECO1',
      },
      {
        id: 7,
        matricule: 'MAT007',
        nomPrenoms: 'Garcia Luis',
        sexe: 'Homme',
        redoublant: 'non',
        dateNaissance: '01/11/1997',
        filiere: 'Arts',
        annee: '2024-2025',
        entryDiploma: 'Baccalauréat',
        statut: 'Actif',
        email: 'luis.garcia@example.com',
        telephone: '147258369',
        niveau: 'ART1',
      },
      {
        id: 8,
        matricule: 'MAT008',
        nomPrenoms: 'Martinez Anna',
        sexe: 'Femme',
        redoublant: 'oui',
        dateNaissance: '12/12/2003',
        filiere: 'Sciences',
        annee: '2024-2025',
        entryDiploma: 'BTS',
        statut: 'Actif',
        email: 'anna.martinez@example.com',
        telephone: '258369147',
        niveau: 'SCI2',
      },
      {
        id: 9,
        matricule: 'MAT009',
        nomPrenoms: 'Petit Thomas',
        sexe: 'Homme',
        redoublant: 'non',
        dateNaissance: '18/01/2001',
        filiere: 'Informatique',
        annee: '2023-2024',
        entryDiploma: 'Licence',
        statut: 'Actif',
        email: 'thomas.petit@example.com',
        telephone: '369147258',
        niveau: 'INFO3',
      },
      {
        id: 10,
        matricule: 'MAT010',
        nomPrenoms: 'Robert Emma',
        sexe: 'Femme',
        redoublant: 'oui',
        dateNaissance: '22/02/1999',
        filiere: 'Gestion',
        annee: '2024-2025',
        entryDiploma: 'Baccalauréat',
        statut: 'Actif',
        email: 'emma.robert@example.com',
        telephone: '741852963',
        niveau: 'GC3',
      },
      {
        id: 11,
        matricule: 'MAT011',
        nomPrenoms: 'Moreau Claire',
        sexe: 'Femme',
        redoublant: 'non',
        dateNaissance: '23/03/2000',
        filiere: 'Informatique',
        annee: '2024-2025',
        entryDiploma: 'BTS',
        statut: 'Inactif',
        email: 'claire.moreau@example.com',
        telephone: '852963741',
        niveau: 'INFO2',
      },
      {
        id: 12,
        matricule: 'MAT012',
        nomPrenoms: 'Roux Pierre',
        sexe: 'Homme',
        redoublant: 'oui',
        dateNaissance: '24/04/2002',
        filiere: 'Gestion',
        annee: '2023-2024',
        entryDiploma: 'Licence',
        statut: 'Actif',
        email: 'pierre.roux@example.com',
        telephone: '963741852',
        niveau: 'GC1',
      },
    ]

    // Filtrage et recherche simulés
    let filteredData = fullData
    if (year !== 'all') {
      filteredData = filteredData.filter((item) => item.annee === year)
    }
    if (filiere !== 'all') {
      filteredData = filteredData.filter((item) => item.filiere === filiere)
    }
    if (entryDiploma !== 'all') {
      filteredData = filteredData.filter((item) => item.entryDiploma === entryDiploma)
    }
    if (niveau !== 'all') {
      filteredData = filteredData.filter((item) => item.niveau === niveau)
    }
    if (redoublant !== 'all') {
      filteredData = filteredData.filter((item) => item.redoublant === redoublant)
    }
    if (search) {
      const searchLower = search.toLowerCase()
      filteredData = filteredData.filter(
        (item) =>
          item.matricule.toLowerCase().includes(searchLower) ||
          item.nomPrenoms.toLowerCase().includes(searchLower) ||
          item.sexe.toLowerCase().includes(searchLower) ||
          item.redoublant.toLowerCase().includes(searchLower) ||
          item.dateNaissance.toLowerCase().includes(searchLower),
      )
    }

    const totalItems = filteredData.length
    const startIndex = (page - 1) * itemsPerPage
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

    return Promise.resolve({
      data: paginatedData,
      total: totalItems,
      totalPages: Math.ceil(totalItems / itemsPerPage),
    })
  }

  /**
   * Récupère les détails d'un étudiant par ID.
   * @param {number} studentId - ID de l'étudiant.
   * @returns {Promise<Object>} Les détails de l'étudiant.
   */
  getStudentDetails = async (studentId) => {
    const endpoint = `/students/${studentId}`
    // return await HttpService.get(endpoint);
    const student = fullData.find((item) => item.id === studentId) || {}
    return Promise.resolve(student)
  }

  /**
   * Exporte une liste (émargement ou notes) avec query params.
   * @param {string} type - 'emargement' ou 'notes'.
   * @param {string} year - Année académique.
   * @param {string} filiere - Filière.
   * @returns {Promise<Object>} { success: boolean, url: string }.
   */
  exportList = async (type, year, filiere) => {
    const endpoint = `/export/${type}?year=${year}&filiere=${filiere}`
    // return await HttpService.get(endpoint);
    return Promise.resolve({
      success: true,
      url: `http://example.com/export_${type}_${year}_${filiere}.pdf`,
    })
  }
}

export default new InscriptionService()
