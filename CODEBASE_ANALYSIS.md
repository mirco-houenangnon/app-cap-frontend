# CAP Application - Codebase Analysis

## Executive Summary

This is a comprehensive academic management system (CAP - Campus Administrative Platform) built with React/TypeScript frontend that manages the complete student lifecycle from application to graduation. The system handles students, admissions, academics, finance, attendance, and human resources.

---

## 1. STUDENT DATA STRUCTURE & CREATION

### Main Student Types

#### `Etudiant` (Active Student)
```
- id: number
- matricule: string (student ID)
- nom: string
- prenom: string
- email: string
- telephone?: string
- date_naissance: string
- lieu_naissance?: string
- sexe: 'M' | 'F'
- nationalite?: string
- adresse?: string
- photo?: string
- specialite_id: number (department/specialty)
- niveau_id: number (study level)
- annee_academique_id: number (academic year)
- statut: 'actif' | 'inactif' | 'suspendu' | 'diplome'
- Relations: specialite, niveau, annee_academique
```

#### `PendingStudent` (Student in Application Process)
```
- id: number
- nom, prenom, email, telephone, date_naissance: string
- sexe: 'M' | 'F'
- nationalite?: string
- specialite_demandee_id?: number
- niveau_demande_id?: number
- statut: 'en_attente' | 'accepte' | 'refuse'
- numero_dossier?: string
- documents?: File[]
- opinionCuca?: string (CUCA committee opinion)
- commentaireCuca?: string
- opinionCuo?: string (CUO committee opinion)
- commentaireCuo?: string
```

#### `PendingStudentData` (API Response Model)
```
- id, email, first_name, last_name, phone, gender: string
- status: 'pending' | 'documents_submitted' | 'approved' | 'rejected'
- department: string
- entry_diploma: { id, name, abbreviation, entry_level }
- files, documents, pieces: array
- exonere?: 'Oui' | 'Non' (financially exempted)
- sponsorise?: 'Oui' | 'Non' (sponsored)
- mailCucaEnvoye, mailCuoEnvoye: counters
```

#### Supporting Data Models
```
AnneeAcademique (Academic Year):
- id, annee: string
- date_debut, date_fin: string
- is_active: boolean

Cycle:
- id, nom, description: string
- duree_annees: number

Specialite (Department/Major):
- id, nom, code: string
- cycle_id: number

Niveau (Study Level):
- id, nom: string
- ordre: number
- cycle_id: number
```

### Student Creation Flow
1. **Candidate Registration** → Creates `PendingStudent`
2. **Document Submission** → Documents stored in `PendingStudentData.documents`
3. **Committee Review** → CUCA/CUO committee sets opinion & comments
4. **Approval Decision** → Status changes to 'approved'
5. **Account Creation** → System creates `Etudiant` record with matricule
6. **Class Assignment** → Student assigned to `ClassGroup`

---

## 2. CANDIDACY/APPLICATION PROCESS

### Services
- **InscriptionService.pendingStudents()** - GET with filters (status, department, academic_year, entry_diploma, level, search, pagination)
- **InscriptionService.getPendingStudent()** - GET by ID
- **InscriptionService.createPendingStudent()** - POST new application
- **InscriptionService.updatePendingStudent()** - PUT update fields

### Process Steps

#### Phase 1: Submission
- Student submits documents during active submission period (managed via `Period`)
- `submitDocuments()` endpoint accepts files and document types
- Status: `pending` → `documents_submitted`

#### Phase 2: Committee Review
- Accessible only during active periods
- Two committees can review:
  - **CUCA**: Sets `opinionCuca`, `commentaireCuca`
  - **CUO**: Sets `opinionCuo`, `commentaireCuo`
- Financial status fields:
  - `exonere`: Whether student is financially exempted
  - `sponsorise`: Whether student is sponsored
- Document management: `renamePiece()` allows custom naming of submitted documents

#### Phase 3: Level Assignment
- `updateLevel()` sets the study level for admitted student
- Can be edited before final validation

#### Phase 4: Validation & Approval
- Status changes to `approved` or `rejected`
- Approved students generate `Etudiant` records
- Communications via `sendMail()` endpoint

