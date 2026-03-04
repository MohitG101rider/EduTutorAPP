import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain, MessageSquare, Sparkles,
  Lightbulb, FileText, Download, Share2,
  Bookmark, CheckCircle, Circle, Clock, Target, Award,
  ArrowLeft, BarChart3, Play, Pause
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChapterDetail = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/');
    }
  }, [navigate]);

  const chapter = {
    id: 1,
    title: 'Chemical Reactions and Equations',
    subject: 'Science',
    class: '10',
    pages: 24,
    totalConcepts: 8,
    completedConcepts: 3,
    lastAccessed: '2 hours ago',
    estimatedTime: '45 minutes',
    difficulty: 'Medium',
    sections: [
      {
        id: 1,
        title: 'Introduction to Chemical Reactions',
        content: `A chemical reaction is a process that leads to the chemical transformation of one set of chemical substances to another. Chemical reactions involve breaking chemical bonds between reactant molecules and forming new bonds between product molecules.

Key characteristics of chemical reactions:
1. Change in color
2. Evolution of gas
3. Formation of precipitate
4. Change in temperature
5. Change in state

Examples of chemical reactions in daily life:
- Rusting of iron
- Cooking of food
- Digestion of food
- Burning of fuel`,
        keyPoints: ['Definition of chemical reaction', 'Signs of chemical reactions', 'Real-world examples'],
        completed: true
      },
      {
        id: 2,
        title: 'Chemical Equations',
        content: `A chemical equation is a symbolic representation of a chemical reaction. It shows the reactants on the left side and products on the right side, separated by an arrow.

Types of chemical equations:
1. Word equation - uses names of substances
2. Skeletal equation - uses chemical formulas without balancing
3. Balanced equation - follows law of conservation of mass

Rules for writing chemical equations:
- Write correct chemical formulas
- Balance the equation
- Indicate physical states (s, l, g, aq)
- Show conditions above the arrow if necessary`,
        keyPoints: ['Types of equations', 'Balancing rules', 'Physical states'],
        completed: true
      },
      {
        id: 3,
        title: 'Types of Chemical Reactions',
        content: `There are several types of chemical reactions:

1. Combination Reaction: Two or more substances combine to form a single product.
   Example: 2H₂ + O₂ → 2H₂O

2. Decomposition Reaction: A single compound breaks down into two or more simpler substances.
   Example: 2H₂O₂ → 2H₂O + O₂

3. Displacement Reaction: A more reactive element displaces a less reactive element from its compound.
   Example: Fe + CuSO₄ → FeSO₄ + Cu

4. Double Displacement Reaction: Exchange of ions between two compounds.
   Example: NaCl + AgNO₃ → AgCl + NaNO₃

5. Oxidation-Reduction (Redox) Reaction: Involves transfer of electrons.
   Example: 2Mg + O₂ → 2MgO`,
        keyPoints: ['Five main types', 'Examples of each', 'How to identify'],
        completed: false
      },
      {
        id: 4,
        title: 'Oxidation and Reduction',
        content: `Oxidation and reduction are complementary processes that occur simultaneously.

Oxidation:
- Loss of electrons
- Gain of oxygen
- Loss of hydrogen
- Increase in oxidation state

Reduction:
- Gain of electrons
- Loss of oxygen
- Gain of hydrogen
- Decrease in oxidation state

Mnemonics:
- OIL RIG: Oxidation Is Loss, Reduction Is Gain (of electrons)
- LEO the lion says GER: Loss of Electrons is Oxidation, Gain of Electrons is Reduction

Examples:
- Rusting: Iron is oxidized
- Photosynthesis: CO₂ is reduced to glucose`,
        keyPoints: ['Definitions', 'Mnemonics', 'Real examples'],
        completed: false
      },
      {
        id: 5,
        title: 'Effects of Oxidation Reactions',
        content: `Oxidation reactions have both beneficial and harmful effects:

Corrosion:
- Rusting of iron
- Tarnishing of silver
- Green coating on copper

Rancidity:
- Oxidation of fats and oils in food
- Prevented by:
  * Storing in airtight containers
  * Adding antioxidants
  * Flushing with nitrogen

Prevention methods:
- Painting or coating metals
- Galvanization
- Using stainless steel
- Proper food storage`,
        keyPoints: ['Corrosion effects', 'Rancidity', 'Prevention methods'],
        completed: false
      }
    ],
    concepts: [
      { name: 'Chemical Reactions', mastered: true },
      { name: 'Balancing Equations', mastered: true },
      { name: 'Types of Reactions', mastered: true },
      { name: 'Oxidation-Reduction', mastered: false },
      { name: 'Corrosion', mastered: false },
      { name: 'Rancidity', mastered: false },
      { name: 'Energy Changes', mastered: false },
      { name: 'Real-world Applications', mastered: false }
    ]
  };

  const handleSectionComplete = (sectionId: number) => {
    setProgress(((sectionId) / chapter.sections.length) * 100);
  };

  const handleAskTutor = () => {
    navigate('/chat');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-purple-200 hover:text-white transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-purple-300">{user.name.charAt(0).toUpperCase()}</span>
              </div>
              <span className="text-sm text-purple-200">{user.name}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chapter Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                    {chapter.subject} • Class {chapter.class}
                  </span>
                  <h1 className="text-3xl font-bold text-white mt-4 mb-2">{chapter.title}</h1>
                  <p className="text-purple-200">{chapter.pages} pages • {chapter.totalConcepts} concepts</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setBookmarked(!bookmarked)}
                    className={`p-3 rounded-xl transition-all ${
                      bookmarked ? 'bg-purple-500 text-white' : 'bg-white/5 text-purple-200 hover:bg-white/10'
                    }`}
                  >
                    <Bookmark className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-white/5 text-purple-200 rounded-xl hover:bg-white/10 transition-all">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-white/5 text-purple-200 rounded-xl hover:bg-white/10 transition-all">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-purple-200">Chapter Progress</span>
                  <span className="text-sm text-purple-300">{Math.round(progress)}%</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <Clock className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <p className="text-lg font-bold text-white">{chapter.estimatedTime}</p>
                  <p className="text-xs text-purple-300">Est. Time</p>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <Target className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <p className="text-lg font-bold text-white">{chapter.completedConcepts}/{chapter.totalConcepts}</p>
                  <p className="text-xs text-purple-300">Concepts</p>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-xl">
                  <Award className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <p className="text-lg font-bold text-white">{chapter.difficulty}</p>
                  <p className="text-xs text-purple-300">Difficulty</p>
                </div>
              </div>
            </motion.div>

            {/* Sections */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-4">Learning Sections</h2>
              {chapter.sections.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white/5 backdrop-blur-xl rounded-2xl border transition-all cursor-pointer ${
                    activeSection === index ? 'border-purple-500/50' : 'border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => setActiveSection(index)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          section.completed ? 'bg-green-500/20' : 'bg-purple-500/20'
                        }`}>
                          {section.completed ? (
                            <CheckCircle className="w-6 h-6 text-green-400" />
                          ) : (
                            <Circle className="w-6 h-6 text-purple-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{section.title}</h3>
                          <p className="text-sm text-purple-300">{section.keyPoints.length} key points</p>
                        </div>
                      </div>
                      {activeSection === index ? (
                        <Pause className="w-5 h-5 text-purple-400" />
                      ) : (
                        <Play className="w-5 h-5 text-purple-400" />
                      )}
                    </div>

                    {activeSection === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-4"
                      >
                        <div className="prose prose-invert max-w-none">
                          <p className="text-purple-200 whitespace-pre-line">{section.content}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {section.keyPoints.map((point, i) => (
                            <span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-lg">
                              {point}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-3 pt-4 border-t border-white/10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSectionComplete(section.id);
                            }}
                            className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                          >
                            Mark as Complete
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAskTutor();
                            }}
                            className="flex-1 py-2 bg-white/5 text-purple-200 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                          >
                            <MessageSquare className="w-4 h-4" />
                            Ask About This
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Concepts Progress */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                Concepts Mastery
              </h3>
              <div className="space-y-3">
                {chapter.concepts.map((concept, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-purple-200 text-sm">{concept.name}</span>
                    {concept.mastered ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-purple-400" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={handleAskTutor}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Ask AI Tutor
                </button>
                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className="w-full py-3 bg-white/5 text-purple-200 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  {showNotes ? 'Hide Notes' : 'View My Notes'}
                </button>
                <button className="w-full py-3 bg-white/5 text-purple-200 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  View Progress
                </button>
              </div>
            </motion.div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30"
            >
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Learning Tips
              </h3>
              <ul className="space-y-2 text-sm text-purple-200">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Complete all sections for full understanding</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Ask questions when you're stuck</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Practice with real-world examples</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>Review completed sections regularly</span>
                </li>
              </ul>
            </motion.div>

            {/* AI Tutor Promo */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-2xl p-6 border border-green-500/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">AI Tutor</h3>
                  <p className="text-xs text-green-300">Context Pruning Enabled</p>
                </div>
              </div>
              <p className="text-sm text-purple-200 mb-4">
                Get instant answers with 70% less data transfer and cost!
              </p>
              <button
                onClick={handleAskTutor}
                className="w-full py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all"
              >
                Start Chatting
              </button>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChapterDetail;
