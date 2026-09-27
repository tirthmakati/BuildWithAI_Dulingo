import React from 'react';
import { HEATMAP_DAYS } from '../data/initialData';

interface AnalyticsViewProps {
  onOpenDrill: () => void;
  onLaunchRecommendedScenario: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  onOpenDrill,
  onLaunchRecommendedScenario
}) => {
  const handleExportReport = () => {
    const reportData = `LinguaFlow Acoustic Analytics Report\nDate: ${new Date().toLocaleDateString()}\nConversational Fluency: 86%\nPronunciation Accuracy: 92%\nLexical Diversity: 78%\nAcoustic Latency: 1.4s\nWeekly Total: 2.5 hrs (150 min)`;
    const blob = new Blob([reportData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'linguaflow-fluency-report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Sub-header & Session Meta Context */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pt-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider text-[#4f6359] font-bold">
              Acoustic Diagnostics
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#4f6359]"></span>
            <span className="text-xs text-[#424845]">Session #42 · Paris Salon Debate</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1f332d] tracking-tight">
            Fluency &amp; Acoustic Analytics
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f4f3f0] text-[#1a1c1a] border border-[#e3e2e0] text-xs">
            <span className="material-symbols-outlined text-sm text-[#4f6359]">calendar_today</span>
            <span className="font-semibold">Last 14 Days</span>
          </div>
          <button
            onClick={handleExportReport}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#cfe5d9] text-[#0d1f18] hover:bg-[#b6cbc0] transition-colors text-xs font-semibold"
            type="button"
          >
            <span className="material-symbols-outlined text-sm">ios_share</span>
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Row (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {/* Stat 1 */}
        <div className="p-5 rounded-xl bg-white shadow-xs border border-[#e3e2e0] flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-xs text-[#424845] font-semibold">Conversational Fluency</span>
            <span className="material-symbols-outlined text-[#4f6359] text-xl">speed</span>
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className="font-serif text-3xl sm:text-4xl text-[#1f332d] tracking-tight font-normal">86%</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#cfe5d9] text-[#54675e] font-bold">
              +4% wk
            </span>
          </div>
          <div className="w-full bg-[#e3e2e0] rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#354a43] h-full rounded-full" style={{ width: '86%' }}></div>
          </div>
          <span className="text-xs text-[#727875] mt-2.5">Solid B2 spontaneous dialogue flow</span>
        </div>

        {/* Stat 2 */}
        <div className="p-5 rounded-xl bg-white shadow-xs border border-[#e3e2e0] flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-xs text-[#424845] font-semibold">Pronunciation Accuracy</span>
            <span className="material-symbols-outlined text-[#4f6359] text-xl">record_voice_over</span>
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className="font-serif text-3xl sm:text-4xl text-[#1f332d] tracking-tight font-normal">92%</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#efeeeb] text-[#4f6359] font-bold">
              Native match
            </span>
          </div>
          <div className="w-full bg-[#e3e2e0] rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#4f6359] h-full rounded-full" style={{ width: '92%' }}></div>
          </div>
          <span className="text-xs text-[#727875] mt-2.5">High clarity across nasal vowels</span>
        </div>

        {/* Stat 3 */}
        <div className="p-5 rounded-xl bg-white shadow-xs border border-[#e3e2e0] flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-xs text-[#424845] font-semibold">Lexical Diversity</span>
            <span className="material-symbols-outlined text-[#4f6359] text-xl">auto_stories</span>
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className="font-serif text-3xl sm:text-4xl text-[#1f332d] tracking-tight font-normal">78%</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#cfe5d9] text-[#54675e] font-bold">
              38 Idioms
            </span>
          </div>
          <div className="w-full bg-[#e3e2e0] rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#354a43] h-full rounded-full" style={{ width: '78%' }}></div>
          </div>
          <span className="text-xs text-[#727875] mt-2.5">Used 38 unique B2/C1 expressions</span>
        </div>

        {/* Stat 4 */}
        <div className="p-5 rounded-xl bg-white shadow-xs border border-[#e3e2e0] flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-xs text-[#424845] font-semibold">Acoustic Latency &amp; Rhythm</span>
            <span className="material-symbols-outlined text-[#4f6359] text-xl">graphic_eq</span>
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className="font-serif text-3xl sm:text-4xl text-[#1f332d] tracking-tight font-normal">
              1.4<span className="text-xl font-sans text-[#4f6359]">s</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#efeeeb] text-[#424845] font-bold">
              -0.3s vs avg
            </span>
          </div>
          <div className="w-full bg-[#e3e2e0] rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#4f6359] h-full rounded-full" style={{ width: '74%' }}></div>
          </div>
          <span className="text-xs text-[#727875] mt-2.5">Near native conversational pacing</span>
        </div>
      </div>

      {/* Editorial Split Layout (7:5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Deep Acoustic & Phonetic Exploration (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-8 min-w-0">
          {/* Phonetic Breakdown & Waveform Section */}
          <div className="bg-white rounded-xl p-6 shadow-xs border border-[#e3e2e0] flex flex-col gap-6">
            <div className="flex items-center justify-between pb-2 border-b border-[#efeeeb]">
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-wider text-[#4f6359] font-bold">
                  Acoustic Diagnostics
                </span>
                <h2 className="font-serif text-xl sm:text-2xl text-[#1f332d]">
                  Phonetic &amp; Pronunciation Breakdown
                </h2>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#efeeeb] text-[#424845] font-medium">
                Liaison &amp; Formants
              </span>
            </div>

            {/* Phoneme Comparison Card */}
            <div className="bg-[#f4f3f0] rounded-lg p-5 flex flex-col gap-4 border border-[#e3e2e0]">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-[#1f332d] text-white flex items-center justify-center font-serif text-base font-bold">
                    u
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-[#1a1c1a]">
                    Target Phoneme: /y/ (tu, vu) vs /u/ (tout, vous)
                  </span>
                </div>
                <span className="text-[11px] text-[#ba1a1a] bg-[#ffdad6] px-2 py-0.5 rounded-full font-bold">
                  Subtle Slump
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#424845] leading-relaxed">
                In phrase <span className="font-serif italic text-[#1f332d] font-semibold">"Si tu avais pu venir plus tôt..."</span>, tongue position was slightly retracted on <strong className="text-[#1a1c1a]">"pu"</strong>, tending towards /pu/ instead of the forward, rounded /py/.
              </p>

              {/* Waveform Visualizer */}
              <div className="bg-white p-4 rounded-lg flex flex-col gap-3 border border-[#e3e2e0]">
                {/* Native Model */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 w-28 shrink-0">
                    <span className="w-6 h-6 rounded-full bg-[#efeeeb] flex items-center justify-center text-[#1f332d] text-xs">
                      <span className="material-symbols-outlined text-sm">play_arrow</span>
                    </span>
                    <span className="text-xs text-[#4f6359] font-semibold">Native Model</span>
                  </div>
                  <div className="h-7 w-full overflow-hidden flex items-center">
                    <svg className="w-full h-6 text-[#4f6359]" preserveAspectRatio="none" viewBox="0 0 300 24">
                      {Array.from({ length: 35 }).map((_, i) => (
                        <rect
                          key={i}
                          x={i * 8 + 2}
                          y={12 - (Math.sin(i * 0.4) * 8 + 2)}
                          width="3"
                          height={Math.abs(Math.sin(i * 0.4) * 16) + 4}
                          rx="1.5"
                          fill="currentColor"
                        />
                      ))}
                    </svg>
                  </div>
                  <span className="text-xs font-mono text-[#4f6359] font-bold w-10 text-right">98%</span>
                </div>

                {/* User Take with highlight */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 w-28 shrink-0">
                    <span className="w-6 h-6 rounded-full bg-[#354a43] text-white flex items-center justify-center text-xs">
                      <span className="material-symbols-outlined text-sm">play_arrow</span>
                    </span>
                    <span className="text-xs text-[#1f332d] font-semibold">Your Input</span>
                  </div>
                  <div className="h-7 w-full overflow-hidden flex items-center">
                    <svg className="w-full h-6 text-[#354a43]" preserveAspectRatio="none" viewBox="0 0 300 24">
                      {Array.from({ length: 35 }).map((_, i) => {
                        const isDip = i >= 8 && i <= 11;
                        return (
                          <rect
                            key={i}
                            x={i * 8 + 2}
                            y={12 - (Math.sin(i * 0.38) * 7 + (isDip ? 1 : 2))}
                            width="3"
                            height={isDip ? 5 : Math.abs(Math.sin(i * 0.38) * 14) + 4}
                            rx="1.5"
                            fill={isDip ? '#ba1a1a' : 'currentColor'}
                          />
                        );
                      })}
                    </svg>
                  </div>
                  <span className="text-xs font-mono text-[#1f332d] font-bold w-10 text-right">81%</span>
                </div>
              </div>

              {/* Call to action */}
              <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="material-symbols-outlined text-[#613e19] text-base">bolt</span>
                  <span className="font-semibold text-[#1a1c1a]">Targeted Drill: French Rounded High Front Vowel [y]</span>
                </div>
                <button
                  onClick={onOpenDrill}
                  className="px-3.5 py-1.5 rounded-lg bg-[#354a43] hover:bg-[#1f332d] text-white transition-all text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  type="button"
                >
                  <span className="material-symbols-outlined text-sm">mic</span>
                  <span>Launch 60s Drill</span>
                </button>
              </div>
            </div>

            {/* Secondary Highlight: Liaison */}
            <div className="p-4 rounded-lg bg-[#efeeeb] flex items-center justify-between border border-[#e3e2e0]/60">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#cfe5d9] text-[#54675e] flex items-center justify-center font-bold text-xs">
                  z
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#1a1c1a]">
                    Liaison enchaînée: "Vous avez" → [vu.za.ve]
                  </span>
                  <span className="text-xs text-[#424845]">
                    Smooth auditory binding detected. Natural transition pitch achieved.
                  </span>
                </div>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-white text-[#4f6359] font-bold font-mono">
                98% Clarity
              </span>
            </div>
          </div>

          {/* Grammar & Nuance Evolution Chart */}
          <div className="bg-white rounded-xl p-6 shadow-xs border border-[#e3e2e0] flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-wider text-[#4f6359] font-bold">
                  Historical Trajectory
                </span>
                <h2 className="font-serif text-xl sm:text-2xl text-[#1f332d]">
                  Grammar &amp; Nuance Evolution
                </h2>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#354a43]"></span>
                  <span className="text-[#424845]">Accuracy</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#b6cbc0]"></span>
                  <span className="text-[#424845]">Subjunctive</span>
                </div>
              </div>
            </div>

            {/* SVG Area Chart */}
            <div className="relative w-full h-48 bg-[#f4f3f0] rounded-lg p-4 flex flex-col justify-between border border-[#e3e2e0]">
              <div className="w-full flex justify-between text-[#727875] text-[10px] font-mono">
                <span>100%</span>
                <span>85% (Target)</span>
                <span>70%</span>
              </div>

              <svg className="w-full h-28 overflow-visible" fill="none" preserveAspectRatio="none" viewBox="0 0 500 100">
                <line x1="0" x2="500" y1="20" y2="20" stroke="#dbdad7" strokeDasharray="4 4" strokeWidth="1" />
                <line x1="0" x2="500" y1="50" y2="50" stroke="#dbdad7" strokeDasharray="4 4" strokeWidth="1" />
                <line x1="0" x2="500" y1="80" y2="80" stroke="#dbdad7" strokeDasharray="4 4" strokeWidth="1" />

                {/* Subjunctive Trend */}
                <path
                  d="M0,75 C80,72 150,60 250,55 C350,50 420,40 500,32"
                  fill="none"
                  stroke="#b6cbc0"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Accuracy Trend */}
                <path
                  d="M0,62 C60,58 130,42 220,38 C320,34 400,22 500,16"
                  fill="none"
                  stroke="#354a43"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                <circle cx="220" cy="38" r="4" fill="#354a43" />
                <circle cx="500" cy="16" r="5" fill="#354a43" className="animate-pulse" />
                <circle cx="500" cy="32" r="4" fill="#b6cbc0" />
              </svg>

              <div className="w-full flex justify-between text-[#424845] text-[11px] pt-2 font-medium">
                <span>Session 1</span>
                <span>Session 12</span>
                <span>Session 24</span>
                <span>Session 36</span>
                <span className="font-bold text-[#1f332d]">Session 42 (Today)</span>
              </div>
            </div>

            {/* Common Slip-ups */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-[#1a1c1a]">Common Slip-ups This Period</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-lg bg-[#efeeeb] flex items-start gap-3 border border-[#e3e2e0]/60">
                  <span className="material-symbols-outlined text-[#4f6359] text-lg mt-0.5">rule</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#1a1c1a]">Subjunctive Trigger Avoidance</span>
                    <span className="text-xs text-[#424845] mt-0.5">
                      Substituted indicative after "bien que" twice. Naturalized after prompt correction.
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#efeeeb] flex items-start gap-3 border border-[#e3e2e0]/60">
                  <span className="material-symbols-outlined text-[#4f6359] text-lg mt-0.5">link</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#1a1c1a]">Preposition Selection: à vs de</span>
                    <span className="text-xs text-[#424845] mt-0.5">
                      "Continuer à" vs "Continuer de" nuance noted in literary discourse mode.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Annotated Dialogue & Immersion Heatmap (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-8 min-w-0">
          {/* Annotated Dialogue */}
          <div className="bg-white rounded-xl p-6 shadow-xs border border-[#e3e2e0] flex flex-col gap-5">
            <div className="flex items-center justify-between pb-1 border-b border-[#efeeeb]">
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-wider text-[#4f6359] font-bold">
                  Acoustic Log
                </span>
                <h2 className="font-serif text-xl sm:text-2xl text-[#1f332d]">Annotated Dialogue</h2>
              </div>
              <span className="text-xs text-[#424845] font-mono">11:42 Duration</span>
            </div>

            {/* Badges Legend */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#cfe5d9] text-[#0d1f18] font-bold text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4f6359]"></span> Idiomatic Mastery
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ffdcbf] text-[#623f1a] font-bold text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#613e19]"></span> Syntax Tweak
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#efeeeb] text-[#1f332d] font-bold text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#354a43]"></span> Phonetic Formant
              </span>
            </div>

            {/* Dialogue stream */}
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-xl bg-[#f4f3f0] flex flex-col gap-1.5 border border-[#e3e2e0]/60">
                <div className="flex items-center justify-between">
                  <span className="font-serif italic text-xs text-[#4f6359] font-semibold">Éléonore (AI Tutor)</span>
                  <span className="text-[11px] text-[#727875]">08:14</span>
                </div>
                <p className="text-xs sm:text-sm text-[#1a1c1a]">
                  « Mais selon vous, comment la littérature du XIXe siècle résonne-t-elle encore dans nos débats contemporains ? »
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#efeeeb] flex flex-col gap-3 border border-[#e3e2e0]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1f332d]">Your Speech</span>
                  <span className="text-[11px] text-[#727875]">08:21</span>
                </div>
                <div className="text-xs sm:text-sm text-[#1a1c1a] leading-relaxed">
                  « À vrai dire,{' '}
                  <span className="bg-[#cfe5d9] text-[#0d1f18] px-1.5 py-0.5 rounded font-bold">
                    il me semble évident
                  </span>{' '}
                  que les fractures sociales de Balzac préfigurent nos crises actuelles. Si l'on{' '}
                  <span className="bg-[#ffdcbf] text-[#623f1a] px-1.5 py-0.5 rounded font-bold">
                    regarderait
                  </span>{' '}
                  attentivement, on{' '}
                  <span className="bg-[#e3e2e0] px-1.5 py-0.5 rounded font-mono font-bold text-[#1f332d] underline decoration-dotted">
                    verrait
                  </span>{' '}
                  les mêmes tensions. »
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <div className="p-2.5 rounded-lg bg-white flex items-start gap-2 border border-[#e3e2e0]">
                    <span className="material-symbols-outlined text-[#4f6359] text-base mt-0.5">sentiment_satisfied</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#4f6359]">Natural Discourse Marker</span>
                      <span className="text-xs text-[#424845]">"Il me semble évident" elevated the tone effortlessly into C1 register.</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white flex items-start gap-2 border border-[#e3e2e0]">
                    <span className="material-symbols-outlined text-[#613e19] text-base mt-0.5">tips_and_updates</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#472805]">Conditional Clause Error</span>
                      <span className="text-xs text-[#424845]">
                        Replace conditional "regarderait" with imparfait: <em>"Si l'on regardait..."</em>.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#f4f3f0] flex flex-col gap-1.5 border border-[#e3e2e0]/60">
                <div className="flex items-center justify-between">
                  <span className="font-serif italic text-xs text-[#4f6359] font-semibold">Éléonore (AI Tutor)</span>
                  <span className="text-[11px] text-[#727875]">08:45</span>
                </div>
                <p className="text-xs sm:text-sm text-[#1a1c1a]">
                  « C'est une observation particulièrement fine. La Comédie Humaine agit comme un miroir anticipé de nos métropoles. »
                </p>
              </div>
            </div>
          </div>

          {/* Speaking Immersion Rhythm Heatmap */}
          <div className="bg-white rounded-xl p-6 shadow-xs border border-[#e3e2e0] flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-wider text-[#4f6359] font-bold">
                  Consistency
                </span>
                <h2 className="font-serif text-xl sm:text-2xl text-[#1f332d]">
                  Speaking Immersion Rhythm
                </h2>
              </div>
              <span className="text-[11px] text-[#4f6359] font-bold bg-[#cfe5d9] px-2 py-0.5 rounded-full">
                Target: 20m / day
              </span>
            </div>

            {/* Calendar Dot Heatmap */}
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-7 gap-2 text-center text-[#727875] text-[11px] font-bold">
                <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {HEATMAP_DAYS.map((slot, idx) => (
                  <div
                    key={idx}
                    className={`h-8 rounded flex items-center justify-center text-xs font-semibold transition-all ${
                      slot.isToday
                        ? 'bg-[#1f332d] text-white shadow-xs font-bold ring-2 ring-[#cfe5d9]'
                        : slot.isFuture
                        ? 'bg-[#f4f3f0] text-[#727875] opacity-40'
                        : slot.mins >= 30
                        ? 'bg-[#354a43] text-white'
                        : slot.mins >= 20
                        ? 'bg-[#cfe5d9] text-[#0d1f18]'
                        : 'bg-[#efeeeb] text-[#727875]'
                    }`}
                    title={`${slot.mins} minutes`}
                  >
                    {slot.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Summary Totals */}
            <div className="p-4 rounded-lg bg-[#f4f3f0] flex items-center justify-between border border-[#e3e2e0]">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#4f6359] text-2xl">timelapse</span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[#1a1c1a]">Weekly Speaking Time</span>
                  <span className="text-xs text-[#424845]">150 mins total (107% of weekly quota)</span>
                </div>
              </div>
              <span className="font-serif text-2xl font-bold text-[#1f332d]">2.5 hrs</span>
            </div>

            {/* Focus Recommendation */}
            <div className="p-4 rounded-lg bg-[#efeeeb] flex items-start gap-3.5 border border-[#e3e2e0]/60">
              <span className="material-symbols-outlined text-[#4f6359] text-xl mt-0.5">auto_awesome</span>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-[#1a1c1a]">Next Recommended Scenario</span>
                <p className="text-xs text-[#424845]">
                  "Architectural Preservation Hearing" — tailored to push formal register, conditional structures, and nasal vowel cadence.
                </p>
                <button
                  onClick={onLaunchRecommendedScenario}
                  className="mt-1 text-xs text-[#1f332d] font-bold hover:underline flex items-center gap-1 self-start"
                >
                  <span>Launch Recommended Session</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