### Key Routes
- Dashboard: `inscription/dashboard` - statistics view
- Pending Students: `inscription/pending-students` - review/approve interface
- Academic Years: `inscription/academics-years` - manage academic calendar
- Students List: `inscription/students-list` - view all active students

### Related Types
- `PeriodType`: 'depot' (submission) | 'reclamation' (appeal)
- `StudentListItem`, `StudentDetails` - API response models

---

## 3. REGISTRATION VALIDATION

### Validation Strategy

#### Before Submission
- **Active Period Check**: `checkSubmissionStatus()` verifies submission periods are open
- **Reclamation Period**: `checkReclamationStatus()` for appeals/modifications

#### Document Validation
- Required documents checked by backend
- Documents stored with metadata (name, path, mime_type, size, id)
- `pieces` can have custom names via `renamePiece()`

#### Framework Levels
```typescript
// Hierarchy: Cycle → Specialite → Niveau
Cycle (e.g., "Licence", "Master")
├── Specialite (e.g., "Computer Science")
│   └── Niveau (e.g., "L1", "L2", "L3")
```

#### Academic Level Fees
- Service: `AcademicLevelFeeService`
- Fields per student level:
  - `registration_fee` (inscription)
  - `uemoa_training_fee` (UEMOA students)
  - `non_uemoa_training_fee` (Non-UEMOA students)
  - `exempted_training_fee` (Exempted/sponsored)
- `getStudentFee()` calculates applicable fees based on student origin

#### Admission Workflow
```
Submission → Documents Review → Committee Opinions → Level Assignment → Financial Status → Approval
```

---

## 4. GRADES/NOTES ASSIGNMENT

### Key Components

#### Program Structure
```
Program:
- id: number
- class_group_id: number
- course_element_professor_id: number
- academic_year_id: number
- weighting: { [key: string]: number } 
  // e.g., { "CC": 30, "TP": 20, "EXAMEN": 50 }
- retake_weighting?: { [key: string]: number } 
  // Separate weights for makeup/retake exams
- Relations: classGroup, academicYear, courseElementProfessor
```

#### Grading Services

**NotesService** (Professor Interface):
```
- getMyClasses(filters): Classes grouped by cycle
- getProgramsByClass(classGroupId): Course programs
- getGradeSheet(programUuid, cohort?): Student roster with grade fields
- getStudentsForEvaluation(programUuid, cohort?)
- createEvaluation(programId, notes, isRetake): Initialize evaluation
- updateGrade(student_id, program_id, position, value): Update single grade
- setWeighting(programId, weighting[]): Define evaluation weightings
- duplicateGrade(programId, columnIndex): Copy evaluation column
- deleteEvaluation(programId, columnIndex)
- exportGradeSheet(programUuid, includeRetake?, cohort?)
```

**NotesService** (Admin Interface):
```
- getDashboard(academicYearId?): Overview stats
- getGradesByDepartmentLevel(filters): Query by department, level, program
- getProgramDetails(programId): Full program details
- exportGradesByDepartment(params): Export grades data
```

#### Grade Data Model
```
Student:
- student_pending_student_id: number
- last_name, first_names: string
- grades: number[] (array of scores)
- average?: number
- retake_grades?: number[]
- retake_average?: number
- validated?: boolean
```

#### Evaluation Types
- **Normal Session**: Regular evaluation
- **Retake**: Additional evaluation opportunity
- **Column Index**: Position of evaluation (1st, 2nd, 3rd, etc.)

#### Assignment Workflow
```
1. Professor selects class/program
2. Creates evaluation (initializes -1 values)
3. Enters grades for each student
4. Sets/adjusts weighting (CC%, TP%, Exam%, etc.)
5. System calculates averages
6. Validation occurs at course_element level
7. Admins can duplicate, modify, or delete
8. Exports for deliberation records (PV fin d'année, PV délibération)
```

#### Decision Records
- **PV Fin d'Année**: Year-end proceedings
- **PV Délibération**: Deliberation minutes by semester
- **Recap Notes**: Grade summary document

---

## 5. STUDENT PROGRESSION BETWEEN CLASSES

### Class/Group Structure

