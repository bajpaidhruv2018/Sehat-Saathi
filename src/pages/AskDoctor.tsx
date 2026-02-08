import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Stethoscope, Loader2, CheckCircle, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Initialize specific client for Ask Doctor feature
// This uses the NEW project url while the rest of the app uses the OLD one
const DOCTOR_PROJECT_URL = "https://nqiyyailhxmavrcokrmv.supabase.co";
const DOCTOR_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xaXl5YWlsaHhtYXZyY29rcm12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NTMzNzQsImV4cCI6MjA4NTUyOTM3NH0.py8zZIE91mqXq3SDw6BIDJEFw5qCLuCMAISTZrnzt7M";

const doctorClient = createClient(DOCTOR_PROJECT_URL, DOCTOR_ANON_KEY);

interface Question {
  id: string;
  patient_name: string;
  category: string;
  question_text: string;
  answer_text: string;
  answered_at: string;
  location?: string;
  doctor_access?: {
    full_name: string;
  } | null;
}

const AskDoctor = () => {
  const [name, setName] = useState("");
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  // Community Q&A State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [questionError, setQuestionError] = useState("");

  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoadingQuestions(true);

        const { data, error } = await (doctorClient as any)
          .from('health_forum')
          .select('*, doctor_access(full_name)')
          .eq('is_answered', true)
          .order('answered_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        setQuestions((data as Question[]) || []);
      } catch (err) {
        console.error("Error fetching community questions:", err);
        setQuestionError("Failed to load community questions.");
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !question || !category) {
      toast({
        title: t('askDoctor.messages.missing'),
        description: t('askDoctor.messages.fillAll'),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let location = "Unknown";

      try {
        if (navigator.geolocation) {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000
            });
          });
          location = `${position.coords.latitude},${position.coords.longitude}`;
        }
      } catch (error) {
        console.log("Geolocation not available or permission denied");
      }

      const { error } = await (doctorClient as any).from('health_forum').insert({
        patient_name: name,
        category,
        question_text: question,
        location: location === "Unknown" ? null : location
      });

      if (error) throw error;

      toast({
        title: "Question submitted!",
        description: "A doctor will reply soon.",
      });

      // Clear form
      setName("");
      setQuestion("");
      setCategory("");
    } catch (error) {
      console.error('Error submitting question:', error);
      toast({
        title: t('askDoctor.messages.error'),
        description: t('askDoctor.messages.errorDesc'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Stethoscope className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">{t('askDoctor.title')}</h1>
          <p className="text-muted-foreground">{t('askDoctor.subtitle')}</p>
        </div>

        <Card className="animate-fade-in mb-12">
          <CardHeader>
            <CardTitle>{t('askDoctor.form.title')}</CardTitle>
            <CardDescription>
              {t('askDoctor.form.desc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">{t('askDoctor.form.name')}</Label>
                <Input
                  id="name"
                  placeholder={t('askDoctor.form.namePlaceholder')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">{t('askDoctor.form.category')}</Label>
                <Select value={category} onValueChange={setCategory} disabled={loading}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder={t('askDoctor.form.categoryPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">{t('askDoctor.categories.general')}</SelectItem>
                    <SelectItem value="nutrition">{t('askDoctor.categories.nutrition')}</SelectItem>
                    <SelectItem value="fitness">{t('askDoctor.categories.fitness')}</SelectItem>
                    <SelectItem value="mental">{t('askDoctor.categories.mental')}</SelectItem>
                    <SelectItem value="chronic">{t('askDoctor.categories.chronic')}</SelectItem>
                    <SelectItem value="preventive">{t('askDoctor.categories.preventive')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="question">{t('askDoctor.form.question')}</Label>
                <Textarea
                  id="question"
                  placeholder={t('askDoctor.form.questionPlaceholder')}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={6}
                  disabled={loading}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('askDoctor.form.submitting')}
                  </>
                ) : (
                  <>
                    <Stethoscope className="mr-2 h-4 w-4" />
                    {t('askDoctor.form.submit')}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Community Q&A Section */}
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Community Q&A</h2>
          </div>

          {loadingQuestions ? (
            <div className="space-y-4">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : questionError ? (
            <div className="text-center p-8 bg-muted/50 rounded-lg">
              <p className="text-destructive">{questionError}</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center p-12 bg-muted/30 rounded-lg border border-dashed">
              <p className="text-muted-foreground">No community questions yet. Be the first to ask!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((q) => (
                <Card key={q.id} className="overflow-hidden">
                  <CardHeader className="pb-3 bg-muted/20">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <Badge variant="outline" className="mb-2 bg-background capitalize">
                          {q.category}
                        </Badge>
                        <CardTitle className="text-base font-medium">
                          Asked by {q.patient_name}
                        </CardTitle>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {q.answered_at ? new Date(q.answered_at).toLocaleDateString() : ''}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 text-sm text-muted-foreground">Question:</h4>
                      <p className="text-foreground">{q.question_text}</p>
                    </div>

                    {q.answer_text && (
                      <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg border border-green-100 dark:border-green-900">
                        <div className="flex items-center gap-2 mb-2 text-green-700 dark:text-green-400">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm font-semibold">
                            Verified Doctor Response
                            {q.doctor_access?.full_name && ` by Dr. ${q.doctor_access.full_name}`}
                          </span>
                        </div>
                        <p className="text-foreground/90">{q.answer_text}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default AskDoctor;