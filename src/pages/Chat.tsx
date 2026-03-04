import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, BookOpen, Brain, Sparkles, Zap,
  Lightbulb, ChevronDown, ChevronUp, Copy,
  ThumbsUp, ThumbsDown, RotateCcw, BarChart3, Home,
  Menu, X, Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  prunedContext?: {
    originalSize: number;
    prunedSize: number;
    savings: number;
    selectedSentences: string[];
  };
  cost?: {
    original: number;
    pruned: number;
    saved: number;
  };
}

interface Chapter {
  id: number;
  title: string;
  content: string;
  concepts: string[];
}

const Chat = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [showContext, setShowContext] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/');
    }
  }, [navigate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chapters: Chapter[] = [
    {
      id: 1,
      title: 'Chemical Reactions and Equations',
      content: `A chemical reaction is a process that leads to the chemical transformation of one set of chemical substances to another. Chemical reactions involve breaking chemical bonds between reactant molecules and forming new bonds between product molecules.

Oxidation is the loss of electrons or an increase in oxidation state by a molecule, atom, or ion. Reduction is the gain of electrons or a decrease in oxidation state. These processes always occur together in what is called a redox reaction.

Balancing chemical equations is essential to satisfy the law of conservation of mass. The number of atoms of each element must be equal on both sides of the equation.

Types of chemical reactions include: combination reactions, decomposition reactions, displacement reactions, double displacement reactions, oxidation-reduction reactions, and precipitation reactions.

Exothermic reactions release energy to the surroundings, while endothermic reactions absorb energy from the surroundings. Combustion is a common example of an exothermic reaction.`,
      concepts: ['Oxidation', 'Reduction', 'Balancing', 'Types of Reactions', 'Exothermic', 'Endothermic']
    },
    {
      id: 2,
      title: 'Light - Reflection and Refraction',
      content: `Light travels in straight lines and exhibits several properties including reflection, refraction, diffraction, and interference. The speed of light in vacuum is approximately 3 × 10^8 m/s.

Reflection occurs when light bounces off a surface. The law of reflection states that the angle of incidence equals the angle of reflection. Concave mirrors converge light rays, while convex mirrors diverge them.

Refraction is the bending of light when it passes from one medium to another with a different optical density. Snell's Law describes this: n1 × sin(θ1) = n2 × sin(θ2), where n is the refractive index.

Lenses work on the principle of refraction. Convex lenses converge light rays and can form real or virtual images. Concave lenses always diverge light rays and form virtual, upright, and diminished images.

Total internal reflection occurs when light travels from a denser medium to a rarer medium at an angle greater than the critical angle. This principle is used in optical fibers.`,
      concepts: ['Reflection', 'Refraction', 'Snell\'s Law', 'Mirrors', 'Lenses', 'Total Internal Reflection']
    },
    {
      id: 3,
      title: 'Electricity',
      content: `Electricity is the flow of electric charge. Electric current is measured in amperes (A) and represents the rate of flow of charge. The conventional current flows from positive to negative terminal.

Ohm's Law states that the current through a conductor is directly proportional to the voltage across it, provided temperature remains constant: V = I × R, where V is voltage, I is current, and R is resistance.

Resistance depends on the material, length, and cross-sectional area of the conductor: R = ρ × L/A, where ρ is resistivity. Series and parallel combinations of resistors follow different rules for calculating equivalent resistance.

Electric power is the rate at which electrical energy is transferred: P = V × I = I² × R = V²/R. The SI unit of power is watt (W).

Heating effect of current is used in electric heaters, irons, and bulbs. The heat produced is given by H = I² × R × t (Joule's Law).`,
      concepts: ['Ohm\'s Law', 'Resistance', 'Circuits', 'Power', 'Series', 'Parallel', 'Joule\'s Law']
    },
    {
      id: 4,
      title: 'Heredity and Evolution',
      content: `Heredity is the transmission of traits from parents to offspring through genes. Gregor Mendel's experiments with pea plants established the fundamental laws of inheritance.

Mendel's First Law (Law of Segregation) states that each individual has two alleles for each trait, which separate during gamete formation. The Second Law (Law of Independent Assortment) states that alleles of different genes assort independently.

DNA (Deoxyribonucleic acid) is the molecule that carries genetic information. It has a double helix structure with nucleotide bases: adenine (A), thymine (T), cytosine (C), and guanine (G).

Evolution is the change in the characteristics of a species over several generations. Natural selection, proposed by Charles Darwin, is the primary mechanism of evolution.

Speciation is the formation of new and distinct species in the course of evolution. It can occur through geographic isolation, genetic drift, or natural selection.`,
      concepts: ['Mendel\'s Laws', 'DNA', 'Natural Selection', 'Speciation', 'Genes', 'Evolution']
    },
    {
      id: 5,
      title: 'Life Processes',
      content: `Life processes are the basic functions performed by living organisms to maintain life. These include nutrition, respiration, transportation, and excretion.

Nutrition is the process by which organisms obtain and utilize food. Autotrophic nutrition (photosynthesis) is used by plants, while heterotrophic nutrition is used by animals and fungi.

Respiration is the process of releasing energy from food. Aerobic respiration requires oxygen and produces more energy (36 ATP), while anaerobic respiration occurs without oxygen and produces less energy (2 ATP).

The human digestive system includes the mouth, esophagus, stomach, small intestine, and large intestine. Enzymes like amylase, pepsin, and trypsin break down carbohydrates, proteins, and fats respectively.

The circulatory system transports nutrients, oxygen, and waste products. The heart pumps blood through arteries, capillaries, and veins. Blood contains red blood cells, white blood cells, and platelets.

Excretion removes metabolic waste from the body. In humans, the kidneys filter blood and produce urine. Plants excrete waste through leaves, bark, and roots.`,
      concepts: ['Nutrition', 'Respiration', 'Digestion', 'Circulation', 'Excretion', 'Photosynthesis']
    }
  ];

  const simulateAIResponse = async (question: string, chapterId: number | null) => {
    setIsLoading(true);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    const selectedChapter = chapterId ? chapters.find(c => c.id === chapterId) : chapters[0];
    const chapterContent = selectedChapter?.content || '';

    // Context Pruning Algorithm
    const sentences = chapterContent.split('. ').filter(s => s.length > 10);
    const questionKeywords = question.toLowerCase().split(' ').filter(word => 
      word.length > 3 && !['the', 'and', 'for', 'with', 'this', 'that'].includes(word)
    );

    // Score sentences based on keyword matching
    const scoredSentences = sentences.map(sentence => {
      const score = questionKeywords.reduce((acc, keyword) => 
        acc + (sentence.toLowerCase().includes(keyword) ? 1 : 0), 0
      );
      return { sentence, score };
    });

    // Select top sentences (context pruning)
    const selectedSentences = scoredSentences
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.min(5, scoredSentences.length))
      .map(s => s.sentence + '.');

    const originalSize = chapterContent.length;
    const prunedSize = selectedSentences.join(' ').length;
    const savings = ((originalSize - prunedSize) / originalSize * 100).toFixed(1);

    // Simulate cost calculation (assuming $0.001 per 1000 tokens)
    const originalTokens = Math.ceil(originalSize / 4);
    const prunedTokens = Math.ceil(prunedSize / 4);
    const originalCost = (originalTokens / 1000) * 0.001;
    const prunedCost = (prunedTokens / 1000) * 0.001;
    const costSaved = originalCost - prunedCost;

    // Generate response based on selected context
    let response = '';
    
    if (question.toLowerCase().includes('oxidation') || question.toLowerCase().includes('reduction')) {
      response = "Based on the chapter content, here's what I found:\n\n" +
        "**Oxidation and Reduction:**\n\n" +
        "Oxidation is the loss of electrons or an increase in oxidation state by a molecule, atom, or ion. Reduction is the gain of electrons or a decrease in oxidation state. These processes always occur together in what is called a redox reaction.\n\n" +
        "Key points to remember:\n" +
        "• Oxidation = Loss of electrons (OIL - Oxidation Is Loss)\n" +
        "• Reduction = Gain of electrons (RIG - Reduction Is Gain)\n" +
        "• Both processes occur simultaneously\n" +
        "• The substance that gets oxidized is the reducing agent\n" +
        "• The substance that gets reduced is the oxidizing agent\n\n" +
        "Would you like me to explain any specific example or type of redox reaction?";
    } else if (question.toLowerCase().includes('light') || question.toLowerCase().includes('mirror') || question.toLowerCase().includes('lens')) {
      response = "Here's what the chapter tells us about light:\n\n" +
        "**Light - Reflection and Refraction:**\n\n" +
        "Light travels in straight lines and exhibits several properties including reflection, refraction, diffraction, and interference. The speed of light in vacuum is approximately 3 × 10^8 m/s.\n\n" +
        "Key concepts:\n" +
        "• **Reflection**: Angle of incidence = Angle of reflection\n" +
        "• **Refraction**: Bending of light when passing between media (Snell's Law)\n" +
        "• **Concave mirrors**: Converge light rays\n" +
        "• **Convex mirrors**: Diverge light rays\n" +
        "• **Total internal reflection**: Used in optical fibers\n\n" +
        "Is there a specific concept you'd like me to elaborate on?";
    } else if (question.toLowerCase().includes('electricity') || question.toLowerCase().includes('ohm') || question.toLowerCase().includes('voltage') || question.toLowerCase().includes('current')) {
      response = "Great question! Here's what the chapter explains:\n\n" +
        "**Electricity Fundamentals:**\n\n" +
        "Electricity is the flow of electric charge. Electric current is measured in amperes (A) and represents the rate of flow of charge.\n\n" +
        "**Ohm's Law:** V = I × R\n" +
        "• V = Voltage (Volts)\n" +
        "• I = Current (Amperes)\n" +
        "• R = Resistance (Ohms)\n\n" +
        "**Electric Power:** P = V × I = I² × R = V²/R\n\n" +
        "Important formulas to remember:\n" +
        "• Resistance: R = ρ × L/A\n" +
        "• Heat produced: H = I² × R × t (Joule's Law)\n\n" +
        "Need help with any specific problem or concept?";
    } else {
      response = "Based on the selected chapter, here's what I found:\n\n" +
        selectedSentences.slice(0, 3).join(' ') + '\n\n' +
        "This content is from the chapter: **" + selectedChapter?.title + "**\n\n" +
        "Key concepts covered:\n" +
        selectedChapter?.concepts.map(c => `• ${c}`).join('\n') + '\n\n' +
        "Would you like me to explain any specific concept in more detail?";
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
      prunedContext: {
        originalSize,
        prunedSize,
        savings: parseFloat(savings),
        selectedSentences
      },
      cost: {
        original: originalCost,
        pruned: prunedCost,
        saved: costSaved
      }
    };

    setMessages(prev => [...prev, newMessage]);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const question = input;
    setInput('');

    await simulateAIResponse(question, selectedChapter);
  };

  const handleClearChat = () => {
    setMessages([]);
    setSelectedChapter(null);
  };

  const formatCurrency = (value: number) => {
    return value < 0.001 ? `$${(value * 1000000).toFixed(2)}μ` : `$${value.toFixed(6)}`;
  };

  if (!user) return null;

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="w-80 bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col"
          >
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">EduTutor India</h2>
                  <p className="text-xs text-purple-300">Context Pruning AI</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-2 bg-white/5 text-purple-200 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Back to Dashboard
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Select Chapter
              </h3>
              <div className="space-y-2">
                {chapters.map((chapter) => (
                  <button
                    key={chapter.id}
                    onClick={() => setSelectedChapter(chapter.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all ${
                      selectedChapter === chapter.id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'bg-white/5 text-purple-200 hover:bg-white/10'
                    }`}
                  >
                    <p className="font-medium text-sm">{chapter.title}</p>
                    <p className="text-xs opacity-70 mt-1">{chapter.concepts.length} concepts</p>
                  </button>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Cost Savings
                </h3>
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-300 text-sm">Total Saved</span>
                    <Award className="w-5 h-5 text-green-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">
                    ${messages.reduce((acc, m) => acc + (m.cost?.saved || 0), 0).toFixed(6)}
                  </p>
                  <p className="text-xs text-green-300 mt-1">
                    {messages.length > 0 
                      ? `${((messages.reduce((acc, m) => acc + (m.prunedContext?.savings || 0), 0) / messages.length)).toFixed(0)}% avg context reduction`
                      : 'Start chatting to see savings!'}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-semibold text-purple-300 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Quick Tips
                </h3>
                <div className="space-y-2 text-xs text-purple-200">
                  <p>• Select a chapter for focused answers</p>
                  <p>• Ask specific questions for better results</p>
                  <p>• Context pruning saves up to 70% cost</p>
                  <p>• Works even with low bandwidth</p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-purple-300">{user.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">{user.name}</p>
                  <p className="text-xs text-purple-300">Class 10</p>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-purple-200 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">AI Tutor Chat</h1>
                <p className="text-sm text-purple-300">
                  {selectedChapter 
                    ? `Chapter: ${chapters.find(c => c.id === selectedChapter)?.title}`
                    : 'Select a chapter to get started'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClearChat}
              className="px-4 py-2 bg-white/5 text-purple-200 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Clear Chat
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Lightbulb className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Welcome to EduTutor India!</h2>
                <p className="text-purple-200 mb-6">
                  I'm your AI tutor powered by context pruning technology. Select a chapter from the sidebar and ask me anything!
                </p>
                <div className="grid gap-3">
                  <p className="text-sm text-purple-300">Try asking:</p>
                  <div className="grid grid-cols-2 gap-2 text-left">
                    <button
                      onClick={() => setInput('What is oxidation and reduction?')}
                      className="p-3 bg-white/5 text-purple-200 text-sm rounded-xl hover:bg-white/10 transition-all text-left"
                    >
                      "What is oxidation?"
                    </button>
                    <button
                      onClick={() => setInput('Explain Ohm\'s Law')}
                      className="p-3 bg-white/5 text-purple-200 text-sm rounded-xl hover:bg-white/10 transition-all text-left"
                    >
                      "Explain Ohm's Law"
                    </button>
                    <button
                      onClick={() => setInput('How do mirrors work?')}
                      className="p-3 bg-white/5 text-purple-200 text-sm rounded-xl hover:bg-white/10 transition-all text-left"
                    >
                      "How do mirrors work?"
                    </button>
                    <button
                      onClick={() => setInput('What are the life processes?')}
                      className="p-3 bg-white/5 text-purple-200 text-sm rounded-xl hover:bg-white/10 transition-all text-left"
                    >
                      "What are life processes?"
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-3xl ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`p-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>

                {message.prunedContext && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 bg-white/5 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setShowContext(!showContext)}
                      className="w-full px-4 py-2 flex items-center justify-between text-purple-200 hover:bg-white/5 transition-all"
                    >
                      <span className="text-sm flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Context Pruning Details
                      </span>
                      {showContext ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    
                    {showContext && (
                      <div className="px-4 pb-4 space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center p-3 bg-white/5 rounded-xl">
                            <p className="text-xs text-purple-300">Original</p>
                            <p className="text-lg font-bold text-white">{message.prunedContext.originalSize}</p>
                            <p className="text-xs text-purple-300">chars</p>
                          </div>
                          <div className="text-center p-3 bg-white/5 rounded-xl">
                            <p className="text-xs text-purple-300">Pruned</p>
                            <p className="text-lg font-bold text-white">{message.prunedContext.prunedSize}</p>
                            <p className="text-xs text-purple-300">chars</p>
                          </div>
                          <div className="text-center p-3 bg-green-500/20 rounded-xl border border-green-500/30">
                            <p className="text-xs text-green-300">Saved</p>
                            <p className="text-lg font-bold text-green-400">{message.prunedContext.savings}%</p>
                            <p className="text-xs text-green-300">reduction</p>
                          </div>
                        </div>

                        {message.cost && (
                          <div className="p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-green-300">Cost Analysis</span>
                              <Zap className="w-4 h-4 text-green-400" />
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-center">
                              <div>
                                <p className="text-xs text-purple-300">Original</p>
                                <p className="text-sm font-semibold text-white">{formatCurrency(message.cost.original)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-purple-300">Pruned</p>
                                <p className="text-sm font-semibold text-white">{formatCurrency(message.cost.pruned)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-green-300">Saved</p>
                                <p className="text-sm font-semibold text-green-400">{formatCurrency(message.cost.saved)}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="p-3 bg-white/5 rounded-xl">
                          <p className="text-xs text-purple-300 mb-2">Selected Context:</p>
                          <p className="text-sm text-purple-200">
                            {message.prunedContext.selectedSentences.join(' ')}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button className="flex-1 py-2 bg-white/5 text-purple-200 text-sm rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                            <Copy className="w-4 h-4" />
                            Copy
                          </button>
                          <button className="flex-1 py-2 bg-white/5 text-purple-200 text-sm rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                            <ThumbsUp className="w-4 h-4" />
                            Helpful
                          </button>
                          <button className="flex-1 py-2 bg-white/5 text-purple-200 text-sm rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                            <ThumbsDown className="w-4 h-4" />
                            Not Helpful
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                <div className={`mt-2 text-xs text-purple-300 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 bg-white/5 backdrop-blur-xl border-t border-white/10">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="flex items-end gap-4">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder="Ask your question about the chapter..."
                  rows={1}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent resize-none transition-all"
                  style={{ minHeight: '50px', maxHeight: '150px' }}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
            <p className="text-xs text-purple-300 mt-3 text-center">
              Context pruning reduces API costs by up to 70% • Optimized for low bandwidth
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
