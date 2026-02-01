// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import '../styles/Footer.css';

const agencies = [
  { id: 1, name: 'Хууль Зүй, Дотоод Хэргийн Яам', url: 'https://mojha.gov.mn' },
  { id: 2, name: 'Цагдаагийн Ерөнхий Газар', url: 'http://police.gov.mn' },
  { id: 3, name: 'Улсын Бүртгэлийн Ерөнхий Газар', url: 'http://burtgel.gov.mn' },
  { id: 4, name: 'Гадаадын Иргэн, Харьяатын Газар', url: 'http://immigration.gov.mn' },
  { id: 5, name: 'Хууль Зүйн Үндэсний Хүрээлэн', url: 'https://nli.gov.mn/' },
  { id: 6, name: 'Хил Хамгаалах Ерөнхий Газар', url: 'http://bpo.gov.mn' },
  { id: 7, name: 'Архивын Ерөнхий Газар', url: 'http://archives.gov.mn' },
  { id: 8, name: 'Дотоод Хэргийн Их Сургууль', url: 'http://www.uia.gov.mn/' },
  { id: 9, name: 'Төрийн Тусгай Албан Хаагчдын Нэгдсэн Эмнэлэг', url: 'http://www.ghsss.gov.mn/home' },
  { id: 10, name: 'Шүүхийн Шийдвэр Гүйцэтгэх Ерөнхий Газар', url: 'http://cd.gov.mn' },
  { id: 11, name: 'Шүүх Шинжилгээний Ерөнхий Газар', url: 'https://www.nfa.gov.mn/' },
  { id: 12, name: 'Хууль Зүйн Туслалцааны Төв', url: 'https://lac.gov.mn/' },
];

const Footer = () => {
  return (
    <footer className="footer">
      <Box className="footer-content">
        <Typography variant="body1" className="footer-text">Хамтрагч Байгууллагууд</Typography>

        {/* Add agency links below */}
        <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', padding: '20px 0' }}>
          <Box>
            {agencies.slice(0, 6).map((agency) => (
              <Typography key={agency.id}>
                <Link href={agency.url} target="_blank" rel="noopener" className="agency-link">
                  • {agency.name}
                </Link>
              </Typography>
            ))}
          </Box>
          <Box>
            {agencies.slice(6).map((agency) => (
              <Typography key={agency.id}>
                <Link href={agency.url} target="_blank" rel="noopener" className="agency-link">
                  • {agency.name}
                </Link>
              </Typography>
            ))}
          </Box>
        </Box>

        <Typography variant="body2" className="footer-text">© 2025 Хууль Зүйн Үндэсний Хүрээлэн. БҮХ ЭРХ ХУУЛИАР ХАМГААЛАГДСАН.</Typography>

        <Box className="footer-links" sx={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px' }}>
          <Link href="/#/privacy-policy" color="inherit">Нууцлалын бодлого</Link>
          <Link href="/#/terms-of-service" color="inherit">Үйлчилгээний нөхцөл</Link>
          <Link href="/#/contact-us" color="inherit">Холбоо барих</Link>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '20px',
          fontSize: '12px',
          color: 'gray',
        }}
      >
        
      </Box>
    </footer>
  );
};

export default Footer;
