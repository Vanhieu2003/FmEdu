"use client"
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import "src/global.css";
import SendIcon from '@mui/icons-material/Send';
import { useSettingsContext } from 'src/components/settings';
import { Button, FormControl, FormControlLabel, IconButton, InputLabel, Link, MenuItem, Modal, Popover, Radio, RadioGroup, Select, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import RenderRatingInput from 'src/sections/components/rating/renderRatingInput';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CleaningReportService from 'src/@core/service/cleaningReport';
import React from 'react';
import ResponsibleUserView from '../components/table/responsibleUserView';
import DeleteIcon from '@mui/icons-material/Delete';
import Upload from '../components/files/Upload';
import FileService from 'src/@core/service/files';
dayjs.locale('vi');
// ----------------------------------------------------------------------

export default function OneView({ reportId }: { reportId: string }) {


  const [criteriaEvaluations, setCriteriaEvaluations] = useState<Array<{ criteriaId: string, value: any, note: string }>>([]);
  const [criteria, setCriteria] = useState<any[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userPerTags, SetUserPerTags] = useState<any[]>([]);
  const [criteriaImages, setCriteriaImages] = useState<{ [criteriaId: string]: string[] }>({});
  const settings = useSettingsContext();
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const parse = require('html-react-parser').default;
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const handleImageClick = (imageUrl: string) => {
    console.log(imageUrl);
    setSelectedImage(imageUrl);
    setOpenModal(true);
  };

  const parseImageUrls = (imageUrlString: string | null): string[] => {
    try {
      if (!imageUrlString) return [];

      const imageObject = JSON.parse(imageUrlString);
      return Object.values(imageObject) as string[];
    } catch (error) {
      console.error('Error parsing image URLs:', error);
      return [];
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedImage(null);
  };

  const [report, setReport] = useState<any>(null);
  useEffect(()=>{console.log(criteriaImages)},[criteriaImages])
  useEffect(() => {
    const fetchData = async () => {
      const response = await CleaningReportService.getCleaningReportById(reportId);
      setReport(response.data);
      setCriteria(response.data.criteriaList);
      SetUserPerTags(response.data.usersByTags);
      const initialImages: { [criteriaId: string]: string[] } = {};
      response.data.criteriaList.forEach((criteria: any) => {
        initialImages[criteria.id] = parseImageUrls(criteria.imageUrl);
      });
      setCriteriaImages(initialImages);
      const initialEvaluations = response.data.criteriaList.map((criteria: any) => ({
        criteriaId: criteria.id,
        value: criteria.value || '',
        note: criteria.note || ''
      }));
      setCriteriaEvaluations(initialEvaluations);
    }
    fetchData();
  }, [id]);
  if (!report) {
    return
  }

  



  const updateCriteriaEvaluation = (criteriaId: string, value: any, note: string) => {
    setCriteriaEvaluations(prevEvaluations => {
      const numericValue = Number(value);
      const existingIndex = prevEvaluations.findIndex(evaluation => evaluation.criteriaId === criteriaId);
      if (existingIndex !== -1) {
        // Nếu đã tồn tại, cập nhật giá trị
        const newEvaluations = [...prevEvaluations];
        newEvaluations[existingIndex] = { criteriaId, value: numericValue, note };
        return newEvaluations;
      } else {
        // Nếu chưa tồn tại, thêm mới
        return [...prevEvaluations, { criteriaId, value: numericValue, note }];
      }
    });
  };


  const handleSubmit = async () => {
    const reportData = {
      "reportId": report.id,
      "criteriaList": criteriaEvaluations.map((criteria: any) => {
        const images = criteriaImages[criteria.criteriaId] || [];
        const imagesObject = images.reduce((acc: any, url: string, index: number) => {
          acc[`image_${index + 1}`] = url;
          return acc;
        }, {});
        return {
          "criteriaId": criteria.criteriaId,
          "value": criteria.value,
          "note": criteria.note,
          "images": imagesObject
        }
      }),
      "userPerTags": userPerTags,
    }
    console.log("reportData:", reportData);
    // const response = await CleaningReportService.updateCleaningReport(reportData);
    // if (response.status === 200) {
    //   alert("Chỉnh sửa thành công");
    //   window.location.href = `/dashboard/two/detail/${reportId}`;
    // }

  };

  const handleValueChange: (criteriaId: string, value: any) => void = (criteriaId, value) => {
    const existingEvaluation = criteriaEvaluations.find(evaluation => evaluation.criteriaId === criteriaId);
    updateCriteriaEvaluation(criteriaId, value, existingEvaluation?.note || '');
  };

  const handleNoteChange = (criteriaId: string, note: string) => {
    const existingEvaluation = criteriaEvaluations.find(evaluation => evaluation.criteriaId === criteriaId);
    updateCriteriaEvaluation(criteriaId, existingEvaluation?.value || '', note);
  };

  const handleImagesChange = (images: { [criteriaId: string]: string[] }) => {
    setCriteriaImages(prevImages => ({
      ...prevImages,
      ...images
    }));
  };

  

  //UI of the website
  return (
    <Container maxWidth={false ? false : 'xl'}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Button
          startIcon={<ArrowBackIcon fontSize='large' />}
          onClick={() => window.history.back()}
        />
        <Typography variant="h4"> Chỉnh sửa Form </Typography>


      </Box>

      <Box
        sx={{
          mt: 5,
          width: 1,
          minHeight: 320,
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            marginBottom: 2,
          }}>
            <Autocomplete
              fullWidth
              sx={{ flex: 1 }}
              options={[report.campusName]}
              getOptionLabel={(option) => option}
              value={report.campusName}
              disabled
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chọn cơ sở"
                  variant="outlined"
                />
              )}
              noOptionsText="Không có dữ liệu cơ sở"
            />
            <Autocomplete
              fullWidth
              sx={{ flex: 1 }}
              options={[report.blockName]}
              getOptionLabel={(option) => option}
              value={report.blockName}
              disabled
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chọn tòa nhà"
                  variant="outlined"
                />
              )}
              noOptionsText="Không có dữ liệu tòa nhà"
            />
            <Autocomplete
              fullWidth
              sx={{ flex: 1 }}
              options={[report.floorName]}
              getOptionLabel={(option) => option}
              value={report.floorName}
              disabled
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chọn tầng"
                  variant="outlined"
                />
              )}
              noOptionsText="Không có dữ liệu tầng"
            />
            <Autocomplete
              fullWidth
              sx={{ flex: 1 }}
              options={[report.roomName]}
              getOptionLabel={(option) => option}
              value={report.roomName}
              disabled
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chọn phòng"
                  variant="outlined"
                />
              )}
              noOptionsText="Không có dữ liệu phòng"
            />
            <Autocomplete
              fullWidth
              disabled
              sx={{ flex: 1 }}
              options={[report.shiftName]}
              getOptionLabel={(option: any) =>
                typeof option === 'string'
                  ? option
                  : `${option.shiftName} (${option.startTime.substring(0, 5)} - ${option.endTime.substring(0, 5)})`
              }
              value={
                typeof report.shiftName === 'string'
                  ? report.shiftName
                  : `${report.shiftName} (${report.startTime.substring(0, 5)} - ${report.endTime.substring(0, 5)})`
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chọn ca"
                  variant="outlined"
                />
              )}
              noOptionsText="Không có dữ liệu ca"
            />
          </Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead sx={{ width: 1 }}>
                <TableRow>
                  <TableCell align='center'>Tiêu chí</TableCell>
                  <TableCell align="center">Đánh giá</TableCell>
                  <TableCell align="center">Ghi chú</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {criteria.map(criterion => {
                  const evaluation = criteriaEvaluations.find(evaluation => evaluation.criteriaId === criterion.id);
                  return (
                    <TableRow
                      key={criterion.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 }, margin: '10px 0' }}
                    >
                      <TableCell component="th" scope="row" align='center'>
                        {criterion.name}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <RenderRatingInput
                            criteriaID={criterion.id}
                            inputRatingType={criterion.criteriaType}
                            value={evaluation?.value || ''}
                            onValueChange={handleValueChange} />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <TextField fullWidth sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                            },
                          },
                        }} placeholder=''
                          onChange={(e) => handleNoteChange(criterion.id, e.target.value)}
                          value={criteriaEvaluations.find(evaluation => evaluation.criteriaId === criterion.id)?.note || ''}
                        />
                        <Upload onImagesChange={handleImagesChange} criteriaId={criterion.id} images={criteriaImages[criterion.id]}></Upload>
                      </TableCell>
                    </TableRow>

                  )
                })}
                <TableRow>
                  <TableCell colSpan={4}>
                    <ResponsibleUserView data={userPerTags} />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
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
        </Box>
        {criteria.length !== 0 &&
          <Button variant="contained" endIcon={<SendIcon />} sx={{ mt: 'auto', alignSelf: 'flex-end', mb: 2, mr: 2 }} onClick={handleSubmit}>
            Send
          </Button>}
      </Box>

    </Container>
  );
}
