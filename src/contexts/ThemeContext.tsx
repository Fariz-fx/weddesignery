import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme } from '@/components/ThemeEditor';
import { translations } from '@/lib/translations';

// Default themes based on existing translations
const defaultThemes: Theme[] = [
  {
    id: 'family',
    name: 'Close Family',
    value: 'family',
    englishText: translations.familyTheme.english,
    tamilText: translations.familyTheme.tamil
  },
  {
    id: 'friends',
    name: 'Best Friends',
    value: 'friends',
    englishText: translations.friendsTheme.english,
    tamilText: translations.friendsTheme.tamil
  },
  {
    id: 'work',
    name: 'Work Colleagues',
    value: 'work',
    englishText: translations.workTheme.english,
    tamilText: translations.workTheme.tamil
  },
  {
    id: 'neighbors',
    name: 'Neighbors',
    value: 'neighbors',
    englishText: translations.neighborsTheme.english,
    tamilText: translations.neighborsTheme.tamil
  },
  {
    id: 'bridesbrotherfriends',
    name: 'Bride\'s Brother Friends',
    value: 'bridesbrotherfriends',
    englishText: translations.bridesbrotherFriendTheme.english,
    tamilText: translations.bridesbrotherFriendTheme.tamil
  },
  {
    id: 'bridesbrotherworkcolleagues',
    name: 'Bride\'s Brother Work Colleagues',
    value: 'bridesbrotherworkcolleagues',
    englishText: translations.bridesbrotherworkcolleagueTheme.english,
    tamilText: translations.bridesbrotherworkcolleagueTheme.tamil
  },
  {
    id: 'elegant',
    name: 'Elegant',
    value: 'elegant',
    englishText: translations.defaultTheme.english,
    tamilText: translations.defaultTheme.tamil
  },
  {
    id: 'modern',
    name: 'Modern',
    value: 'modern',
    englishText: translations.defaultTheme.english,
    tamilText: translations.defaultTheme.tamil
  },
  {
    id: 'rustic',
    name: 'Rustic',
    value: 'rustic',
    englishText: translations.defaultTheme.english,
    tamilText: translations.defaultTheme.tamil
  }
];

interface ThemeContextType {
  themes: Theme[];
  addTheme: (theme: Theme) => void;
  editTheme: (theme: Theme) => void;
  getThemeText: (themeValue: string, language: string) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with default themes and load any saved custom themes
  const [themes, setThemes] = useState<Theme[]>(() => {
    const savedThemes = localStorage.getItem('customThemes');
    const customThemes = savedThemes ? JSON.parse(savedThemes) : [];
    
    // Combine default themes with custom themes, ensuring no duplicates
    return [
      ...defaultThemes,
      ...customThemes.filter((custom: Theme) => 
        !defaultThemes.some(def => def.value === custom.value)
      )
    ];
  });

  // Save custom themes to localStorage whenever they change
  useEffect(() => {
    const customThemes = themes.filter(theme => theme.isCustom);
    if (customThemes.length > 0) {
      localStorage.setItem('customThemes', JSON.stringify(customThemes));
    }
  }, [themes]);

  const addTheme = (newTheme: Theme) => {
    setThemes(prev => [...prev, newTheme]);
  };

  const editTheme = (updatedTheme: Theme) => {
    setThemes(prev => 
      prev.map(theme => 
        theme.value === updatedTheme.value ? updatedTheme : theme
      )
    );
  };

  const getThemeText = (themeValue: string, language: string = 'english'): string => {
    const theme = themes.find(t => t.value === themeValue);
    if (!theme) return '';
    
    return language === 'english' ? theme.englishText : theme.tamilText;
  };

  return (
    <ThemeContext.Provider value={{ themes, addTheme, editTheme, getThemeText }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemes = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemes must be used within a ThemeProvider');
  }
  return context;
};