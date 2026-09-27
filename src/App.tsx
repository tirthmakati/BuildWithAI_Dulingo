import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Header } from './components/Header';
import { ScenariosView } from './views/ScenariosView';
import { LivePracticeView } from './views/LivePracticeView';
import { AnalyticsView } from './views/AnalyticsView';
import { VocabularyVaultView } from './views/VocabularyVaultView';
import { LeaderboardView } from './views/LeaderboardView';
import { PronunciationModal } from './components/PronunciationModal';
import { INITIAL_SCENARIOS, INITIAL_VOCABULARY, INITIAL_LEADERBOARD } from './data/initialData';
import { Scenario, VocabularyItem, LeaderboardUser } from './types';
import { aiTutorService } from './services/aiTutorService';
import confetti from 'canvas-confetti';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('scenarios');
  const [currentLanguage, setCurrentLanguage] = useState<string>('French');
  const [scenarios, setScenarios] = useState<Scenario[]>(INITIAL_SCENARIOS);
  const [activeScenario, setActiveScenario] = useState<Scenario>(INITIAL_SCENARIOS[1]); // Parisian cafe by default for instant speech practice
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>(INITIAL_VOCABULARY);
  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>(INITIAL_LEADERBOARD);

  // User Stats & Gamification state
  const [userXp, setUserXp] = useState<number>(2480);
  const [streakDays, setStreakDays] = useState<number>(18);
  const [dailyMinutes, setDailyMinutes] = useState<number>(18);
  const [dailyTargetMinutes] = useState<number>(20);

  // Modals & Navigation
  const [isDrillModalOpen, setIsDrillModalOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Keyboard shortcut listener for Command+K (search)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCurrentTab('scenarios');
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleChangeLanguage = (newLang: string) => {
    setCurrentLanguage(newLang);
    const matching = scenarios.find((s) => s.language === newLang);
    if (matching) {
      setActiveScenario(matching);
    }
  };

  const handleSelectScenario = (scenario: Scenario) => {
    setActiveScenario(scenario);
    setCurrentTab('live-practice');
  };

  const handleSynthesizeScenario = (topic: string) => {
    const newScenario = aiTutorService.synthesizeBespokeScenario(topic, currentLanguage);
    setScenarios((prev) => [newScenario, ...prev]);
    setActiveScenario(newScenario);
    setCurrentTab('live-practice');
    setUserXp((prev) => prev + 25);
    try {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.5 } });
    } catch (e) {
      // ignore
    }
  };

  const handleSaveToVault = (wordItem: VocabularyItem) => {
    setVocabulary((prev) => {
      if (prev.some((v) => v.word.toLowerCase() === wordItem.word.toLowerCase())) {
        return prev;
      }
      return [wordItem, ...prev];
    });
    setUserXp((prev) => prev + 15);
  };

  const handleEndSession = (minutesPracticed: number, xpEarned: number) => {
    const totalMins = Math.max(1, minutesPracticed);
    setDailyMinutes((prev) => Math.min(60, prev + totalMins));
    setUserXp((prev) => prev + xpEarned);
    if (dailyMinutes + totalMins >= dailyTargetMinutes) {
      try {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.4 } });
      } catch (e) {
        // ignore
      }
    }
    setCurrentTab('analytics');
  };

  const handleDrillCompleted = (xpEarned: number) => {
    setUserXp((prev) => prev + xpEarned);
    setDailyMinutes((prev) => prev + 2);
  };

  const handleChallengeFriend = (friendName: string) => {
    alert(`Oral Duel initiated with ${friendName}! Launching live 3-minute scenario.`);
    setActiveScenario(INITIAL_SCENARIOS[0]);
    setCurrentTab('live-practice');
  };

  const handleAddFriend = (username: string) => {
    const newFriend: LeaderboardUser = {
      id: `friend-${Date.now()}`,
      name: username.replace('@', ''),
      username: username.startsWith('@') ? username : `@${username}`,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      xp: 2100,
      streakDays: 7,
      rank: leaderboardUsers.length + 1,
      isCurrentUser: false,
      division: 'Obsidian',
      dailyMinutes: 15,
      pronunciationAvg: 90,
      wordsLearned: 320,
      recentActivity: 'Joined your daily friendship league',
      statusText: 'New speaking rival',
      isFriend: true
    };
    setLeaderboardUsers((prev) => [...prev, newFriend]);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1a1c1a] font-sans">
      {/* Sidebar Navigation */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        dailyMinutes={dailyMinutes}
        dailyTargetMinutes={dailyTargetMinutes}
        onOpenDrill={() => setIsDrillModalOpen(true)}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Top App Bar Header */}
        <Header
          currentLanguage={currentLanguage}
          onChangeLanguage={handleChangeLanguage}
          streakDays={streakDays}
          userRank={3}
          userXp={userXp}
          onQuickPractice={() => {
            const preferred = scenarios.find((s) => s.language === currentLanguage) || INITIAL_SCENARIOS[0];
            setActiveScenario(preferred);
            setCurrentTab('live-practice');
          }}
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
        />

        {/* View Routing */}
        <main className="relative pt-16 min-h-screen bg-[#faf9f6] w-full px-4 sm:px-8">
          {currentTab === 'scenarios' && (
            <ScenariosView
              scenarios={scenarios}
              onSelectScenario={handleSelectScenario}
              onSynthesizeScenario={handleSynthesizeScenario}
              currentLanguage={currentLanguage}
              onSelectLanguage={handleChangeLanguage}
            />
          )}

          {currentTab === 'live-practice' && (
            <LivePracticeView
              scenario={activeScenario}
              onEndSession={handleEndSession}
              onSaveToVault={handleSaveToVault}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsView
              onOpenDrill={() => setIsDrillModalOpen(true)}
              onLaunchRecommendedScenario={() => {
                const preferred = scenarios.find((s) => s.language === currentLanguage) || INITIAL_SCENARIOS[0];
                setActiveScenario(preferred);
                setCurrentTab('live-practice');
              }}
            />
          )}

          {currentTab === 'vocabulary-vault' && (
            <VocabularyVaultView
              vocabulary={vocabulary}
              onOpenQuickDrill={() => setIsDrillModalOpen(true)}
            />
          )}

          {currentTab === 'leaderboard' && (
            <LeaderboardView
              users={leaderboardUsers}
              currentUserXp={userXp}
              onChallengeFriend={handleChallengeFriend}
              onAddFriend={handleAddFriend}
            />
          )}
        </main>
      </div>

      {/* Pronunciation Masterclass Micro-Drill Modal */}
      <PronunciationModal
        isOpen={isDrillModalOpen}
        onClose={() => setIsDrillModalOpen(false)}
        onDrillCompleted={handleDrillCompleted}
        currentLanguage={currentLanguage}
      />
    </div>
  );
}