#### Core Entities
```
ClassGroup:
- id: number
- name: string (e.g., "L1-Group-A")
- department?: Department
- academic_year?: AcademicYear
- study_level?: string
- Relations: students, programs

Cohort:
- Logical grouping within academic year + department
- Can be time-based or intake-based
- Retrieved via getCohorts(academicYearId?, departmentId?)

StudentPendingStudent:
- Links PendingStudent → accepted into specific ClassGroup
- Used for lifecycle tracking
```

#### Progression Workflow

```
Academic Year Planning:
└─ Create/Update ClassGroups
   ├─ getClassGroups(academicYearId, departmentId, studyLevel, cohort?)
   ├─ createClassGroups(data) - batch create with student assignments
   ├─ createDefaultClassGroup() - auto-populate entire cohort
   └─ deleteClassGroup() / deleteAllClassGroups()

Class Assignment:
└─ During registration period
   ├─ System reads studentsList by filters
   ├─ Assigns to appropriate ClassGroup
   └─ Creates Program entries for each course

Promotion/Retention:
└─ Based on grades + decision logic
   ├─ saveYearDecisions(academicYearId, decisions[])
   │  └─ decisions: { student_id, decision: 'promoted' | 'retained' | 'exempted' }
   └─ New ClassGroup created next year at NiveauNext
```

#### Navigation Parameters
```
Academic Year → Department (Specialite) → Level (Niveau) → Cohort → ClassGroup
```

### Services Used
- `InscriptionService.getClassGroups()` - list groups
- `InscriptionService.createClassGroups()` - create with student assignments
- `InscriptionService.createDefaultClassGroup()` - single default group
- `InscriptionService.getClassGroupDetails()` - inspect group
- `NotesService.saveSemesterDecisions()` - promote/retain per semester
- `NotesService.saveYearDecisions()` - year-end decisions

---

## 6. FINANCIAL MANAGEMENT

### Finance System Architecture

#### Core Types

**Paiement** (Payment):
```
- id, matricule: string
- montant: number
- reference: string (transaction ID)
- numero_compte: string
- date_versement: string
- motif: string (purpose)
- email?, contact?: string
- statut: 'attente' | 'accepte' | 'rejete'
- quittance_url?: string
- commentaire?: string
```

**TarifScolarite** (Tuition Fee):
```
- id: number
- specialite_id, niveau_id, annee_academique_id: number
- montant_inscription: number
- montant_scolarite: number
- montant_total: number
- devise: string
```

**Quittance** (Receipt):
```
- id, paiement_id: number
- numero_quittance: string
- fichier?: string (attachment)
- statut: 'soumis' | 'verifie' | 'valide' | 'rejete'
- motif_rejet?: string
```

**CompteEtudiant** (Student Account):
```
- etudiant_id: number
- montant_total_du: number (amount owed)
- montant_paye: number
- montant_restant: number (balance)
- statut: 'a_jour' | 'en_retard' | 'dette'
- paiements: Paiement[]
```

#### Fee Categories
```
PAYMENT_TYPES:
- 'inscription' (registration)
- 'scolarite' (tuition)
- 'examen' (exam fees)
- 'autre' (other)

PAYMENT_MODES:
- 'especes' (cash)
- 'virement' (bank transfer)
- 'cheque' (check)
- 'mobile_money'

PAYMENT_STATUS:
- 'en_attente' (pending)
- 'valide' (validated)
- 'rejete' (rejected)
- 'annule' (cancelled)
```

#### Services

**FinanceService**:
```
// Payments
- getPaiements(filters): List with pagination
- createPaiement(data): Record new payment
- getPaiementByReference(reference): Lookup
- getStudentInfo(matricule): Get student details
- getStudentTransactions(studentPendingStudentId): History
- getStudentBalance(studentPendingStudentId): Current balance

// Receipts/Quittances
- getQuittances(filters): List
- validateQuittance(id): Mark as verified
- rejectQuittance(id, motif): Reject with reason

// Fee Structure
- getTarifs(): All fees
- getTarifById(id): Specific fee
- getAvailableClasses(academicYearId): Classes for fees
- createTarif(data): New fee
- updateTarif(id, data): Modify fee
- deleteTarif(id): Remove fee

// Student Account
- getCompteEtudiant(etudiantId): Account balance
- getStudentFinancialState(studentId, academicYearId): Full state
- submitPayment(formData): Student submits payment

// Exemptions
- getExonerations(filters): Exempt students
- createExoneration(data): Grant exemption
- updateExoneration(id, data)
- deleteExoneration(id)

// Reports
- getStatistics(filters): Financial summary
- getFinancialStatsByDepartment(academicYearId, departmentId?)
- getRevenueByPeriod(startDate, endDate, groupBy)
- exportPayments(filters): Download data
```

