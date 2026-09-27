import React from 'react';

interface NavigationProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  dailyMinutes: number;
  dailyTargetMinutes: number;
  onOpenDrill: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  dailyMinutes,
  dailyTargetMinutes,
  onOpenDrill,
  isMobileOpen,
  onCloseMobile
}) => {
  const percentDaily = Math.min(100, Math.round((dailyMinutes / dailyTargetMinutes) * 100));

  const navItems = [
    { id: 'live-practice', label: 'Live Practice', icon: 'mic' },
    { id: 'scenarios', label: 'Scenarios & Topics', icon: 'forum' },
    { id: 'analytics', label: 'Fluency Analytics', icon: 'monitoring' },
    { id: 'vocabulary-vault', label: 'Vocabulary Vault', icon: 'auto_stories' },
    { id: 'leaderboard', label: 'Social Leaderboard', icon: 'leaderboard', badge: 'Daily Rank' },
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-[#f4f3f0] z-50 flex flex-col justify-between py-6 px-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-[#e3e2e0] transition-transform duration-300 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-6">
          {/* Logo & Subtitle */}
          <div className="flex items-center justify-between px-3">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => handleNavClick('scenarios')}
            >
              <img
                src="https://lh3.googleusercontent.com/aida/AEtjO1W-NI9MBTZMcBPmchmYmtcNbLBl8ah7kqjIA-FBEHcG4fPJ6UYbo0Y_o6GhBcA-99W7xTTwz8-vbRrQWjCDIr0OtycvbYKJbswi4Shz-OJr_gEUgOVjigwNBWEIfqKo3DzcN34EJ_gCn8fYj62CGg7ph5tr4PFnYmvKF24dXER73MTy9jzh2PJ6HoZTH2uz_Ub83S2A_LCQqGVYgGmxnXj8z51Lgg5GSY0klVjPH_Szvm8uh6dW3OU3mg"
                alt="LinguaFlow AI Logo"
                className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="font-serif text-xl font-medium text-[#1f332d] tracking-tight">LinguaFlow</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#4f6359]">Acoustic AI Studio</span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-[#727875] hover:bg-[#efeeeb]"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Acoustic Latency Badge */}
          <div className="px-3">
            <div className="bg-[#efeeeb] rounded-lg p-3 flex items-center justify-between border border-[#e3e2e0]/60">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4f6359] text-lg">graphic_eq</span>
                <span className="text-xs font-semibold text-[#424845]">Acoustic Latency</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4f6359] animate-pulse"></span>
                <span className="text-xs text-[#354a43] font-bold font-mono">140ms</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5 px-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#354a43] text-white shadow-sm'
                      : 'text-[#424845] hover:bg-[#efeeeb] hover:text-[#1a1c1a]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="material-symbols-outlined text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase font-bold ${
                        isActive ? 'bg-[#d0e8de] text-[#0a1f19]' : 'bg-[#cfe5d9] text-[#54675e]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Micro-Drill Quick Launch Card */}
          <div className="mx-2 p-3 rounded-xl bg-gradient-to-br from-[#cfe5d9]/60 to-[#efeeeb] border border-[#b4ccc2]/50 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#354a43] flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-[#4f6359]">bolt</span>
                Acoustic Drill
              </span>
              <span className="text-[10px] bg-[#354a43] text-white px-1.5 py-0.2 rounded font-mono font-bold">+50 XP</span>
            </div>
            <p className="text-xs text-[#424845]">
              Master French <strong className="text-[#1f332d]">/y/ vs /u/</strong> front vowel formants in 60s.
            </p>
            <button
              onClick={onOpenDrill}
              className="mt-1 w-full py-1.5 px-3 rounded-lg bg-[#354a43] hover:bg-[#1f332d] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-sm">record_voice_over</span>
              <span>Launch 60s Drill</span>
            </button>
          </div>
        </div>

        {/* Daily Target & Utility Footer */}
        <div className="flex flex-col gap-4 px-3">
          <div className="p-3.5 rounded-lg bg-[#efeeeb] border border-[#e3e2e0]/60 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#424845]">Daily Target</span>
              <span className="text-xs text-[#4f6359] font-bold">
                {dailyMinutes} / {dailyTargetMinutes} min
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#e3e2e0] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#354a43] rounded-full transition-all duration-500"
                style={{ width: `${percentDaily}%` }}
              ></div>
            </div>
            <span className="text-[10px] text-[#727875] text-right font-medium">
              {percentDaily >= 100 ? '🎉 Daily goal achieved!' : `${dailyTargetMinutes - dailyMinutes} min to complete goal`}
            </span>
          </div>

          <div className="pt-2 flex items-center justify-between text-[#727875] text-xs">
            <button
              className="hover:text-[#1a1c1a] transition-colors p-1"
              title="Acoustic tuning"
              onClick={() => alert('Acoustic Tuning: Calibrated for low-latency native speech & liaison analysis.')}
            >
              <span className="material-symbols-outlined text-lg">tune</span>
            </button>
            <button
              className="hover:text-[#1a1c1a] transition-colors p-1"
              title="Practice tips & guidelines"
              onClick={() => alert('LinguaFlow Guide:\n• Press spacebar or tap the microphone to speak.\n• Target CEFR levels from A1 up to C1.\n• Climb the daily Obsidian League by practicing speech regularly!')}
            >
              <span className="material-symbols-outlined text-lg">help_outline</span>
            </button>
            <span className="text-[11px] font-mono text-[#727875]">⌘K Search</span>
          </div>
        </div>
      </aside>
    </>
  );
};
