import { Stack, Card, Typography, Chip, TableContainer, Paper, Table, TableBody, TableCell, TableHead, TableRow, Box, Rating, Modal, ListItemText, Grid } from '@mui/material';

import React, { useState } from 'react'
import ResponsibleUserView from './responsibleUserView';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import dayjs from 'dayjs';
import HouseIcon from '@mui/icons-material/House';
import PersonIcon from '@mui/icons-material/Person';
interface Props {
    report: any
}

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
const ReportDetail = ({ report }: Props) => {
    const parse = require('html-react-parser').default;
    const [openModal, setOpenModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedImage(null);
    };

    const renderRightContentInfo = ({ icon, title, content }: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {icon}
            <Box sx={{ ml: 2 }}>
                <Typography variant="subtitle2">{title}</Typography>
                <Typography variant="body2" color="text.secondary">
                    {content}
                </Typography>
            </Box>
        </Box>
    );

    const renderLeftContent = (
        <Stack component={Card} spacing={3} sx={{ p: 3 }}>
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
                                            <img key={index} src={url} alt={`Image ${index}`} width={100} height={100} style={{ margin: '0 5px', cursor: 'zoom-in' }} onClick={() => handleImageClick(url)} />
                                        )
                                    ))}
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell colSpan={4}>
                                <ResponsibleUserView data={report.usersByTags} isShadow={false} />
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
        </Stack>
    );


    const renderRightContent = (
        <Stack component={Card} spacing={2} sx={{ p: 3,marginLeft:'20px'}}>
            <Typography variant='h6'>Thông tin báo cáo</Typography>
            <Stack spacing={1}>
                {renderRightContentInfo({
                    icon: <CalendarMonthIcon />,
                    title: "Ngày đánh giá",
                    content: dayjs(report.createAt).format('DD/MM/YYYY')
                })}
                {renderRightContentInfo({
                    icon: <CalendarMonthIcon />,
                    title: "Ngày cập nhật",
                    content: dayjs(report.updateAt).format('DD/MM/YYYY')
                })}
                {renderRightContentInfo({
                    icon: <HouseIcon />,
                    title: "Cơ sở",
                    content: report.campusName
                })}
                {renderRightContentInfo({
                    icon: <HouseIcon />,
                    title: "Tòa nhà",
                    content: report.blockName
                })}
                {renderRightContentInfo({
                    icon: <HouseIcon />,
                    title: "Tầng",
                    content: report.floorName
                })}
                {renderRightContentInfo({
                    icon: <HouseIcon />,
                    title: "Phòng",
                    content: report.roomName
                })}
                {renderRightContentInfo({
                    icon: <PersonIcon />,
                    title: "Người đánh giá",
                    content: "Nhân viên A"
                })}
            </Stack>
        </Stack>
    );


    return (
        <Grid container spacing={4}>
            <Grid xs={12} md={9}>
                {renderLeftContent}
            </Grid>

            <Grid xs={12} md={3}>
                {renderRightContent}
            </Grid>
        </Grid>
    )
}

export default ReportDetail