'use client';

import Box from '@mui/material/Box';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useSettingsContext } from 'src/components/settings';
import {
  Autocomplete, TextField, Paper, Table, TableCell, TableContainer, TableRow, TableHead, TableBody,
  IconButton, Menu, MenuItem,
  Link,
  TableFooter,
  Pagination,
  Collapse,
  Button
} from '@mui/material';
import CampusService from 'src/@core/service/campus';
import { useEffect, useState } from 'react';
import GroupRoomService from 'src/@core/service/grouproom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CollapsibleRoomGroup from '../components/table/RoomGroup/CollapsibleRoomGroup';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import React from 'react';
import AddForm from '../components/form/AddForm';
import Popup from '../components/form/Popup';
import AddRoomGroup from '../components/form/AddRoomGroup';
import SnackbarComponent from '../components/snackBar';

// ----------------------------------------------------------------------

export default function RoomGroupListView() {
  const settings = useSettingsContext();
  const [campus, setCampus] = useState<any[]>([]);
  const [groupRooms, setGroupRooms] = useState<any[]>([]);

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [openPopUpAdd, setOpenPopUpAdd] = useState<boolean>(false);
  const [openRow, setOpenRow] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarStatus, setSnackbarStatus] = useState('success');


  const handleRowClick = (rowId: any) => {
    setOpenRow(openRow === rowId ? null : rowId);
  };

  const handleAddRoomGroupSuccess = async (message: string) => {
    setSnackbarMessage(message);
    setSnackbarStatus('success');
    setSnackbarOpen(true);
    fetchGroupRoom();
    setTimeout(() => {
      setSnackbarOpen(false);
    }, 3000);
  };


  const fetchGroupRoom = async () => {
    try {
      const response: any = await GroupRoomService.getAllGroupRooms(pageNumber, pageSize);
      setGroupRooms(response.data.roomGroups);
      setTotalPages(Math.ceil(response.data.totalRecords / pageSize));
    } catch (error: any) {
      console.error('Error fetching Room Group data:', error);
    }
  };

  useEffect(() => {
    const fetchCampus = async () => {
      try {
        const response: any = await CampusService.getAllCampus();
        setCampus(response.data);
      } catch (error: any) {
        console.error('Error fetching campus data:', error);
      }
    };

    

    // Gọi cả hai hàm song song
    fetchCampus();
    fetchGroupRoom();

  }, [pageNumber]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPageNumber(newPage);
  };

  const handleAddClick = () => {
    setOpenPopUpAdd(true);
  }



  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4">Danh sách nhóm phòng</Typography>
      </Box>


      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginY: 2, alignItems: 'center' }}>
        <Autocomplete
          disablePortal
          options={campus}
          getOptionLabel={(option: any) => option.campusName || ''}
          sx={{ width: 300, marginY: 1 }}
          // onChange={null}
          renderInput={(params: any) => <TextField {...params} label="Chọn cơ sở" />}
        />
        <Button variant='contained' onClick={handleAddClick} sx={{ height: 'fit-content', padding: '10px' }}>Tạo mới</Button>
        <Popup title="Tạo mới nhóm phòng" openPopup={openPopUpAdd} setOpenPopup={setOpenPopUpAdd} >
          <AddRoomGroup setOpenPopup={setOpenPopUpAdd} onSuccess={handleAddRoomGroupSuccess} />
        </Popup>
      </Box>

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
                <TableCell align='center'></TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {groupRooms.map((groupRoom: any, index) => (
                <React.Fragment key={groupRoom.id}>
                  <TableRow key={groupRoom.id}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">{groupRoom.campusName}</TableCell>
                    <TableCell align="center">{groupRoom.groupName}</TableCell>
                    <TableCell align="center">{groupRoom.description}</TableCell>
                    <TableCell align="center">{groupRoom.numberOfRoom}</TableCell>
                    <TableCell align='right'>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => handleRowClick(groupRoom.id)}
                      >
                        {openRow === groupRoom.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
                      <Collapse in={openRow === groupRoom.id} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                          <CollapsibleRoomGroup id={groupRoom.id}></CollapsibleRoomGroup>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>

              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Pagination
                      count={totalPages}
                      page={pageNumber}
                      onChange={handlePageChange}
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      ) : (
        <Typography>Không có báo cáo nào cho campus này.</Typography>
      )}
      <SnackbarComponent
        status={snackbarStatus as 'success' | 'error' | 'info' | 'warning'}
        open={snackbarOpen}
        message={snackbarMessage}
      />
    </Container>
  );
}
