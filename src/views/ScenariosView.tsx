import React, { useState, useMemo } from 'react';
import { Scenario, ScenarioCategory } from '../types';

interface ScenariosViewProps {
  scenarios: Scenario[];
  onSelectScenario: (scenario: Scenario) => void;
  onSynthesizeScenario: (topic: string) => void;
  onBookmarkScenario?: (scenarioId: string) => void;
  currentLanguage: string;
  onSelectLanguage: (lang: string) => void;
}

export const ScenariosView: React.FC<ScenariosViewProps> = ({
  scenarios,
  onSelectScenario,
  onSynthesizeScenario,
  currentLanguage,
  onSelectLanguage
}) => {
  const [activeCategory, setActiveCategory] = useState<ScenarioCategory>('all');
  const [selectedCefr, setSelectedCefr] = useState<string | null>(null);
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState<string>(currentLanguage || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('progression');
  const [customTopic, setCustomTopic] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // Sync with currentLanguage prop
  React.useEffect(() => {
    if (currentLanguage) {
      setSelectedLanguageFilter(currentLanguage);
    }
  }, [currentLanguage]);

  const categories: { id: ScenarioCategory; label: string; icon?: string }[] = [
    { id: 'all', label: 'All Scenarios' },
    { id: 'travel', label: 'Travel & Dining', icon: 'restaurant' },
    { id: 'professional', label: 'Professional & Business', icon: 'work_outline' },
    { id: 'social', label: 'Social & Casual', icon: 'groups' },
    { id: 'culture', label: 'Debate & Culture', icon: 'theater_comedy' },
    { id: 'emergency', label: 'Urgent & Everyday Problem-Solving', icon: 'emergency' }
  ];

  const cefrLevels = [
    { code: 'A1', label: 'Beginner', count: 4 },
    { code: 'A2', label: 'Elementary', count: 9 },
    { code: 'B1', label: 'Intermediate', count: 16 },
    { code: 'B2', label: 'Upper-Int', count: 22 },
    { code: 'C1', label: 'Advanced', count: 11 },
    { code: 'C2', label: 'Mastery', count: 5 }
  ];

  const languageOptions = [
    { code: 'all', label: 'All Languages', flag: '🌐' },
    { code: 'Gujarati', label: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
    { code: 'Hindi', label: 'हिन्दी (Hindi)', flag: '🇮🇳' },
    { code: 'Hindi to English', label: 'हिन्दी से अंग्रेज़ी (English)', flag: '🇮🇳➔🇬🇧' },
    { code: 'Gujarati to English', label: 'ગુજરાતીથી અંગ્રેજી (English)', flag: '🇮🇳➔🇺🇸' },
    { code: 'French', label: 'Français (French)', flag: '🇫🇷' },
    { code: 'Japanese', label: '日本語 (Japanese)', flag: '🇯🇵' }
  ];

  const filteredScenarios = useMemo(() => {
    return scenarios.filter((sc) => {
      // Language check
      if (selectedLanguageFilter !== 'all') {
        const scLang = sc.language || 'French';
        if (scLang !== selectedLanguageFilter) {
          return false;
        }
      }
      // Category check
      if (activeCategory !== 'all' && sc.category !== activeCategory) {
        return false;
      }
      // CEFR check (if selected)
      if (selectedCefr && !sc.level.includes(selectedCefr)) {
        return false;
      }
      // Search check
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = sc.title.toLowerCase().includes(q);
        const matchesLoc = sc.location.toLowerCase().includes(q);
        const matchesPartner = sc.partnerName.toLowerCase().includes(q);
        const matchesDesc = sc.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesLoc && !matchesPartner && !matchesDesc) {
          return false;
        }
      }
      return true;
    });
  }, [scenarios, selectedLanguageFilter, activeCategory, selectedCefr, searchQuery]);

  // Featured scenario matches language selection
  const featuredScenario = useMemo(() => {
    if (selectedLanguageFilter === 'Gujarati') {
      return scenarios.find((s) => s.id === 'gujarat-manek-chowk') || filteredScenarios[0] || scenarios[0];
    }
    if (selectedLanguageFilter === 'Hindi') {
      return scenarios.find((s) => s.id === 'delhi-chandni-chowk') || filteredScenarios[0] || scenarios[0];
    }
    if (selectedLanguageFilter === 'Hindi to English') {
      return scenarios.find((s) => s.id === 'en-tech-standup') || filteredScenarios[0] || scenarios[0];
    }
    if (selectedLanguageFilter === 'Gujarati to English') {
      return scenarios.find((s) => s.id === 'gu-en-business-pitch') || filteredScenarios[0] || scenarios[0];
    }
    return scenarios.find((s) => s.id === 'lyon-lease') || filteredScenarios[0] || scenarios[0];
  }, [scenarios, selectedLanguageFilter, filteredScenarios]);

  const handleSynthesizeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopic.trim()) return;
    setIsSynthesizing(true);
    setTimeout(() => {
      onSynthesizeScenario(customTopic.trim());
      setIsSynthesizing(false);
      setCustomTopic('');
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Top Ambient Glow Decorator */}
      <div className="relative w-full overflow-hidden pointer-events-none -mt-4 mb-2 h-16">
        <div className="absolute -top-16 left-1/3 w-96 h-32 bg-[#cfe5d9]/40 rounded-full blur-3xl"></div>
        <div className="absolute -top-12 right-1/4 w-80 h-28 bg-[#ffdcbf]/30 rounded-full blur-3xl"></div>
      </div>

      {/* Page Header & Search Bar */}
      <section className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex items-center gap-2 text-[#4f6359]">
              <span className="material-symbols-outlined text-sm">record_voice_over</span>
              <span className="text-[11px] uppercase tracking-widest text-[#4f6359] font-bold">
                Acoustic Simulation Studio
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1f332d] tracking-tight">
              Immersive Real-World Scenarios
            </h1>
            <p className="font-serif italic text-base sm:text-lg text-[#424845]">
              Practice lifelike conversations with AI partners tailored to your exact fluency goals.
            </p>
          </div>

          {/* Search Input */}
          <div className="w-full md:w-96 flex items-center gap-3 bg-white shadow-xs rounded-xl px-4 py-3 border border-[#e3e2e0]">
            <span className="material-symbols-outlined text-[#4f6359] text-xl">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, cities, or speech acts..."
              className="bg-transparent border-0 outline-none w-full text-[#1a1c1a] placeholder:text-[#727875] text-sm"
            />
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#e9e8e5] text-[#424845] font-mono uppercase font-bold">
              ⌘K
            </span>
          </div>
        </div>

        {/* Language Studio Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#4f6359] shrink-0 mr-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">translate</span>
            Language:
          </span>
          {languageOptions.map((lang) => {
            const isSelected = selectedLanguageFilter === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  setSelectedLanguageFilter(lang.code);
                  if (lang.code !== 'all') {
                    onSelectLanguage(lang.code);
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#1f332d] text-white shadow-xs font-bold'
                    : 'bg-[#efeeeb] hover:bg-[#e3e2e0] text-[#424845]'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            );
          })}
        </div>

        {/* Category Pill Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#354a43] text-white shadow-xs'
                    : 'bg-[#f4f3f0] hover:bg-[#efeeeb] text-[#424845] hover:text-[#1a1c1a]'
                }`}
              >
                {cat.icon && <span className="material-symbols-outlined text-base">{cat.icon}</span>}
                <span>{cat.label}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#d0e8de]"></span>}
              </button>
            );
          })}
        </div>

        {/* CEFR Fluency Level Stepper Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#f4f3f0]/80 border border-[#e3e2e0]">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-[#4f6359] font-bold">Curated CEFR Band</span>
            <span className="material-symbols-outlined text-base text-[#727875]">tune</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {cefrLevels.map((lvl) => {
              const isActive = selectedCefr === lvl.code;
              return (
                <button
                  key={lvl.code}
                  onClick={() => setSelectedCefr(isActive ? null : lvl.code)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-colors ${
                    isActive
                      ? 'bg-[#354a43] text-white shadow-xs font-bold'
                      : 'bg-[#e3e2e0] text-[#1a1c1a] hover:bg-[#354a43] hover:text-white font-medium'
                  }`}
                >
                  <span className="font-bold">{lvl.code}</span>
                  <span className="text-[11px] opacity-80">{lvl.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-[#1f332d] text-white' : 'bg-white text-[#1a1c1a]'
                    }`}
                  >
                    {lvl.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-[#424845]">
            <span className="inline-block w-2 h-2 rounded-full bg-[#4f6359]"></span>
            <span>Recommended for current profile (B2 • 84% mastery)</span>
          </div>
        </div>
      </section>

      {/* Featured Spotlight Scenario Card (Bento Overlap) */}
      {featuredScenario && (
        <section className="max-w-7xl mx-auto w-full mt-8">
          <div className="relative bg-white rounded-2xl shadow-sm border border-[#e3e2e0] overflow-hidden grid grid-cols-1 lg:grid-cols-12 group transition-all hover:shadow-md">
            {/* Image Half */}
            <div className="relative lg:col-span-5 min-h-[300px] lg:min-h-[420px] overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ backgroundImage: `url('${featuredScenario.imageUrl}')` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#1f332d]/85 via-[#1f332d]/30 to-transparent"></div>

              {/* Badges on image */}
              <div className="absolute top-5 left-5 flex items-center gap-2">
                <span className="text-[11px] uppercase px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#1f332d] font-bold shadow-xs">
                  Featured Spotlight
                </span>
                <span className="text-[11px] uppercase px-3 py-1 rounded-full bg-[#613e19] text-[#dcaa7c] font-semibold">
                  High Diplomacy
                </span>
              </div>

              <div className="absolute bottom-5 left-5 right-5 text-white flex flex-col gap-1">
                <span className="text-[10px] tracking-wider uppercase text-[#b4ccc2]">Location Simulation</span>
                <p className="font-serif text-xl sm:text-2xl text-white font-medium">{featuredScenario.location}</p>
                <div className="flex items-center gap-4 pt-1 text-xs text-[#e9e8e5]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">schedule</span> {featuredScenario.durationMinutes} mins
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">record_voice_over</span> AI Partner: {featuredScenario.partnerName}
                  </span>
                </div>
              </div>
            </div>

            {/* Content Half */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6 bg-white">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-0.5 rounded-full text-xs uppercase tracking-wide bg-[#cfe5d9] text-[#54675e] font-bold">
                      {featuredScenario.level}
                    </span>
                    <span className="text-xs text-[#727875]">•</span>
                    <span className="text-xs text-[#424845] font-semibold">{featuredScenario.categoryLabel}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#4f6359]">
                    <span className="material-symbols-outlined text-base">star</span>
                    <span className="text-xs font-semibold">{featuredScenario.rating} ({featuredScenario.reviewsCount} reviews)</span>
                  </div>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl text-[#1f332d] tracking-tight">
                  {featuredScenario.title}
                </h2>

                <p className="text-sm text-[#424845] leading-relaxed">
                  {featuredScenario.description}
                </p>

                {/* Cultural Nuance Brief Bento */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                  <div className="p-3.5 rounded-xl bg-[#f4f3f0] flex flex-col gap-2 border border-[#e3e2e0]/60">
                    <div className="flex items-center gap-2 text-[#1f332d] text-xs font-bold">
                      <span className="material-symbols-outlined text-base text-[#4f6359]">psychology_alt</span>
                      <span>Cultural Nuance Brief</span>
                    </div>
                    <p className="text-xs text-[#424845] leading-relaxed">
                      {featuredScenario.culturalNuance}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#f4f3f0] flex flex-col gap-2 border border-[#e3e2e0]/60">
                    <div className="flex items-center gap-2 text-[#1f332d] text-xs font-bold">
                      <span className="material-symbols-outlined text-base text-[#4f6359]">dictionary</span>
                      <span>Target Lexicon ({featuredScenario.lexicalKeysCount} Terms)</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {featuredScenario.targetLexicon.slice(0, 4).map((lex) => (
                        <span key={lex} className="px-2 py-0.5 rounded bg-[#e3e2e0] text-[#424845] text-[11px] font-medium">
                          {lex}
                        </span>
                      ))}
                      <span className="px-2 py-0.5 rounded bg-[#e3e2e0] text-[#424845] text-[11px] font-medium font-mono">
                        +{featuredScenario.lexicalKeysCount - 4} more
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-3 border-t border-[#efeeeb]">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={featuredScenario.partnerAvatar}
                      alt={featuredScenario.partnerName}
                      className="w-12 h-12 rounded-full object-cover shadow-xs ring-2 ring-[#e3e2e0]"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#4f6359] ring-2 ring-white"></span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#1a1c1a]">{featuredScenario.partnerName}</span>
                    <span className="text-[11px] text-[#424845]">{featuredScenario.partnerRole}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    className="p-3 rounded-lg bg-[#f4f3f0] hover:bg-[#efeeeb] text-[#1a1c1a] transition-colors"
                    title="Bookmark for later"
                  >
                    <span className="material-symbols-outlined text-lg">bookmark_border</span>
                  </button>
                  <button
                    onClick={() => onSelectScenario(featuredScenario)}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#354a43] hover:bg-[#1f332d] text-white text-sm font-semibold transition-all shadow-xs hover:shadow-sm active:scale-98"
                  >
                    <span className="material-symbols-outlined text-lg">mic</span>
                    <span>Start Voice Practice</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section Divider with Metric Bar */}
      <section className="max-w-7xl mx-auto w-full my-10 flex flex-col md:flex-row items-center justify-between gap-4 py-3.5 px-6 rounded-2xl bg-[#f4f3f0]/60 border border-[#e3e2e0]">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#4f6359] text-2xl">graphic_eq</span>
          <div>
            <h3 className="font-serif text-lg text-[#1a1c1a] font-medium">Curated Scenario Library</h3>
            <p className="text-xs text-[#424845]">{scenarios.length} scenarios active across all registers</p>
          </div>
        </div>

        {/* Acoustic Waveform Decorator */}
        <div className="flex items-center gap-1.5 h-6 px-4 py-1 rounded-full bg-white shadow-xs border border-[#e3e2e0]">
          <span className="text-[11px] text-[#424845] mr-1">Voice Latency:</span>
          <div className="flex items-end gap-1 h-3.5">
            <span className="w-1 h-2 bg-[#4f6359] rounded-full animate-pulse"></span>
            <span className="w-1 h-3.5 bg-[#354a43] rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1 h-2.5 bg-[#4f6359] rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></span>
            <span className="w-1 h-3.5 bg-[#354a43] rounded-full animate-pulse" style={{ animationDelay: '75ms' }}></span>
            <span className="w-1 h-1.5 bg-[#c2c8c4] rounded-full"></span>
          </div>
          <span className="text-[11px] font-mono text-[#4f6359] ml-1 font-bold">140ms</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#424845]">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white text-[#1a1c1a] text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#e3e2e0] outline-none shadow-xs cursor-pointer"
          >
            <option value="progression">Curriculum Progression</option>
            <option value="difficulty">Difficulty (Low to High)</option>
            <option value="duration">Shortest Sessions (&lt; 10 min)</option>
            <option value="rating">Community Rating</option>
          </select>
        </div>
      </section>

      {/* 3-Column Scenario Card Grid */}
      <section className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScenarios.map((item) => (
          <article
            key={item.id}
            className="flex flex-col justify-between bg-white rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 group overflow-hidden border border-[#e3e2e0]"
          >
            <div className="flex flex-col">
              {/* Thumbnail */}
              <div className="relative h-44 w-full overflow-hidden bg-[#efeeeb]">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${item.imageUrl}')` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1f332d]/70 via-transparent to-transparent"></div>

                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] uppercase tracking-wide bg-white/95 backdrop-blur-md text-[#1a1c1a] font-bold shadow-xs">
                    {item.level}
                  </span>
                  {item.highStakes && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ffdad6] text-[#93000a]">
                      High Stakes
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                  <span className="flex items-center gap-1 drop-shadow-sm">
                    <span className="material-symbols-outlined text-sm">schedule</span> {item.durationMinutes} min
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#354a43]/90 backdrop-blur-xs font-semibold">
                    {item.badge || item.categoryLabel}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col gap-2.5">
                <div className="flex items-center gap-1.5 text-[#424845] text-xs">
                  <span className="material-symbols-outlined text-sm text-[#4f6359]">location_on</span>
                  <span className="truncate">{item.location}</span>
                </div>

                <h3 className="font-serif text-lg text-[#1f332d] tracking-tight group-hover:text-[#4f6359] transition-colors leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-[#424845] line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Partner snippet */}
                <div className="mt-1 pt-2.5 flex items-center justify-between bg-[#f4f3f0] p-2.5 rounded-xl border border-[#e3e2e0]/60">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#cfe5d9] flex items-center justify-center text-[#54675e] text-xs font-bold">
                      {item.partnerName.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#1a1c1a]">{item.partnerName}</span>
                      <span className="text-[10px] text-[#727875] truncate max-w-[120px]">{item.partnerRole}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#4f6359] font-bold">
                    <span className="material-symbols-outlined text-sm">auto_stories</span>
                    <span>{item.lexicalKeysCount} Keys</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <div className="p-5 pt-0">
              <button
                onClick={() => onSelectScenario(item)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#f4f3f0] group-hover:bg-[#354a43] group-hover:text-white text-[#1a1c1a] text-xs font-bold transition-all shadow-xs"
              >
                <span className="material-symbols-outlined text-base">play_arrow</span>
                <span>Launch Session</span>
              </button>
            </div>
          </article>
        ))}
      </section>

      {/* Bottom Topic Generator CTA */}
      <section className="max-w-7xl mx-auto w-full mt-16 p-8 lg:p-12 rounded-3xl bg-[#f4f3f0] border border-[#e3e2e0] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col gap-3 max-w-xl z-10">
          <div className="flex items-center gap-2 text-[#4f6359]">
            <span className="material-symbols-outlined text-lg">auto_awesome</span>
            <span className="text-xs uppercase tracking-widest font-bold">Tailored Synthesis</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#1f332d] tracking-tight">
            Need a bespoke conversational topic?
          </h3>
          <p className="text-sm text-[#424845] leading-relaxed">
            Input your real-life event (an upcoming embassy visa interview, architectural pitch, or wine cellar tour). LinguaFlow will build a dedicated CEFR-targeted acoustic persona in under 20 seconds.
          </p>
        </div>

        <form onSubmit={handleSynthesizeSubmit} className="flex items-center gap-4 z-10 w-full md:w-auto">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="e.g. Discussing wine pairings with a sommelier"
              className="px-4 py-3 rounded-xl bg-white text-[#1a1c1a] placeholder:text-[#727875] text-sm shadow-xs outline-none w-full sm:w-80 border border-[#e3e2e0]"
            />
            <button
              type="submit"
              disabled={isSynthesizing || !customTopic.trim()}
              className="px-6 py-3 rounded-xl bg-[#354a43] hover:bg-[#1f332d] disabled:opacity-50 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2 whitespace-nowrap active:scale-98"
            >
              <span className="material-symbols-outlined text-base">
                {isSynthesizing ? 'hourglass_top' : 'bolt'}
              </span>
              <span>{isSynthesizing ? 'Synthesizing...' : 'Generate Scenario'}</span>
            </button>
          </div>
        </form>

        {/* Soft background aura */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#cfe5d9]/50 rounded-full blur-3xl pointer-events-none"></div>
      </section>
    </div>
  );
};
