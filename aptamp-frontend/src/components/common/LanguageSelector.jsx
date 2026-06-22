import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Menu, MenuItem } from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (lng) => {
    setAnchorEl(null);
    if (lng) {
      localStorage.setItem('aptamp_lang', lng);
      i18n.changeLanguage(lng);
    }
  };


  const currentLanguageLabel = i18n.language === 'te' ? 'తెలుగు' : 'English';

  return (
    <div>
      <Button
        color="inherit"
        startIcon={<TranslateIcon />}
        onClick={handleClick}
        sx={{ fontWeight: 600 }}
      >
        {currentLanguageLabel}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleClose(null)}
      >
        <MenuItem onClick={() => handleClose('en')}>English</MenuItem>
        <MenuItem onClick={() => handleClose('te')}>తెలుగు (Telugu)</MenuItem>
      </Menu>
    </div>
  );
}
