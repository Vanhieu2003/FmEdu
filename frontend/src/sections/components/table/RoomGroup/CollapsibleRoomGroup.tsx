import { Container, Paper, Typography, TableContainer, Table, TableBody, TableRow, TableCell, TableHead, Box, Button, Link } from '@mui/material';
import React, { useEffect, useState } from 'react'
import GroupRoomService from 'src/@core/service/grouproom';


interface props {
    id: string;
}

const data1 = {
    "id": "05efbaca-8f4f-4010-b7e9-41e63416b49f",
    "groupName": "Nóm B",
    "description": "Nhóm B vệ sinh rất B",
    "rooms": [
        {
            "id": "0ab76ebb-e1c0-4c74-84db-27393d98cd6d",
            "roomName": "Khu tự học",
            "campusName": "Cơ sở 280 An Dương Vương",
            "campusId": "2fc4779e-7cc5-49fe-a5f8-bfe890bf958c",
            "floorName": "Tầng trệt",
            "blockName": "Dãy nhà B - 280ADV",
            "categoryName": "Khu tự học"
        },
        {
            "id": "e159a37d-ae89-49a7-ab19-649755c53151",
            "roomName": "Khu tự học ",
            "campusName": "Cơ sở 280 An Dương Vương",
            "campusId": "2fc4779e-7cc5-49fe-a5f8-bfe890bf958c",
            "floorName": "Tầng trệt",
            "blockName": "Dãy nhà B - 280ADV",
            "categoryName": "Khu tự học"
        },
        {
            "id": "bc0da313-fcd2-4380-821e-054f2cafdcc6",
            "roomName": "Phòng  B104",
            "campusName": "Cơ sở 280 An Dương Vương",
            "campusId": "2fc4779e-7cc5-49fe-a5f8-bfe890bf958c",
            "floorName": "Lầu 1",
            "blockName": "Dãy nhà B - 280ADV",
            "categoryName": "Phòng học"
        },
        {
            "id": "06b6abf3-6d3a-4dc2-a695-de837e4e9aea",
            "roomName": "Phòng  B110",
            "campusName": "Cơ sở 280 An Dương Vương",
            "campusId": "2fc4779e-7cc5-49fe-a5f8-bfe890bf958c",
            "floorName": "Lầu 1",
            "blockName": "Dãy nhà B - 280ADV",
            "categoryName": "Phòng học"
        },
        {
            "id": "2cbec46f-fde1-4323-a5fc-5a9e33401cf6",
            "roomName": "Phòng  B108",
            "campusName": "Cơ sở 280 An Dương Vương",
            "campusId": "2fc4779e-7cc5-49fe-a5f8-bfe890bf958c",
            "floorName": "Lầu 1",
            "blockName": "Dãy nhà B - 280ADV",
            "categoryName": "Phòng học"
        },
        {
            "id": "e706e433-54ba-4264-a84a-a24febfe7dea",
            "roomName": "Phòng  B101",
            "campusName": "Cơ sở 280 An Dương Vương",
            "campusId": "2fc4779e-7cc5-49fe-a5f8-bfe890bf958c",
            "floorName": "Lầu 1",
            "blockName": "Dãy nhà B - 280ADV",
            "categoryName": "Phòng học"
        },
        {
            "id": "00266293-3079-4b7d-9900-b5597926d6cc",
            "roomName": "Nhà vệ sinh (trệt)",
            "campusName": "Cơ sở 280 An Dương Vương",
            "campusId": "2fc4779e-7cc5-49fe-a5f8-bfe890bf958c",
            "floorName": "Tầng trệt",
            "blockName": "Dãy nhà B - 280ADV",
            "categoryName": "Nhà vệ sinh"
        }
    ]
}
const CollapsibleRoomGroup = ({ id }: props) => {

    const [data, setData] = useState<any>();

    const fetchRoomGroup = async () => {
        try {
            const response: any = await GroupRoomService.getRoomGroupById(id);
            setData(response.data);
        } catch (error: any) {
            console.error('Error fetching responsible group:', error);
        }
    };
    useEffect(() => {
        fetchRoomGroup();
    }, [])
    if (!data) {
        return (
            <Container>
                <Typography variant="h6" sx={{ marginTop: 3 }}>
                    Không tìm thấy thông tin của nhóm phòng.
                </Typography>
            </Container>
        );
    }
    return (
        <Paper elevation={3} sx={{ position: 'relative', pb: 8 }}>
            <TableContainer>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell align="left">
                                <TableContainer style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell><strong>STT</strong></TableCell>
                                                <TableCell><strong>Cơ sở</strong></TableCell>
                                                <TableCell><strong>Tòa nhà</strong></TableCell>
                                                <TableCell><strong>Tầng</strong></TableCell>
                                                <TableCell><strong>Khu vực</strong></TableCell>
                                                <TableCell><strong>Phòng</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data.rooms && data.rooms.map((room: any, index: any) => (
                                                <TableRow key={room.id}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{room.campusName}</TableCell>
                                                    <TableCell>{room.blockName}</TableCell>
                                                    <TableCell>{room.floorName}</TableCell>
                                                    <TableCell>{room.categoryName}</TableCell>
                                                    <TableCell>{room.roomName}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{
                position: 'absolute',
                bottom: 16, // Khoảng cách từ bottom
                right: 16, // Khoảng cách từ right
                display: 'flex',
                justifyContent: 'flex-end'
            }}>
                <Button variant="contained">
                    <Link
                        href={`/dashboard/room-group/edit/${id}`}
                        sx={{ display: 'flex', color: 'white' }}
                        underline="none">
                        Chỉnh sửa
                    </Link>
                </Button>
            </Box>
        </Paper>
    )
}

export default CollapsibleRoomGroup