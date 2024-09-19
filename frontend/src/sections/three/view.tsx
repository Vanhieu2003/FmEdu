'use client';


import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useSettingsContext } from 'src/components/settings';
import { Grid } from '@mui/material';
import AnalyticsWidgetSummary from '../components/Overview/OverViewAnalytics';
import DescriptionIcon from '@mui/icons-material/Description';

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
      <Grid container spacing={3} sx={{ mt: 5 }}>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="Tổng số báo cáo"
            total={255}
            icon={<DescriptionIcon/>}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
