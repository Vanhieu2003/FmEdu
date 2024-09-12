"use client"
import React from 'react';
import { Container, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Rating } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import dayjs from 'dayjs';


const reportData = [
  {
    "reportID": 1,
    "date": "2024-06-08",
    "house": "Cơ sở A",
    "floor": "Tầng 1",
    "area": "Khu vực 1",
    "user": "Nguyễn Văn A",
    "criteria": [
      {
        "criteriaID": 1,
        "name": "Tiêu chí 1",
        "ratingType": "BINARY",
        "ratingValue": "Đạt",
        "notes": "Sạch sẽ và gọn gàng",
      },
      {
        "criteriaID": 2,
        "name": "Tiêu chí 2",
        "ratingType": "RATING",
        "ratingValue": 4,
        "notes": "Cần cải thiện thêm",
      },
      {
        "criteriaID": 3,
        "name": "Tiêu chí 3",
        "ratingType": "RATING",
        "ratingValue": 2,
        "notes": "Chưa lau sạch",
      },
      {
        "criteriaID": 4,
        "name": "Tiêu chí 4",
        "ratingType": "BINARY",
        "ratingValue": "Đạt",
        "notes": "",
      },
      {
        "criteriaID": 5,
        "name": "Tiêu chí 5",
        "ratingType": "BINARY",
        "ratingValue": "Không đạt",
        "notes": "Vết bẩn ở toilet",
      },
      {
        "criteriaID": 6,
        "name": "Tiêu chí 6",
        "ratingType": "RATING",
        "ratingValue": 4,
        "notes": "Cần cải thiện thêm",
      }
    ]
  },
  {
    "reportID": 2,
    "date": "2024-05-02",
    "house": "Cơ sở B",
    "floor": "Tầng 2",
    "area": "Khu vực 1",
    "user": "Đinh Thị B",
    "criteria": [
      {
        "criteriaID": 1,
        "name": "Tiêu chí 1",
        "ratingType": "BINARY",
        "ratingValue": "Đạt",
        "notes": "Sạch sẽ và gọn gàng",
      },
      {
        "criteriaID": 2,
        "name": "Tiêu chí 2",
        "ratingType": "RATING",
        "ratingValue": 4,
        "notes": "Cần cải thiện thêm",
      },
      {
        "criteriaID": 3,
        "name": "Tiêu chí 3",
        "ratingType": "RATING",
        "ratingValue": 2,
        "notes": "Chưa lau sạch",
      },
      {
        "criteriaID": 4,
        "name": "Tiêu chí 4",
        "ratingType": "BINARY",
        "ratingValue": "Đạt",
        "notes": "",
      },
      {
        "criteriaID": 5,
        "name": "Tiêu chí 5",
        "ratingType": "BINARY",
        "ratingValue": "Không đạt",
        "notes": "Vết bẩn ở toilet",
      },
      {
        "criteriaID": 6,
        "name": "Tiêu chí 6",
        "ratingType": "RATING",
        "ratingValue": 4,
        "notes": "Cần cải thiện thêm",
      }
    ]
  },
];

const renderRatingInput = (RatingType: string, RatingValue: any) => {
  switch (RatingType) {
    case "BINARY":
      return (
        <Box>
          <Typography>{RatingValue}</Typography>
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

const ReportDetailView = ({ id }: { id: number }) => {
  
  const report = reportData.find(report => report.reportID === Number(id));
  if (!report) {
    return
  }
  return (
    <Container maxWidth="lg" >
      <Button
        startIcon={<ArrowBackIcon fontSize='large' />}
        onClick={() => window.history.back()}
      />
      <Box sx={{ mt: 5 }}>
        <Typography variant="h2" gutterBottom sx={{ textAlign: 'center' }}>
          Báo cáo chi tiết vệ sinh
        </Typography>
        <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="h6">Ngày: {dayjs(report.date).format('DD/MM/YYYY')}</Typography>
          <Typography variant="h6">Cơ sở: {report.house}</Typography>
          <Typography variant="h6">Tầng: {report.floor}</Typography>
          <Typography variant="h6">Khu vực: {report.area}</Typography>
          <Typography variant="h6">Người đánh giá: {report.user}</Typography>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Tiêu chí</TableCell>
                <TableCell align="center">Đánh giá</TableCell>
                <TableCell align="center">Ghi chú</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {report.criteria.map((criterion) => (
                <TableRow key={criterion.criteriaID}>
                  <TableCell align="center">{criterion.name}</TableCell>
                  <TableCell align="center">
                    {renderRatingInput(criterion.ratingType, criterion.ratingValue)}
                  </TableCell>
                  <TableCell align="center">{criterion.notes === "" ? "Không có ghi chú" : criterion.notes}</TableCell>
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
