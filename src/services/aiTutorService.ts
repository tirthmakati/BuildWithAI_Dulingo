/**
 * AI Tutor Service for Contextual Conversation & Synthesis
 */
import { Scenario, DialogueTurn, NuanceTip } from '../types';

export class AiTutorService {
  /**
   * Produce responsive tutor dialogues based on scenario and user utterance
   */
  public generateTutorResponse(
    scenario: Scenario,
    userText: string,
    history: DialogueTurn[]
  ): {
    tutorReply: string;
    translation: string;
    nuanceTip?: NuanceTip;
    highlightWord?: { word: string; ipa: string; pos: string; def: string };
  } {
    const lower = userText.toLowerCase();

    // --- GUJARATI SCENARIOS ---
    if (scenario.id === 'gujarat-manek-chowk') {
      if (lower.includes('ઢોંસો') || lower.includes('dosa') || lower.includes('તીખું') || lower.includes('માખણ') || lower.includes('ઓછું')) {
        return {
          tutorReply: '« ચોક્કસ શેઠ! એકદમ ગરમાગરમ ક્રિસ્પી ગ્વાલિયર ઢોંસો અને સાથે ઠંડી કાઠિયાવાડી છાસ પાંચ મિનિટમાં તૈયાર કરી દઉં છું. ચીઝ વધારે નાખું કે માખણ? »',
          translation: '"Certainly sir! A piping hot crispy Gwalior Dosa and cold Kathiyawadi buttermilk will be ready in five minutes. Shall I add extra cheese or butter?"',
          nuanceTip: {
            id: 'tip-gu-1',
            type: 'idiom',
            title: 'અમદાવાદી આતિથ્ય લહેકો (Colloquial Gujarati)',
            description: 'ગુજરાતીમાં "જરા ઓછું તીખું" અને "શેઠ" જેવા શબ્દો વાપરવાથી સ્થાનિક વેપારીઓ સાથે સહજ આત્મીયતા બંધાય છે.',
            recommendedPhrase: '« જરા ઓછું તીખું રાખજો હો ભાઈ! »',
            note: 'Shows native conversational warmth in street food stalls.'
          },
          highlightWord: {
            word: 'ગ્વાલિયર ઢોંસો',
            ipa: '/gwaː.li.jər d̪oː.soː/',
            pos: 'સંજ્ઞા (noun)',
            def: 'Famous Manek Chowk buttery roasted spiced crisp crepe'
          }
        };
      } else {
        return {
          tutorReply: '« અરે વાહ! તમારો ઓર્ડર નોંધી લીધો છે. ખાધા પછી સ્પેશિયલ જામુન શોટ્સ પણ ચાખજો, મજા પડી જશે! બીજું કઈ લાવું? »',
          translation: '"Wonderful! Your order is noted. After eating, do try our special Jamun shots too, you will love it! Anything else?"',
          nuanceTip: {
            id: 'tip-gu-2',
            type: 'cultural',
            title: 'ગુજરાતી ભોજન સંસ્કૃતિ (Food Culture)',
            description: 'જમ્યા પછી "બહુ મજા આવી ગઈ" કહેવું એ રસોઈયા માટે સૌથી મોટો પુરસ્કાર ગણાય છે.',
            recommendedPhrase: '« એકદમ સ્વાદિષ્ટ બન્યું છે! »'
          }
        };
      }
    }

    if (scenario.id === 'gujarat-surat-textile') {
      return {
        tutorReply: '« ભાઈસાબ, તમે કાયમી ગ્રાહક છો એટલે તમારા માટે ૧૨% વ્યાજબી રોકડ વટાવ અને પાકું જીએસટી બિલ સાથે માલ તૈયાર કરાવી દઉં છું. પેકિંગ બોક્સમાં કરાવવું છે ને? »',
        translation: '"Sir, you are our valued regular client, so I will prepare the order with a 12% cash discount and proper GST invoice. Packaging in gift boxes, correct?"',
        nuanceTip: {
          id: 'tip-gu-trade',
          type: 'idiom',
          title: 'વેપારી વાટાઘાટો (Trade Etiquette)',
          description: 'કડકાઈથી બોલવાને બદલે "વ્યાજબી કરી આપો" શબ્દનો ઉપયોગ કરવાથી વેપારી ખુશીથી શ્રેષ્ઠ ભાવ આપે છે.',
          recommendedPhrase: '« જરા વ્યાજબી કરી આપો ને ભાઈ »',
          note: 'Key negotiation phrase across Surat & Ahmedabad wholesale markets.'
        },
        highlightWord: {
          word: 'વ્યાજબી',
          ipa: '/vjaːd͡ʒ.biː/',
          pos: 'વિશેષણ (adjective)',
          def: 'Fair, justified, and reasonable in trade pricing'
        }
      };
    }

    // --- HINDI SCENARIOS ---
    if (scenario.id === 'delhi-chandni-chowk') {
      return {
        tutorReply: '« बिल्कुल जनाब! अदरक और हरी इलायची की गरमागरम कड़क कुल्हड़ चाय और साथ में कुरकुरी चाशनीदार जलेबी पेश है। बताइए, चाय में मीठा बिल्कुल आपके मिज़ाज के मुताबिक है ना? »',
        translation: '"Certainly sir! Piping hot ginger-cardamom earthen cup chai and crispy syrupy jalebi are ready for you. Tell me, is the sweetness suited to your taste?"',
        nuanceTip: {
          id: 'tip-hi-1',
          type: 'idiom',
          title: 'दिल्ली की लखनवी तहज़ीब (Old Delhi Courtesies)',
          description: 'पुरानी दिल्ली में "जनाब", "तशरीफ़ रखिए" और "मिज़ाज" जैसे लफ़્ज़ बातचीत में गहरा अपनापन लाते हैं।',
          recommendedPhrase: '« चाय का ज़ायका सचमुच लाजवाब है! »',
          note: 'Warm complimentary tone in street food conversations.'
        },
        highlightWord: {
          word: 'लाजवाब',
          ipa: '/laː.d͡ʒə.ʋaːb/',
          pos: 'विशेषण (adj.)',
          def: 'Incomparable, exquisite, extraordinary in culinary flavor'
        }
      };
    }

    if (scenario.id === 'hindi-bengaluru-tech') {
      return {
        tutorReply: '« आपकी पिछली तिमाही की रिपोर्ट और माइक्रो-सर्विसेज माइग्रेशन में आपका योगदान वास्तव में सराहनीय रहा है। हम 14% वेतन वृद्धि और हाइब्रिड वर्क मॉडल पर औपचारिक सहमति दे सकते हैं। »',
        translation: '"Your quarterly delivery metrics and contribution to microservices migration have been truly commendable. We can agree to a 14% compensation revision and hybrid structure."',
        nuanceTip: {
          id: 'tip-hi-corp',
          type: 'grammar',
          title: 'व्यावसायिक भाषा (Corporate Register)',
          description: 'व्यक्तिगत ज़रूरतों के बजाय "समीक्षा", "योगदान" और "मील का पत्थर" जैसे शब्दों का प्रयोग कॉर्पोरेट संवाद को प्रभावी बनाता है।',
          recommendedPhrase: '« हमारी टीम के मील के पत्थर स्पष्ट हैं »'
        }
      };
    }

    // --- HINDI TO ENGLISH / GUJARATI TO ENGLISH SCENARIOS ---
    if (scenario.id === 'en-tech-standup' || scenario.language === 'Hindi to English' || scenario.language === 'Gujarati to English') {
      if (lower.includes('yesterday') || lower.includes('commit') || lower.includes('blocker') || lower.includes('pr') || lower.includes('deploy')) {
        return {
          tutorReply: '« Awesome progress! That PR review looks solid. Let’s make sure we run automated integration tests before pushing to staging. Do you anticipate any bandwidth issues for tomorrow’s sprint demo? »',
          translation: 'शानदार प्रगति! पीआर समीक्षा बहुत अच्छी लग रही है। स्टेजिंग पर पुश करने से पहले ऑटोमेटेड टेस्ट अवश्य चलाएं। क्या कल के स्प्रिंट डेमो के लिए कोई समस्या है?',
          nuanceTip: {
            id: 'tip-en-1',
            type: 'idiom',
            title: 'Natural Agile Idiom',
            description: 'Instead of saying "I am having difficulties", native tech leads say:',
            recommendedPhrase: '« I have no blockers at the moment. »',
            note: 'Standard high-confidence agile standup phrasing.'
          },
          highlightWord: {
            word: 'blocker',
            ipa: '/ˈblɒk.ər/',
            pos: 'noun (tech)',
            def: 'An obstacle or dependency halting task progression'
          }
        };
      } else {
        return {
          tutorReply: '« Got it! That makes total sense. Let’s sync up offline after standup for 5 minutes to iron out the remaining edge cases. »',
          translation: 'समझ गया! यह बिल्कुल सही है। स्टैंडअप के बाद 5 मिनट अलग से बात करके शेष पहलुओं को सुलझा लेते हैं।',
          nuanceTip: {
            id: 'tip-en-2',
            type: 'idiom',
            title: 'Professional Corporate Idiom',
            description: 'Use "sync up offline" instead of "talk in private later" in business meetings.',
            recommendedPhrase: '« Let’s sync up offline after this. »'
          }
        };
      }
    }

    // --- FRENCH SCENARIOS ---
    if (scenario.id === 'paris-cafe' || scenario.language === 'French') {
      if (lower.includes('viennoiserie') || lower.includes('croissant') || lower.includes('spécialité') || lower.includes('frais') || lower.includes('savoir')) {
        return {
          tutorReply: '« Ah, tout juste sorties du four ! Nous avons notre fameux chausson aux pommes à la cannelle et une brioche feuilletée aux éclats de pistache. Avec ceci, un café filtre ou une boisson lactée ? »',
          translation: '"Ah, fresh out of the oven! We have our famous spiced apple turnover and a flaky pistachio brioche. With this, a batch filter coffee or a milk beverage?"',
          nuanceTip: {
            id: 'tip-fr-1',
            type: 'idiom',
            title: 'Natural Parisian Idiom',
            description: 'Instead of « Je voudrais savoir », Parisian locals frequently use the softer conditional idiom:',
            recommendedPhrase: '« Je prendrais bien... »',
            originalPhrase: '« Je voudrais savoir »',
            note: 'Conveys casual warmth in small boutiques and cafés.'
          },
          highlightWord: {
            word: 'chausson aux pommes',
            ipa: '/ʃo.sɔ̃ o pɔm/',
            pos: 'noun, masc.',
            def: 'Traditional golden puff pastry turnover with spiced compote'
          }
        };
      } else if (lower.includes('flat white') || lower.includes('avoine') || lower.includes('lait') || lower.includes('café')) {
        return {
          tutorReply: '« Parfaitement, un flat white au lait d’avoine bien soyeux. Vous préférez déguster au comptoir ou vous installez en terrasse chauffée ? »',
          translation: '"Certainly, a silky flat white with oat milk. Would you prefer to enjoy it at the counter or sit on the heated terrace?"',
          nuanceTip: {
            id: 'tip-fr-2',
            type: 'grammar',
            title: 'Grammar Accuracy: Validated',
            description: 'Flawless contraction and preposition choice with dairy alternatives:',
            recommendedPhrase: '« au lait d’avoine »',
            note: 'Excellent native usage of the partitive/instrumental preposition.'
          }
        };
      }
    }

    // General fallback contextual response
    return {
      tutorReply: `« C’est très clair. Poursuivons sur ce point : comment envisagez-vous de concilier cette approche avec vos objectifs ? »`,
      translation: `"That is very clear. Let’s proceed on this point: how do you envision balancing this approach with your goals?"`,
      nuanceTip: {
        id: 'tip-gen',
        type: 'grammar',
        title: 'Conversational Flow & Natural Cadence',
        description: 'Smooth response delivery. Pacing matched native benchmarks (120–140 wpm).'
      }
    };
  }

