import { useState, useEffect } from 'react';
import InscriptionService from '../../services/inscription.service';

const usePendingStudentsData = () => {
  const [academicYears, setAcademicYears] = useState([]);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [graphesData, setGraphesData] = useState({ inscritsParFiliere: [], admis: 0, rejetes: 0 });
  const [filterOptions, setFilterOptions] = useState({ filieres: [], years: [], entryDiplomas: [], statuts: [] });
  const [selectedYear, setSelectedYear] = useState('2024-2025');
  const [selectedFiliere, setSelectedFiliere] = useState('all');
  const [selectedEntryDiploma, setSelectedEntryDiploma] = useState('all');
  const [selectedStatut, setSelectedStatut] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const yearsData = await InscriptionService.academicYears('all');
        setAcademicYears(yearsData || []);

        const filterData = await InscriptionService.filterOptions();
        setFilterOptions(filterData || { filieres: [], years: [], entryDiplomas: [], statuts: [] });

        const studentsData = await InscriptionService.pendingStudents(
          'all',
          selectedFiliere,
          selectedYear,
          selectedEntryDiploma,
          selectedStatut,
          currentPage,
          searchQuery
        );
        setPendingStudents(studentsData.data || []);
        setTotalStudents(studentsData.total || 0);
        setTotalPages(studentsData.totalPages || 1);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setError('Impossible de charger les données.');
        setPendingStudents([]);
        setTotalStudents(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear, selectedFiliere, selectedEntryDiploma, selectedStatut, currentPage, searchQuery]);

  // Fonction pour mettre à jour les pièces d'un étudiant
  const updateStudentPieces = async (studentId, newPieces) => {
    try {
      const response = await InscriptionService.updatePieces(studentId, newPieces);
      setPendingStudents(prev =>
        prev.map(student =>
          student.id === studentId ? { ...student, pieces: response.pieces } : student
        )
      );
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la mise à jour des pièces:', error);
      setError('Impossible de mettre à jour les pièces.');
      return { success: false, error };
    }
  };

  const sendStudentMail = async (studentsData) => {
    try {
      const response = await InscriptionService.sendMail(studentsData);
      if (response.success) {
        setPendingStudents(prev =>
          prev.map(student => {
            const studentData = studentsData.find(data => data.studentId === student.id);
            if (studentData) {
              return {
                ...student,
                mailCucaEnvoye: studentData.opinionCuca ? 'Oui' : student.mailCucaEnvoye,
                mailCucaCount: studentData.opinionCuca ? (student.mailCucaCount || 0) + 1 : student.mailCucaCount,
                mailCuoEnvoye: studentData.opinionCuo ? 'Oui' : student.mailCuoEnvoye,
                mailCuoCount: studentData.opinionCuo ? (student.mailCuoCount || 0) + 1 : student.mailCuoCount,
                opinionCuca: studentData.opinionCuca || student.opinionCuca,
                commentaireCuca: studentData.commentaireCuca || student.commentaireCuca,
                opinionCuo: studentData.opinionCuo || student.opinionCuo,
                commentaireCuo: studentData.commentaireCuo || student.commentaireCuo,
              };
            }
            return student;
          })
        );
        return { success: true };
      } else {
        setError('Échec de l\'envoi du mail.');
        return { success: false };
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du mail:', error);
      setError('Une erreur est survenue lors de l\'envoi du mail.');
      return { success: false, error };
    }
  };

  // Fonction pour exporter les données
  const exportData = async (format) => {
    try {
      const endpoint = `/export/${format}?year=${selectedYear}&filiere=${selectedFiliere}`;
      const response = await InscriptionService.exportData(endpoint);
      if (response.success) {
        return { success: true, url: response.url };
      } else {
        setError('Échec de l\'export.');
        return { success: false };
      }
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      setError('Une erreur est survenue lors de l\'export.');
      return { success: false, error };
    }
  };

  return {
    academicYears,
    pendingStudents,
    graphesData,
    filterOptions,
    selectedYear,
    setSelectedYear,
    selectedFiliere,
    setSelectedFiliere,
    selectedEntryDiploma,
    setSelectedEntryDiploma,
    selectedStatut,
    setSelectedStatut,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalStudents,
    totalPages,
    loading,
    error,
    updateStudentPieces,
    sendStudentMail,
    exportData,
  };
};

export default usePendingStudentsData;