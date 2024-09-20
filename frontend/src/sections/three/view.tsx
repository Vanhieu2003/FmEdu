'use client';


import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useSettingsContext } from 'src/components/settings';
import Grid from "@mui/material/Grid2";
import AnalyticsWidgetSummary from '../components/Overview/OverViewAnalytics';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import HomeIcon from '@mui/icons-material/Home';
import { PieChart } from '@mui/x-charts';
import AnalyticsWebsiteVisits from '../components/Overview/AnalyticsWebsiteVisits';
import AnalyticsCurrentVisits from '../components/Overview/AnalyticsCurrentVisit';

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
      <Grid container spacing={3} sx={{ mt: 5, display: 'flex', justifyContent: 'space-between', flexWrap: 'nowrap' }}>
        <Grid sx={{ flex: 1 }}>
          <AnalyticsWidgetSummary
            title="Tổng số báo cáo"
            total={255}
            icon={<ContentPasteIcon fontSize='large' />}
          />
        </Grid>
        <Grid sx={{ flex: 1 }}>
          <AnalyticsWidgetSummary
            title="Tổng tiến độ báo cáo"
            total={76}
            unit='%'
            icon={<FitnessCenterIcon fontSize='large' />}
            color='secondary'
          />
        </Grid>

        <Grid sx={{ flex: 1 }}>
          <AnalyticsWidgetSummary
            title="Tổng khu vực đã báo cáo"
            total={124}
            icon={<HomeIcon fontSize='large' />}
            color='info'
          />
        </Grid>
      </Grid>
      <Grid spacing={2} sx={{ mt: 5, display: 'flex', justifyContent: 'space-between', flexWrap: 'nowrap' }}>
        <Grid sx={{ flex: 1 }}>
        <AnalyticsWebsiteVisits
            title="Website Visits"
            subheader="(+43%) than last year"
            chart={{
              labels: [
                '01/01/2024',
                '02/01/2024',
                '03/01/2024',
                '04/01/2024',
                '05/01/2024',
                '06/01/2024',
                '07/01/2024',
                '08/01/2024',
                '09/01/2024',
                '10/01/2024',
                '11/01/2024',
              ],
              series: [
                {
                  name: 'Team A',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Team B',
                  type: 'column',
                  fill: 'solid',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                
              ],
            }}
          />
        </Grid>

        <Grid sx={{ flex: 1 }}>
        <AnalyticsCurrentVisits
            title="Current Visits"
            chart={{
              series: [
                { label: 'Lau sàn', value: 4344 },
                { label: 'Tổng vệ sinh định kỳ', value: 5435 },
                { label: 'Lau kính', value: 1443 },
                { label: 'Xịt mùi thơm', value: 4443 },
                { label: 'Vệ sinh nhà bếp', value: 4443 },
                { label: 'Vệ sinh nhà vệ sinh', value: 4443 },
              ],
            }}
          />
        </Grid>

      </Grid>
    </Container>
  );
}
