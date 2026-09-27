import React, { useState, useEffect, useRef } from 'react';
import { Scenario, DialogueTurn, NuanceTip, QuickPrompt, VocabularyItem } from '../types';
import { speechService } from '../services/speechService';
import { aiTutorService } from '../services/aiTutorService';
import confetti from 'canvas-confetti';

interface LivePracticeViewProps {
  scenario: Scenario;
  onEndSession: (minutesPracticed: number, xpEarned: number) => void;
  onSaveToVault: (word: VocabularyItem) => void;
}

const getScenarioPresets = (sc: Scenario) => {
  const isGujarati = sc.language === 'Gujarati';
  const isHindi = sc.language === 'Hindi';
  const isEnglish = sc.language?.includes('English');

  let defaultWord = {
    word: 'chausson aux pommes',
    ipa: '/ʃo.sɔ̃ o pɔm/',
    pos: 'noun, masc.',
    def: 'Traditional golden puff pastry turnover with spiced compote',
    saved: false
  };

  let prompts: QuickPrompt[] = [
    {
      id: 'qp-1',
      french: '« Un flat white au lait d’avoine, s’il vous plaît. »',
      english: 'A flat white with oat milk, please.'
    },
    {
      id: 'qp-2',
      french: '« Le chausson aux pommes est encore tiède ? »',
      english: 'Is the apple turnover still warm?'
    },
    {
      id: 'qp-3',
      french: '« Ce sera sur place, au comptoir. »',
      english: 'For here, at the counter.'
    }
  ];

  let tips: NuanceTip[] = [
    {
      id: `tip-${sc.id}-1`,
      type: 'idiom',
      title: 'Conversational Idiom',
      description: sc.culturalNuance || 'Speak with natural cadence and respectful forms.',
      recommendedPhrase: sc.targetLexicon?.[0] ? `« ${sc.targetLexicon[0]} »` : undefined,
      note: 'Key regional nuance.'
    }
  ];

  if (isGujarati) {
    if (sc.id === 'gujarat-surat-textile') {
      defaultWord = {
        word: 'વ્યાજબી',
        ipa: '/vjaːd͡ʒ.biː/',
        pos: 'વિશેષણ (adjective)',
        def: 'Reasonable, fair, or justified in pricing and terms',
        saved: false
      };
      prompts = [
        { id: 'qp-1', french: '« જરા વ્યાજબી કરી આપો ને ભાઈ, અમે કાયમી ગ્રાહક છીએ. »', english: 'Please give a fair price brother, we are regular clients.' },
        { id: 'qp-2', french: '« ૧૫ બાંધણી સાડીઓ પર રોકડ વટાવ કેટલો મળશે? »', english: 'How much cash discount on 15 Bandhani sarees?' },
        { id: 'qp-3', french: '« ગુણવત્તા ઉત્તમ છે, જીએસટી બિલ પાકું બનાવજો. »', english: 'The quality is great, please make a proper GST invoice.' }
      ];
    } else {
      defaultWord = {
        word: 'ઓછું તીખું',
        ipa: '/oːt͡ʃʰ.ũ tiː.kʰũ/',
        pos: 'વિશેષણ પદ (phrase)',
        def: 'Less spicy / mild spice preference in Gujarati food',
        saved: false
      };
      prompts = [
        { id: 'qp-1', french: '« ભાઈ, એક ગ્વાલિયર ઢોંસો બનાવજો, જરા ઓછું તીખું રાખજો! »', english: 'Brother, one Gwalior Dosa, make it mild spice!' },
        { id: 'qp-2', french: '« સાથે એક ઠંડી મસાલા છાસ આપજો. »', english: 'Give one cold masala buttermilk along with it.' },
        { id: 'qp-3', french: '« માખણ વધારે નાખજો અને પાર્સલ કરી આપો. »', english: 'Add extra butter and pack it for takeaway.' }
      ];
    }
    tips = [
      {
        id: 'tip-gu-init',
        type: 'idiom',
        title: 'અમદાવાદી વાતચીત લહેકો (Gujarati Warmth)',
        description: 'ગુજરાતીમાં "કેમ છો", "જરા વ્યાજબી કરો", અને "બહુ મજા આવી ગઈ" જેવા શબ્દો સહજ આત્મીયતા વધારે છે.',
        recommendedPhrase: '« જરા ઓછું તીખું રાખજો હો ભાઈ! »'
      }
    ];
  } else if (isHindi) {
    if (sc.id === 'hindi-bengaluru-tech') {
      defaultWord = {
        word: 'समीक्षा',
        ipa: '/sə.miːk.ʂaː/',
        pos: 'संज्ञा (noun, f.)',
        def: 'Comprehensive review, evaluation, or assessment',
        saved: false
      };
      prompts = [
        { id: 'qp-1', french: '« मेरी पिछली तिमाही की समीक्षा में क्लाउड माइग्रेशन समय से पूरा हुआ था। »', english: 'In my quarterly review, cloud migration was completed on time.' },
        { id: 'qp-2', french: '« मैं वरिष्ठ भूमिका और जिम्मेदारियों के लिए पूरी तरह तैयार हूँ। »', english: 'I am fully prepared for senior roles and responsibilities.' },
        { id: 'qp-3', french: '« क्या हम हाइब्रिड वर्क मॉडल और 15% वेतन वृद्धि पर चर्चा कर सकते हैं? »', english: 'Can we discuss the hybrid work model and 15% increment?' }
      ];
    } else {
      defaultWord = {
        word: 'लाजवाब',
        ipa: '/laː.d͡ʒə.ʋaːb/',
        pos: 'विशेषण (adj.)',
        def: 'Incomparable, exquisite in taste and flavor',
        saved: false
      };
      prompts = [
        { id: 'qp-1', french: '« भाई साहब, एक कड़क कुल्हड़ चाय बना दीजिए, चीनी कम रखिएगा। »', english: 'Brother, please make one strong earthen cup tea with less sugar.' },
        { id: 'qp-2', french: '« साथ में ताज़ा गरमागरम जलेबी भी लगवा दीजिए। »', english: 'Please serve fresh hot jalebi alongside.' },
        { id: 'qp-3', french: '« चाय का ज़ायका सचमुच लाजवाब है! »', english: 'The flavor of this tea is truly wonderful!' }
      ];
    }
    tips = [
      {
        id: 'tip-hi-init',
        type: 'idiom',
        title: 'दिल्ली-लखनवी तहज़ीब (Hindi Etiquette)',
        description: 'हिंदी में "जनाब", "तशरीफ़ रखिए" और "लाजवाब" का उपयोग संवाद को सुरुचिपूर्ण और आत्मीय बनाता है।',
        recommendedPhrase: '« चाय का ज़ायका सचमुच लाजवाब है! »'
      }
    ];
  } else if (isEnglish) {
    if (sc.id === 'en-tech-standup') {
      defaultWord = {
        word: 'blocker',
        ipa: '/ˈblɒk.ər/',
        pos: 'noun (tech)',
        def: 'An impediment or obstacle preventing a sprint task from progressing',
        saved: false
      };
      prompts = [
        { id: 'qp-1', french: '« Yesterday I pushed the auth PR, today I am reviewing staging metrics. »', english: 'Yesterday I pushed auth PR, today reviewing staging metrics.' },
        { id: 'qp-2', french: '« I have no blockers currently and will deploy by noon. »', english: 'I have no blockers currently and will deploy by noon.' },
        { id: 'qp-3', french: '« Let us sync up offline regarding the database migration pipeline. »', english: 'Let us sync up offline regarding the database migration.' }
      ];
    } else {
      defaultWord = {
        word: 'flat white',
        ipa: '/flæt waɪt/',
        pos: 'noun (culinary)',
        def: 'Espresso coffee with steamed microfoam milk',
        saved: false
      };
      prompts = [
        { id: 'qp-1', french: '« Could I please get a flat white with oat milk, for takeaway? »', english: 'Could I please get a flat white with oat milk, for takeaway?' },
        { id: 'qp-2', french: '« Do you take contactless Google or Apple Pay? »', english: 'Do you take contactless Google or Apple Pay?' },
        { id: 'qp-3', french: '« Cheers, thank you and have a wonderful day! »', english: 'Cheers, thank you and have a wonderful day!' }
      ];
    }
    tips = [
      {
        id: 'tip-en-init',
        type: 'idiom',
        title: 'Natural Spoken English Flow',
        description: 'Replace direct commands with polite softeners: "Could I please get..." or "Let’s sync up offline".',
        recommendedPhrase: '« I have zero blockers for today’s sprint. »'
      }
    ];
  }

  const initialDialogue: DialogueTurn[] = [
    {
      id: `turn-1-${sc.id}`,
      speaker: 'ai',
      speakerName: sc.partnerName.split(' ')[0] || 'Tutor',
      avatar: sc.partnerAvatar,
      text: sc.initialMessage,
      time: '09:12 AM',
      contextTranslation: sc.initialTranslation
    }
  ];

  return { defaultWord, prompts, tips, initialDialogue };
};

