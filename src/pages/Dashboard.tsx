import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, BookOpen, Award } from "lucide-react";
import { useTranslation } from "react-i18next";

interface UserProgress {
  id: string;
  module_name: string;
  module_category: string;
  completed_at: string;
  progress_percentage: number;
}

interface UserBadge {
  id: string;
  badge_name: string;
  badge_icon: string;
  earned_at: string;
  milestone_value: number;
}

const Dashboard = () => {
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("User");
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: t('dashboard.auth.title'),
          description: t('dashboard.auth.desc'),
          variant: "destructive",
        });
        return;
      }

      setUserName(user.email?.split('@')[0] || "User");

      const { data, error } = await supabase.functions.invoke('get-dashboard', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) throw error;

      setProgress(data.progress || []);
      setBadges(data.badges || []);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      toast({
        title: t('dashboard.error.title'),
        description: t('dashboard.error.desc'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRecentModule = () => {
    if (progress.length === 0) return null;
    return progress[0];
  };

  const recentModule = getRecentModule();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {t('dashboard.welcome', { name: userName })}
          </h1>
          <p className="text-muted-foreground">{t('dashboard.track')}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                {t('dashboard.stats.modules')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{progress.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-secondary" />
                {t('dashboard.stats.badges')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-secondary">{badges.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/20 to-accent/10 border-accent/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-accent-foreground" />
                {t('dashboard.stats.overall')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={Math.min((progress.length / 10) * 100, 100)} className="h-3" />
              <p className="text-sm text-muted-foreground mt-2">
                {t('dashboard.stats.progress', { count: progress.length, total: 10 })}
              </p>
            </CardContent>
          </Card>
        </div>

        {recentModule && (
          <Card className="mb-8 animate-fade-in">
            <CardHeader>
              <CardTitle>{t('dashboard.continue.title')}</CardTitle>
              <CardDescription>{t('dashboard.continue.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{recentModule.module_name}</h3>
                  <p className="text-sm text-muted-foreground">{recentModule.module_category}</p>
                </div>
                <Badge variant="secondary" className="w-fit">{recentModule.progress_percentage}% {t('dashboard.continue.complete')}</Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {badges.length > 0 && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>{t('dashboard.achievements.title')}</CardTitle>
              <CardDescription>{t('dashboard.achievements.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/50 transition-all duration-300 hover:scale-105"
                  >
                    <div className="text-4xl">{badge.badge_icon}</div>
                    <div>
                      <h4 className="font-semibold">{badge.badge_name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(badge.earned_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {progress.length === 0 && badges.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-4">{t('dashboard.empty.title')}</p>
              <p className="text-sm text-muted-foreground">
                {t('dashboard.empty.subtitle')}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};


export default Dashboard;