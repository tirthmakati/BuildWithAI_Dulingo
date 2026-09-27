import React, { useState } from 'react';
import { LeaderboardUser } from '../types';
import confetti from 'canvas-confetti';

interface LeaderboardViewProps {
  users: LeaderboardUser[];
  currentUserXp: number;
  onChallengeFriend: (friendName: string) => void;
  onAddFriend: (username: string) => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  users,
  currentUserXp,
  onChallengeFriend,
  onAddFriend
}) => {
  const [activeTab, setActiveTab] = useState<'league' | 'friends' | 'challenges'>('friends');
  const [nudgedFriends, setNudgedFriends] = useState<Record<string, boolean>>({});
  const [cheeredFriends, setCheeredFriends] = useState<Record<string, boolean>>({});
  const [friendModalOpen, setFriendModalOpen] = useState(false);
  const [newFriendHandle, setNewFriendHandle] = useState('');
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Sync current user's XP in the list
  const sortedUsers = [...users]
    .map((u) => (u.isCurrentUser ? { ...u, xp: currentUserXp } : u))
    .sort((a, b) => b.xp - a.xp)
    .map((u, idx) => ({ ...u, rank: idx + 1 }));

  const friendsOnly = sortedUsers.filter((u) => u.isFriend || u.isCurrentUser);

  const handleNudge = (user: LeaderboardUser) => {
    setNudgedFriends((prev) => ({ ...prev, [user.id]: true }));
    setNotificationMsg(`Nudged ${user.name}! An acoustic study invite was sent.`);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  const handleCheer = (user: LeaderboardUser) => {
    setCheeredFriends((prev) => ({ ...prev, [user.id]: true }));
    try {
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
    } catch (e) {
      // ignore
    }
    setNotificationMsg(`Sent streak flames to ${user.name}! 🔥`);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  const handleAddFriendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFriendHandle.trim()) return;
    onAddFriend(newFriendHandle.trim());
    setNewFriendHandle('');
    setFriendModalOpen(false);
    setNotificationMsg(`Friend request sent to ${newFriendHandle}!`);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  const dailyChallenges = [
    {
      id: 'c1',
      title: 'Acoustic Stamina',
      desc: 'Practice speaking for 15+ minutes in any real-world scenario',
      rewardXp: 75,
      progress: '14 / 15 min',
      completed: false,
      icon: 'timer'
    },
    {
      id: 'c2',
      title: 'Phonetic Precision',
      desc: 'Achieve >90% pronunciation score on French /y/ front vowel drill',
      rewardXp: 50,
      progress: '1 / 1 complete',
      completed: true,
      icon: 'record_voice_over'
    },
    {
      id: 'c3',
      title: 'Diplomatic Pacing',
      desc: 'Complete 4 consecutive conversational turns with native latency under 1.2s',
      rewardXp: 60,
      progress: '3 / 4 turns',
      completed: false,
      icon: 'speed'
    },
    {
      id: 'c4',
      title: 'Vocabulary Harvest',
      desc: 'Inspect and save 3 new expressions from the Parisian Specialty Café',
      rewardXp: 40,
      progress: '3 / 3 saved',
      completed: true,
      icon: 'auto_stories'
    }
  ];

  return (
    <div className="flex flex-col w-full pb-20">
      {/* Toast Notification Banner */}
      {notificationMsg && (
        <div className="fixed top-20 right-6 z-50 bg-[#1f332d] text-white px-4 py-2.5 rounded-xl shadow-lg border border-[#cfe5d9]/30 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <span className="material-symbols-outlined text-sm text-[#cfe5d9]">check_circle</span>
          <span className="text-xs font-semibold">{notificationMsg}</span>
        </div>
      )}

      {/* Header & Tournament Countdown */}
      <div className="flex flex-col gap-6 pt-2 mb-8">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] uppercase tracking-widest text-[#4f6359] font-bold">
            Daily Social Arena
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#4f6359]"></span>
          <span className="text-xs text-[#727875]">Obsidian League • Division 1</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1f332d] tracking-tight">
              Social Leaderboard &amp; Daily Rivalry
            </h1>
            <p className="font-serif italic text-base sm:text-lg text-[#424845] mt-1">
              Encourage daily speaking competition, challenge friends to oral duels, and defend your streak.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#f4f3f0] p-3 rounded-2xl border border-[#e3e2e0] self-start lg:self-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#354a43] flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-xl">workspace_premium</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-[#727875]">Tournament Ends In</span>
                <span className="font-mono text-xs sm:text-sm font-bold text-[#1f332d]">
                  1d 14h 28m
                </span>
              </div>
            </div>
            <button
              onClick={() => setFriendModalOpen(true)}
              className="ml-2 px-3 py-1.5 rounded-lg bg-white hover:bg-[#efeeeb] text-[#1f332d] border border-[#e3e2e0] text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">person_add</span>
              <span>Add Friend</span>
            </button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center justify-between border-b border-[#e3e2e0] pb-3 flex-wrap gap-3">
          <div className="flex p-1 bg-[#f4f3f0] rounded-xl gap-1 border border-[#e3e2e0]">
            <button
              onClick={() => setActiveTab('friends')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'friends'
                  ? 'bg-white text-[#1f332d] shadow-xs'
                  : 'text-[#424845] hover:text-[#1a1c1a]'
              }`}
            >
              <span className="material-symbols-outlined text-base text-[#4f6359]">groups</span>
              <span>Friends Showdown</span>
              <span className="px-2 py-0.2 rounded-full bg-[#cfe5d9] text-[#54675e] text-[10px] font-bold">
                {friendsOnly.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('league')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'league'
                  ? 'bg-white text-[#1f332d] shadow-xs'
                  : 'text-[#424845] hover:text-[#1a1c1a]'
              }`}
            >
              <span className="material-symbols-outlined text-base">emoji_events</span>
              <span>Obsidian Division</span>
              <span className="w-2 h-2 rounded-full bg-[#4f6359]"></span>
            </button>
            <button
              onClick={() => setActiveTab('challenges')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'challenges'
                  ? 'bg-white text-[#1f332d] shadow-xs'
                  : 'text-[#424845] hover:text-[#1a1c1a]'
              }`}
            >
              <span className="material-symbols-outlined text-base">bolt</span>
              <span>Daily Quests</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#4f6359] font-semibold bg-[#cfe5d9]/60 px-3 py-1.5 rounded-full border border-[#b4ccc2]">
            <span className="material-symbols-outlined text-sm">local_fire_department</span>
            <span>2x XP Oral Practice Multiplier Active</span>
          </div>
        </div>
      </div>

      {activeTab === 'friends' || activeTab === 'league' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Leaderboard List (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {/* Zone explanation strip */}
            <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#f4f3f0] border border-[#e3e2e0] text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <span className="font-semibold text-[#1a1c1a]">Ranks 1–3: Promotion to Diamond League</span>
              </div>
              <div className="flex items-center gap-2 text-[#727875]">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                <span>Ranks 7–8: Relegation Zone</span>
              </div>
            </div>

            {/* User Cards */}
            <div className="flex flex-col gap-3">
              {(activeTab === 'friends' ? friendsOnly : sortedUsers).map((user) => {
                const isPromoting = user.rank <= 3;
                const isRelegating = user.rank >= 7;

                return (
                  <div
                    key={user.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 ${
                      user.isCurrentUser
                        ? 'bg-gradient-to-r from-[#cfe5d9]/70 via-white to-white border-[#354a43] shadow-sm ring-2 ring-[#354a43]/20'
                        : 'bg-white hover:bg-[#faf9f6] border-[#e3e2e0] shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank number badge */}
                      <div className="flex flex-col items-center justify-center w-8 shrink-0">
                        <span
                          className={`font-serif text-lg font-bold ${
                            user.rank === 1
                              ? 'text-amber-700'
                              : user.rank === 2
                              ? 'text-slate-600'
                              : user.rank === 3
                              ? 'text-amber-800'
                              : 'text-[#727875]'
                          }`}
                        >
                          #{user.rank}
                        </span>
                        {isPromoting && (
                          <span className="material-symbols-outlined text-xs text-emerald-700" title="Promotion Zone">
                            arrow_upward
                          </span>
                        )}
                        {isRelegating && (
                          <span className="material-symbols-outlined text-xs text-amber-700" title="Relegation Zone">
                            arrow_downward
                          </span>
                        )}
                      </div>

                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-[#e3e2e0]"
                        />
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#4f6359] ring-2 ring-white"></span>
                      </div>

                      {/* Name & Details */}
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm sm:text-base text-[#1f332d]">
                            {user.name}
                          </span>
                          <span className="text-xs text-[#727875] font-mono">{user.username}</span>
                          {user.isCurrentUser && (
                            <span className="px-2 py-0.2 rounded-full bg-[#1f332d] text-white text-[10px] font-bold uppercase">
                              You
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-[#424845] mt-0.5 line-clamp-1">{user.statusText}</span>
                        <div className="flex items-center gap-3 text-xs text-[#727875] mt-1">
                          <span className="flex items-center gap-1 font-semibold text-[#613e19]">
                            <span className="material-symbols-outlined text-sm">local_fire_department</span>
                            {user.streakDays}d Streak
                          </span>
                          <span>•</span>
                          <span>{user.dailyMinutes}m today</span>
                          <span>•</span>
                          <span>{user.pronunciationAvg}% Pronunciation</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: XP Score & Social Actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#efeeeb]">
                      <div className="flex flex-col text-left sm:text-right">
                        <span className="font-serif text-xl sm:text-2xl font-bold text-[#1f332d]">
                          {user.xp} <span className="text-xs font-sans font-medium text-[#4f6359]">XP</span>
                        </span>
                        <span className="text-[10px] text-[#727875]">{user.wordsLearned} expressions</span>
                      </div>

                      {/* Interactive Buttons for Friends */}
                      {!user.isCurrentUser && (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleCheer(user)}
                            className={`p-2 rounded-lg border text-xs transition-colors ${
                              cheeredFriends[user.id]
                                ? 'bg-[#ffdcbf] text-[#623f1a] border-[#f0bd8d]'
                                : 'bg-[#f4f3f0] hover:bg-[#efeeeb] text-[#424845] border-[#e3e2e0]'
                            }`}
                            title="Cheer with streak flame"
                          >
                            <span className="material-symbols-outlined text-base">local_fire_department</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleNudge(user)}
                            className={`p-2 rounded-lg border text-xs transition-colors ${
                              nudgedFriends[user.id]
                                ? 'bg-[#cfe5d9] text-[#0d1f18] border-[#b4ccc2]'
                                : 'bg-[#f4f3f0] hover:bg-[#efeeeb] text-[#424845] border-[#e3e2e0]'
                            }`}
                            title="Nudge to practice"
                          >
                            <span className="material-symbols-outlined text-base">notifications</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onChallengeFriend(user.name)}
                            className="px-3 py-1.5 rounded-lg bg-[#354a43] hover:bg-[#1f332d] text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-sm">swords</span>
                            <span className="hidden sm:inline">Oral Duel</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT SIDEBAR: Live Activity Feed & Friend Comparison (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Live Social Feed */}
            <div className="bg-white rounded-2xl p-5 shadow-xs border border-[#e3e2e0] flex flex-col gap-4">
              <div className="flex items-center justify-between pb-1 border-b border-[#efeeeb]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-[#4f6359]">rss_feed</span>
                  <h3 className="font-serif text-lg text-[#1f332d]">Friends Live Feed</h3>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" title="Live stream"></span>
              </div>

              <div className="flex flex-col gap-3.5">
                {sortedUsers.slice(0, 5).map((u, i) => (
                  <div key={u.id} className="flex items-start gap-3 text-xs">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-[#e3e2e0]"
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-[#1a1c1a]">{u.name}</span>
                        <span className="text-[10px] text-[#727875] font-mono">• {i * 4 + 2}m ago</span>
                      </div>
                      <span className="text-[#424845] mt-0.5 leading-snug">{u.recentActivity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Friend Head-to-Head Comparison Card */}
            <div className="bg-[#f4f3f0] rounded-2xl p-5 border border-[#e3e2e0] flex flex-col gap-4">
              <div className="flex items-center gap-2 text-[#1f332d]">
                <span className="material-symbols-outlined text-lg text-[#4f6359]">compare_arrows</span>
                <h3 className="font-serif text-lg font-medium">Head-to-Head Rivalry</h3>
              </div>
              <p className="text-xs text-[#424845]">
                You vs #1 Chloé Laurent. Close the gap before Sunday’s midnight reset!
              </p>

              <div className="bg-white rounded-xl p-3.5 flex flex-col gap-2.5 border border-[#e3e2e0]">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[#1f332d]">You: 2,480 XP</span>
                  <span className="text-[#727875]">Chloé: 2,840 XP</span>
                </div>
                <div className="w-full h-2 bg-[#efeeeb] rounded-full overflow-hidden flex">
                  <div className="bg-[#354a43] h-full" style={{ width: '47%' }}></div>
                  <div className="bg-[#b6cbc0] h-full" style={{ width: '53%' }}></div>
                </div>
                <span className="text-[11px] text-[#4f6359] font-bold text-center">
                  360 XP needed to claim #1 spot
                </span>
              </div>

              <button
                onClick={() => onChallengeFriend('Chloé Laurent')}
                className="w-full py-2.5 px-4 rounded-xl bg-[#354a43] hover:bg-[#1f332d] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">play_arrow</span>
                <span>Send 3-min Scenario Challenge</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Daily Challenges Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {dailyChallenges.map((task) => (
            <div
              key={task.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                task.completed
                  ? 'bg-[#cfe5d9]/30 border-[#b4ccc2]'
                  : 'bg-white border-[#e3e2e0] shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      task.completed ? 'bg-[#cfe5d9] text-[#0d1f18]' : 'bg-[#f4f3f0] text-[#4f6359]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">{task.icon}</span>
                  </div>
                  <div className="flex flex-col">
                    <h4 className="font-serif text-base text-[#1f332d] font-semibold">{task.title}</h4>
                    <p className="text-xs text-[#424845] mt-0.5">{task.desc}</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#1f332d] text-white text-xs font-mono font-bold shrink-0">
                  +{task.rewardXp} XP
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-[#efeeeb]">
                <span className="text-[#727875] font-semibold">Progress: {task.progress}</span>
                <span
                  className={`font-bold flex items-center gap-1 ${
                    task.completed ? 'text-emerald-700' : 'text-[#4f6359]'
                  }`}
                >
                  {task.completed ? (
                    <>
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      <span>Claimed</span>
                    </>
                  ) : (
                    <span>In Progress</span>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Friend Modal */}
      {friendModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-[#e3e2e0] flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#efeeeb]">
              <div className="flex items-center gap-2 text-[#1f332d]">
                <span className="material-symbols-outlined text-xl text-[#4f6359]">person_add</span>
                <h3 className="font-serif text-xl font-medium">Add a Language Partner</h3>
              </div>
              <button
                onClick={() => setFriendModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#efeeeb] flex items-center justify-center text-[#424845]"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <p className="text-xs text-[#424845]">
              Compete daily on speaking minutes, pronunciation fidelity, and weekly league promotions.
            </p>

            <form onSubmit={handleAddFriendSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                value={newFriendHandle}
                onChange={(e) => setNewFriendHandle(e.target.value)}
                placeholder="@username (e.g. @parisian_speaker)"
                className="px-4 py-2.5 rounded-xl bg-[#f4f3f0] border border-[#e3e2e0] text-sm text-[#1a1c1a] outline-none focus:bg-white"
                autoFocus
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFriendModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-[#424845] hover:bg-[#efeeeb]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newFriendHandle.trim()}
                  className="px-5 py-2 rounded-lg bg-[#354a43] hover:bg-[#1f332d] disabled:opacity-50 text-white text-xs font-semibold shadow-xs"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
