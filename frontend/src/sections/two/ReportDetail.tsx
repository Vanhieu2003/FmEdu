"use client"
import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Rating,Modal } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import dayjs from 'dayjs';
import CleaningReportService from 'src/@core/service/cleaningReport';


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
  const parse = require('html-react-parser').default;
  const [report, setReport] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedImage(null);
  };


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
          <Typography variant="h6"> {report.campusName}</Typography>
          <Typography variant="h6"> {report.blockName}</Typography>
          <Typography variant="h6"> {report.floorName}</Typography>
          <Typography variant="h6">{report.roomName}</Typography>
          <Typography variant="h6">Người đánh giá: Nhân viên A</Typography>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align='center' sx={{ width: '25%' }}>Tiêu chí</TableCell>
                <TableCell align='center' sx={{ width: '25%' }}>Đánh giá</TableCell>
                <TableCell align='center' sx={{ width: '25%' }}>Ghi chú</TableCell>
                <TableCell align='center' sx={{ width: '25%' }}>Ảnh</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {report.criteriaList.map((criterion: any, index: any) => (
                <TableRow key={criterion.id}>
                  <TableCell align='center' sx={{ width: '25%' }}>{criterion.name}</TableCell>
                  <TableCell align='center' sx={{ width: '25%' }}>
                    {renderRatingInput(criterion.criteriaType, criterion.value)}
                  </TableCell>
                  <TableCell align='center' sx={{ width: '25%' }}>
                    {parse(criterion.note)}
                  </TableCell>
                  <TableCell align='center' sx={{ width: '25%' }}>
                    {criterion.imageUrl && Object.entries(JSON.parse(criterion.imageUrl)).map(([key, url]: [string, unknown], index: number) => (
                      typeof url === 'string' && (
                          <img key={index} src={url} alt={`Image ${index}`} width={100} height={100} style={{ margin: '0 5px', cursor: 'zoom-in' }} onClick={() => handleImageClick(url)}/>
                      )
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            maxHeight: "90%",
            maxWidth: "90%",
            overflow: "auto",
          }}
        >
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Zoomed"
              style={{ width: "100%", height: "auto" }}
            />
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default ReportDetailView;
