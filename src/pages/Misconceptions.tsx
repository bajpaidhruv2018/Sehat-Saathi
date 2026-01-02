import { useState } from "react";
import { Card } from "@/components/ui/card";
import { XCircle, CheckCircle, Droplet, ThermometerSun, Syringe, Baby, Hospital, Brain, Pill, Users, Glasses, Sun, Activity, AlertTriangle } from "lucide-react";
import { AudioIcon } from "@/components/ui/AudioIcon";

import { useTranslation } from "react-i18next";

interface Misconception {
  id: number;
  icon: typeof Syringe;
  mythEn?: string;
  mythHi?: string;
  factEn?: string;
  factHi?: string;
  tipEn?: string;
  tipHi?: string;
  videoUrl: string;
}

const misconceptions: Misconception[] = [
  {
    id: 1,
    icon: Syringe,
    mythEn: "Vaccines cause illness.",
    mythHi: "टीके लगवाने से बीमारियाँ होती हैं।",
    factEn: "Vaccines protect you and your family from serious diseases.",
    factHi: "टीके आपको और आपके परिवार को गंभीर बीमारियों से बचाते हैं।",
    tipEn: "Vaccines contain weakened or inactive parts of a disease that trigger your body's immune response. They are safe and prevent serious illnesses like polio, measles, and tetanus.",
    tipHi: "टीकों में रोग के कमजोर या निष्क्रिय भाग होते हैं जो शरीर की प्रतिरक्षा प्रणाली को सक्रिय करते हैं। ये सुरक्षित हैं और पोलियो, खसरा और टिटनेस जैसी गंभीर बीमारियों से बचाते हैं।",
    videoUrl: "https://www.youtube.com/watch?v=zBkVCpbNnkU",
  },
  {
    id: 2,
    icon: Baby,
    mythEn: "Pregnant women should eat less.",
    mythHi: "गर्भवती महिलाओं को कम खाना चाहिए।",
    factEn: "They should eat nutritious food for their health and baby's growth.",
    factHi: "उन्हें पौष्टिक भोजन करना चाहिए ताकि माँ और बच्चे दोनों स्वस्थ रहें।",
    tipEn: "Pregnant women need extra nutrients including iron, folic acid, and calcium. Eating balanced meals helps ensure a healthy pregnancy and baby development.",
    tipHi: "गर्भवती महिलाओं को आयरन, फोलिक एसिड और कैल्शियम जैसे अतिरिक्त पोषक तत्वों की आवश्यकता होती है। संतुलित भोजन स्वस्थ गर्भावस्था और बच्चे के विकास को सुनिश्चित करता है।",
    videoUrl: "https://www.youtube.com/watch?v=dNjdZu8DOz0",
  },
  {
    id: 3,
    icon: Droplet,
    mythEn: "Boiled water is bad for health.",
    mythHi: "उबला हुआ पानी नुकसानदायक होता है।",
    factEn: "Boiling kills germs and makes water safe to drink.",
    factHi: "उबालने से कीटाणु मर जाते हैं और पानी पीने योग्य बनता है।",
    tipEn: "Boil water for at least 10-15 minutes to remove harmful bacteria, viruses, and parasites. This simple method prevents waterborne diseases like diarrhea and cholera.",
    tipHi: "हानिकारक बैक्टीरिया, वायरस और परजीवियों को मारने के लिए पानी को कम से कम 10-15 मिनट तक उबालें। यह सरल तरीका दस्त और हैजा जैसी जल जनित बीमारियों को रोकता है।",
    videoUrl: "https://www.youtube.com/watch?v=d6cckvSxNfA",
  },
  {
    id: 4,
    icon: ThermometerSun,
    mythEn: "Fever should not be treated with cold water.",
    mythHi: "बुखार में ठंडा पानी नहीं लगाना चाहिए।",
    factEn: "Cold compress helps reduce fever safely.",
    factHi: "ठंडा पानी बुखार को कम करने में मदद करता है।",
    tipEn: "Use a clean cloth soaked in room temperature or slightly cool water on the forehead. This helps bring down body temperature naturally. Avoid ice-cold water as it may cause shivering.",
    tipHi: "माथे पर कमरे के तापमान या थोड़े ठंडे पानी में भीगे साफ कपड़े का उपयोग करें। यह शरीर के तापमान को स्वाभाविक रूप से कम करने में मदद करता है। बर्फ जैसा ठंडा पानी न लगाएं क्योंकि इससे कंपकंपी हो सकती है।",
    videoUrl: "https://www.youtube.com/watch?v=vLkTZZ6w6eM",
  },
  {
    id: 5,
    icon: Hospital,
    mythEn: "Only city hospitals provide good treatment.",
    mythHi: "सिर्फ शहर के अस्पताल ही अच्छा इलाज देते हैं।",
    factEn: "Government Primary Health Centres (PHCs) also give free, quality care.",
    factHi: "सरकारी प्राथमिक स्वास्थ्य केंद्र (PHC) भी मुफ्त और अच्छा इलाज देते हैं।",
    tipEn: "PHCs provide free medicines, vaccinations, maternal care, and basic treatments. ASHA workers and ANMs are trained to help with common health issues. Visit your nearest PHC for checkups.",
    tipHi: "PHC मुफ्त दवाएं, टीकाकरण, मातृ देखभाल और बुनियादी उपचार प्रदान करते हैं। आशा कार्यकर्ता और ANM सामान्य स्वास्थ्य समस्याओं में मदद के लिए प्रशिक्षित हैं। जांच के लिए अपने निकटतम PHC पर जाएं।",
    videoUrl: "https://www.youtube.com/watch?v=YM8jR8VYjY0",
  },
  {
    id: 6,
    icon: Baby,
    mythEn: "Eating papaya during pregnancy causes miscarriage.",
    mythHi: "गर्भावस्था के दौरान पपीता खाने से गर्भपात होता है।",
    factEn: "Ripe papaya is safe and full of vitamins.",
    factHi: "पका हुआ पपीता सुरक्षित होता है और विटामिन से भरपूर होता है।",
    tipEn: "Fully ripe papaya is excellent for pregnant women as it contains Vitamin A and C. Avoid raw or semi-ripe papaya as it contains latex which might be harmful.",
    tipHi: "पूरी तरह से पका हुआ पपीता गर्भवती महिलाओं के लिए बहुत अच्छा होता है क्योंकि इसमें विटामिन ए और सी होता है। कच्चे या अधपके पपीते से बचें क्योंकि इसमें लैटेक्स होता है जो हानिकारक हो सकता है।",
    videoUrl: "https://www.youtube.com",
  },
  {
    id: 7,
    icon: Brain,
    mythEn: "Mental illness is caused by evil spirits.",
    mythHi: "मानसिक बीमारी बुरी आत्माओं के कारण होती है।",
    factEn: "It is a medical condition treatable by doctors.",
    factHi: "यह एक चिकित्सीय स्थिति है जिसका इलाज डॉक्टरों द्वारा किया जा सकता है।",
    tipEn: "Mental health issues are brain disorders, not supernatural events. Psychiatrists and psychologists can treat them with therapy and medication.",
    tipHi: "मानसिक स्वास्थ्य समस्याएं मस्तिष्क संबंधी विकार हैं, कोई अलौकिक घटना नहीं। मनोचिकितसक और मनोवैज्ञानिक चिकित्सा और दवा के साथ उनका इलाज कर सकते हैं।",
    videoUrl: "https://www.youtube.com",
  },
  {
    id: 8,
    icon: Pill,
    mythEn: "Antibiotics cure colds and flu.",
    mythHi: "एंटीबायोटिक्स सर्दी और फ्लू को ठीक करते हैं।",
    factEn: "Antibiotics only kill bacteria, not viruses.",
    factHi: "एंटीबायोटिक्स केवल बैक्टीरिया को मारते हैं, वायरस को नहीं।",
    tipEn: "Colds and flu are caused by viruses. Taking antibiotics for them won't help and can increase antibiotic resistance. Rest and hydration are best.",
    tipHi: "सर्दी और फ्लू वायरस के कारण होते हैं। उनके लिए एंटीबायोटिक लेने से कोई मदद नहीं मिलेगी और एंटीबायोटिक प्रतिरोध बढ़ सकता है। आराम और जलयोजन सबसे अच्छा है।",
    videoUrl: "https://www.youtube.com",
  },
  {
    id: 9,
    icon: Users,
    mythEn: "Men don't need to worry about family planning.",
    mythHi: "पुरुषों को परिवार नियोजन के बारे में चिंता करने की जरूरत नहीं है।",
    factEn: "Family planning is a shared responsibility.",
    factHi: "परिवार नियोजन एक साझा जिम्मेदारी है।",
    tipEn: "Men play a crucial role. Condoms are a safe, effective method of contraception that involves men and also protects against sexually transmitted infections.",
    tipHi: "पुरुष महत्वपूर्ण भूमिका निभाते हैं। कंडोम गर्भनिरोधक का एक सुरक्षित, प्रभावी तरीका है जिसमें पुरुष शामिल होते हैं और यौन संचारित संक्रमणों से भी बचाता है।",
    videoUrl: "https://www.youtube.com",
  },
  {
    id: 10,
    icon: Droplet,
    mythEn: "Drinking less water reduces swelling during pregnancy.",
    mythHi: "गर्भावस्था के दौरान कम पानी पीने से सूजन कम हो जाती है।",
    factEn: "Drinking enough water actually helps reduce swelling.",
    factHi: "पर्याप्त पानी पीने से वास्तव में सूजन कम करने में मदद मिलती है।",
    tipEn: "Staying hydrated helps flush out waste and prevents fluid retention. Pregnant women should drink 8-10 glasses of water daily.",
    tipHi: "हाइड्रेटेड रहने से अपशिष्ट को बाहर निकालने में मदद मिलती है और तरल प्रतिधारण को रोकता है। गर्भवती महिलाओं को रोजाना 8-10 गिलास पानी पीना चाहिए।",
    videoUrl: "https://www.youtube.com",
  },
  {
    id: 11,
    icon: Glasses,
    mythEn: "Wearing glasses makes eyesight worse.",
    mythHi: "चश्मा पहनने से आंखों की रोशनी और खराब हो जाती है।",
    factEn: "Glasses correct vision and reduce eye strain.",
    factHi: "चश्मा दृष्टि को ठीक करता है और आंखों के तनाव को कम करता है।",
    tipEn: "Glasses help you see clearly and stop your eyes from working too hard. They do not weaken your eyes; refusing to wear them might cause headaches.",
    tipHi: "चश्मा आपको स्पष्ट रूप से देखने में मदद करता है और आपकी आंखों को बहुत मेहनत करने से रोकता है। वे आपकी आंखों को कमजोर नहीं करते हैं; उन्हें पहनने से इनकार करने पर सिरदर्द हो सकता है।",
    videoUrl: "https://www.youtube.com",
  },
  {
    id: 12,
    icon: Sun,
    mythEn: "Dengue mosquitoes only bite at night.",
    mythHi: "डेंगू के मच्छर केवल रात में काटते हैं।",
    factEn: "They primarily bite during the day.",
    factHi: "वे मुख्य रूप से दिन के दौरान काटते हैं।",
    tipEn: "Aedes mosquitoes, which spread dengue, are most active early morning and late afternoon. Use repellents and wear full sleeves even during the day.",
    tipHi: "एडीज मच्छर, जो डेंगू फैलाते हैं, सुबह और देर दोपहर में सबसे अधिक सक्रिय होते हैं। दिन के दौरान भी विकर्षक का प्रयोग करें और पूरी आस्तीन वाले कपड़े पहनें।",
    videoUrl: "https://www.youtube.com",
  },
  {
    id: 13,
    icon: Baby,
    mythEn: "Newborns should be given honey or water first.",
    mythHi: "नवजात शिशुओं को पहले शहद या पानी दिया जाना चाहिए।",
    factEn: "Only breastmilk should be given for 6 months.",
    factHi: "6 महीने तक केवल मां का दूध ही देना चाहिए।",
    tipEn: "Breastmilk contains all the water and nutrients a baby needs. Honey can be dangerous for infants under 1 year due to botulism risk.",
    tipHi: "मां के दूध में वह सारा पानी और पोषक तत्व होते हैं जो बच्चे को चाहिए होते हैं। बोटुलिज़्म के खतरे के कारण 1 साल से कम उम्र के बच्चों के लिए शहद खतरनाक हो सकता है।",
    videoUrl: "https://www.youtube.com",
  },
  {
    id: 14,
    icon: Activity,
    mythEn: "TB is hereditary and cannot be cured.",
    mythHi: "टीबी वंशानुगत है और इसका इलाज नहीं किया जा सकता है।",
    factEn: "TB is infectious but completely curable.",
    factHi: "टीबी संक्रामक है लेकिन पूरी तरह से इलाज योग्य है।",
    tipEn: "Tuberculosis spreads through air when someone coughs. It is not genetic. With a full course of DOTS treatment, it can be cured completely.",
    tipHi: "जब कोई खांसता है तो तपेदिक हवा के माध्यम से फैलता है। यह आनुवंशिक नहीं है। डॉट्स (DOTS) उपचार के एक पूर्ण पाठ्यक्रम के साथ, इसे पूरी तरह से ठीक किया जा सकता है।",
    videoUrl: "https://www.youtube.com",
  },
  {
    id: 15,
    icon: AlertTriangle,
    mythEn: "Snake bites should be cut and sucked.",
    mythHi: "सांप के काटने पर काट कर चूसना चाहिए।",
    factEn: "Never cut or suck the wound; go to hospital.",
    factHi: "घाव को कभी न काटें या चूसें; अस्पताल जाएं।",
    tipEn: "Immobilize the bitten limb and keep the patient calm. Cutting or sucking wastes time and can cause infection. Antivenom at a hospital is the only cure.",
    tipHi: "काटे गए अंग को स्थिर करें और रोगी को शांत रखें। काटने या चूसने से समय बर्बाद होता है और संक्रमण हो सकता है। अस्पताल में एंटीवेनम ही एकमात्र इलाज है।",
    videoUrl: "https://www.youtube.com",
  },
];

