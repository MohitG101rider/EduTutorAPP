import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Plus, Search, Edit2, Trash2, Save, X,
  BookOpen, Brain, Tag, Calendar, Clock,
  Home, LogOut, Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Note {
  id: number;
  title: string;
  content: string;
  chapterId: number | null;
  chapterTitle: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  starred: boolean;
}

const Notes = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      title: 'Key Formulas - Electricity',
      content: 'V = IR (Ohm\'s Law)\nP = VI = I²R = V²/R (Power)\nR = ρL/A (Resistance)\nH = I²Rt (Joule\'s Law)\n\nImportant:\n- In series: R_eq = R1 + R2 + R3\n- In parallel: 1/R_eq = 1/R1 + 1/R2 + 1/R3\n- Current is same in series\n- Voltage is same in parallel',
      chapterId: 3,
      chapterTitle: 'Electricity',
      tags: ['formulas', 'important', 'physics'],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
      starred: true
    },
    {
      id: 2,
      title: 'Light Ray Diagrams',
      content: 'Concave Mirror Ray Diagrams:\n\n1. Object at infinity: Image at F, real, inverted, highly diminished\n2. Object beyond C: Image between C and F, real, inverted, diminished\n3. Object at C: Image at C, real, inverted, same size\n4. Object between C and F: Image beyond C, real, inverted, enlarged\n5. Object at F: Image at infinity, real, inverted, highly enlarged\n6. Object between F and P: Image behind mirror, virtual, erect, enlarged\n\nConvex Mirror:\n- Always forms virtual, erect, diminished image\n- Image is between P and F',
      chapterId: 2,
      chapterTitle: 'Light - Reflection and Refraction',
      tags: ['diagrams', 'practice', 'optics'],
      createdAt: '2024-01-14',
      updatedAt: '2024-01-14',
      starred: true
    },
    {
      id: 3,
      title: 'Chemical Equation Balancing Tips',
      content: 'Steps to balance chemical equations:\n\n1. Write the unbalanced equation\n2. Count atoms of each element on both sides\n3. Start with elements that appear in only one compound on each side\n4. Balance polyatomic ions as a unit if they appear on both sides\n5. Balance hydrogen and oxygen last\n6. Check your work\n\nTips:\n- Use coefficients, not subscripts\n- Keep polyatomic ions together when possible\n- Balance metals first, then non-metals\n- Double-check atom counts',
      chapterId: 1,
      chapterTitle: 'Chemical Reactions',
      tags: ['tips', 'chemistry', 'balancing'],
      createdAt: '2024-01-13',
      updatedAt: '2024-01-13',
      starred: false
    },
    {
      id: 4,
      title: 'Mendel\'s Laws Summary',
      content: 'Law of Segregation (First Law):\n- Each individual has two alleles for each trait\n- Alleles separate during gamete formation\n- Each gamete receives one allele\n- Random fertilization restores pair\n\nLaw of Independent Assortment (Second Law):\n- Genes for different traits assort independently\n- Applies to genes on different chromosomes\n- Creates genetic variation\n\nKey Terms:\n- Genotype: Genetic makeup\n- Phenotype: Observable characteristics\n- Homozygous: Same alleles (AA, aa)\n- Heterozygous: Different alleles (Aa)',
      chapterId: 4,
      chapterTitle: 'Heredity and Evolution',
      tags: ['genetics', 'mendel', 'biology'],
      createdAt: '2024-01-12',
      updatedAt: '2024-01-12',
      starred: false
    },
    {
      id: 5,
      title: 'Life Processes - Quick Notes',
      content: 'Photosynthesis:\n6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂\n\nHuman Digestion:\n- Mouth: Amylase breaks down starch\n- Stomach: Pepsin breaks down proteins\n- Small intestine: Complete digestion and absorption\n- Large intestine: Water absorption\n\nRespiration:\n- Aerobic: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + 36 ATP\n- Anaerobic: C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂ + 2 ATP\n\nExcretion:\n- Kidneys filter blood\n- Nephrons are functional units\n- Urine: water, urea, salts',
      chapterId: 5,
      chapterTitle: 'Life Processes',
      tags: ['biology', 'processes', 'equations'],
      createdAt: '2024-01-11',
      updatedAt: '2024-01-11',
      starred: true
    }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [newNote, setNewNote] = useState({ title: '', content: '', tags: '' });

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

  const allTags = [...new Set(notes.flatMap(note => note.tags))];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !filterTag || note.tags.includes(filterTag);
    return matchesSearch && matchesTag;
  });

  const handleCreateNote = () => {
    const note: Note = {
      id: Date.now(),
      title: newNote.title || 'Untitled Note',
      content: newNote.content,
      chapterId: null,
      chapterTitle: 'General',
      tags: newNote.tags.split(',').map(t => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      starred: false
    };
    setNotes([note, ...notes]);
    setNewNote({ title: '', content: '', tags: '' });
    setShowCreateModal(false);
  };

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
  };

  const handleToggleStar = (id: number) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, starred: !note.starred } : note
    ));
  };

  const handleSaveEdit = () => {
    if (selectedNote) {
      setNotes(notes.map(note =>
        note.id === selectedNote.id ? { ...selectedNote, updatedAt: new Date().toISOString().split('T')[0] } : note
      ));
      setIsEditing(false);
    }
  };

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

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-purple-200 hover:text-white transition-all"
              >
                <Home className="w-5 h-5" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-purple-300">{user.name.charAt(0).toUpperCase()}</span>
              </div>
              <button onClick={handleLogout} className="text-purple-200 hover:text-white">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Create Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Note
            </button>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>

            {/* Tags Filter */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
              <h3 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Filter by Tag
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setFilterTag(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    !filterTag ? 'bg-purple-500/20 text-purple-300' : 'text-purple-200 hover:bg-white/5'
                  }`}
                >
                  All Notes
                </button>
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setFilterTag(tag)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      filterTag === tag ? 'bg-purple-500/20 text-purple-300' : 'text-purple-200 hover:bg-white/5'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30">
              <h3 className="text-lg font-bold text-white mb-4">Note Statistics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-purple-200">Total Notes</span>
                  <span className="text-white font-bold">{notes.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-200">Starred</span>
                  <span className="text-yellow-400 font-bold">{notes.filter(n => n.starred).length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-200">Unique Tags</span>
                  <span className="text-green-400 font-bold">{allTags.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes List */}
          <div className="lg:col-span-3">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No notes found</h3>
                <p className="text-purple-200 mb-4">Create your first note to get started!</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  Create Note
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                <AnimatePresence>
                  {filteredNotes.map((note, index) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedNote(note)}
                      className={`bg-white/5 backdrop-blur-xl rounded-2xl p-6 border cursor-pointer transition-all hover:border-purple-500/50 ${
                        selectedNote?.id === note.id ? 'border-purple-500/50' : 'border-white/10'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-1">{note.title}</h3>
                          <p className="text-sm text-purple-300 flex items-center gap-2">
                            <BookOpen className="w-3 h-3" />
                            {note.chapterTitle}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStar(note.id);
                          }}
                          className={`p-2 rounded-lg transition-all ${
                            note.starred ? 'text-yellow-400' : 'text-purple-300 hover:text-yellow-400'
                          }`}
                        >
                          <Star className={`w-5 h-5 ${note.starred ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                      <p className="text-purple-200 text-sm mb-4 line-clamp-3">{note.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {note.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-lg">
                              #{tag}
                            </span>
                          ))}
                          {note.tags.length > 3 && (
                            <span className="px-2 py-1 bg-white/5 text-purple-300 text-xs rounded-lg">
                              +{note.tags.length - 3}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-purple-300 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {note.createdAt}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Note Detail Modal */}
      <AnimatePresence>
        {selectedNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              if (!isEditing) setSelectedNote(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 rounded-3xl border border-white/10 max-w-3xl w-full max-h-[80vh] overflow-hidden"
            >
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-4">
                  {isEditing ? (
                    <input
                      type="text"
                      value={selectedNote.title}
                      onChange={(e) => setSelectedNote({ ...selectedNote, title: e.target.value })}
                      className="flex-1 text-2xl font-bold text-white bg-transparent border-b border-purple-500 focus:outline-none"
                    />
                  ) : (
                    <h2 className="text-2xl font-bold text-white">{selectedNote.title}</h2>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleStar(selectedNote.id)}
                      className={`p-2 rounded-lg transition-all ${
                        selectedNote.starred ? 'text-yellow-400' : 'text-purple-300'
                      }`}
                    >
                      <Star className={`w-5 h-5 ${selectedNote.starred ? 'fill-current' : ''}`} />
                    </button>
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all"
                        >
                          <Save className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="p-2 bg-white/5 text-purple-300 rounded-lg hover:bg-white/10 transition-all"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="p-2 bg-white/5 text-purple-300 rounded-lg hover:bg-white/10 transition-all"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteNote(selectedNote.id)}
                          className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-purple-300">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {selectedNote.chapterTitle}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {selectedNote.createdAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Updated: {selectedNote.updatedAt}
                  </span>
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-[50vh]">
                {isEditing ? (
                  <textarea
                    value={selectedNote.content}
                    onChange={(e) => setSelectedNote({ ...selectedNote, content: e.target.value })}
                    className="w-full h-64 p-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                  />
                ) : (
                  <div className="prose prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap text-purple-200 font-sans">{selectedNote.content}</pre>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedNote.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-lg">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Note Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 rounded-3xl border border-white/10 max-w-lg w-full p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Create New Note</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-purple-200 text-sm mb-2">Title</label>
                  <input
                    type="text"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    placeholder="Note title..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
                <div>
                  <label className="block text-purple-200 text-sm mb-2">Content</label>
                  <textarea
                    value={newNote.content}
                    onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                    placeholder="Write your notes here..."
                    rows={8}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-purple-200 text-sm mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={newNote.tags}
                    onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
                    placeholder="physics, formulas, important"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-3 bg-white/5 text-purple-200 rounded-xl hover:bg-white/10 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateNote}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all"
                  >
                    Create Note
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notes;
