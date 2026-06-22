import React from 'react';
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Box
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FAQ_ITEMS = [
  {
    q: "How do I register as a player on the APTAMP portal?",
    a: "Click on the 'Register' button in the navigation header, fill in your profile details (Name, DOB, gender, state, district), and optionally upload your profile photo. Once submitted, your profile will be sent to the APTA administration for review. You can log in once approved."
  },
  {
    q: "What documents are required for player profile approval?",
    a: "You must supply valid Date of Birth (DOB) proof (e.g. Birth Certificate, SSC mark sheet) and identity proof (e.g. Aadhaar Card). These can be uploaded in the document management section of your profile dashboard once registered."
  },
  {
    q: "How do I enter/register for an upcoming tournament?",
    a: "Log in as an approved Player, navigate to the 'Tournaments' tab on your sidebar dashboard, browse upcoming tournaments, select your preferred category (Singles/Doubles/Mixed), and submit. You will then be prompted to pay the tournament fee."
  },
  {
    q: "How does the automatic ranking system calculate points?",
    a: "Points are allocated dynamically depending on how far you advance in each tournament bracket: Winner earns 100 points, Runner-Up earns 70 points, and Semi-Finalists receive 40 points. Standings are recalculated immediately by association admins once match results are recorded."
  },
  {
    q: "How do I pay my tournament registration fee?",
    a: "Tournament registration fees are collected offline. Please contact the tournament organizer or your district secretary to make the payment. Once verified, the admin will update your payment status on the portal."
  }
];

export default function Faq() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
        Frequently Asked Questions (FAQ)
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4, fontWeight: 500 }}>
        Answers to questions about player registration, payments, tournament entries, and standings.
      </Typography>
      <Divider sx={{ mb: 4 }} />

      <Box sx={{ mt: 2 }}>
        {FAQ_ITEMS.map((faq, i) => (
          <Accordion key={i} sx={{ mb: 2, '&:before': { display: 'none' }, border: '1px solid #cbd5e1', borderRadius: '4px !important' }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`faq-content-${i}`}
              id={`faq-header-${i}`}
              sx={{ py: 1, backgroundColor: '#f8fafc' }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {faq.q}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3, borderTop: '1px solid #cbd5e1' }}>
              <Typography variant="body1" color="text.secondary">
                {faq.a}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
}