**AcademicLevelFeeService**:
```
// Calculate fees based on student level
- getStudentFee(data): 
  inputs: academic_year_id, department_id, study_level, origin
  outputs: applicable fees for 'uemoa' | 'non_uemoa' | 'exempted'
- getAll(filters): List all level fees
- create(data): Define fee for level
- update(uuid, data): Modify fee
- delete(uuid): Remove fee
```

#### Financial Workflow

```
Tariff Definition:
└─ Admin defines fees per level × department × year
   └─ Separated by student origin (UEMOA/Non-UEMOA/Exempted)

Student Enrollment:
└─ Total fee calculated via getStudentFee()
└─ Assigned to CompteEtudiant

Payment Recording:
└─ Student submits payment (submitPayment)
└─ Receipt generated (Quittance)
└─ Status: soumis → verifie → valide/rejete

Validation:
└─ Finance officer reviews receipt
└─ validateQuittance() or rejectQuittance()
└─ Payment status updated: attente → accepte/rejete

Reporting:
└─ Statistics: Revenue, collections, pending
└─ Department summary: By-department financial health
└─ Student account: Balance, history, reminders
```

#### Routes
```
/finance/dashboard - Overview
/finance/tarifs - Fee management
/finance/historique - Payment history
/finance/validation - Payment validation
/finance/submit-payment - Student payment portal
/finance/my-financial-state - Student account view
/finance/exonerations - Exemption management
/finance/reports - Advanced reporting
```

---

## 7. APIS & SERVICES

### Core HTTP Service
**HttpService** - Base wrapper around Axios
```typescript
- API_URL: {VITE_API_URL}/api/ (default: http://localhost:8001/api/)
- Methods: get<T>(), post<T>(), put<T>(), patch<T>(), delete<T>()
- File handling: downloadFile(url, options?)
- Interceptors: addRequestInterceptor(), addResponseInterceptor()
- Response wrapping: ApiResponse<T>, PaginatedResponse<T>
```

### Module Services

| Module | Service | Key Methods |
|--------|---------|------------|
| **Inscription** | InscriptionService | pendingStudents(), academicYears(), getClassGroups(), createClassGroups() |
| **Courses** | CoursService | getTeachingUnits(), getCourseElements(), getPrograms(), attachProfessor() |
| **Grades** | NotesService | getGradeSheet(), updateGrade(), createEvaluation(), exportGradeSheet() |
| **Finance** | FinanceService | getPaiements(), getTarifs(), getStudentFinancialState(), validateQuittance() |
| **Employment** | EmploiDuTempsService | getScheduledCourses(), checkConflicts(), getScheduleByClassGroup() |
| **HR** | RhService | getProfessors(), getGrades(), createProfessor(), updateProfessor() |
| **ACL Level Fees** | AcademicLevelFeeService | getStudentFee(), create(), update(), delete() |
| **Presence** | PresenceService | (Currently empty - placeholder) |

### API Response Structure
```typescript
ApiResponse<T>:
{
  data?: T
  message?: string
  status?: number
  success?: boolean
  meta?: PaginationMeta
}

PaginationMeta:
{
  total: number
  per_page: number
  current_page: number
  last_page: number
  from?: number | null
  to?: number | null
}
```

### Authentication & Context
**AuthContext** - React Context providing:
```
- user: User (current logged-in user)
- role: string | null (professeur | chef-division | admin | etc.)
- login(credentials): Promise
- logout(): void
- isAuthenticated: boolean
```

