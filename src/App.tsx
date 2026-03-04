import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Book, Camera, Video, Trophy, User, Home, Search, Play, Lock, ChevronLeft, ChevronRight, Award, Star, Flame, Menu, LogOut, ArrowRight, Check, PlayCircle, Sparkles, Brain, TrendingUp, Target, Zap, BookOpen, MessageCircle, Share2, Bookmark, MoreVertical } from 'lucide-react';

// ====================== TYPES ======================
type Subject = 'Physics' | 'Chemistry' | 'Biology' | 'Mathematics' | 'English' | 'Hindi' | 'Social Science' | 'History' | 'Geography' | 'Political Science' | 'Sociology' | 'Economics' | 'Business Studies' | 'Accountancy' | 'Computer Science' | 'Physical Education';
type Class = '9th' | '10th' | '11th' | '12th';
type Tab = 'learn' | 'practice' | 'quiz';

interface UserData {
  id: string;
  name: string;
  email: string;
  password: string;
  class: Class;
  points: number;
  streak: number;
  level: number;
  avatar: string;
  createdAt: string;
}

interface Chapter {
  id: number;
  class: Class;
  subject: Subject;
  title: string;
  description: string;
  content: string;
  keyConcepts: string[];
  youtubeVideo: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  practiceQuestions: Question[];
  notes: Note[];
  mindMap: string;
  commonMistakes: string[];
  tips: string[];
  previousYearQuestions: string[];
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  type: 'MCQ' | 'Short Answer' | 'Long Answer';
}

interface Note {
  id: number;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  isAiGenerated: boolean;
}

interface Video {
  id: number;
  title: string;
  subject: Subject;
  class: Class;
  chapterId: number;
  thumbnail: string;
  youtubeId: string;
  duration: string;
  views: string;
  rating: number;
  topics: string[];
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  target: number;
}

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  suggestedVideos?: Video[];
  timestamp: Date;
}

// ====================== DATA ======================
const subjects: Subject[] = [
  'Physics', 'Chemistry', 'Biology', 'Mathematics', 
  'English', 'Hindi', 'Social Science', 'History', 
  'Geography', 'Political Science', 'Sociology', 
  'Economics', 'Business Studies', 'Accountancy', 
  'Computer Science', 'Physical Education'
];

const classes: Class[] = ['9th', '10th', '11th', '12th'];

const generateNotes = (chapter: string, subject: Subject): Note[] => [
  {
    id: 1,
    title: `${chapter} - Complete Overview`,
    content: `This comprehensive overview covers all the essential concepts from ${chapter}. It includes key definitions, important formulas, and fundamental principles that form the foundation of this topic.

**Key Points:**
• Understanding the basic concepts is crucial for advanced topics
• Regular practice helps in retaining the information
• Connect theory with real-world applications for better understanding

**Mind Map:**
Start with the main concept in the center, branch out to sub-topics, and connect related ideas with arrows.

**Exam Strategy:**
• Focus on understanding rather than memorizing
• Create summary notes for quick revision
• Solve previous year questions`,
    tags: [subject.toLowerCase(), 'overview', 'revision'],
    createdAt: '2024-01-15',
    isAiGenerated: true
  },
  {
    id: 2,
    title: `${chapter} - Key Concepts & Formulas`,
    content: `**Essential Formulas:**
• Formula 1: [Insert Formula]
• Formula 2: [Insert Formula]
• Formula 3: [Insert Formula]

**Important Concepts:**
1. **Concept Name**: Detailed explanation with examples
2. **Concept Name**: Detailed explanation with examples
3. **Concept Name**: Detailed explanation with examples

**Quick Tips:**
• Remember the units for each formula
• Understand when to apply which formula
• Practice numerical problems regularly`,
    tags: [subject.toLowerCase(), 'formulas', 'key-concepts'],
    createdAt: '2024-01-14',
    isAiGenerated: true
  },
  {
    id: 3,
    title: `${chapter} - Practice Questions & Solutions`,
    content: `**Question 1:**
[Question Text]

**Solution:**
Step-by-step explanation...

**Question 2:**
[Question Text]

**Solution:**
Step-by-step explanation...

**Question 3:**
[Question Text]

**Solution:**
Step-by-step explanation...

**Common Mistakes to Avoid:**
• Mistake 1: Explanation
• Mistake 2: Explanation
• Mistake 3: Explanation`,
    tags: [subject.toLowerCase(), 'practice', 'solutions'],
    createdAt: '2024-01-13',
    isAiGenerated: true
  },
  {
    id: 4,
    title: `${chapter} - Revision Notes`,
    content: `**Last Minute Revision Checklist:**
✅ Read all key concepts
✅ Review important formulas
✅ Solve 5 practice questions
✅ Go through common mistakes
✅ Check previous year questions

**Important Diagrams:**
• Diagram 1: Labeled diagram description
• Diagram 2: Labeled diagram description
• Diagram 3: Labeled diagram description

**Mnemonics to Remember:**
Create catchy phrases to remember sequences and lists`,
    tags: [subject.toLowerCase(), 'revision', 'last-minute'],
    createdAt: '2024-01-12',
    isAiGenerated: true
  }
];

