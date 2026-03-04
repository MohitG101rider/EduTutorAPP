import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Brain, MessageSquare, BarChart3, LogOut,
  ChevronRight, Sparkles, TrendingUp, Award, Lightbulb,
  FileText, GraduationCap, Clock, Target, CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Chapter {
  id: number;
  title: string;
  subject: string;
  class: string;
  pages: number;
  concepts: string[];
  completed: boolean;
}

interface Note {
  id: number;
  title: string;
  chapterId: number;
  content: string;
  createdAt: string;
  tags: string[];
}

interface ClassInfo {
  id: number;
  name: string;
  subject: string;
  teacher: string;
  nextClass: string;
  students: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedClass, setSelectedClass] = useState(10);
  const [selectedSubject, setSelectedSubject] = useState('Science');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const chapters: Chapter[] = [
    {
      id: 1,
      title: 'Chemical Reactions and Equations',
      subject: 'Science',
      class: '10',
      pages: 24,
      concepts: ['Oxidation', 'Reduction', 'Balancing', 'Types of Reactions'],
      completed: true
    },
    {
      id: 2,
      title: 'Light - Reflection and Refraction',
      subject: 'Science',
      class: '10',
      pages: 32,
      concepts: ['Mirrors', 'Lenses', 'Snell\'s Law', 'Total Internal Reflection'],
      completed: false
    },
    {
      id: 3,
      title: 'Electricity',
      subject: 'Science',
      class: '10',
      pages: 28,
      concepts: ['Ohm\'s Law', 'Resistors', 'Circuits', 'Power'],
      completed: false
    },
    {
      id: 4,
      title: 'Heredity and Evolution',
      subject: 'Science',
      class: '10',
      pages: 20,
      concepts: ['Mendel\'s Laws', 'DNA', 'Evolution', 'Speciation'],
      completed: false
    },
    {
      id: 5,
      title: 'Life Processes',
      subject: 'Science',
      class: '10',
      pages: 36,
      concepts: ['Digestion', 'Respiration', 'Circulation', 'Excretion'],
      completed: false
    }
  ];

  const notes: Note[] = [
    {
      id: 1,
      title: 'Key Formulas - Electricity',
      chapterId: 3,
      content: 'V = IR, P = VI, R = ρL/A...',
      createdAt: '2024-01-15',
      tags: ['formulas', 'important']
    },
    {
      id: 2,
      title: 'Light Ray Diagrams',
      chapterId: 2,
      content: 'Concave mirror ray diagrams for different object positions...',
      createdAt: '2024-01-14',
      tags: ['diagrams', 'practice']
    },
    {
      id: 3,
      title: 'Chemical Equation Balancing Tips',
      chapterId: 1,
      content: 'Always balance oxygen and hydrogen last...',
      createdAt: '2024-01-13',
      tags: ['tips', 'chemistry']
    }
  ];

  const classes: ClassInfo[] = [
    { id: 1, name: 'Physics Lab', subject: 'Science', teacher: 'Prof. Sharma', nextClass: 'Tomorrow, 10 AM', students: 45 },
    { id: 2, name: 'Chemistry Workshop', subject: 'Science', teacher: 'Dr. Patel', nextClass: 'Wed, 2 PM', students: 38 },
    { id: 3, name: 'Biology Field Study', subject: 'Science', teacher: 'Ms. Gupta', nextClass: 'Fri, 11 AM', students: 42 }
  ];

  const stats = [
    { icon: BookOpen, label: 'Chapters Completed', value: '12/45', color: 'from-blue-500 to-cyan-500' },
    { icon: Clock, label: 'Study Hours', value: '156h', color: 'from-purple-500 to-pink-500' },
    { icon: Award, label: 'Quiz Score', value: '87%', color: 'from-yellow-500 to-orange-500' },
    { icon: TrendingUp, label: 'Progress', value: '68%', color: 'from-green-500 to-emerald-500' }
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">EduTutor India</span>
            </div>

            <div className="hidden md:flex items-center gap-1">
              {[
                { id: 'overview', icon: BarChart3, label: 'Overview' },
                { id: 'chapters', icon: BookOpen, label: 'Chapters' },
                { id: 'notes', icon: FileText, label: 'Notes' },
                { id: 'classes', icon: GraduationCap, label: 'Classes' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-purple-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-purple-200">
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold">{user.name.charAt(0).toUpperCase()}</span>
                </div>
                <span className="text-sm">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-purple-200 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Welcome Section */}
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user.name}! 👋</h1>
                <p className="text-purple-200">Ready to continue your learning journey today?</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300 group"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-purple-200 text-sm">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10 cursor-pointer"
                  onClick={() => navigate('/chat')}
                >
                  <MessageSquare className="w-8 h-8 text-blue-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Ask AI Tutor</h3>
                  <p className="text-purple-200 text-sm">Get instant answers to your questions with context pruning</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10 cursor-pointer"
                  onClick={() => setActiveTab('chapters')}
                >
                  <BookOpen className="w-8 h-8 text-purple-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Continue Learning</h3>
                  <p className="text-purple-200 text-sm">Pick up where you left off with your chapters</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10 cursor-pointer"
                >
                  <Lightbulb className="w-8 h-8 text-yellow-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Daily Challenge</h3>
                  <p className="text-purple-200 text-sm">Test your knowledge with today's quiz</p>
                </motion.div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  {[
                    { action: 'Completed chapter', item: 'Chemical Reactions', time: '2 hours ago', icon: CheckCircle },
                    { action: 'Asked question', item: 'About Ohm\'s Law', time: '5 hours ago', icon: MessageSquare },
                    { action: 'Created note', item: 'Key Formulas', time: '1 day ago', icon: FileText },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
                      <activity.icon className="w-5 h-5 text-purple-400" />
                      <div className="flex-1">
                        <p className="text-white">{activity.action}: <span className="text-purple-200">{activity.item}</span></p>
                        <p className="text-purple-300/60 text-sm">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'chapters' && (
            <motion.div
              key="chapters"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">Study Chapters</h1>
                <div className="flex gap-2">
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(Number(e.target.value))}
                    className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="9">Class 9</option>
                    <option value="10">Class 10</option>
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                  </select>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option>Science</option>
                    <option>Mathematics</option>
                    <option>History</option>
                    <option>Geography</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chapters.map((chapter, index) => (
                  <motion.div
                    key={chapter.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300 cursor-pointer"
                    onClick={() => navigate(`/chapter/${chapter.id}`)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                        {chapter.subject}
                      </span>
                      {chapter.completed && (
                        <span className="px-3 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                          Completed
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{chapter.title}</h3>
                    <p className="text-purple-200 text-sm mb-4">{chapter.pages} pages • Class {chapter.class}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {chapter.concepts.slice(0, 3).map((concept, i) => (
                        <span key={i} className="px-2 py-1 bg-white/5 text-purple-200 text-xs rounded-lg">
                          {concept}
                        </span>
                      ))}
                      {chapter.concepts.length > 3 && (
                        <span className="px-2 py-1 bg-white/5 text-purple-300 text-xs rounded-lg">
                          +{chapter.concepts.length - 3} more
                        </span>
                      )}
                    </div>
                    <button className="w-full py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded-xl hover:from-purple-500/30 hover:to-pink-500/30 transition-all flex items-center justify-center gap-2">
                      Start Learning <ChevronRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'notes' && (
            <motion.div
              key="notes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white">My Notes</h1>
                <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Create New Note
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map((note, index) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300"
                  >
                    <h3 className="text-lg font-bold text-white mb-3">{note.title}</h3>
                    <p className="text-purple-200 text-sm mb-4 line-clamp-3">{note.content}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {note.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-lg">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-purple-300/60 text-xs">{note.createdAt}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'classes' && (
            <motion.div
              key="classes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h1 className="text-3xl font-bold text-white">My Classes</h1>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((cls, index) => (
                  <motion.div
                    key={cls.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                        {cls.subject}
                      </span>
                      <Target className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{cls.name}</h3>
                    <p className="text-purple-200 text-sm mb-4">Teacher: {cls.teacher}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-purple-300">Next: {cls.nextClass}</span>
                      <span className="text-purple-300">{cls.students} students</span>
                    </div>
                    <button className="w-full mt-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded-xl hover:from-purple-500/30 hover:to-pink-500/30 transition-all">
                      Join Class
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;