const MythCard = ({ misconception }: { misconception: any }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { t, i18n } = useTranslation();

  // Map ID to icon - we keep icons in code as they are React components
  const Icon = misconception.icon;
  const isHindi = i18n.language === 'hi';

  // Helper to get text content
  const mythText = t(`misconceptions.items.${misconception.id - 1}.myth`);
  const factText = t(`misconceptions.items.${misconception.id - 1}.fact`);
  const tipText = t(`misconceptions.items.${misconception.id - 1}.tip`);
  const vernacularMyth = isHindi ? misconception.mythEn : t(`misconceptions.items.${misconception.id - 1}.mythHi`);

  const handleAudioClick = (e: React.MouseEvent, text: string) => {
    e.stopPropagation(); // Prevent card flip
    // AudioIcon handles the speak call internally, but we need to stop propagation here effectively
    // Actually AudioIcon already does stopPropagation.
    // But since the parent div has onClick, we need to be careful.
    // The AudioIcon component does e.stopPropagation().
  };

  return (
    <div
      className="flip-card h-96 cursor-pointer perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`flip-card-inner relative h-full w-full transition-all duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180 scale-105' : 'scale-100'}`}>
        {/* Front - Myth */}
        <Card className="flip-card-face flip-card-front absolute inset-0 flex flex-col items-center justify-center p-6 backface-hidden border-2 border-destructive bg-gradient-to-br from-destructive/10 to-background shadow-lg hover:shadow-xl transition-shadow">
          <div className="mb-4 rounded-full bg-destructive/20 p-4">
            <Icon className="h-12 w-12 text-destructive" />
          </div>
          <div className="mb-3 flex items-center gap-2">
            <XCircle className="h-6 w-6 text-destructive" />
            <h3 className="text-xl font-bold text-destructive">Myth / गलत धारणा</h3>
          </div>
          <div className="flex flex-col items-center gap-2 mb-2 w-full">
            <p className="text-center text-lg font-semibold text-foreground">
              {mythText}
            </p>
            <AudioIcon text={mythText} className="hover:bg-destructive/10 text-destructive" />
          </div>
          <p className="text-center text-base text-muted-foreground">
            {vernacularMyth}
          </p>

          <p className="mt-4 text-sm text-muted-foreground italic animate-pulse">
            {t('misconceptions.tapHint')}
          </p>
        </Card>

        {/* Back - Fact */}
        <Card className="flip-card-face flip-card-back absolute inset-0 flex flex-col items-center justify-center p-6 backface-hidden rotate-y-180 border-2 border-secondary bg-gradient-to-br from-secondary/10 to-background shadow-lg hover:shadow-xl transition-shadow overflow-y-auto">
          <div className="mb-4 rounded-full bg-secondary/20 p-4">
            <Icon className="h-12 w-12 text-secondary" />
          </div>
          <div className="mb-3 flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-secondary" />
            <h3 className="text-xl font-bold text-secondary">Fact / सच्चाई</h3>
          </div>
          <div className="flex flex-col items-center gap-2 mb-2 w-full">
            <p className="text-center text-lg font-semibold text-foreground">
              {factText}
            </p>
            <AudioIcon text={factText} className="hover:bg-secondary/10 text-secondary" />
          </div>

          <div className="mt-2 w-full rounded-lg bg-accent/50 p-3 border border-accent">
            <div className="flex items-start justify-between gap-2">
              <p className="mb-1 text-sm font-medium text-accent-foreground">
                📘 {tipText}
              </p>
              <AudioIcon text={tipText} className="h-6 w-6 shrink-0" />
            </div>
          </div>
          <a
            href={misconception.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-light transition-colors shadow-soft"
          >
            {t('misconceptions.learnMore')}
          </a>
        </Card>
      </div>
    </div>
  );
};

const Misconceptions = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/5 to-background animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12 md:py-16 animate-slide-in-right">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading mb-4 text-3xl font-bold text-foreground md:text-5xl animate-scale-in">
            {t('misconceptions.title')}
          </h1>
          <h2 className="font-heading mb-6 text-lg font-semibold text-muted-foreground md:text-2xl animate-scale-in" style={{ animationDelay: '100ms' }}>
            {t('misconceptions.subtitle')}
          </h2>
          <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg animate-fade-in" style={{ animationDelay: '200ms' }}>
            {t('misconceptions.description')}
          </p>
        </div>
      </section>

      {/* Did You Know Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Card className="border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-secondary/5 p-6 shadow-soft animate-fade-in">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/20 p-3">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-heading mb-2 text-xl font-bold text-primary">
                  {t('misconceptions.didYouKnow.title')}
                </h3>
                <p className="text-foreground">
                  <strong>{t('misconceptions.didYouKnow.text')}</strong>
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Misconceptions Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {misconceptions.map((misconception, index) => (
              <div
                key={misconception.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <MythCard misconception={misconception} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <Card className="mx-auto max-w-3xl border-2 border-secondary/30 bg-gradient-to-br from-secondary/10 to-background p-8 shadow-lg">
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-secondary" />
            <h3 className="font-heading mb-4 text-2xl font-bold text-foreground">
              {t('misconceptions.cta.title')}
            </h3>
            <h4 className="font-heading mb-4 text-xl font-semibold text-muted-foreground">
              {t('misconceptions.cta.subtitle')}
            </h4>
            <p className="mb-2 text-lg text-foreground">
              {t('misconceptions.cta.text')}
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Misconceptions;