const generateChapters = (classGrade: Class, subject: Subject): Chapter[] => {
  const chaptersData: { [key in Class]: { [key in Subject]: string[] } } = {
    '9th': {
      'Physics': ['Motion', 'Force and Laws of Motion', 'Gravitation', 'Work and Energy', 'Sound'],
      'Chemistry': ['Matter in Our Surroundings', 'Is Matter Around Us Pure', 'Atoms and Molecules', 'Structure of the Atom'],
      'Biology': ['The Fundamental Unit of Life', 'Tissues', 'Diversity in Living Organisms', 'Why Do We Fall Ill', 'Natural Resources'],
      'Mathematics': ['Number Systems', 'Polynomials', 'Coordinate Geometry', 'Linear Equations', 'Introduction to Euclid\'s Geometry', 'Lines and Angles', 'Triangles', 'Quadrilaterals', 'Circles', 'Heron\'s Formula', 'Surface Areas and Volumes', 'Statistics', 'Probability'],
      'English': ['The Fun They Had', 'The Sound of Music', 'The Little Girl', 'A Truly Beautiful Mind', 'The Snake and the Mirror', 'My Childhood', 'Packing', 'Reach for the Top', 'The Bond of Love', 'Kathmandu', 'If I Were You'],
      'Hindi': ['क्षितिज भाग 1', 'कृतिका भाग 1', 'स्पर्श भाग 1', 'संचयन भाग 1'],
      'Social Science': ['The French Revolution', 'Socialism in Europe', 'Nazism and the Rise of Hitler', 'Forest Society', 'Pastoralists', 'India - Size and Location', 'Physical Features', 'Drainage', 'Climate', 'Natural Vegetation', 'Population', 'What is Democracy', 'Constitutional Design', 'Electoral Politics', 'Working of Institutions', 'Democratic Rights', 'The Story of Village Palampur', 'People as Resource', 'Poverty', 'Food Security'],
      'History': ['The French Revolution', 'Socialism in Europe', 'Nazism', 'Forest Society', 'Pastoralists', 'Early Societies', 'The Vedic Period', 'Jainism and Buddhism', 'Mauryan Empire', 'Post Mauryan Trends', 'Gupta Empire', 'Early Medieval India', 'The Age of Vijayanagara', 'The Mughal Court', 'Medieval Society', 'Early Modern India', 'Colonialism', 'The Revolt of 1857', 'Social and Religious Movements', 'The Growth of Nationalism', 'Mahatma Gandhi', 'Independence and Partition'],
      'Geography': ['India - Size and Location', 'Physical Features', 'Drainage', 'Climate', 'Natural Vegetation', 'Soils', 'Natural Hazards', 'Resources', 'Primary Activities', 'Secondary Activities', 'Tertiary Activities', 'Transport', 'Communication', 'International Trade', 'Human Settlements'],
      'Political Science': ['What is Democracy', 'Why Democracy', 'Constitutional Design', 'Election and Representation', 'Legislature', 'Executive', 'Judiciary', 'Federalism', 'Local Governments', 'Constitution as a Living Document', 'Political Theory', 'Freedom', 'Equality', 'Justice', 'Rights', 'Citizenship', 'Nationalism', 'Secularism', 'Peace', 'Development'],
      'Sociology': ['Introducing Sociology', 'Sociology and Society', 'Terms and Concepts', 'Understanding Social Institutions', 'Culture and Socialisation', 'Social Change', 'Social Order', 'Introducing Western Sociologists', 'Indian Sociologists', 'Structure of Indian Society', 'Social Institutions', 'Social Inequality', 'Unity in Diversity', 'Demographic Structure', 'Social Movements'],
      'Economics': ['The Story of Village Palampur', 'People as Resource', 'Poverty as a Challenge', 'Food Security in India', 'Introduction to Statistics', 'Collection of Data', 'Organisation of Data', 'Presentation of Data', 'Measures of Central Tendency', 'Measures of Dispersion', 'Correlation', 'Index Numbers'],
      'Business Studies': ['Business Trade and Commerce', 'Forms of Business Organisation', 'Private Public and Global Enterprises', 'Business Services', 'Emerging Modes of Business', 'Social Responsibilities', 'Formation of a Company', 'Sources of Business Finance', 'Small Business', 'Internal Trade', 'International Business'],
      'Accountancy': ['Introduction to Accounting', 'Theory Base', 'Recording of Transactions', 'Journal', 'Ledgers', 'Trial Balance', 'Bank Reconciliation', 'Depreciation', 'Bill of Exchange', 'Financial Statements', 'Financial Statement Analysis', 'Accounting for Partnership', 'Reconstitution', 'Retirement', 'Dissolution', 'Company Accounts', 'Issue of Shares', 'Issue of Debentures', 'Cash Flow Statement', 'Ratio Analysis', 'Computerised Accounting'],
      'Computer Science': ['Python Basics', 'Variables and Data Types', 'Operators', 'Conditional Statements', 'Looping', 'Functions', 'Strings', 'Lists', 'Tuples', 'Dictionaries', 'Exception Handling', 'File Handling', 'Object Oriented Programming', 'Inheritance', 'Polymorphism', 'Data Structures', 'Algorithms', 'Database Management', 'SQL', 'Computer Networks', 'Internet and Web', 'Cyber Security', 'E-commerce'],
      'Physical Education': ['Physical Education and Sports', 'Olympic Movement', 'Yoga', 'Physical Activity', 'Children and Sports', 'Women and Sports', 'Test and Measurement', 'Biomechanics', 'Psychology', 'Training in Sports']
    },
    '10th': {
      'Physics': ['Light - Reflection and Refraction', 'Human Eye and Colorful World', 'Electricity', 'Magnetic Effects', 'Sources of Energy'],
      'Chemistry': ['Chemical Reactions and Equations', 'Acids Bases and Salts', 'Metals and Non-metals', 'Carbon and its Compounds', 'Periodic Classification'],
      'Biology': ['Life Processes', 'Control and Coordination', 'How do Organisms Reproduce', 'Heredity and Evolution', 'Our Environment', 'Sustainable Management'],
      'Mathematics': ['Real Numbers', 'Polynomials', 'Pair of Linear Equations', 'Quadratic Equations', 'Arithmetic Progressions', 'Triangles', 'Coordinate Geometry', 'Introduction to Trigonometry', 'Applications of Trigonometry', 'Circles', 'Constructions', 'Areas Related to Circles', 'Surface Areas and Volumes', 'Statistics', 'Probability'],
      'English': ['A Letter to God', 'Nelson Mandela', 'Two Stories about Flying', 'From the Diary of Anne Frank', 'The Hundred Dresses', 'Glimpses of India', 'Mijbil the Otter', 'Madam Rides the Bus', 'The Sermon at Benares', 'The Proposal'],
      'Hindi': ['क्षितिज भाग 2', 'कृतिका भाग 2', 'स्पर्श भाग 2', 'संचयन भाग 2'],
      'Social Science': ['Rise of Nationalism', 'Nationalist Movement', 'Nationalism in India', 'Making of a Global World', 'Age of Industrialisation', 'Print Culture', 'Resources and Development', 'Forest Resources', 'Water Resources', 'Agriculture', 'Minerals', 'Manufacturing', 'Life Lines', 'Power Sharing', 'Federalism', 'Democracy', 'Gender Religion', 'Popular Struggles', 'Political Parties', 'Outcomes of Democracy', 'Challenges', 'Development', 'Sectors', 'Money and Credit', 'Globalisation', 'Consumer Rights'],
      'History': ['Rise of Nationalism', 'Nationalist Movement', 'Nationalism in India', 'Making of a Global World', 'Age of Industrialisation', 'Print Culture', 'Bricks Beads', 'Kings Farmers', 'Kinship Caste', 'Thinkers Beliefs', 'Through Travellers', 'Bhakti Sufi', 'Imperial Capital', 'Peasants Zamindars', 'Kings Chronicles', 'Colonialism', 'Rebels Raj', 'Colonial Cities', 'Mahatma Gandhi', 'Understanding Partition', 'Framing Constitution', 'Challenges of Nation', 'Era of Dominance', 'Politics of Planning', 'External Relations', 'Crisis of Order', 'Popular Movements', 'Regional Aspirations', 'Recent Politics'],
      'Geography': ['Fundamentals of Human Geography', 'Human Geography', 'World Population', 'Population Composition', 'Human Development', 'Primary Activities', 'Secondary Activities', 'Tertiary Activities', 'Quaternary Activities', 'Transport', 'Communication', 'International Trade', 'Human Settlements', 'India: People', 'Population', 'Migration', 'Human Development', 'Human Settlements', 'Land Resources', 'Water Resources', 'Mineral Resources', 'Manufacturing', 'Planning', 'Transport', 'International Trade', 'Geographical Perspective'],
      'Political Science': ['End of Bipolarity', 'Contemporary Centres', 'US Hegemony', 'Alternative Centres', 'South Asia', 'International Organisations', 'Security', 'Environment', 'Globalisation', 'Challenges', 'Era of Dominance', 'Politics of Planning', 'External Relations', 'Crisis of Order', 'Popular Movements', 'Regional Aspirations', 'Recent Politics'],
      'Sociology': ['Indian Society', 'Demographic Structure', 'Social Institutions', 'Market', 'Social Inequality', 'Cultural Diversity', 'Structural Change', 'Cultural Change', 'Globalisation', 'Mass Media', 'Social Movements', 'Rural Development', 'Industrial Development', 'Democracy', 'Globalisation', 'Mass Media', 'Social Movements'],
      'Economics': ['Development', 'Sectors', 'Money and Credit', 'Globalisation', 'Consumer Rights', 'Introduction to Microeconomics', 'Theory of Consumer', 'Production', 'Firm', 'Market Equilibrium', 'Non-Competitive Markets', 'Introduction to Macroeconomics', 'National Income', 'Money and Banking', 'Income Determination', 'Government Budget', 'Open Economy'],
      'Business Studies': ['Nature of Management', 'Principles of Management', 'Business Environment', 'Planning', 'Organising', 'Staffing', 'Directing', 'Controlling', 'Financial Management', 'Financial Markets', 'Marketing', 'Consumer Protection', 'Entrepreneurship'],
      'Accountancy': ['Not-for-Profit', 'Partnership', 'Admission', 'Retirement', 'Dissolution', 'Share Capital', 'Debentures', 'Financial Statements', 'Analysis', 'Accounting Ratios', 'Cash Flow', 'Computerised', 'Database', 'Software'],
      'Computer Science': ['Python Revision', 'Functions', 'Files', 'Data Structures', 'Exception', 'Recursion', 'Sorting', 'OOP', 'Inheritance', 'Polymorphism', 'Graphs', 'Database', 'SQL', 'Networks', 'Cyber Security', 'E-commerce', 'Emerging'],
      'Physical Education': ['Planning', 'Sports Nutrition', 'Yoga', 'Differently-Abled', 'Children', 'Women', 'Test', 'Biomechanics', 'Psychology', 'Training']
    },
    '11th': {
      'Physics': ['Physical World', 'Units and Measurements', 'Motion in a Straight Line', 'Motion in a Plane', 'Laws of Motion', 'Work Energy Power', 'System of Particles', 'Gravitation', 'Mechanical Properties', 'Thermal Properties', 'Thermodynamics', 'Kinetic Theory', 'Oscillations', 'Waves'],
      'Chemistry': ['Basic Concepts', 'Structure of Atom', 'Classification', 'Chemical Bonding', 'States of Matter', 'Thermodynamics', 'Equilibrium', 'Redox', 'Hydrogen', 's-Block', 'p-Block', 'Organic Chemistry', 'Hydrocarbons', 'Environmental'],
      'Biology': ['The Living World', 'Biological Classification', 'Plant Kingdom', 'Animal Kingdom', 'Morphology', 'Anatomy', 'Structural Organisation', 'Cell', 'Biomolecules', 'Cell Cycle', 'Transport', 'Mineral Nutrition', 'Photosynthesis', 'Respiration', 'Plant Growth', 'Digestion', 'Breathing', 'Body Fluids', 'Excretion', 'Locomotion', 'Neural', 'Chemical'],
      'Mathematics': ['Sets', 'Relations', 'Trigonometry', 'Induction', 'Complex Numbers', 'Linear Inequalities', 'Permutations', 'Binomial', 'Sequences', 'Straight Lines', 'Conic Sections', '3D Geometry', 'Limits', 'Mathematical Reasoning', 'Statistics', 'Probability'],
      'English': ['Portrait of a Lady', 'We\'re Not Afraid', 'Discovering Tut', 'Landscape', 'Ailing Planet', 'Browning Version', 'Childhood', 'Father to Son', 'Laburnum Top', 'Voice of the Rain'],
      'Hindi': ['अंतरा भाग 1', 'वितान भाग 1', 'आरोह भाग 1', 'अभ्यास्वान भाग 1'],
      'Social Science': ['Indian Economy', 'Statistics', 'Development', 'Sectors', 'Money', 'Globalisation', 'Consumer Rights'],
      'History': ['From Beginning', 'Writing', 'Empires', 'Central Islamic', 'Nomadic', 'Three Orders', 'Cultural', 'Confrontation', 'Industrial', 'Displacing', 'Paths', 'Early Societies', 'Vedic', 'Jainism', 'Mauryan', 'Gupta', 'Medieval', 'Vijayanagara', 'Mughal', 'Colonial', 'Revolt', 'Nationalism', 'Gandhi', 'Partition', 'Constitution'],
      'Geography': ['Fundamentals', 'Earth', 'Origin', 'Interior', 'Continents', 'Geomorphic', 'Landforms', 'Atmosphere', 'Solar', 'Circulation', 'Water', 'Climate', 'Biodiversity', 'India', 'Location', 'Physiography', 'Drainage', 'Climate', 'Vegetation', 'Soils', 'Hazards', 'Resources', 'Activities', 'Transport', 'Settlements'],
      'Political Science': ['Constitution', 'Rights', 'Election', 'Legislature', 'Executive', 'Judiciary', 'Federalism', 'Local', 'Constitution', 'Theory', 'Freedom', 'Equality', 'Justice', 'Rights', 'Citizenship', 'Nationalism', 'Secularism', 'Peace', 'Development'],
      'Sociology': ['Sociology', 'Society', 'Concepts', 'Institutions', 'Culture', 'Socialisation', 'Change', 'Order', 'Western', 'Indian', 'Structure', 'Inequality', 'Unity', 'Demographic', 'Movements'],
      'Economics': ['Indian Economy', 'Statistics', 'Development', 'Sectors', 'Money', 'Globalisation', 'Consumer Rights', 'Microeconomics', 'Consumer', 'Production', 'Firm', 'Equilibrium', 'Macroeconomics', 'National Income', 'Money', 'Income', 'Budget', 'Open Economy'],
      'Business Studies': ['Business', 'Forms', 'Enterprises', 'Services', 'Modes', 'Responsibilities', 'Formation', 'Finance', 'Small Business', 'Internal Trade', 'International'],
      'Accountancy': ['Introduction', 'Theory', 'Recording', 'Journal', 'Ledgers', 'Trial', 'Bank', 'Depreciation', 'Bills', 'Financial', 'Analysis', 'Partnership', 'Reconstitution', 'Retirement', 'Dissolution', 'Company', 'Shares', 'Debentures', 'Cash Flow', 'Ratios', 'Computerised'],
      'Computer Science': ['Python', 'Variables', 'Operators', 'Conditionals', 'Loops', 'Functions', 'Strings', 'Lists', 'Tuples', 'Dictionaries', 'Exception', 'Files', 'OOP', 'Inheritance', 'Polymorphism', 'Data Structures', 'Algorithms', 'Database', 'SQL', 'Networks', 'Cyber', 'E-commerce'],
      'Physical Education': ['CWSN', 'Olympic', 'Yoga', 'Leadership', 'Children', 'Women', 'Test', 'Biomechanics', 'Psychology', 'Training']
    },
    '12th': {
      'Physics': ['Electric Charges', 'Electrostatic', 'Current', 'Moving Charges', 'Magnetism', 'Electromagnetic', 'Alternating', 'Waves', 'Ray Optics', 'Wave Optics', 'Dual Nature', 'Atoms', 'Nuclei', 'Semiconductor', 'Communication'],
      'Chemistry': ['Solid State', 'Solutions', 'Electrochemistry', 'Kinetics', 'Surface', 'Isolation', 'p-Block', 'd and f', 'Coordination', 'Haloalkanes', 'Alcohols', 'Aldehydes', 'Amines', 'Biomolecules', 'Polymers', 'Everyday'],
      'Biology': ['Reproduction', 'Sexual', 'Human', 'Reproductive', 'Inheritance', 'Molecular', 'Evolution', 'Health', 'Strategies', 'Microbes', 'Biotechnology', 'Organisms', 'Ecosystem', 'Biodiversity', 'Environmental'],
      'Mathematics': ['Relations', 'Trigonometry', 'Matrices', 'Determinants', 'Continuity', 'Application', 'Integrals', 'Application', 'Differential', 'Vectors', '3D', 'Linear', 'Probability'],
      'English': ['Last Lesson', 'Lost Spring', 'Deep Water', 'Rattrap', 'Indigo', 'Poets', 'Interview', 'Going Places', 'Mother', 'Elementary', 'Keeping', 'Beauty', 'Roadside', 'Aunt'],
      'Hindi': ['अंतरा भाग 2', 'वितान भाग 2', 'आरोह भाग 2', 'अभ्यास्वान भाग 2'],
      'Social Science': ['Development', 'Sectors', 'Money', 'Globalisation', 'Consumer Rights', 'Microeconomics', 'Macroeconomics', 'Indian Economy', 'Statistics'],
      'History': ['Bricks', 'Kings', 'Kinship', 'Thinkers', 'Travellers', 'Bhakti', 'Vijayanagara', 'Peasants', 'Kings', 'Colonial', 'Rebels', 'Cities', 'Gandhi', 'Partition', 'Constitution', 'Challenges', 'Dominance', 'Planning', 'External', 'Crisis', 'Movements', 'Regional', 'Recent'],
      'Geography': ['Human', 'Population', 'Composition', 'Development', 'Activities', 'Transport', 'Settlements', 'India', 'Population', 'Migration', 'Development', 'Land', 'Water', 'Mineral', 'Manufacturing', 'Planning', 'Transport', 'Trade', 'Issues'],
      'Political Science': ['Bipolarity', 'Centres', 'Hegemony', 'Alternative', 'South Asia', 'Organisations', 'Security', 'Environment', 'Globalisation', 'Challenges', 'Dominance', 'Planning', 'External', 'Crisis', 'Movements', 'Regional', 'Recent'],
      'Sociology': ['Indian', 'Demographic', 'Institutions', 'Market', 'Inequality', 'Diversity', 'Structural', 'Cultural', 'Globalisation', 'Media', 'Movements', 'Rural', 'Industrial', 'Democracy', 'Media', 'Movements'],
      'Economics': ['Microeconomics', 'Consumer', 'Production', 'Firm', 'Equilibrium', 'Macroeconomics', 'National', 'Money', 'Income', 'Budget', 'Open', 'Development', 'Reforms', 'Challenges', 'Comparison'],
      'Business Studies': ['Management', 'Principles', 'Environment', 'Planning', 'Organising', 'Staffing', 'Directing', 'Controlling', 'Financial', 'Markets', 'Marketing', 'Consumer', 'Entrepreneurship'],
      'Accountancy': ['Not-for-Profit', 'Partnership', 'Admission', 'Retirement', 'Dissolution', 'Share', 'Debentures', 'Financial', 'Analysis', 'Ratios', 'Cash Flow', 'Computerised', 'Database', 'Software'],
      'Computer Science': ['Revision', 'Functions', 'Files', 'Structures', 'Exception', 'Recursion', 'Sorting', 'OOP', 'Inheritance', 'Polymorphism', 'Graphs', 'Database', 'SQL', 'Networks', 'Cyber', 'E-commerce', 'Emerging'],
      'Physical Education': ['Planning', 'Nutrition', 'Yoga', 'Differently', 'Children', 'Women', 'Test', 'Biomechanics', 'Psychology', 'Training']
    }
  };

  const chapterNames = chaptersData[classGrade]?.[subject] || ['Chapter 1', 'Chapter 2', 'Chapter 3', 'Chapter 4', 'Chapter 5'];
  
  return chapterNames.map((name, index) => ({
    id: index + 1,
    class: classGrade,
    subject,
    title: name,
    description: `Comprehensive study material for ${name} as per NCERT syllabus for Class ${classGrade}`,
    content: `${name} - Detailed Content
========================

This chapter covers all the essential concepts from the NCERT textbook for Class ${classGrade}.

**Topics Covered:**
• Introduction to ${name}
• Key concepts and definitions
• Detailed explanations with examples
• Applications in real-life scenarios
• Problem-solving techniques
• Previous year questions analysis

**Learning Objectives:**
By the end of this chapter, you will:
1. Understand the fundamental concepts of ${name}
2. Apply theoretical knowledge to practical problems
3. Solve numerical and theoretical questions
4. Prepare effectively for board examinations`,
    keyConcepts: [`Concept 1: ${name} basics`, `Concept 2: Key principles`, `Concept 3: Applications`, `Concept 4: Problem solving`, `Concept 5: Advanced topics`],
    youtubeVideo: 'dQw4w9WgXcQ',
    difficulty: (['Easy', 'Medium', 'Hard'] as const)[index % 3],
    practiceQuestions: [
      {
        id: 1,
        question: `What is the main concept discussed in ${name}?`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 0,
        explanation: 'This is the fundamental concept that forms the basis of the entire chapter.',
        type: 'MCQ'
      },
      {
        id: 2,
        question: 'Which of the following best describes the key principle?',
        options: ['Description 1', 'Description 2', 'Description 3', 'Description 4'],
        correctAnswer: 2,
        explanation: 'This option correctly captures the essence of the principle discussed in the chapter.',
        type: 'MCQ'
      },
      {
        id: 3,
        question: 'Solve the following problem based on the concepts learned.',
        options: ['Solution A', 'Solution B', 'Solution C', 'Solution D'],
        correctAnswer: 1,
        explanation: 'The detailed solution involves applying the formulas and concepts step-by-step.',
        type: 'MCQ'
      }
    ],
    notes: generateNotes(name, subject),
    mindMap: `https://mindmap.example.com/${name.toLowerCase().replace(/ /g, '-')}.png`,
    commonMistakes: [
      'Mistake 1: Not understanding the basics before advanced topics',
      'Mistake 2: Forgetting units in numerical problems',
      'Mistake 3: Not practicing enough questions',
      'Mistake 4: Skipping diagrams and labeled figures'
    ],
    tips: [
      'Tip 1: Start with NCERT textbook before reference books',
      'Tip 2: Create your own notes for better retention',
      'Tip 3: Practice previous year questions regularly',
      'Tip 4: Revise weekly to maintain continuity',
      'Tip 5: Join study groups for better understanding'
    ],
    previousYearQuestions: [
      '2023 Board: Question on basic concepts (5 marks)',
      '2022 Board: Numerical problem (3 marks)',
      '2021 Board: Theory question with diagram (4 marks)',
      '2020 Board: Application-based question (6 marks)'
    ]
  }));
};

