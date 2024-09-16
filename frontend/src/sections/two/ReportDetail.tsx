"use client"
import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Rating } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import dayjs from 'dayjs';
import  CleaningReportService  from 'src/@core/service/cleaningReport';
import RenderRatingInput from '../components/rating/renderRatingInput';


const renderRatingInput = (RatingType: string, RatingValue: any) => {
  switch (RatingType) {
    case "BINARY":
      return (
        <Box>
          <Typography>{RatingValue === 2 ? "Đạt" : RatingValue === 1 ? "Không Đạt" : "Chưa đánh giá"}</Typography>
        </Box>
      );
    case "RATING":
      return (
        <Rating
          value={RatingValue || 0}
          disabled
          
        />
      );
    default:
      return null;
  }
};
const ReportDetailView = ({ id }: { id: string }) => {
  
  const [report, setReport] = useState<any>(null);
  useEffect(()=>{
    const fetchData = async()=>{
      const response = await CleaningReportService.getCleaningReportById(id);
      setReport(response.data);
    }
    fetchData();
  },[id]);
  if (!report) {
    return
  }
  return (
    <Container maxWidth="lg" >
      <Button
        startIcon={<ArrowBackIcon fontSize='large' />}
        onClick={() => window.location.href = `/dashboard/two`}
      />
      <Box sx={{ mt: 5 }}>
        <Typography variant="h2" gutterBottom sx={{ textAlign: 'center' }}>
          Báo cáo chi tiết vệ sinh
        </Typography>
        <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="h6">Ngày đánh giá: {dayjs(report.createAt).format('DD/MM/YYYY')}</Typography>
          <Typography variant="h6">Ngày cập nhật: {dayjs(report.updateAt).format('DD/MM/YYYY')}</Typography>
          <Typography variant="h6">Ca: {report.startTime.substring(0, 5)} - {report.endTime.substring(0, 5)}</Typography>
          <Typography variant="h6">Cơ sở: {report.campusName}</Typography>
          <Typography variant="h6">Cơ sở: {report.blockName}</Typography>
          <Typography variant="h6">Tầng: {report.floorName}</Typography>
          <Typography variant="h6">Khu vực: {report.roomName}</Typography>
          <Typography variant="h6">Người đánh giá: Nhân viên A</Typography>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align='center' sx={{ width: '16.67%' }}>Tiêu chí</TableCell>
                <TableCell align='center' sx={{ width: '33.33%' }}>Đánh giá</TableCell>
                <TableCell align='center' sx={{ width: '33.33%' }}>Ghi chú</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {report.criteriaList.map((criterion: any,index:any) => (
                <TableRow key={criterion.id}>
                  <TableCell align='center' sx={{ width: '16.67%' }}>{criterion.name}</TableCell>
                  <TableCell align='center' sx={{ width: '33.33%' }}>
                    {/* <RenderRatingInput inputRatingType={criterion.criteriaType} value={criterion.value} disabled={true}/> */}
                    {renderRatingInput(criterion.criteriaType, criterion.value)}
                  </TableCell>
                  <TableCell align='center' sx={{ width: '33.33%' }}>{criterion.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default ReportDetailView;
