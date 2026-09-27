import React, { useState, useMemo } from 'react';
import { VocabularyItem, Milestone } from '../types';
import { MILESTONES_DATA } from '../data/initialData';
import { speechService } from '../services/speechService';
import confetti from 'canvas-confetti';

interface VocabularyVaultViewProps {
  vocabulary: VocabularyItem[];
  onOpenQuickDrill: () => void;
}

export const VocabularyVaultView: React.FC<VocabularyVaultViewProps> = ({
  vocabulary,
  onOpenQuickDrill
}) => {
  const [activeTab, setActiveTab] = useState<'bank' | 'milestones'>('bank');
  const [filterStatus, setFilterStatus] = useState<'all' | 'review' | 'learning' | 'mastered'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingWordId, setPlayingWordId] = useState<string | null>(null);

  const reviewCount = vocabulary.filter((v) => v.status === 'review').length;
  const learningCount = vocabulary.filter((v) => v.status === 'learning').length;
  const masteredCount = vocabulary.filter((v) => v.status === 'mastered').length;

  const filteredWords = useMemo(() => {
    return vocabulary.filter((item) => {
      if (filterStatus !== 'all' && item.status !== filterStatus) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.word.toLowerCase().includes(q) ||
          item.meaning.toLowerCase().includes(q) ||
          item.scenarioOrigin.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [vocabulary, filterStatus, searchQuery]);

  const detectWordLang = (word: string, origin: string): string => {
    if (/[\u0A80-\u0AFF]/.test(word)) return 'gu-IN';
    if (/[\u0900-\u097F]/.test(word)) return 'hi-IN';
    if (origin.toLowerCase().includes('standup') || origin.toLowerCase().includes('english') || origin.toLowerCase().includes('london')) {
      return 'en-US';
    }
    return 'fr-FR';
  };

  const handlePlayWord = (item: VocabularyItem) => {
    setPlayingWordId(item.id);
    const lang = detectWordLang(item.word, item.scenarioOrigin);
    speechService.speak(item.word, 0.9, lang).finally(() => {
      setPlayingWordId(null);
    });
  };

  const handleStartDrill = () => {
    try {
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.5 } });
    } catch (e) {
      // ignore
    }
    onOpenQuickDrill();
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Header Info */}
      <div className="flex flex-col gap-6 pt-2 mb-8">
        <div className="flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-widest text-[#4f6359] font-bold">
            Lexical Repository &amp; Cadence
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#4f6359]"></span>
          <span className="text-xs text-[#727875]">Acoustic Harvest Engine v2.4</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1f332d] tracking-tight">
              Curriculum &amp; Vocabulary Vault
            </h1>
            <p className="font-serif italic text-base sm:text-lg text-[#424845] mt-1">
              A bespoke repertoire gathered from organic pauses, subtle hesitations, and conversational victories.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#f4f3f0] p-2 rounded-xl border border-[#e3e2e0] self-start lg:self-auto">
            <div className="px-3 sm:px-4 py-2 flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-[#727875] font-bold">Saved Words</span>
              <span className="font-serif text-xl sm:text-2xl text-[#1f332d] font-semibold">{vocabulary.length + 475}</span>
            </div>
            <div className="w-px h-8 bg-[#e3e2e0]"></div>
            <div className="px-3 sm:px-4 py-2 flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-[#727875] font-bold">Scenarios Mastered</span>
              <span className="font-serif text-xl sm:text-2xl text-[#1f332d] font-semibold">34</span>
            </div>
            <div className="w-px h-8 bg-[#e3e2e0]"></div>
            <div className="px-3 sm:px-4 py-2 flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-[#4f6359] font-bold">Target Benchmark</span>
              <span className="text-xs sm:text-sm font-semibold text-[#1a1c1a] flex items-center gap-1">
                C1 Fluency Eval
                <span className="material-symbols-outlined text-sm text-[#4f6359]">verified</span>
              </span>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center justify-between pt-2 border-b border-[#e3e2e0] pb-3 flex-wrap gap-3">
          <div className="flex p-1 bg-[#f4f3f0] rounded-xl gap-1 border border-[#e3e2e0]">
            <button
              onClick={() => setActiveTab('bank')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'bank'
                  ? 'bg-white text-[#1f332d] shadow-xs'
                  : 'text-[#424845] hover:text-[#1a1c1a]'
              }`}
            >
              <span className="material-symbols-outlined text-base text-[#4f6359]">auto_stories</span>
              <span>Vocabulary Bank &amp; Recall</span>
              <span className="px-2 py-0.2 rounded-full bg-[#cfe5d9] text-[#54675e] text-[10px] font-bold">
                {vocabulary.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('milestones')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'milestones'
                  ? 'bg-white text-[#1f332d] shadow-xs'
                  : 'text-[#424845] hover:text-[#1a1c1a]'
              }`}
            >
              <span className="material-symbols-outlined text-base">flag_circle</span>
              <span>Learning Journey &amp; Milestones</span>
              <span className="w-2 h-2 rounded-full bg-[#613e19]"></span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#727875]">
            <span className="material-symbols-outlined text-sm">schedule</span>
            <span>Spaced algorithm tuned to Ebbinghaus natural decay model</span>
          </div>
        </div>
      </div>

      {activeTab === 'bank' ? (
        <div className="flex flex-col gap-8">
          {/* Spaced Recall Deck Prompt Banner */}
          <div className="relative w-full rounded-2xl bg-white shadow-xs border border-[#e3e2e0] p-6 overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#cfe5d9]/30 to-transparent pointer-events-none"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#cfe5d9] flex items-center justify-center text-[#54675e] shrink-0 mt-0.5 shadow-xs">
                  <span className="material-symbols-outlined text-2xl">record_voice_over</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-serif text-lg sm:text-xl text-[#1f332d]">
                      Interactive Audio Recall Deck
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#613e19] text-[#dcaa7c] text-[11px] font-bold tracking-wide">
                      {reviewCount || 18} Due Today
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#424845] max-w-2xl leading-relaxed">
                    Captured phrases are entering their vulnerable retention window today. Run a brief oral exercise to lock in cadence, tone, and inflection.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                <div className="hidden xl:flex flex-col text-right mr-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#727875] font-bold">
                    Estimated Drill Time
                  </span>
                  <span className="text-xs sm:text-sm text-[#1a1c1a] font-semibold">4 min 30 sec</span>
                </div>
                <button
                  onClick={handleStartDrill}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#354a43] hover:bg-[#1f332d] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-98"
                  type="button"
                >
                  <span className="material-symbols-outlined text-lg">mic</span>
                  <span>Start 5-min Spaced Audio Drill</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filtering Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-[#1f332d] text-white shadow-xs'
                    : 'bg-[#f4f3f0] hover:bg-[#efeeeb] text-[#424845]'
                }`}
              >
                All ({vocabulary.length})
              </button>
              <button
                onClick={() => setFilterStatus('review')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  filterStatus === 'review'
                    ? 'bg-[#ba1a1a] text-white shadow-xs'
                    : 'bg-[#f4f3f0] hover:bg-[#efeeeb] text-[#ba1a1a]'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
                Needs Review ({reviewCount})
              </button>
              <button
                onClick={() => setFilterStatus('learning')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap ${
                  filterStatus === 'learning'
                    ? 'bg-[#4f6359] text-white shadow-xs'
                    : 'bg-[#f4f3f0] hover:bg-[#efeeeb] text-[#424845]'
                }`}
              >
                Learning ({learningCount})
              </button>
              <button
                onClick={() => setFilterStatus('mastered')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap ${
                  filterStatus === 'mastered'
                    ? 'bg-[#354a43] text-white shadow-xs'
                    : 'bg-[#f4f3f0] hover:bg-[#efeeeb] text-[#4f6359]'
                }`}
              >
                Mastered ({masteredCount})
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#727875] text-lg pointer-events-none">
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter harvested words..."
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#f4f3f0] text-[#1a1c1a] placeholder:text-[#727875] text-xs sm:text-sm focus:outline-none focus:bg-white border border-[#e3e2e0] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredWords.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 shadow-xs border border-[#e3e2e0] flex flex-col justify-between gap-5 transition-all hover:shadow-md"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-3">
                        <h3 className="font-serif text-xl sm:text-2xl text-[#1f332d]">{item.word}</h3>
                        <button
                          type="button"
                          onClick={() => handlePlayWord(item)}
                          className="w-7 h-7 rounded-full bg-[#efeeeb] flex items-center justify-center text-[#4f6359] hover:bg-[#cfe5d9] transition-colors"
                          title="Listen to pronunciation"
                        >
                          <span className="material-symbols-outlined text-base">
                            {playingWordId === item.id ? 'graphic_eq' : 'volume_up'}
                          </span>
                        </button>
                      </div>
                      <span className="text-xs text-[#727875] font-mono mt-0.5">
                        {item.ipa} • {item.pos}
                      </span>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide ${
                        item.status === 'review'
                          ? 'bg-[#ffdad6] text-[#93000a]'
                          : item.status === 'mastered'
                          ? 'bg-[#cfe5d9] text-[#0d1f18]'
                          : 'bg-[#efeeeb] text-[#424845]'
                      }`}
                    >
                      {item.status === 'review'
                        ? 'Review Imminent'
                        : item.status === 'mastered'
                        ? 'Optimal'
                        : 'Consolidating'}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-wider text-[#727875] font-bold">
                      Nuanced Meaning
                    </span>
                    <p className="text-xs sm:text-sm text-[#1a1c1a] leading-relaxed">{item.meaning}</p>
                  </div>

                  <div className="bg-[#f4f3f0] p-4 rounded-xl flex flex-col gap-2 border border-[#e3e2e0]/60">
                    <span className="text-[10px] uppercase tracking-wider text-[#4f6359] flex items-center gap-1.5 font-bold">
                      <span className="material-symbols-outlined text-sm">chat_bubble</span>
                      Your Live Context Quote
                    </span>
                    <p className="font-serif italic text-xs sm:text-sm text-[#1a1c1a] leading-relaxed">
                      {item.contextQuote}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 pt-2 border-t border-[#efeeeb]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#efeeeb] text-[#4f6359] font-medium">
                      <span className="material-symbols-outlined text-xs">{item.scenarioIcon}</span>
                      <span>{item.scenarioOrigin}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#727875]">Retention</span>
                      <span className="font-bold text-[#1f332d] font-mono">{item.retentionPercent}%</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-[#e3e2e0] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.retentionPercent < 50
                          ? 'bg-[#ba1a1a]'
                          : item.retentionPercent < 75
                          ? 'bg-[#4f6359]'
                          : 'bg-[#354a43]'
                      }`}
                      style={{ width: `${item.retentionPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Learning Journey & Milestones Roadmap View */
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#f4f3f0] p-6 rounded-2xl border border-[#e3e2e0]">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-[#354a43] text-white text-xs font-bold">
                  Current Level: B2 Advanced
                </span>
                <span className="material-symbols-outlined text-[#4f6359] text-base">arrow_forward</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#613e19] text-[#dcaa7c] text-xs font-bold">
                  Target: C1 Operational Mastery
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#424845] mt-1">
                Track your progression across nuances, pragmatic competence, and syntactic autonomy.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-xl shadow-xs border border-[#e3e2e0]">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-[#727875] font-bold">Roadmap Velocity</span>
                <span className="font-serif text-lg text-[#1f332d] font-bold">78% Complete</span>
              </div>
              <div className="w-12 h-12 relative flex items-center justify-center">
                <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#efeeeb]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    className="text-[#354a43]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="78, 100"
                    strokeLinecap="round"
                    strokeWidth="3"
                  />
                </svg>
                <span className="material-symbols-outlined absolute text-sm text-[#354a43]">trending_up</span>
              </div>
            </div>
          </div>

          {/* Timeline Milestones */}
          <div className="relative flex flex-col gap-6 pl-4 md:pl-8 before:absolute before:left-8 md:before:left-12 before:top-6 before:bottom-6 before:w-0.5 before:bg-[#e3e2e0]">
            {MILESTONES_DATA.map((milestone) => (
              <div key={milestone.id} className="relative flex items-start gap-6 group">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ring-4 ring-[#faf9f6] shadow-xs z-10 ${
                    milestone.status === 'achieved'
                      ? 'bg-[#1f332d] text-white'
                      : milestone.status === 'in-progress'
                      ? 'bg-[#354a43] text-white animate-pulse'
                      : milestone.status === 'capstone'
                      ? 'bg-[#613e19] text-[#dcaa7c]'
                      : 'bg-[#e3e2e0] text-[#727875]'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    {milestone.status === 'achieved'
                      ? 'check'
                      : milestone.status === 'in-progress'
                      ? 'timelapse'
                      : milestone.status === 'capstone'
                      ? 'school'
                      : 'lock'}
                  </span>
                </div>

                <div
                  className={`flex-1 rounded-2xl p-6 shadow-xs border flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                    milestone.status === 'in-progress'
                      ? 'bg-white border-l-4 border-l-[#354a43] border-[#e3e2e0]'
                      : milestone.status === 'capstone'
                      ? 'bg-gradient-to-r from-white to-[#f4f3f0] border-[#e3e2e0]'
                      : 'bg-white border-[#e3e2e0]'
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] uppercase tracking-wider text-[#4f6359] font-bold">
                        Milestone {milestone.number} • {milestone.status === 'achieved' ? 'Achieved' : milestone.status === 'in-progress' ? 'In Progress' : 'Pending'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#cfe5d9] text-[#54675e] text-[10px] font-bold">
                        {milestone.badge}
                      </span>
                    </div>

                    <h4 className="font-serif text-lg sm:text-xl text-[#1f332d]">{milestone.title}</h4>
                    <p className="text-xs sm:text-sm text-[#424845] max-w-2xl leading-relaxed">
                      {milestone.description}
                    </p>

                    <div className="flex items-center gap-3 text-[#727875] text-xs pt-1">
                      <span>{milestone.scenariosTested}</span>
                      <span>•</span>
                      <span>{milestone.expressionsAcquired}</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    {milestone.score && (
                      <span className="px-3.5 py-1.5 rounded-lg bg-[#f4f3f0] text-[#4f6359] text-xs font-bold">
                        Score: {milestone.score}/100
                      </span>
                    )}
                    {milestone.progressPercent && (
                      <span className="px-3.5 py-1.5 rounded-lg bg-[#354a43] text-white text-xs font-bold">
                        {milestone.progressPercent}% Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