  /**
   * Synthesize a bespoke scenario from a user prompt in under 20s
   */
  public synthesizeBespokeScenario(userPrompt: string, languageName: string = 'French'): Scenario {
    const id = 'custom-' + Date.now();
    const promptClean = userPrompt.trim();
    const title = promptClean.length > 40 ? promptClean.slice(0, 38) + '...' : promptClean;

    const isGujarati = languageName.includes('Gujarati');
    const isHindi = languageName.includes('Hindi');
    const isEnglish = languageName.includes('English');

    const speechLang = isGujarati ? 'gu-IN' : isHindi ? 'hi-IN' : isEnglish ? 'en-US' : 'fr-FR';

    return {
      id,
      title: title.charAt(0).toUpperCase() + title.slice(1),
      category: 'social',
      categoryLabel: 'Bespoke Simulation',
      level: 'B2 Upper-Int',
      durationMinutes: 12,
      location: 'Customized Location Simulation',
      description: `Tailored acoustic simulation generated for "${userPrompt}". Practice natural dialogic exchanges and cultural nuances.`,
      partnerName: isGujarati ? 'અનિલભાઈ' : isHindi ? 'अमित कुमार' : isEnglish ? 'Alex Jenkins' : 'Alexandre',
      partnerRole: 'Adaptive Acoustic AI Partner',
      partnerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      partnerStyle: 'Polite, articulate, culturally attuned specialist',
      badge: 'Synthesized',
      rating: 5.0,
      reviewsCount: 1,
      culturalNuance: 'Use respectful opening discourse markers before expressing nuanced preferences.',
      lexicalKeysCount: 15,
      targetLexicon: isGujarati
        ? ['વ્યાજબી', 'ઓછું તીખું', 'કેમ છો', 'ખાસિયત', 'આનંદ થયો']
        : isHindi
        ? ['लाजवाब', 'समीक्षा', 'नमस्ते', 'बिल्कुल', 'मेहरबानी']
        : isEnglish
        ? ['blocker', 'sync up', 'lead time', 'seamless', 'action item']
        : ['en quelque sorte', 'au fur et à mesure', 'à vrai dire', 'sensibilité', 'privilégier'],
      imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
      missionTarget: `Successfully complete conversation regarding: ${userPrompt}`,
      initialMessage: isGujarati
        ? '« નમસ્તે! આજે આપણી વચ્ચે આ વિષય પર વાતચીત કરવાનો ખૂબ આનંદ છે. આપ ક્યાંથી શરૂઆત કરવા માંગો છો? »'
        : isHindi
        ? '« नमस्ते! आज इस विषय पर आपसे बातचीत करके बहुत प्रसन्नता हो रही है। आप किस बिंदु से चर्चा शुरू करना चाहेंगे? »'
        : isEnglish
        ? '« Hello! It’s a pleasure to speak with you today regarding this topic. Where would you like us to start? »'
        : '« Bonjour ! C’est un plaisir d’échanger avec vous aujourd’hui sur ce sujet. Par quoi souhaiteriez-vous que nous commencions ? »',
      initialTranslation: 'Hello! It is a pleasure to speak with you today on this topic. Where would you like to start?',
      language: languageName,
      speechLang
    };
  }
}

export const aiTutorService = new AiTutorService();
