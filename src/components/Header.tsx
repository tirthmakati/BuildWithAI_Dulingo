import React, { useState } from 'react';
import { AVAILABLE_LANGUAGES } from '../data/initialData';
import { LanguageOption } from '../types';

interface HeaderProps {
  currentLanguage: string;
  onChangeLanguage: (lang: string) => void;
  streakDays: number;
  userRank: number;
  userXp: number;
  onQuickPractice: () => void;
  onOpenMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  onChangeLanguage,
  streakDays,
  userRank,
  userXp,
  onQuickPractice,
  onOpenMobileNav
}) => {
  const [isLangOpen, setIsLangOpen] = useState(false);

  const currentLangObj: LanguageOption =
    AVAILABLE_LANGUAGES.find((l) => l.code === currentLanguage) || AVAILABLE_LANGUAGES[0];

  const categories = ['Indian Languages', 'English for Indian Speakers', 'European & Asian Languages'] as const;

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-[#faf9f6]/95 backdrop-blur-xl border-b border-[#e3e2e0] z-40 flex items-center justify-between px-4 sm:px-8">
      {/* Left: Mobile Nav toggle + Language & Streak */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 rounded-lg text-[#1f332d] hover:bg-[#efeeeb]"
          title="Open menu"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>

        {/* Enhanced Language Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f4f3f0] hover:bg-[#efeeeb] transition-all text-[#1a1c1a] border border-[#e3e2e0] shadow-xs active:scale-98"
            type="button"
          >
            <span className="material-symbols-outlined text-base text-[#4f6359]">translate</span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm">{currentLangObj.flag}</span>
              <span className="text-xs sm:text-sm font-bold tracking-tight">{currentLangObj.label}</span>
              <span className="hidden sm:inline text-xs text-[#727875] font-serif">
                ({currentLangObj.nativeName})
              </span>
            </div>
            <span className="text-[10px] uppercase px-1.5 py-0.5 rounded-full bg-[#cfe5d9] text-[#54675e] font-bold">
              {currentLangObj.level}
            </span>
            <span className="material-symbols-outlined text-sm text-[#727875]">expand_more</span>
          </button>

          {isLangOpen && (
            <div className="absolute left-0 mt-2 w-80 sm:w-96 max-h-[80vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-[#e3e2e0] p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-[#e3e2e0]/80">
                <span className="text-xs uppercase font-bold text-[#1f332d] tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#4f6359]">language</span>
                  Select Language Studio
                </span>
                <span className="text-[10px] text-[#727875] font-mono">
                  {AVAILABLE_LANGUAGES.length} Languages
                </span>
              </div>

              {categories.map((category) => {
                const categoryLangs = AVAILABLE_LANGUAGES.filter((l) => l.category === category);
                return (
                  <div key={category} className="mb-3 last:mb-0">
                    <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[#4f6359] bg-[#f4f3f0] rounded-md mb-1.5">
                      {category}
                    </div>
                    <div className="flex flex-col gap-1">
                      {categoryLangs.map((lang) => {
                        const isSelected = lang.code === currentLanguage;
                        return (
                          <button
                            key={lang.code}
                            onClick={() => {
                              onChangeLanguage(lang.code);
                              setIsLangOpen(false);
                            }}
                            className={`w-full p-2.5 rounded-xl text-left flex items-start justify-between gap-3 transition-all ${
                              isSelected
                                ? 'bg-[#cfe5d9]/60 font-bold text-[#1f332d] border border-[#b4ccc2]'
                                : 'hover:bg-[#f4f3f0] text-[#424845] border border-transparent'
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              <span className="text-lg mt-0.5">{lang.flag}</span>
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs sm:text-sm font-bold text-[#1a1c1a]">
                                    {lang.label}
                                  </span>
                                  <span className="text-xs text-[#4f6359] font-medium font-serif">
                                    {lang.nativeName}
                                  </span>
                                </div>
                                <span className="text-[11px] text-[#727875] line-clamp-1 mt-0.5">
                                  {lang.description}
                                </span>
                              </div>
                            </div>
                            <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-[#efeeeb] text-[#4f6359] font-mono font-bold shrink-0">
                              {lang.level}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Streak Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f4f3f0] text-[#1a1c1a] border border-[#e3e2e0]">
          <span className="material-symbols-outlined text-base text-[#613e19] fill-current">local_fire_department</span>
          <span className="text-xs sm:text-sm font-semibold">{streakDays} Day Streak</span>
          <span className="hidden md:inline-block w-1.5 h-1.5 rounded-full bg-emerald-600" title="Streak active today"></span>
        </div>
      </div>

      {/* Right: Quick Practice & User Avatar with League Rank */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* League status pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#efeeeb] text-[#354a43] border border-[#e3e2e0] text-xs font-semibold">
          <span className="material-symbols-outlined text-sm text-[#4f6359]">workspace_premium</span>
          <span>Obsidian League</span>
          <span className="bg-[#354a43] text-white text-[10px] px-1.5 rounded-full font-mono font-bold">#{userRank}</span>
        </div>

        {/* Quick Practice button */}
        <button
          onClick={onQuickPractice}
          className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 rounded-lg bg-[#354a43] hover:bg-[#1f332d] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs hover:shadow-sm active:scale-98"
          type="button"
        >
          <span className="material-symbols-outlined text-base">play_arrow</span>
          <span>Quick Practice</span>
        </button>

        {/* User profile avatar */}
        <div className="relative flex items-center cursor-pointer group" title={`You: ${userXp} XP (Rank #${userRank})`}>
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBitA0MI8G5DBRYOw4XQ5TVEYJ4StP_JJOzRVZvMbIdI_1eUe3SLgHDlMWk9_4hqcJeJkr7T3DvKW7uyNQ6BIQsmPqX9lM2Jeg0mGt67k7caQxCRz9vxPTzUC_AFQKNRK7kGmh7QH61R9yhMpja7JYrQH2K5rPb6EsXnzE4oSfF0GAJk5ksCRGiuTeMoajR04nts_bO2AjiYpArOxMuUXM55jKnKqMNjmaRdCtC-7R5Qt5RBzjmwJXm"
            alt="User Profile"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-[#e3e2e0] group-hover:ring-[#354a43] transition-all"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#4f6359] ring-2 ring-white"></span>
        </div>
      </div>
    </header>
  );
};
