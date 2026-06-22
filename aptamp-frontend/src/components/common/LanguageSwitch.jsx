import React from 'react';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import TranslateIcon from '@mui/icons-material/Translate';

export default function LanguageSwitch() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const toggleLanguage = () => {
    const nextLang = currentLang === 'en' ? 'te' : 'en';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('aptamp_lang', nextLang);
  };

  return (
    <Button
      variant="outlined"
      color="inherit"
      onClick={toggleLanguage}
      startIcon={<TranslateIcon />}
      sx={{
        borderColor: 'rgba(255, 255, 255, 0.4)',
        color: '#ffffff',
        '&:hover': {
          borderColor: '#ffffff',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
        fontSize: '0.85rem',
        textTransform: 'none',
        py: 0.5,
        px: 1.5,
      }}
    >
      {currentLang === 'en' ? 'తెలుగు' : 'English'}
    </Button>
  );
}
