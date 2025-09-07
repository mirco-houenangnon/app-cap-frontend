import { useState, useEffect } from 'react';
import InscriptionService from '../../services/inscription.service';
import Swal from 'sweetalert2';

const useStudentsListData = () => {
  const [students, setStudents] = useState([]);
  const [filterOptions, setFilterOptions] = useState({ years: [], filieres: [], entryDiplomas: [], redoublants: ['all', 'oui', 'non'], niveaux: {} });
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedFiliere, setSelectedFiliere] = useState('all');
  const [selectedEntryDiploma, setSelectedEntryDiploma] = useState('all');
  const [selectedRedoublant, setSelectedRedoublant] = useState('all');
  const [selectedNiveau, setSelectedNiveau] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const options = await InscriptionService.filterOptions();
        setFilterOptions({
          years: options.years || [],
          filieres: options.filieres || [],
          entryDiplomas: options.entryDiplomas || [],
          niveaux: options.niveaux || {},
          redoublants: ['all', 'oui', 'non'],
        });

        const response = await InscriptionService.studentsList(
          selectedYear,
          selectedFiliere,
          selectedEntryDiploma,
          selectedRedoublant,
          selectedNiveau,
          currentPage,
          searchQuery
        );
        setStudents(response.data || []);
        setTotalPages(response.totalPages || 1);
      } catch (error) {
        console.error('Erreur lors du fetch des données:', error);
        setError('Impossible de charger les données.');
        setStudents([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedYear, selectedFiliere, selectedEntryDiploma, selectedRedoublant, selectedNiveau, currentPage, searchQuery]);

  // Réinitialiser le niveau si la filière change
  useEffect(() => {
    setSelectedNiveau('all');
  }, [selectedFiliere]);

  const getStudentDetails = async (studentId) => {
    try {
      const details = await InscriptionService.getStudentDetails(studentId);
      setStudentDetails(details);
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de l\'étudiant:', error);
      setError('Impossible de charger les détails de l\'étudiant.');
      return { success: false };
    }
  };

  const exportList = async (type) => {
    if (selectedYear === 'all' || selectedFiliere === 'all' || selectedNiveau === 'all') {
      Swal.fire({
        icon: 'warning',
        title: 'Sélection requise',
        text: 'Veuillez sélectionner une année académique, une filière et un niveau avant d\'exporter.',
      });
      return { success: false };
    }
    try {
      const response = await InscriptionService.exportList(type, selectedYear, selectedFiliere, selectedNiveau);
      if (response.success) {
        return { success: true, url: response.url };
      } else {
        setError('Échec de l\'export.');
        return { success: false };
      }
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      setError('Une erreur est survenue lors de l\'export.');
      return { success: false };
    }
  };

  return {
    students,
    filterOptions,
    selectedYear,
    setSelectedYear,
    selectedFiliere,
    setSelectedFiliere,
    selectedEntryDiploma,
    setSelectedEntryDiploma,
    selectedRedoublant,
    setSelectedRedoublant,
    selectedNiveau,
    setSelectedNiveau,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    studentDetails,
    getStudentDetails,
    exportList,
    loading,
    error,
  };
};

export default useStudentsListData;