### Route Constants
```typescript
INSCRIPTION_ROUTES:
- PENDING_STUDENTS: 'inscription/pending-students'
- ACADEMIC_YEARS: 'inscription/academic-years'
- CLASS_GROUPS: 'inscription/class-groups'
- FILIERES: 'inscription/filieres'
- NIVEAUX: 'inscription/niveaux'
- CYCLES: 'inscription/cycles'

FINANCE_ROUTES:
- PAIEMENTS: 'finance/paiements'
- QUITTANCES: 'finance/quittances'
- TARIFS: 'finance/tarifs'

NOTES_ROUTES:
- PROFESSOR: 'notes/professor/*'
- ADMIN: 'notes/admin/*'
- DECISIONS: 'notes/decisions/*'

EMPLOI_DU_TEMPS_ROUTES:
- SCHEDULED_COURSES: 'emploi-temps/scheduled-courses'
- BUILDINGS: 'emploi-temps/buildings'
- ROOMS: 'emploi-temps/rooms'
```

### Key Hooks (Data Management)

| Hook | Purpose |
|------|---------|
| `usePendingStudentsData` | Manage pending applications with filters |
| `usePaiementsData` | Payments list with pagination |
| `useTarifsData` | Fee management |
| `useProfessorGrades` | Grade sheet & evaluation workflow |
| `useAdminGrades` | Admin view of grades & decisions |
| `useFiltersData` | Load departments, levels, cohorts |
| `useProfessors` | HR professor management |
| `useValidation` | Payment validation workflow |

---

## 8. DATA FLOW DIAGRAMS

### Student Lifecycle
```
┌─────────────────────────────────────────────────────────────────┐
│                    STUDENT LIFECYCLE                            │
└─────────────────────────────────────────────────────────────────┘

1. RECRUITMENT PHASE
   ├─ Publish academic year periods
   ├─ Student fills application
   └─ Creates PendingStudent

2. APPLICATION REVIEW
   ├─ Student submits documents
   ├─ CUCA/CUO committees review
   ├─ Set opinions & financial status
   └─ Admin approves/rejects

3. ENROLLMENT
   ├─ Approved → new Etudiant record created
   ├─ Matricule assigned
   ├─ Assigned to ClassGroup
   └─ Programs created for courses

4. ACADEMIC YEAR
   ├─ Professors enter grades (per program)
   ├─ Admin manages grade weightings
   ├─ Committees make promotion decisions
   └─ Decisions saved per semester/year

5. PROGRESSION
   ├─ Decision: promoted/retained/exempted
   ├─ Student moves to next Niveau
   └─ New ClassGroup created for next year

6. GRADUATION/EXIT
   └─ Status updated: 'diplome' or 'inactif'
```

### Finance Processing
```
│
├─ Define Fees
│  └─ AcademicLevelFeeService.create()
│     └─ Per: academic_year × department × level × origin
│
├─ Enroll Student
│  └─ Calculate fee: getStudentFee()
│     └─ CompteEtudiant created with montant_du
│
├─ Student Pays
│  └─ submitPayment(formData)
│     └─ Paiement record + Quittance generated
│     └─ Status: 'attente'
│
├─ Validate Payment
│  └─ Finance officer reviews receipt
│  ├─ validateQuittance() → Status: 'verifie' → 'valide'
│  └─ rejectQuittance() → Status: 'rejete'
│
└─ Track Account
   └─ getStudentFinancialState()
      └─ Shows balance, payment history
```

### Grade Assignment  
```
Academic Year Start
  ↓
Define Programs (per ClassGroup × CourseElement × Professor)
  ↓
Professor Creates Evaluation
  ├─ Choose program
  ├─ getGradeSheet() - fetch students
  └─ createEvaluation() - initialize
  ↓
Enter Grades
  ├─ updateGrade(student_id, position, value)
  ├─ For each evaluation column (CC, TD, TP, Exam, etc.)
  └─ System marks completion %
  ↓
Set Weighting
  └─ setWeighting([0.3, 0.2, 0.5]) for [CC, TP, Exam]
  ↓
Calculate Averages
  └─ System computes: average = Σ(grade × weight)
  ↓
Review & Export (Admin)
  ├─ exportGradeSheet(), exportPVFinAnnee()
  └─ Used for deliberation meetings
  ↓
Make Decisions
  ├─ saveSemesterDecisions()
  └─ saveYearDecisions()
```

