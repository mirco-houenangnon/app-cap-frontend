import { useState, useEffect } from 'react';
import InscriptionService from '../../services/inscription.service'; 
import { format, parse } from 'date-fns'; 
import { fr } from 'date-fns/locale'; 

const useDashboardData = () => {
    const [stats, setStats] = useState({});
    const [academicYears, setAcademicYears] = useState([]);
    const [pendingStudents, setPendingStudents] = useState([]);
    const [graphesData, setGraphesData] = useState({ inscritsParFiliere: [] });
    const [selectedYear, setSelectedYear] = useState('');
    const [loading, setLoading] = useState(true);

    const formatDate = (dateStr) => {
        try {
            const parsedDate = parse(dateStr, 'dd/MM/yyyy', new Date());
            return format(parsedDate, 'dd MMMM yyyy', { locale: fr });
        } catch (error) {
            console.error('Erreur lors du formatage de la date:', dateStr, error);
            return dateStr; 
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsRes = await InscriptionService.stats();
                setStats(statsRes);
                setSelectedYear(statsRes.anneeAcademique);
                const yearsRes = await InscriptionService.academicYears('some');
                const formattedYears = yearsRes.map(year => ({
                    ...year,
                    debut: formatDate(year.debut),
                    fin: formatDate(year.fin),
                    periodesDepot: year.periodesDepot
                        .split(' - ')
                        .map(date => formatDate(date))
                        .join(' - ')
                }));
                setAcademicYears(formattedYears);

                const studentsRes = await InscriptionService.pendingStudents('some');
                console.log(studentsRes)

                const formattedStudents = studentsRes.data.map(student => ({
                    ...student,
                    dateDepot: formatDate(student.dateDepot)
                }));
                setPendingStudents(formattedStudents);

                const graphesRes = await InscriptionService.graphes(statsRes.anneeAcademique);
                setGraphesData(graphesRes);
            } catch (error) {
                console.error('Erreur lors du fetch des données:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Refetch graphes quand l'année change
    useEffect(() => {
        if (selectedYear) {
            const fetchGraphes = async () => {
                const graphesRes = await InscriptionService.graphes(selectedYear);
                setGraphesData(graphesRes);
            };
            fetchGraphes();
        }
    }, [selectedYear]);

    return { stats, academicYears, pendingStudents, graphesData, selectedYear, setSelectedYear, loading };
};

export default useDashboardData;