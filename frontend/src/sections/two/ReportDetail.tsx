"use client"
import React, { useEffect, useState } from 'react';
import { Container , Button} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import CleaningReportService from 'src/@core/service/cleaningReport';

import ReportDetail from '../components/table/reportDetail';

const ReportDetailView = ({ id }: { id: string }) => {
  const [report, setReport] = useState<any>(null); 
  useEffect(() => {
    const fetchData = async () => {
      const response = await CleaningReportService.getCleaningReportById(id);
      setReport(response.data);
    }
    fetchData();
  }, [id]);
  if (!report) {
    return
  }

  return (
    <Container maxWidth="lg" >
      <Button
        startIcon={<ArrowBackIcon fontSize='large' />}
        onClick={() => window.location.href = `/dashboard/two`}
      />
      <ReportDetail report = {report}/>
    </Container>
  );
};

export default ReportDetailView;