---

## 9. KEY BUSINESS PROCESSES

### Process: Application Approval
```
Step 1: Submission Period Active?
  └─ checkSubmissionStatus() → Yes/No

Step 2: Upload Documents
  └─ PendingStudent.documents stored
  └─ Document types tracked

Step 3: CUCA Review
  └─ updatePendingStudent() with opinionCuca
  └─ Set exonere/sponsorise status

Step 4: CUO Review (if applicable)
  └─ updatePendingStudent() with opinionCuo

Step 5: Admin Approves
  └─ Status → 'approved'
  └─ Backend creates Etudiant record

Step 6: Student Assigned to Class
  └─ getClassGroups() → select group
  └─ Or createDefaultClassGroup() auto-assign
  
Step 7: Send Confirmation
  └─ sendMail() to approved students
```

### Process: Grade Entry & Validation
```
Step 1: Professor Selects Program
  └─ NotesService.getMyClasses() → getGradeSheet()

Step 2: Create Evaluation
  └─ createEvaluation(programId)
  └─ Initialize all grades to -1 (not entered)

Step 3: Enter Grades
  └─ updateGrade(student_id, program_id, position, value)
  └─ For each student × evaluation

Step 4: Configure Weights
  └─ setWeighting(programId, [30, 20, 50])
  └─ For [CC, TP, Exam] components

Step 5: Review Before Submission
  └─ getCompletionPercentage() → all filled?

Step 6: Admin Export
  └─ exportPVDeliberation() for committee
  └─ exportRecapNotes() for records

Step 7: Make Decisions
  └─ saveYearDecisions(academicYear, decisions[])
  └─ Include student_id + decision type
```

### Process: Fee Payment & Validation
```
Step 1: Define Fee Structure
  └─ AcademicLevelFeeService.create()
     ├─ For UEMOA students: 500,000 CFA
     ├─ For Non-UEMOA: 1,000,000 CFA
     └─ Exempted: 0 CFA

Step 2: Student Checks Balance
  └─ getStudentFinancialState(studentId, academicYearId)
  └─ Shows: due_amount, paid, balance

Step 3: Student Submits Payment
  └─ submitPayment(formData)
     ├─ Amount
     ├─ Reference
     ├─ Receipt scan (PDF/IMG)
     └─ Notes
  └─ Paiement record created: status='attente'

Step 4: Finance Officer Validates
  └─ getValidation().validatePayment() OR
  └─ rejectQuittance(id, motif)
  └─ Status → 'accepte' or 'rejete'

Step 5: System Updates Account
  └─ CompteEtudiant.montant_paye += amount
  └─ statut updated: 'a_jour'/'en_retard'/'dette'

Step 6: Student Gets Receipt
  └─ Quittance status → 'valide'
  └─ Can download receipt from portal
```

### Process: Student Progression
```
Step 1: End of Academic Year
  └─ Committees review grades & decisions
  
Step 2: Make Promotion Decision
  └─ saveYearDecisions() with decisions:
     ├─ {student_id: 1, decision: 'promoted'} → next level
     ├─ {student_id: 2, decision: 'retained'} → same level
     ├─ {student_id: 3, decision: 'exempted'} → transferred
     └─ {student_id: 4, decision: 'graduated'} → status='diplome'

Step 3: System Updates Status
  └─ Etudiant.niveau_id = nextNiveau
  └─ Etudiant.annee_academique_id = nextYear

Step 4: New ClassGroups Created
  └─ For next academic year:
     ├─ createClassGroups() with promoted students
     ├─ Or createDefaultClassGroup()
     └─ New Programs generated for courses

Step 5: Fees Recalculated
  └─ getStudentFee() for new level
  └─ New CompteEtudiant records
  
Step 6: Schedule Assigned
  └─ EmploiDuTempsService.getScheduleByClassGroup()
  └─ New class schedule published
```

---

## 10. TECHNOLOGY STACK

