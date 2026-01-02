import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";

export const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('language', lng);
    };

    const languages = [
        { code: 'en', label: 'English', flag: '🇬🇧' },
        { code: 'hi', label: 'हिंदी (Hindi)', flag: '🇮🇳' },
        { code: 'mr', label: 'मराठी (Marathi)', flag: '🇮🇳' },
    ];

    const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

    return (
        <Select value={i18n.language} onValueChange={changeLanguage}>
            <SelectTrigger
                className="w-[140px] h-9 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary-dark transition-colors focus:ring-primary/20"
            >
                <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4" />
                    <span className="text-sm font-medium hidden sm:inline-block truncate">
                        {currentLang.label.split(' ')[0]}
                    </span>
                    <span className="sm:hidden text-sm font-medium">
                        {currentLang.code.toUpperCase()}
                    </span>
                </div>
            </SelectTrigger>
            <SelectContent align="end" className="bg-background/95 backdrop-blur-sm border-primary/20">
                {languages.map((lang) => (
                    <SelectItem
                        key={lang.code}
                        value={lang.code}
                        className="cursor-pointer focus:bg-primary/10 focus:text-primary"
                    >
                        <span className="mr-2 text-base">{lang.flag}</span>
                        {lang.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};
