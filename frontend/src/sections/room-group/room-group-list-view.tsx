'use client';

import Box from '@mui/material/Box';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useSettingsContext } from 'src/components/settings';
import { Autocomplete, TextField, Paper, Table, TableCell, TableContainer, TableRow, TableHead, TableBody } from '@mui/material';
import  CampusService  from 'src/@core/service/campus';
import { useEffect, useState } from 'react';
import  GroupRoomService  from 'src/@core/service/grouproom';

// ----------------------------------------------------------------------

export default function RoomGroupListView() {
  const settings = useSettingsContext();
  const [campus, setCampus] = useState<any[]>([]);
  const [groupRooms, setGroupRoooms] = useState<any[]>([]);







  useEffect(() => {
    const fetchCampus = async () => {
      try {
        const response: any = await CampusService.getAllCampus();
        setCampus(response.data);
      } catch (error: any) {
        console.error('Error fetching campus data:', error);
      }
    };
  
    const fetchGroupRoom = async () => {
      try {
        const response: any = await GroupRoomService.getAllGroupRooms();
        setGroupRoooms(response.data);
      } catch (error: any) {
        console.error('Error fetching Room Group data:', error);
      }
    };
  
    // Gọi cả hai hàm song song
    fetchCampus();
    fetchGroupRoom();
  
  }, []);
  




  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
 
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4">Danh sách nhóm phòng</Typography>

      </Box>

       {/* Autocomplete để chọn campus */}
       <Box sx={{ display: 'flex', gap: 2, marginBottom: 3 }}>
        <Autocomplete
          disablePortal
          options={campus}
          getOptionLabel={(option: any) => option.campusName || ''}
          sx={{ width: 300, marginBottom: 3 }}
         // onChange={null}
          renderInput={(params: any) => <TextField {...params} label="Chọn Campus" />}
        />
        </Box>

 {/* Hiển thị báo cáo khối */}
 {groupRooms.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
              <TableCell align="center">STT</TableCell>
                <TableCell align="center">Cơ sở</TableCell>
                <TableCell align="center">Nhóm phòng</TableCell>
                <TableCell align="center">Mô tả </TableCell>
                <TableCell align="center">Số lượng phòng</TableCell>
         
              </TableRow>
            </TableHead>
            <TableBody>
              {groupRooms.map((groupRoom:any,index) => (
                <TableRow key={groupRoom.id}>
              <TableCell align="center">{index + 1}</TableCell>
               <TableCell align="center">{groupRoom.campusName}</TableCell>
                <TableCell align="center">{groupRoom.groupName}</TableCell>
                <TableCell align="center">{groupRoom.description}</TableCell>
                <TableCell align="center">{groupRoom.numberOfRoom}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>Không có báo cáo nào cho campus này.</Typography>
      )}


        
    </Container>
  );
}
