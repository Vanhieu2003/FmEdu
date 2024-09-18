'use client';

import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useSettingsContext } from 'src/components/settings';
import Upload from '../components/files/Upload';
import Image from 'next/image';

// ----------------------------------------------------------------------

export default function ThreeView() {
  const settings = useSettingsContext();
  const handleImagesChange = (images: string[]) => {
    console.log('Images changed:', images);
    // Xử lý dữ liệu ảnh ở đây
  };
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h4"> Page Three </Typography>

      <Box
        sx={{
          mt: 5,
          width: 1,
          height: 320,
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
        }}
      />
      <img src = "http://localhost:8000/uploads/638622713274203650.jpg" alt="logo" width={100} height={100}></img>
    </Container>
  );
}