export const LivePracticeView: React.FC<LivePracticeViewProps> = ({
  scenario,
  onEndSession,
  onSaveToVault
}) => {
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [speechPace, setSpeechPace] = useState<'1.0x Pace' | '0.8x Slow' | '1.2x Native'>('1.0x Pace');
  const [hintsOn, setHintsOn] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [typedInput, setTypedInput] = useState('');
  const [savedWordFeedback, setSavedWordFeedback] = useState<string | null>(null);

  const initialPresets = getScenarioPresets(scenario);
  const [inspectedWord, setInspectedWord] = useState(initialPresets.defaultWord);
  const [nuanceTips, setNuanceTips] = useState<NuanceTip[]>(initialPresets.tips);
  const [dialogue, setDialogue] = useState<DialogueTurn[]>(initialPresets.initialDialogue);
  const [quickPrompts, setQuickPrompts] = useState<QuickPrompt[]>(initialPresets.prompts);

  // Sync state whenever scenario changes
  useEffect(() => {
    const presets = getScenarioPresets(scenario);
    setDialogue(presets.initialDialogue);
    setQuickPrompts(presets.prompts);
    setInspectedWord(presets.defaultWord);
    setNuanceTips(presets.tips);
    setSessionSeconds(0);
  }, [scenario.id]);

  // Frequency wave bars (8 values)
  const [waveFrequencies, setWaveFrequencies] = useState<number[]>([15, 35, 60, 85, 70, 45, 55, 25]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Audio wave animation
  useEffect(() => {
    const waveInterval = setInterval(() => {
      setWaveFrequencies([
        Math.floor(Math.random() * 40 + 10),
        Math.floor(Math.random() * 60 + 20),
        Math.floor(Math.random() * 80 + 20),
        isListening ? Math.floor(Math.random() * 90 + 30) : Math.floor(Math.random() * 70 + 20),
        isListening ? Math.floor(Math.random() * 85 + 30) : Math.floor(Math.random() * 60 + 20),
        Math.floor(Math.random() * 50 + 15),
        Math.floor(Math.random() * 65 + 20),
        Math.floor(Math.random() * 40 + 10)
      ]);
    }, 220);
    return () => clearInterval(waveInterval);
  }, [isListening]);

  // Keyboard shortcut: Spacebar to talk
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isListening && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault();
        handleStartSpeech();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' && isListening && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault();
        handleStopSpeech();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isListening]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartSpeech = () => {
    setIsListening(true);
    setInterimText('');
    speechService.startListening(
      (transcript, isFinal) => {
        setInterimText(transcript);
        if (isFinal) {
          handleUserUtterance(transcript);
        }
      },
      (err) => {
        console.warn('Speech error/sandbox fallback:', err);
      },
      () => {
        setIsListening(false);
      },
      scenario.speechLang || 'fr-FR'
    );
  };

  const handleStopSpeech = () => {
    speechService.stopListening();
    setIsListening(false);
    if (interimText.trim()) {
      handleUserUtterance(interimText);
      setInterimText('');
    }
  };

  const handleUserUtterance = (text: string) => {
    const assessment = speechService.assessPronunciation(text);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newTurn: DialogueTurn = {
      id: `turn-${Date.now()}`,
      speaker: 'user',
      speakerName: 'You',
      text: text.startsWith('«') ? text : `« ${text} »`,
      time: nowTime,
      pacingWpm: assessment.pacingWpm,
      pronunciationScore: assessment.score
    };

    setDialogue((prev) => [...prev, newTurn]);

    // AI Partner response
    setTimeout(() => {
      const response = aiTutorService.generateTutorResponse(scenario, text, dialogue);
      const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const aiTurn: DialogueTurn = {
        id: `turn-ai-${Date.now()}`,
        speaker: 'ai',
        speakerName: scenario.partnerName.split(' ')[0] || 'Tutor',
        avatar: scenario.partnerAvatar,
        text: response.tutorReply,
        time: aiTime,
        contextTranslation: response.translation
      };

      setDialogue((prev) => [...prev, aiTurn]);

      if (response.nuanceTip) {
        setNuanceTips((prev) => [response.nuanceTip!, ...prev.slice(0, 3)]);
      }

      if (response.highlightWord) {
        setInspectedWord({
          word: response.highlightWord.word,
          ipa: response.highlightWord.ipa,
          pos: response.highlightWord.pos,
          def: response.highlightWord.def,
          saved: false
        });
      }

      // Automatically speak the tutor reply
      const rate = speechPace === '0.8x Slow' ? 0.8 : speechPace === '1.2x Native' ? 1.2 : 1.0;
      speechService.speak(response.tutorReply, rate, scenario.speechLang || 'fr-FR');
    }, 1100);
  };

  const handlePromptClick = (prompt: QuickPrompt) => {
    handleUserUtterance(prompt.targetText || prompt.french || '');
  };

  const handleTypedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedInput.trim()) return;
    handleUserUtterance(typedInput.trim());
    setTypedInput('');
  };

  const handleSaveInspectedToVault = () => {
    const newVocab: VocabularyItem = {
      id: `vault-${Date.now()}`,
      word: inspectedWord.word,
      ipa: inspectedWord.ipa,
      pos: inspectedWord.pos,
      meaning: inspectedWord.def,
      contextQuote: `« ...${inspectedWord.word}... »`,
      highlightInQuote: inspectedWord.word,
      scenarioOrigin: scenario.title,
      scenarioIcon: 'storefront',
      retentionPercent: 90,
      status: 'learning',
      lastPracticed: 'Today'
    };

    onSaveToVault(newVocab);
    setInspectedWord((prev) => ({ ...prev, saved: true }));
    setSavedWordFeedback('Saved to your Vocabulary Vault!');
    try {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
    } catch (e) {
      // ignore
    }
    setTimeout(() => setSavedWordFeedback(null), 3000);
  };

  const cycleSpeed = () => {
    if (speechPace === '1.0x Pace') setSpeechPace('0.8x Slow');
    else if (speechPace === '0.8x Slow') setSpeechPace('1.2x Native');
    else setSpeechPace('1.0x Pace');
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Session Breadcrumb & Quick Controls */}
      <section className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 mb-2 border-b border-[#e3e2e0]">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="text-[11px] uppercase tracking-widest text-[#4f6359] px-2.5 py-1 rounded-full bg-[#efeeeb] font-bold">
            Acoustic Session #482
          </span>
          <span className="w-1 h-1 rounded-full bg-[#c2c8c4]"></span>
          <div className="flex items-center gap-1.5 text-[#424845] text-xs sm:text-sm font-mono">
            <span className="material-symbols-outlined text-sm">schedule</span>
            <span>{formatTimer(sessionSeconds)}</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-[#c2c8c4]"></span>
          <span className="flex items-center gap-1.5 text-xs text-[#4f6359] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#4f6359] animate-pulse"></span>
            Ultra-Low Latency (118ms)
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={cycleSpeed}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#efeeeb] hover:bg-[#e9e8e5] text-xs font-semibold text-[#1a1c1a] transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-base">speed</span>
            <span>{speechPace}</span>
          </button>

          <button
            onClick={() => setHintsOn(!hintsOn)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              hintsOn ? 'bg-[#cfe5d9] text-[#1f332d]' : 'bg-[#efeeeb] text-[#424845]'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-base">translate</span>
            <span>Hints {hintsOn ? 'On' : 'Off'}</span>
          </button>

          <button
            onClick={() => onEndSession(Math.round(sessionSeconds / 60), 85)}
            className="px-3.5 py-1.5 rounded-lg bg-[#efeeeb] hover:bg-[#ffdad6] hover:text-[#93000a] text-[#424845] transition-colors text-xs font-semibold flex items-center gap-1"
            type="button"
          >
            <span className="material-symbols-outlined text-base">close</span>
            <span>End Session</span>
          </button>
        </div>
      </section>

      {/* Main Grid: 8 cols Left Stage / 4 cols Right Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full items-start">
        {/* LEFT STAGE: Roleplay Canvas & Speech Thread (8 cols) */}
        <div className="xl:col-span-8 flex flex-col gap-5 min-w-0">
          {/* Scenario Banner Card */}
          <div className="w-full bg-white rounded-xl p-5 shadow-xs border border-[#e3e2e0] relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0">
                  <img
                    src={scenario.partnerAvatar}
                    alt={scenario.partnerName}
                    className="w-14 h-14 rounded-full object-cover shadow-xs ring-2 ring-[#e3e2e0]"
                  />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#4f6359] ring-2 ring-white"></span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-serif text-xl font-medium text-[#1f332d] tracking-tight">
                      {scenario.partnerName}
                    </h2>
                    <span className="text-xs text-[#424845]">· {scenario.partnerRole}</span>
                    <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-[#d2e7dc] text-[#0d1f18] font-bold tracking-wide">
                      {scenario.level}
                    </span>
                  </div>
                  <p className="text-xs text-[#424845] mt-1">
                    <span className="font-semibold text-[#1a1c1a]">Active Scenario:</span> {scenario.title} ({scenario.location})
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:items-end justify-center bg-[#f4f3f0] px-4 py-2.5 rounded-lg max-w-sm border border-[#e3e2e0]">
                <div className="flex items-center gap-1.5 text-[#4f6359]">
                  <span className="material-symbols-outlined text-sm">flag</span>
                  <span className="text-[10px] uppercase tracking-wider font-bold">Mission Target</span>
                </div>
                <span className="text-xs text-[#1a1c1a] text-left md:text-right font-medium leading-snug mt-0.5">
                  {scenario.missionTarget}
                </span>
              </div>
            </div>
          </div>

          {/* Expressive AI Partner Acoustic Presence Island */}
          <div className="w-full bg-gradient-to-b from-[#f4f3f0] to-[#efeeeb] rounded-xl p-6 shadow-xs border border-[#e3e2e0] flex flex-col items-center justify-center text-center relative overflow-hidden">
            {/* Waveform Visualizer */}
            <div className="flex items-center gap-1.5 mb-3.5 h-10">
              {waveFrequencies.map((h, idx) => (
                <span
                  key={idx}
                  className={`w-1 rounded-full transition-all duration-200 ${
                    idx % 2 === 0 ? 'bg-[#4f6359]' : 'bg-[#1f332d]'
                  }`}
                  style={{ height: `${Math.max(6, Math.min(36, h * 0.4))}px` }}
                ></span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#4f6359] text-base animate-spin" style={{ animationDuration: '4s' }}>
                graphic_eq
              </span>
              <span className="font-serif italic text-lg sm:text-xl text-[#1f332d]">
                {scenario.partnerName.split(' ')[0]} is listening intently...
              </span>
            </div>
            <p className="text-xs text-[#424845] mt-1">
              Acoustic pitch & liaison detection actively calibrated
            </p>
          </div>

          {/* Dialogue Conversation Stream */}
          <div className="flex flex-col gap-5 py-2">
            {dialogue.map((turn) => {
              const isAi = turn.speaker === 'ai';
              return (
                <div
                  key={turn.id}
                  className={`flex flex-col gap-1.5 max-w-2xl ${
                    isAi ? 'self-start' : 'self-end items-end'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isAi ? (
                      <>
                        <span className="font-serif italic text-xs text-[#4f6359] font-medium">
                          {turn.speakerName}
                        </span>
                        <span className="text-[11px] text-[#727875]">{turn.time}</span>
                        <button
                          onClick={() => speechService.speak(turn.text, speechPace === '0.8x Slow' ? 0.8 : 1.0, scenario.speechLang || 'fr-FR')}
                          className="text-[#4f6359] hover:text-[#1f332d] transition-colors p-0.5"
                          title="Replay natural audio"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-base">volume_up</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => speechService.speak(turn.text, 1.0, scenario.speechLang || 'fr-FR')}
                          className="text-[#4f6359] hover:text-[#1f332d] transition-colors p-0.5"
                          title="Replay speech"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-base">volume_up</span>
                        </button>
                        <span className="text-[11px] text-[#727875]">{turn.time}</span>
                        <span className="text-xs font-bold text-[#1f332d]">You</span>
                      </>
                    )}
                  </div>

                  <div
                    className={`p-5 rounded-2xl shadow-xs leading-relaxed ${
                      isAi
                        ? 'bg-white text-[#1a1c1a] border border-[#e3e2e0]'
                        : 'bg-[#1f332d] text-white border border-[#1f332d]'
                    }`}
                  >
                    <p className="text-base sm:text-lg">
                      {isAi ? (
                        turn.text.includes('chausson aux pommes') ? (
                          <>
                            « Ah, tout juste sorties du four ! Nous avons notre fameux{' '}
                            <button
                              type="button"
                              onClick={() =>
                                setInspectedWord({
                                  word: 'chausson aux pommes',
                                  ipa: '/ʃo.sɔ̃ o pɔm/',
                                  pos: 'noun, masc.',
                                  def: 'Traditional golden puff pastry turnover with spiced compote',
                                  saved: false
                                })
                              }
                              className="bg-[#cfe5d9] text-[#54675e] px-2 py-0.5 rounded-md font-medium hover:bg-[#b6cbc0] transition-colors"
                            >
                              chausson aux pommes
                            </button>{' '}
                            à la cannelle et une brioche feuilletée aux éclats de pistache. Avec ceci, un café filtre ou une boisson lactée ? »
                          </>
                        ) : (
                          turn.text
                        )
                      ) : (
                        turn.text
                      )}
                    </p>

                    {/* Learner telemetry indicators */}
                    {!isAi && (turn.pacingWpm || turn.pronunciationScore) && (
                      <div className="mt-3 flex items-center justify-between text-[#b4ccc2] text-xs pt-2 border-t border-white/10">
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs text-[#d2e7dc]">check_circle</span>
                          Pacing: {turn.pacingWpm || 134} wpm (Fluid)
                        </span>
                        <span className="font-semibold text-[#d2e7dc]">
                          Pronunciation: {turn.pronunciationScore || 94}%
                        </span>
                      </div>
                    )}

                    {/* Inline translation hints for AI turns */}
                    {isAi && hintsOn && turn.contextTranslation && (
                      <div className="mt-3 pt-3 flex flex-col gap-1 bg-[#f4f3f0]/70 rounded-lg p-3 text-xs border border-[#e3e2e0]">
                        <div className="flex items-center gap-1.5 text-[#4f6359] uppercase font-bold text-[10px]">
                          <span className="material-symbols-outlined text-sm">lightbulb</span>
                          <span>Context Translation</span>
                        </div>
                        <span className="italic text-[#424845]">"{turn.contextTranslation}"</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />

            {/* Dynamic Word Inspector Popover Card */}
            {inspectedWord && (
              <div className="p-4 bg-[#f4f3f0] rounded-xl flex items-center justify-between border border-[#e3e2e0] mt-1 shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#e3e2e0] text-[#4f6359]">
                    <span className="material-symbols-outlined text-lg">auto_stories</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-[#1f332d]">{inspectedWord.word}</span>
                      <span className="text-xs text-[#727875] font-mono">{inspectedWord.ipa}</span>
                      <span className="text-[10px] text-[#4f6359] font-medium uppercase">{inspectedWord.pos}</span>
                    </div>
                    <span className="text-xs text-[#424845] mt-0.5">{inspectedWord.def}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {savedWordFeedback && (
                    <span className="text-xs text-emerald-800 font-bold hidden sm:inline">
                      {savedWordFeedback}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleSaveInspectedToVault}
                    disabled={inspectedWord.saved}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                      inspectedWord.saved
                        ? 'bg-emerald-800 text-white'
                        : 'bg-white text-[#1f332d] hover:bg-[#e9e8e5] border border-[#e3e2e0]'
                    }`}
                  >
                    {inspectedWord.saved ? 'Saved ✓' : 'Save to Vault'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Active Audio Capture & Bottom Voice Controls Bar */}
          <div className="w-full bg-white rounded-2xl p-4 shadow-md border border-[#e3e2e0] flex flex-col gap-3 sticky bottom-4 z-20">
            <div className="flex items-center justify-between gap-4">
              {/* Audio Settings info */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => speechService.speak('Audio Test', 1.0, scenario.speechLang || 'fr-FR')}
                  className="p-2.5 rounded-full bg-[#efeeeb] hover:bg-[#e9e8e5] text-[#424845] transition-colors"
                  title="Audio Test"
                  type="button"
                >
                  <span className="material-symbols-outlined text-xl">mic</span>
                </button>
                <div className="hidden sm:flex flex-col">
                  <span className="text-xs font-bold text-[#1a1c1a]">Built-in Studio Mic</span>
                  <span className="text-[11px] text-[#4f6359]">{scenario.language || 'Acoustic'} Calibrated</span>
                </div>
              </div>

              {/* Pulsing Core Mic Trigger Button */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={isListening ? handleStopSpeech : handleStartSpeech}
                  className="relative group flex items-center justify-center cursor-pointer"
                >
                  {isListening && (
                    <span className="absolute w-16 h-16 rounded-full bg-[#cfe5d9] animate-ping pointer-events-none"></span>
                  )}
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 ${
                      isListening ? 'bg-red-700 animate-pulse' : 'bg-[#354a43] hover:bg-[#1f332d]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl">
                      {isListening ? 'stop' : 'mic'}
                    </span>
                  </div>
                </button>

                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-[#1f332d]">
                    {isListening ? 'Listening...' : 'Ready to Speak'}
                  </span>
                  <span className="text-xs text-[#424845]">
                    Press <kbd className="px-1.5 py-0.5 bg-[#efeeeb] rounded font-mono text-[10px] text-[#1a1c1a] border border-[#e3e2e0]">Space</kbd> or speak naturally
                  </span>
                </div>
              </div>

              {/* Fast Action: What to say? */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleUserUtterance(quickPrompts[0]?.french || '« Hello »')}
                  className="px-3 py-2 rounded-lg bg-[#efeeeb] hover:bg-[#e9e8e5] text-[#1f332d] text-xs font-bold transition-colors flex items-center gap-1.5"
                  title="Get inspiration on what to say next"
                >
                  <span className="material-symbols-outlined text-base">psychology</span>
                  <span className="hidden md:inline">What to say?</span>
                </button>
              </div>
            </div>

            {/* Quick Text Fallback Input Bar */}
            <form onSubmit={handleTypedSubmit} className="w-full flex items-center gap-2 pt-1 bg-[#f4f3f0] rounded-xl px-3 py-1.5 border border-[#e3e2e0]">
              <span className="material-symbols-outlined text-[#727875] text-lg">keyboard</span>
              <input
                type="text"
                value={typedInput}
                onChange={(e) => setTypedInput(e.target.value)}
                placeholder={`Or type your response in ${scenario.language || 'the target language'}...`}
                className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-[#1a1c1a] placeholder:text-[#727875]"
              />
              <button
                type="submit"
                className="p-1.5 rounded-lg bg-[#354a43] text-white hover:bg-[#1f332d] transition-colors"
                title="Send speech"
              >
                <span className="material-symbols-outlined text-base">arrow_upward</span>
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT STAGE: Live Real-Time Pedagogical Assistant Panel (4 cols) */}
        <div className="xl:col-span-4 flex flex-col gap-5 min-w-0">
          {/* Real-Time Nuance Feedback Radar */}
          <div className="w-full bg-white rounded-xl p-5 shadow-xs border border-[#e3e2e0] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#613e19] text-xl">auto_fix_high</span>
                <h3 className="font-serif text-lg text-[#1f332d]">Live Nuance Feedback</h3>
              </div>
              <span className="text-[10px] uppercase font-bold text-[#4f6359] bg-[#d2e7dc] px-2 py-0.5 rounded-full">
                Real-Time
              </span>
            </div>

            {/* Nuance Cards */}
            {nuanceTips.map((tip) => (
              <div key={tip.id} className="bg-[#f4f3f0] p-3.5 rounded-xl flex flex-col gap-2 border border-[#e3e2e0]/60">
                <div className="flex items-center gap-1.5 text-[#613e19]">
                  <span className="material-symbols-outlined text-base">
                    {tip.type === 'grammar' ? 'check_circle' : 'recommend'}
                  </span>
                  <span className="text-xs font-bold text-[#1f332d]">{tip.title}</span>
                </div>
                <p className="text-xs text-[#1a1c1a] leading-normal">{tip.description}</p>
                {tip.recommendedPhrase && (
                  <div className="bg-white p-2.5 rounded-lg flex items-center justify-between border border-[#e3e2e0]">
                    <span className="text-xs font-bold text-[#1f332d]">{tip.recommendedPhrase}</span>
                    <button
                      type="button"
                      onClick={() => speechService.speak(tip.recommendedPhrase!, 1.0, scenario.speechLang || 'fr-FR')}
                      className="text-[#4f6359] hover:text-[#1f332d]"
                      title="Hear native pronunciation"
                    >
                      <span className="material-symbols-outlined text-base">volume_up</span>
                    </button>
                  </div>
                )}
                {tip.note && (
                  <span className="text-[11px] text-[#424845] italic">{tip.note}</span>
                )}
              </div>
            ))}
          </div>

          {/* Suggested Next Utterances & Contextual Vocabulary */}
          <div className="w-full bg-white rounded-xl p-5 shadow-xs border border-[#e3e2e0] flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1f332d] text-xl">forum</span>
                <h3 className="font-serif text-lg text-[#1f332d]">Quick Speaking Prompts</h3>
              </div>
              <span className="text-xs text-[#727875]">Tap to Speak</span>
            </div>
            <p className="text-xs text-[#424845]">
              Tap any target expression to auto-compose or guide your response:
            </p>

            <div className="flex flex-col gap-2.5">
              {quickPrompts.map((qp) => (
                <button
                  key={qp.id}
                  onClick={() => handlePromptClick(qp)}
                  className="w-full text-left p-3 rounded-xl bg-[#f4f3f0] hover:bg-[#efeeeb] transition-all flex items-center justify-between group border border-[#e3e2e0]/60"
                  type="button"
                >
                  <div className="flex flex-col pr-2">
                    <span className="text-xs font-bold text-[#1a1c1a] group-hover:text-[#1f332d]">
                      {qp.targetText || qp.french}
                    </span>
                    <span className="text-[11px] text-[#727875]">{qp.english}</span>
                  </div>
                  <span className="material-symbols-outlined text-[#727875] group-hover:text-[#1f332d] transition-colors text-lg shrink-0">
                    mic
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Fluency Flow & Speech Ergonomics Meter */}
          <div className="w-full bg-white rounded-xl p-5 shadow-xs border border-[#e3e2e0] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4f6359] text-xl">speed</span>
                <h3 className="font-serif text-lg text-[#1f332d]">Acoustic Cadence</h3>
              </div>
              <span className="text-xs font-bold text-[#4f6359]">Optimal</span>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#424845] font-medium">Conversational Turn Delay</span>
                  <span className="font-bold text-[#1f332d]">0.9s (Native: 0.8–1.2s)</span>
                </div>
                <div className="w-full h-2 bg-[#e3e2e0] rounded-full overflow-hidden">
                  <div className="h-full bg-[#4f6359] rounded-full w-[85%]"></div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#424845] font-medium">Prosody &amp; {scenario.language || 'French'} Intonation</span>
                  <span className="font-bold text-[#1f332d]">88 / 100</span>
                </div>
                <div className="w-full h-2 bg-[#e3e2e0] rounded-full overflow-hidden">
                  <div className="h-full bg-[#354a43] rounded-full w-[88%]"></div>
                </div>
              </div>
            </div>

            {/* Sparkline Chart */}
            <div className="pt-2 flex flex-col gap-1 border-t border-[#efeeeb]">
              <div className="flex items-center justify-between text-[11px] text-[#727875]">
                <span>Speech flow stability (last 5 min)</span>
                <span>Steady</span>
              </div>
              <svg className="w-full h-10 text-[#4f6359]" fill="none" viewBox="0 0 300 48">
                <path
                  d="M0 32C30 32 45 16 75 18C105 20 120 38 150 24C180 10 200 30 230 18C260 6 280 20 300 14"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M0 32C30 32 45 16 75 18C105 20 120 38 150 24C180 10 200 30 230 18C260 6 280 20 300 14V48H0V32Z"
                  fill="currentColor"
                  fillOpacity="0.08"
                />
              </svg>
            </div>
          </div>

          {/* Cultural Etiquette Note */}
          <div className="w-full rounded-xl bg-[#f4f3f0] p-4 flex items-center gap-3 border border-[#e3e2e0]">
            <span className="material-symbols-outlined text-[#4f6359] text-2xl">school</span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#1f332d]">Cultural Nuance &amp; Etiquette</span>
              <span className="text-xs text-[#424845]">
                {scenario.culturalNuance ||
                  `In ${scenario.language || 'language learning'}, respectful phrasing and natural cadence make all the difference.`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
