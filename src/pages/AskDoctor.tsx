import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Stethoscope, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const AskDoctor = () => {
  const [name, setName] = useState("");
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

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
    setResponse("");

    try {
      const { data, error } = await supabase.functions.invoke('ask-doctor', {
        body: { name, question, category },
      });

      if (error) throw error;

      setResponse(data.response);
      toast({
        title: t('askDoctor.messages.received'),
        description: t('askDoctor.messages.receivedDesc'),
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

        <Card className="animate-fade-in">
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

            {response && (
              <Card className="mt-6 bg-primary/5 border-primary/20 animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-lg">{t('askDoctor.response.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed">{response}</p>
                  <p className="text-xs text-muted-foreground mt-4">
                    {t('askDoctor.response.disclaimer')}
                  </p>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


export default AskDoctor;