### Frontend
- **Framework**: React 18+ with TypeScript
- **UI Library**: CoreUI
- **HTTP Client**: Axios
- **State Management**: React Context + Hooks
- **Routing**: React Router v6
- **Testing**: Vitest
- **Build Tool**: Vite

### Backend (Inferred from API)
- **Framework**: Laravel (PHP)
- **API Style**: RESTful
- **Response Format**: JSON with ApiResponse wrapper

### Key Development Patterns
```
Service Layer → HTTP Layer → React Components
     ↓             ↓              ↓
Services/*.ts  http.service.ts   Views/*
               (Axios wrapper)    Components/*
                                  Hooks/*
```

---

## 11. IMPORTANT CONSTANTS & ENUMS

### Student Status
- `'actif'` - Active student
- `'inactif'` - Inactive
- `'suspendu'` - Suspended
- `'diplome'` - Graduated

### Pending Student Status
- `'en_attente'` - Awaiting review
- `'accepte'` - Accepted
- `'refuse'` - Rejected

### Application Status
- `'pending'` - Initial submission
- `'documents_submitted'` - Documents uploaded
- `'approved'` - Accepted
- `'rejected'` - Denied

### Payment Status
- `'en_attente'` - Pending
- `'accepte'` - Accepted/Validated
- `'rejete'` - Rejected
- `'annule'` - Cancelled

### Receipt Status
- `'soumis'` - Submitted
- `'verifie'` - Verified
- `'valide'` - Validated
- `'rejete'` - Rejected

### Evaluation Types
- `'lecture'` - Lecture/Theory
- `'td'` - Tutorial
- `'tp'` - Practical work
- `'exam'` - Final exam

### Room Types
- `'amphitheater'` - Lecture hall
- `'classroom'` - Standard classroom
- `'lab'` - Laboratory
- `'computer_lab'` - IT lab
- `'conference'` - Conference room

---

## 12. SUMMARY TABLE: Key Entity Relationships

```
Academic Structure:
  AnneeAcademique ←→ Etudiant
                 ←→ Program
                 ←→ TarifScolarite
                 
  Cycle → Specialite ←→ Department
          ├─ Niveau
          └─ Etudiant

  Niveau ←→ Etudiant
         ├─ ClassGroup
         └─ Program

  ClassGroup ←→ Etudiant
             ├─ Program
             ├─ ScheduledCourse
             └─ Presence

Academic Content:
  TeachingUnit (UE)
    └─ CourseElement (ECUE)
         ├─ Professor
         ├─ CourseResource
         └─ Program
  
  Program
    ├─ ClassGroup
    ├─ CourseElementProfessor
    ├─ AcademicYear
    ├─ Grade (via weighting)
    └─ Decision (promotion/retention)

Administration:
  PendingStudent
    ├─ Documents
    ├─ Committee Opinions (CUCA, CUO)
    └─ Approves → creates Etudiant

Financial:
  CompteEtudiant
    ├─ Etudiant
    ├─ AcademicYear
    ├─ Paiement[]
    └─ TarifScolarite

  Paiement
    ├─ Quittance
    └─ Status tracking

Schedules:
  ClassGroup ←→ ScheduledCourse
  ScheduledCourse
    ├─ TimeSlot
    ├─ Room
    ├─ Professor
    └─ CourseElementProfessor
  
  TimeSlot
    ├─ DayOfWeek
    ├─ StartTime/EndTime
    └─ Type (lecture/TD/TP/exam)
```

---

## CONCLUSION

The CAP system is a comprehensive academic management platform featuring:

1. **Complete Student Lifecycle** - From application through graduation
2. **Multi-Stage Approval** - Committee reviews, document validation, financial screening
3. **Flexible Class Organization** - Cohorts, class groups, level progression
4. **Detailed Grading** - Weighted evaluations, multiple exam components, retake support
5. **Financial Integration** - Fee structures by level, payment tracking, exemptions/sponsorships
6. **Schedule Management** - Room/building/time conflict resolution
7. **Comprehensive Reporting** - Export for deliberations, financial/academic analytics

The frontend implements a service-oriented architecture with React hooks for state management, enabling modular, maintainable code for complex academic workflows.
