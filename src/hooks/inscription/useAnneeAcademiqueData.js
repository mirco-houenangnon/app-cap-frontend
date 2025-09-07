import { useState, useEffect } from 'react';
import InscriptionService from '../../services/inscription.service';
import { format, parse } from 'date-fns';
import { fr } from 'date-fns/locale';

const useAnneeAcademiquesData = () => {
  const [academicYears, setAcademicYears] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Formater les dates pour l'affichage
  const formatDate = (dateStr) => {
    try {
      const parsedDate = parse(dateStr, 'dd/MM/yyyy', new Date());
      return format(parsedDate, 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      console.error('Erreur lors du formatage de la date:', dateStr, error);
      return dateStr;
    }
  };

  const safeFormat = (dateStr) => {
  const d = new Date(dateStr);
  return isNaN(d) ? '' : format(d, 'dd/MM/yyyy HH:mm', { locale: fr });
};

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const yearsData = await InscriptionService.academicYears('all');
        // Formater les dates des années académiques
        const formattedYears = yearsData.map(year => ({
          ...year,
          debut: formatDate(year.debut),
          fin: formatDate(year.fin),
        }));
        setAcademicYears(formattedYears || []);

        const filieresData = await InscriptionService.getFilieres();
        setFilieres(filieresData || []);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setError('Impossible de charger les données.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fonction pour créer une nouvelle année académique
  const createAcademicYear = async (start, end) => {
    try {
      const response = await InscriptionService.createAcademicYear(start, end);
      if (response.success) {
        setAcademicYears(prev => [
          ...prev,
          {
            ...response.year,
            debut: formatDate(response.year.debut),
            fin: formatDate(response.year.fin),
          }
        ]);
        return { success: true };
      } else {
        setError('Échec de la création de l\'année académique.');
        return { success: false };
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'année académique:', error);
      setError('Une erreur est survenue lors de la création de l\'année académique.');
      return { success: false };
    }
  };

  // Fonction pour ajouter une période à une année académique
  const addPeriod = async (yearId, type, startDate, startTime, endDate, endTime, selectedFilieres) => {
    try {
      const response = await InscriptionService.addPeriod(yearId, type, startDate, startTime, endDate, endTime, selectedFilieres);
      if (response.success) {
        return { success: true };
      } else {
        setError(response.error || 'Échec de l\'ajout de la période.');
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la période:', error);
      setError('Une erreur est survenue lors de l\'ajout de la période.');
      return { success: false };
    }
  };

  // Fonction pour récupérer les périodes d'une année académique
  const getPeriods = async (yearId) => {
    try {
      const periodsData = await InscriptionService.getPeriods(yearId);
      // Formater les dates des périodes
      const formattedPeriods = periodsData.map(period => ({
  ...period,
  start: safeFormat(period.start),
  end: safeFormat(period.end),
}));
      return formattedPeriods || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des périodes:', error);
      setError('Impossible de charger les périodes.');
      return [];
    }
  };

  return {
    academicYears,
    filieres,
    loading,
    error,
    createAcademicYear,
    addPeriod,
    getPeriods,
  };
};

export default useAnneeAcademiquesData;