const generateVideos = (classGrade: Class, subject: Subject, chapters: Chapter[]): Video[] => {
  const videoTopics = [
    'Full Chapter Explanation',
    'Important Questions',
    'Previous Year Solutions',
    'Tips and Tricks',
    'Mind Map Explanation'
  ];

  return chapters.flatMap((chapter, idx) => 
    videoTopics.map((topic, vIdx) => ({
      id: (idx * 5) + vIdx + 1,
      title: `${chapter.title} - ${topic}`,
      subject,
      class: classGrade,
      chapterId: chapter.id,
      thumbnail: `https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg`,
      youtubeId: 'dQw4w9WgXcQ',
      duration: `${Math.floor(Math.random() * 30 + 15)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      views: `${(Math.random() * 5 + 0.5).toFixed(1)}M`,
      rating: Math.floor(Math.random() * 2 + 4),
      topics: [chapter.title, topic.toLowerCase()]
    }))
  );
};

const achievementsData: Achievement[] = [
  { id: 1, title: 'First Steps', description: 'Complete your first chapter', icon: '🎯', points: 100, unlocked: true, unlockedAt: '2024-01-10', progress: 100, target: 1 },
  { id: 2, title: 'Quiz Master', description: 'Score 90% or above in a quiz', icon: '🏆', points: 200, unlocked: true, unlockedAt: '2024-01-12', progress: 100, target: 1 },
  { id: 3, title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥', points: 300, unlocked: false, progress: 43, target: 7 },
  { id: 4, title: 'Video Scholar', description: 'Watch 10 video tutorials', icon: '📺', points: 150, unlocked: false, progress: 30, target: 10 },
  { id: 5, title: 'Note Taker', description: 'Create 5 notes', icon: '📝', points: 200, unlocked: true, unlockedAt: '2024-01-14', progress: 100, target: 5 },
  { id: 6, title: 'Subject Expert', description: 'Complete all chapters in one subject', icon: '⭐', points: 500, unlocked: false, progress: 20, target: 5 },
  { id: 7, title: 'Camera Genius', description: 'Solve 5 problems using camera', icon: '📷', points: 250, unlocked: false, progress: 40, target: 5 },
  { id: 8, title: 'Chat Champion', description: 'Ask 50 questions to AI tutor', icon: '💬', points: 300, unlocked: false, progress: 20, target: 50 },
  { id: 9, title: 'All Rounder', description: 'Study 3 different subjects', icon: '🌟', points: 400, unlocked: false, progress: 66, target: 3 },
  { id: 10, title: 'Perfect Score', description: 'Score 100% in any test', icon: '💯', points: 350, unlocked: false, progress: 0, target: 1 },
  { id: 11, title: 'Night Owl', description: 'Study between 10 PM - 6 AM', icon: '🦉', points: 150, unlocked: false, progress: 0, target: 5 },
  { id: 12, title: 'Early Bird', description: 'Study before 8 AM', icon: '🐦', points: 150, unlocked: false, progress: 60, target: 5 }
];

// ====================== COMPONENTS ======================

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('edututor_users') || '[]');
      const user = users.find((u: UserData) => u.email === email && u.password === password);
      
      if (user) {
        localStorage.setItem('edututor_currentUser', JSON.stringify(user));
        navigate('/dashboard');
      } else {
        setError('Invalid email or password. Please try again or sign up.');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-yellow-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md relative z-10 border border-white/20">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">🎓</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            EduTutor India
          </h1>
          <p className="text-gray-600">Your Personal AI Learning Companion</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all outline-none"
              placeholder="your@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Start Learning ✨'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
          <div className="text-xs text-gray-400 pt-2 border-t">
            <p>For testing: Create an account first to login</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [classGrade, setClassGrade] = useState<Class>('10th');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('edututor_users') || '[]');
      
      if (users.find((u: UserData) => u.email === email)) {
        setError('An account with this email already exists');
        setLoading(false);
        return;
      }

      const newUser: UserData = {
        id: Date.now().toString(),
        name,
        email,
        password,
        class: classGrade,
        points: 100,
        streak: 1,
        level: 1,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('edututor_users', JSON.stringify(users));
      localStorage.setItem('edututor_currentUser', JSON.stringify(newUser));
      
      navigate('/dashboard');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-teal-600 to-blue-500 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-cyan-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md relative z-10 border border-white/20">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">🌟</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Join EduTutor
          </h1>
          <p className="text-gray-600">Start your personalized learning journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all outline-none"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all outline-none"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Your Class</label>
            <select
              value={classGrade}
              onChange={(e) => setClassGrade(e.target.value as Class)}
              className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all outline-none bg-white"
              required
            >
              {classes.map(c => (
                <option key={c} value={c}>Class {c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all outline-none"
              placeholder="Minimum 6 characters"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-200 transition-all outline-none"
              placeholder="Re-enter password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account 🚀'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('edututor_currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    } else if (location.pathname !== '/login' && location.pathname !== '/signup') {
      navigate('/login');
    }
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('edututor_currentUser');
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/classes', icon: BookOpen, label: 'Classes' },
    { path: '/notes', icon: Book, label: 'Notes' },
    { path: '/videos', icon: Video, label: 'Videos' },
    { path: '/achievements', icon: Trophy, label: 'Achievements' },
    { path: '/camera', icon: Camera, label: 'Snap & Solve' },
  ];

  if (location.pathname === '/login' || location.pathname === '/signup') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Menu className="w-6 h-6 text-slate-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🎓</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EduTutor India
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-full border border-yellow-200">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="font-semibold text-orange-600">{currentUser?.streak || 1} days</span>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-purple-200">
              <Star className="w-5 h-5 text-purple-500" />
              <span className="font-semibold text-purple-600">{currentUser?.points || 100} pts</span>
            </div>
            <div className="flex items-center gap-3">
              <img
                src={currentUser?.avatar}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-purple-300 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => navigate('/profile')}
              />
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-50 rounded-xl transition-colors text-red-500"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white/80 backdrop-blur-lg shadow-sm min-h-[calc(100vh-72px)] transition-all duration-300 hidden md:block border-r border-slate-200`}
        >
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'hover:bg-slate-100 text-slate-600 hover:text-slate-800'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>

          {sidebarOpen && currentUser && (
            <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center gap-3 mb-3">
                <img src={currentUser.avatar} alt="" className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-semibold text-slate-800">{currentUser.name}</p>
                  <p className="text-xs text-slate-500">Class {currentUser.class}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-600">Level {currentUser.level}</span>
                <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg shadow-lg border-t border-slate-200 z-50">
        <div className="flex justify-around py-2">
          {navItems.slice(0, 5).map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`p-3 rounded-xl transition-all ${location.pathname === item.path ? 'bg-blue-100 text-blue-600' : 'text-slate-500'}`}
            >
              <item.icon className="w-6 h-6" />
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [activeClass, setActiveClass] = useState<Class>('10th');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('edututor_currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
      setActiveClass(JSON.parse(user).class);
    }
  }, []);

  const chapters = selectedSubject ? generateChapters(activeClass, selectedSubject) : [];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-6 md:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, {currentUser?.name}! 👋</h2>
            <p className="opacity-90 text-sm md:text-base">Continue your learning journey today</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold">{currentUser?.level}</p>
              <p className="text-xs opacity-75">Level</p>
            </div>
            <div className="w-px h-12 bg-white/30"></div>
            <div className="text-center">
              <p className="text-3xl font-bold">{currentUser?.streak}</p>
              <p className="text-xs opacity-75">Day Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-slate-100">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-800">{subjects.length}</p>
          <p className="text-sm text-slate-500">Subjects</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-slate-100">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
            <Book className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-slate-800">150+</p>
          <p className="text-sm text-slate-500">Chapters</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-slate-100">
          <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
            <Video className="w-6 h-6 text-pink-600" />
          </div>
          <p className="text-2xl font-bold text-slate-800">500+</p>
          <p className="text-sm text-slate-500">Videos</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-slate-100">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-slate-800">{currentUser?.points || 100}</p>
          <p className="text-sm text-slate-500">Points Earned</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/classes')}
            className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl hover:shadow-md transition-all hover:scale-105"
          >
            <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center mb-3">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <span className="font-semibold text-slate-700">Start Learning</span>
          </button>
          <button
            onClick={() => navigate('/camera')}
            className="flex flex-col items-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl hover:shadow-md transition-all hover:scale-105"
          >
            <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center mb-3">
              <Camera className="w-7 h-7 text-white" />
            </div>
            <span className="font-semibold text-slate-700">Snap & Solve</span>
          </button>
          <button
            onClick={() => navigate('/videos')}
            className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl hover:shadow-md transition-all hover:scale-105"
          >
            <div className="w-14 h-14 bg-purple-500 rounded-xl flex items-center justify-center mb-3">
              <PlayCircle className="w-7 h-7 text-white" />
            </div>
            <span className="font-semibold text-slate-700">Watch Videos</span>
          </button>
          <button
            onClick={() => navigate('/achievements')}
            className="flex flex-col items-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl hover:shadow-md transition-all hover:scale-105"
          >
            <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center mb-3">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <span className="font-semibold text-slate-700">Achievements</span>
          </button>
        </div>
      </div>

      {/* Class & Subject Selection */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h3 className="text-xl font-bold text-slate-800">Today's Learning</h3>
          <div className="flex items-center gap-3">
            <select
              value={activeClass}
              onChange={(e) => setActiveClass(e.target.value as Class)}
              className="px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none bg-white"
            >
              {classes.map(c => (
                <option key={c} value={c}>Class {c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {subjects.slice(0, 12).map(subject => (
            <button
              key={subject}
              onClick={() => setSelectedSubject(selectedSubject === subject ? null : subject)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedSubject === subject ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {subject}
            </button>
          ))}
        </div>

        {selectedSubject && chapters.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4">
            {chapters.slice(0, 4).map(chapter => (
              <div
                key={chapter.id}
                onClick={() => navigate(`/chapters/${chapter.id}`)}
                className="p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl hover:shadow-md transition-all cursor-pointer border border-slate-100"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-slate-800">{chapter.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${chapter.difficulty === 'Easy' ? 'bg-green-100 text-green-600' : chapter.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>
                    {chapter.difficulty}
                  </span>
                </div>
                <p className="text-sm text-slate-500 line-clamp-2">{chapter.description}</p>
                <div className="flex items-center gap-2 mt-3">
                  <ArrowRight className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-600 font-medium">Start Chapter</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!selectedSubject && (
          <div className="text-center py-12 text-slate-500">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <p>Select a subject to view chapters</p>
          </div>
        )}
      </div>

      {/* Learning Tip */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl p-6 text-white shadow-lg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-lg mb-1">Learning Tip of the Day 💡</h4>
            <p className="opacity-90">The expert in anything was once a beginner. Keep practicing daily and track your progress! Review your notes weekly to reinforce learning.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Classes = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState<Class>('10th');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const chapters = selectedSubject ? generateChapters(selectedClass, selectedSubject) : [];
  const filteredChapters = chapters.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Study Materials</h2>
          <p className="text-slate-500">Explore chapters by class and subject</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chapters..."
              className="pl-10 pr-4 py-2 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none w-64"
            />
          </div>
        </div>
      </div>

      {/* Class Selection */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {classes.map(c => (
            <button
              key={c}
              onClick={() => {
                setSelectedClass(c);
                setSelectedSubject(null);
              }}
              className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${selectedClass === c ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              Class {c}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Selection */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <h3 className="font-semibold text-slate-800 mb-3">Select Subject</h3>
        <div className="flex flex-wrap gap-2">
          {subjects.map(subject => (
            <button
              key={subject}
              onClick={() => setSelectedSubject(selectedSubject === subject ? null : subject)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedSubject === subject ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {subject}
            </button>
          ))}
        </div>
      </div>

      {/* Chapter List */}
      {selectedSubject && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">
              {selectedSubject} - Class {selectedClass}
            </h3>
            <span className="text-slate-500">{filteredChapters.length} chapters</span>
          </div>

          <div className="grid gap-4">
            {filteredChapters.map((chapter, idx) => (
              <div
                key={chapter.id}
                onClick={() => navigate(`/chapters/${chapter.id}`)}
                className="p-5 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl hover:shadow-md transition-all cursor-pointer border border-slate-100 group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {chapter.title}
                      </h4>
                      <p className="text-sm text-slate-500 mt-1">{chapter.description}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {chapter.keyConcepts.slice(0, 3).map((concept, cIdx) => (
                          <span key={cIdx} className="px-2 py-1 bg-white rounded-lg text-xs text-slate-600 border border-slate-200">
                            {concept.split(':')[0]}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${chapter.difficulty === 'Easy' ? 'bg-green-100 text-green-600' : chapter.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>
                      {chapter.difficulty}
                    </span>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!selectedSubject && (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100 text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Select a Subject</h3>
          <p className="text-slate-500">Choose a subject from above to view chapters</p>
        </div>
      )}
    </div>
  );
};

const ChapterDetail = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('learn');
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    // Chapter initialization logic


    // Get chapter from params (simplified for demo)
    const sampleChapters = generateChapters('10th', 'Physics');
    setChapter(sampleChapters[0]);
  }, []);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        `Great question about ${chapter?.title}! Let me explain this concept in detail. The key idea here is understanding the fundamental principles and applying them to solve problems.`,
        `That's an important concept in ${chapter?.subject}. Let me break it down for you. First, you need to remember the basic definitions, then move on to applications.`,
        `Excellent question! This is a common topic in exams. Here's what you need to know: focus on understanding rather than memorizing, and practice plenty of numerical problems.`
      ];

      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        suggestedVideos: generateVideos('10th', 'Physics', [chapter!]).slice(0, 2)
      };

      setChatMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const handleQuizAnswer = (questionId: number, answer: number) => {
    if (!quizSubmitted) {
      setQuizAnswers(prev => ({ ...prev, [questionId]: answer }));
    }
  };

  const submitQuiz = () => {
    setQuizSubmitted(true);
  };

  if (!chapter) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading chapter...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Chapter Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <button
          onClick={() => navigate('/classes')}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-4 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back to Chapters</span>
        </button>

        <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                {chapter.subject}
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
                Class {chapter.class}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${chapter.difficulty === 'Easy' ? 'bg-green-100 text-green-600' : chapter.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>
                {chapter.difficulty}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">{chapter.title}</h1>
            <p className="text-slate-600">{chapter.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors">
              <Bookmark className="w-5 h-5" />
            </button>
            <button className="p-3 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-6 border-b border-slate-200 overflow-x-auto">
          {(['learn', 'practice', 'quiz'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold transition-all whitespace-nowrap ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'learn' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Chapter Content */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Chapter Content</h3>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-slate-700 font-sans text-sm leading-relaxed bg-slate-50 p-4 rounded-xl">
                  {chapter.content}
                </pre>
              </div>
            </div>

            {/* Key Concepts */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Key Concepts</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {chapter.keyConcepts.map((concept, idx) => (
                  <div key={idx} className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-slate-800">{concept.split(':')[0]}</span>
                    </div>
                    <p className="text-sm text-slate-600">{concept.split(':')[1] || 'Detailed concept explanation'}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-800">AI-Generated Notes</h3>
                <span className="text-sm text-slate-500">{chapter.notes.length} notes</span>
              </div>
              <div className="space-y-4">
                {chapter.notes.map(note => (
                  <div key={note.id} className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-slate-800">{note.title}</h4>
                      {note.isAiGenerated && (
                        <span className="px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs rounded-full">
                          AI Generated
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{note.content}</p>
                    <div className="flex items-center gap-2">
                      {note.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-white rounded text-xs text-slate-600 border border-slate-200">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips & Mistakes */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  Tips for Success
                </h3>
                <ul className="space-y-3">
                  {chapter.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-600" />
                  Common Mistakes
                </h3>
                <ul className="space-y-3">
                  {chapter.commonMistakes.map((mistake, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Previous Year Questions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Previous Year Questions</h3>
              <div className="space-y-3">
                {chapter.previousYearQuestions.map((q, idx) => (
                  <div key={idx} className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
                    <p className="text-sm text-slate-700">{q}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Tutor */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden sticky top-24">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold">AI Tutor</h3>
                    <p className="text-sm opacity-90">Ask me anything!</p>
                  </div>
                </div>
              </div>

              <div className="h-64 overflow-y-auto p-4 space-y-3 bg-slate-50">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p className="text-sm">Ask questions about this chapter</p>
                  </div>
                ) : (
                  chatMessages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'bg-white border border-slate-200'}`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        {msg.suggestedVideos && (
                          <div className="mt-3 pt-3 border-t border-slate-200">
                            <p className="text-xs font-semibold mb-2">📺 Related Videos:</p>
                            <div className="space-y-2">
                              {msg.suggestedVideos.map(video => (
                                <a
                                  key={video.id}
                                  href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all"
                                >
                                  <PlayCircle className="w-4 h-4 text-blue-600" />
                                  <span className="text-xs text-blue-700 truncate">{video.title}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 bg-white border-t border-slate-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask a question..."
                    className="flex-1 px-4 py-2 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none text-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-md transition-all"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Video Tutorial */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-3">Video Tutorial</h3>
              <div className="aspect-video bg-slate-100 rounded-xl overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${chapter.youtubeVideo}`}
                  title={chapter.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'practice' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Practice Questions</h3>
          <div className="space-y-6">
            {chapter.practiceQuestions.map((q, idx) => (
              <div key={q.id} className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border border-slate-100">
                <div className="flex items-start gap-3 mb-4">
                  <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="px-2 py-1 bg-slate-200 text-slate-600 rounded text-xs font-medium mb-2 inline-block">
                      {q.type}
                    </span>
                    <p className="font-medium text-slate-800">{q.question}</p>
                  </div>
                </div>
                <div className="ml-11 space-y-2">
                  {q.options.map((option, optIdx) => (
                    <label key={optIdx} className="flex items-center gap-3 p-3 bg-white rounded-xl hover:bg-blue-50 transition-colors cursor-pointer border border-slate-100">
                      <input
                        type="radio"
                        name={`q${q.id}`}
                        checked={quizAnswers[q.id] === optIdx}
                        onChange={() => handleQuizAnswer(q.id, optIdx)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-slate-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => alert('Answers saved! Check your understanding.')}
            className="mt-6 w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Check Answers
          </button>
        </div>
      )}

      {activeTab === 'quiz' && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Chapter Quiz</h3>
          <div className="space-y-6">
            {chapter.practiceQuestions.map((q, idx) => (
              <div key={q.id} className={`p-6 rounded-2xl border-2 ${quizSubmitted ? quizAnswers[q.id] === q.correctAnswer ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'}`}>
                <p className="font-medium text-slate-800 mb-4">{idx + 1}. {q.question}</p>
                <div className="space-y-2">
                  {q.options.map((option, optIdx) => (
                    <div
                      key={optIdx}
                      className={`p-3 rounded-xl flex items-center gap-3 ${quizSubmitted ? optIdx === q.correctAnswer ? 'bg-green-200 border-2 border-green-500' : quizAnswers[q.id] === optIdx ? 'bg-red-200 border-2 border-red-500' : 'bg-white' : quizAnswers[q.id] === optIdx ? 'bg-blue-100 border-2 border-blue-500' : 'bg-white border border-slate-200'}`}
                    >
                      <input
                        type="radio"
                        name={`quiz${q.id}`}
                        checked={quizAnswers[q.id] === optIdx}
                        onChange={() => !quizSubmitted && handleQuizAnswer(q.id, optIdx)}
                        disabled={quizSubmitted}
                        className="w-4 h-4"
                      />
                      <span>{option}</span>
                    </div>
                  ))}
                </div>
                {quizSubmitted && (
                  <div className="mt-3 p-3 bg-blue-100 rounded-xl">
                    <p className="text-sm text-blue-700"><strong>Explanation:</strong> {q.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {!quizSubmitted ? (
            <button
              onClick={submitQuiz}
              className="mt-6 w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all"
            >
              Submit Quiz
            </button>
          ) : (
            <div className="mt-6 p-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl text-center border border-green-200">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
              <p className="text-3xl font-bold text-slate-800 mb-2">
                Score: {chapter.practiceQuestions.filter(q => quizAnswers[q.id] === q.correctAnswer).length} / {chapter.practiceQuestions.length}
              </p>
              <p className="text-slate-600 mb-4">
                {chapter.practiceQuestions.filter(q => quizAnswers[q.id] === q.correctAnswer).length === chapter.practiceQuestions.length
                  ? 'Perfect Score! 🎉'
                  : chapter.practiceQuestions.filter(q => quizAnswers[q.id] === q.correctAnswer).length >= chapter.practiceQuestions.length * 0.7
                  ? 'Great Job! 👍'
                  : 'Keep Practicing! 💪'}
              </p>
              <button
                onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); }}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-md transition-all"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Notes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'All'>('All');

  const allNotes = [
    ...generateChapters('10th', 'Physics').flatMap(c => c.notes),
    ...generateChapters('10th', 'Chemistry').flatMap(c => c.notes),
    ...generateChapters('10th', 'Biology').flatMap(c => c.notes),
    ...generateChapters('10th', 'Mathematics').flatMap(c => c.notes),
  ];

  const filteredNotes = allNotes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">My Notes</h2>
          <p className="text-slate-500">Access all your AI-generated study notes</p>
        </div>
        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-md transition-all flex items-center gap-2">
          <Book className="w-5 h-5" />
          Create Note
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none"
            />
          </div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value as Subject | 'All')}
            className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none bg-white"
          >
            <option value="All">All Subjects</option>
            {subjects.slice(0, 8).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.map((note, idx) => (
          <div key={note.id + idx} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors opacity-0 group-hover:opacity-100">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            <h3 className="font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
              {note.title}
            </h3>
            <p className="text-sm text-slate-500 mb-4 line-clamp-3">{note.content}</p>
            <div className="flex items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                {note.tags.slice(0, 2).map((tag, tIdx) => (
                  <span key={tIdx} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
              {note.isAiGenerated && (
                <span className="px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs rounded-full">
                  AI
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Videos = () => {
  const [selectedClass, setSelectedClass] = useState<Class>('10th');
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const sampleChapters = generateChapters(selectedClass, selectedSubject === 'All' ? 'Physics' : selectedSubject);
  const allVideos = generateVideos(selectedClass, selectedSubject === 'All' ? 'Physics' : selectedSubject, sampleChapters);

  const filteredVideos = allVideos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-6 md:p-8 text-white shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <PlayCircle className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Video Tutorials</h2>
            <p className="opacity-90">Learn from the best educators</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search videos..."
              className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none"
            />
          </div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value as Class)}
            className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none bg-white"
          >
            {classes.map(c => (
              <option key={c} value={c}>Class {c}</option>
            ))}
          </select>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value as Subject | 'All')}
            className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none bg-white"
          >
            <option value="All">All Subjects</option>
            {subjects.slice(0, 8).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map(video => (
          <div key={video.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-md transition-all">
            <div className="relative">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <a
                  href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-16 h-16 bg-white rounded-full flex items-center justify-center"
                >
                  <Play className="w-8 h-8 text-red-600 ml-1" />
                </a>
              </div>
              <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </span>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs font-medium">
                  {video.subject}
                </span>
                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                  Class {video.class}
                </span>
              </div>
              <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {video.title}
              </h3>
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>{video.views} views</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span>{video.rating}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Achievements = () => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const filteredAchievements = achievementsData.filter(a => {
    if (filter === 'unlocked') return a.unlocked;
    if (filter === 'locked') return !a.unlocked;
    return true;
  });

  const unlockedCount = achievementsData.filter(a => a.unlocked).length;
  const totalPoints = achievementsData.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-3xl p-6 md:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Achievements 🏆</h2>
            <p className="opacity-90">Unlock badges and earn rewards</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{unlockedCount}/{achievementsData.length}</p>
              <p className="text-sm opacity-75">Unlocked</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{totalPoints}</p>
              <p className="text-sm opacity-75">Points Earned</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {(['all', 'unlocked', 'locked'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2 rounded-xl font-medium transition-all ${filter === f ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.map(achievement => (
          <div
            key={achievement.id}
            className={`p-6 rounded-2xl border-2 transition-all ${achievement.unlocked ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' : 'bg-slate-50 border-slate-200'}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl ${achievement.unlocked ? 'bg-gradient-to-br from-yellow-400 to-orange-400' : 'bg-slate-300'}`}>
                {achievement.unlocked ? achievement.icon : '🔒'}
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${achievement.unlocked ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
                +{achievement.points} pts
              </span>
            </div>
            <h3 className="font-bold text-slate-800 mb-1">{achievement.title}</h3>
            <p className="text-sm text-slate-500 mb-4">{achievement.description}</p>
            <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${achievement.unlocked ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'}`}
                style={{ width: `${Math.min(100, (achievement.progress / achievement.target) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-2 text-sm text-slate-500">
              <span>{achievement.progress}/{achievement.target}</span>
              {achievement.unlockedAt && <span>Unlocked {achievement.unlockedAt}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CameraFeature = () => {
  const [image, setImage] = useState<string | null>(null);
  const [solution, setSolution] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: 1280, height: 720 } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      setImage(null);
      setSolution(null);
    } catch (err) {
      alert('Camera access denied. Please enable camera permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/png');
        setImage(imageData);
        stopCamera();
      }
    }
  };

  const generateSolution = () => {
    setLoading(true);
    setTimeout(() => {
      setSolution(`📸 **Problem Analysis Complete!**

I've analyzed your photo and here's what I found:

**Problem Type:** Mathematics - Quadratic Equation

**Solution Steps:**

1. **Identify the equation:**
   The problem is: x² - 5x + 6 = 0

2. **Factor the quadratic:**
   x² - 5x + 6 = (x - 2)(x - 3) = 0

3. **Find the roots:**
   x - 2 = 0 → x = 2
   x - 3 = 0 → x = 3

4. **Verification:**
   Substitute x = 2: 4 - 10 + 6 = 0 ✓
   Substitute x = 3: 9 - 15 + 6 = 0 ✓

**Final Answer:** x = 2, x = 3

💡 **Tip:** Always verify your solutions by substituting back into the original equation!

Would you like me to:
• Explain this concept in detail?
• Provide similar practice problems?
• Show a video explanation?`);
      setLoading(false);
    }, 2000);
  };

  const retakePhoto = () => {
    setImage(null);
    setSolution(null);
    startCamera();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-green-600 via-teal-600 to-blue-600 rounded-3xl p-6 md:p-8 text-white shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <Camera className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Snap & Solve</h2>
            <p className="opacity-90">Click a photo of any problem and get instant solutions</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        {!image ? (
          <div className="space-y-4">
            <div className="relative bg-slate-100 rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
              {cameraActive ? (
                <>
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  <canvas ref={canvasRef} className="hidden" />
                </>
              ) : (
                <div className="text-center text-slate-500">
                  <Camera className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <p className="text-lg font-medium">Camera Preview</p>
                  <p className="text-sm">Click "Start Camera" to begin</p>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-4">
              {!cameraActive ? (
                <button
                  onClick={startCamera}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-2xl font-bold text-lg hover:shadow-lg hover:scale-105 transition-all flex items-center gap-3"
                >
                  <Camera className="w-6 h-6" />
                  Start Camera
                </button>
              ) : (
                <>
                  <button
                    onClick={capturePhoto}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:shadow-lg hover:scale-105 transition-all flex items-center gap-3"
                  >
                    <div className="w-6 h-6 border-4 border-white rounded-full"></div>
                    Capture Photo
                  </button>
                  <button
                    onClick={stopCamera}
                    className="px-6 py-4 bg-slate-200 text-slate-700 rounded-2xl font-semibold hover:bg-slate-300 transition-all"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative">
              <img src={image} alt="Captured problem" className="w-full max-h-96 object-contain rounded-2xl border-4 border-slate-100" />
            </div>

            {!solution ? (
              <div className="flex justify-center gap-4">
                <button
                  onClick={generateSolution}
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-2xl font-bold text-lg hover:shadow-lg hover:scale-105 transition-all flex items-center gap-3 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      Generate Solution
                    </>
                  )}
                </button>
                <button
                  onClick={retakePhoto}
                  className="px-6 py-4 bg-slate-200 text-slate-700 rounded-2xl font-semibold hover:bg-slate-300 transition-all flex items-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Retake
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 border-2 border-green-200">
                  <pre className="whitespace-pre-wrap text-slate-800 font-sans text-sm leading-relaxed">{solution}</pre>
                </div>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={retakePhoto}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-md transition-all flex items-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    Solve Another Problem
                  </button>
                  <button
                    onClick={() => alert('Solution saved to notes!')}
                    className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300 transition-all flex items-center gap-2"
                  >
                    <Bookmark className="w-5 h-5" />
                    Save Solution
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-6 border border-blue-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Tips for Better Results
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-700">Good Lighting</p>
              <p className="text-sm text-slate-500">Ensure the problem is well-lit and clear</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-700">Clear Focus</p>
              <p className="text-sm text-slate-500">Keep the camera steady and in focus</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-700">Full Problem</p>
              <p className="text-sm text-slate-500">Capture the complete problem statement</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-700">Readable Text</p>
              <p className="text-sm text-slate-500">Make sure all text is legible</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const navigate = useNavigate();
  const unlockedCount = achievementsData.filter(a => a.unlocked).length;

  useEffect(() => {
    const user = localStorage.getItem('edututor_currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('edututor_currentUser');
    navigate('/login');
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-6 md:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-24 h-24 rounded-full border-4 border-white/30 shadow-lg"
          />
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold">{currentUser.name}</h2>
            <p className="opacity-90">{currentUser.email}</p>
            <div className="flex items-center justify-center md:justify-start gap-4 mt-3">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">Class {currentUser.class}</span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">Level {currentUser.level}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-800">{currentUser.points}</p>
              <p className="text-sm text-slate-500">Total Points</p>
            </div>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full" style={{ width: '60%' }}></div>
          </div>
          <p className="text-sm text-slate-500 mt-2">400 points to Level {currentUser.level + 1}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-800">{currentUser.streak}</p>
              <p className="text-sm text-slate-500">Day Streak</p>
            </div>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 7 }).map((_, idx) => (
              <div key={idx} className={`flex-1 h-2 rounded-full ${idx < currentUser.streak ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-slate-200'}`}></div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-800">{unlockedCount}</p>
              <p className="text-sm text-slate-500">Achievements</p>
            </div>
          </div>
          <p className="text-sm text-slate-600">{Math.round((unlockedCount / achievementsData.length) * 100)}% of achievements unlocked</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Account Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">Edit Profile</p>
                <p className="text-sm text-slate-500">Update your information</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">Change Password</p>
                <p className="text-sm text-slate-500">Update your password</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">Subscription</p>
                <p className="text-sm text-slate-500">Manage your plan</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full py-4 bg-red-500 text-white rounded-2xl font-semibold hover:bg-red-600 transition-all flex items-center justify-center gap-2"
      >
        <LogOut className="w-5 h-5" />
        Sign Out
      </button>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/chapters/:id" element={<ChapterDetail />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/camera" element={<CameraFeature />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;