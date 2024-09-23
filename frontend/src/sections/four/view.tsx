"use client"
import React, { useState, useEffect } from 'react';
import { Autocomplete, Box, Button, Container, FormControl, IconButton, InputLabel, Link, Menu, MenuItem, Pagination, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, alpha } from '@mui/material';
import Dayjs from 'dayjs';
import Popup from '../components/form/Popup';
import AddForm from '../components/form/AddForm';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EditForm from '../components/form/EditForm';
import BlockService from 'src/@core/service/block';
import axios from 'axios';
import FloorService from 'src/@core/service/floor';
import RoomService from 'src/@core/service/room';
import CampusService from 'src/@core/service/campus';
import CleaningFormService from 'src/@core/service/form';
interface Campus {
  id: string;
  campusCode: string;
  campusName: string;
  campusName2: string;
  campusSymbol: string;
  sortOrder: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
interface Blocks {
  id: string,
  blockCode: string,
  blockName: string,
  blockName2: string,
  blockNo: string,
  dvtcode: string,
  dvtname: string,
  assetTypeCode: string,
  assetTypeName: string,
  sortOrder: number,
  useDepartmentCode: string,
  useDepartmentName: string,
  manageDepartmentCode: string,
  manageDepartmentName: string,
  floorArea: number,
  contructionArea: number,
  functionCode: string,
  functionName: string,
  valueSettlement: number,
  originalPrice: number,
  centralFunding: number,
  localFunding: number,
  otherFunding: number,
  statusCode: string,
  statusName: string,
  campusCode: string,
  campusName: string,
  campusId: string,
  createdAt: string,
  updatedAt: string
}


type Floor = {
  id: string,
  floorCode: string,
  floorName: string,
  description: string,
  floorOrder: number,
  basementOrder: number,
  sortOrder: number,
  notes: string,
  createdAt: string,
  updatedAt: string
};

type Room = {
  id: string,
  roomCode: string,
  roomName: string,
  description: string,
  roomNo: string,
  dvtcode: string,
  dvtname: string,
  assetTypeCode: string,
  assetTypeName: string,
  useDepartmentCode: string,
  useDepartmentName: string,
  manageDepartmentCode: string,
  manageDepartmentName: string,
  numberOfSeats: number,
  floorArea: number,
  contructionArea: number,
  valueSettlement: number,
  originalPrice: number,
  centralFunding: number,
  localFunding: number,
  otherFunding: number,
  statusCode: string,
  statusName: string,
  sortOrder: number,
  blockId: string,
  roomCategoryId: string,
  floorId: string,
  createdAt: string,
  updatedAt: string,
  roomCategory: null | any,
  lessons: any[]
};
type Tag = {
  Id: string;
  name: string;
};


type Criteria = {
  CriteriaID: number;
  Name: string;
  ratingtype?: string;
  tags?: Tag[];
};

type Form = {
  id?: string,
  formName: string,
  campusName?: string,
  blockName?: string,
  floorName?: string,
  roomName?: string
};



export default function FourView() {
  const [formList, setFormList] = useState<Form[]>()
  const [campus, setCampus] = useState<Campus[]>([]);
  const [blocks, setBlocks] = useState<Blocks[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCampus, setSelectedCampus] = useState<string | null>(null);
  const [selectedBlocks, setSelectedBlocks] = useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentFormID, setCurrentFormID] = useState<string>('0');
  const [filterFormList, setFilterFormList] = useState<Form[]>();
  const [openPopUp, setOpenPopUp] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const open = Boolean(anchorEl);

  const mockForm: Form[] = formList || [];
  const filterForm = () => {
    let filteredForm = mockForm;
    if (selectedCampus !== null) {
      filteredForm = filteredForm.filter(report => report?.campusName === campus.find(campus => campus.id === selectedCampus)?.campusName);
    }
    if (selectedBlocks !== null) {
      filteredForm = filteredForm?.filter(report => report?.blockName === blocks.find(block => block.id === selectedBlocks)?.blockName);
    }
    if (selectedFloor !== null) {
      filteredForm = filteredForm?.filter(report => report?.floorName === floors.find(floor => floor.id === selectedFloor)?.floorName);
    }
    if (selectedRoom !== null) {
      filteredForm = filteredForm?.filter(report => report?.roomName === rooms.find(room => room.id === selectedRoom)?.roomName);
    }

    if (filteredForm && filteredForm.length > 0) {
      setFilterFormList(filteredForm);
    } else {
      setFilterFormList([]);
    }
    setFilterFormList(newReports => {
      console.log('Updated Reports:', newReports);
      return newReports;
    });
  };


  const fetchData = async (pageNumber: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response1 = await CampusService.getAllCampus();
      const response2 = await CleaningFormService.getAllCleaningForm(pageNumber);
      setCampus(response1.data);
      setFormList(response2.data.result);
      var totalPages = Math.ceil(response2.data.totalValue / 10);
      setTotalPages(totalPages);
    } catch (error) {
      setError(error.message);
      console.error('Chi tiết lỗi:', error);
    } finally {
      setIsLoading(false);
    }
  }

const handleClick = (event: React.MouseEvent<HTMLElement>, form: Form) => {
  setCurrentFormID(form.id || '');
  setAnchorEl(event.currentTarget);
};

const handleAddClick = () => {
  setIsEditing(false);
  setOpenPopUp(true);
}

const handleEditClick = () => {
  setIsEditing(true);
  setOpenPopUp(true);
}

useEffect(() => { console.log(currentFormID); }, [currentFormID]);

const handleClose = () => {
  setAnchorEl(null);
};
useEffect(() => {
  filterForm();

}, [selectedCampus, selectedBlocks, selectedFloor, selectedRoom]);
//   console.log(newForm);
//   if (formList && formList.length !== 0) {
//     formList.map((form) => {
//       if (form.id === newForm.id) {
//         form.formName = newForm.formName;
//         form.campusId = newForm.campusId;
//         form.blockId = newForm.blockId;
//         form.floorId = newForm.floorId;
//         form.roomId = newForm.roomId;
//         console.log("OK")
//       }
//       else {
//         const updatedFormList = [...formList, newForm];
//         setFormList(updatedFormList);
//         console.log("else")
//       }
//     })
//   }
//   else {
//     const updatedFormList = [...(formList || []), newForm];
//     setFormList(updatedFormList);
//   }
// };

useEffect(() => {
  setFilterFormList(formList);
}, [formList]);

const handleCampusSelect = async (CampusId: string) => {
  var campusId = CampusId;
  try {
    const response = await BlockService.getBlockByCampusId(campusId);
    setBlocks(response.data);
    setFloors([]);
    setRooms([]);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tầng:', error);
  }
};
const handleBlockSelect = async (blockId: string) => {
  var blockId = blockId;

  try {
    const response = await FloorService.getFloorByBlockId(blockId);
    if (response.data.length > 0) {
      setFloors(response.data);
      console.log(response.data);
      setRooms([]);
    }
    else {
      setFloors([]);
      setRooms([]);
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tầng:', error);
  }
};

const handleFloorSelect = async (floorId: string) => {
  var floorId = floorId;

  try {
    const response = await RoomService.getRoomsByFloorId(floorId);
    if (response.data.length > 0) {
      setRooms(response.data);
    }
    else {
      setRooms([]);
    }
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tầng:', error);
  }
};

const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
  setPage(value);
};

useEffect(() => {
  fetchData(page);
  console.log("totalPages", totalPages);
}, [page]);

return (
  <Container maxWidth="xl">
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Typography variant="h4">Page four</Typography>
      <Button variant='contained' onClick={handleAddClick}>Tạo mới</Button>
      <Popup title={isEditing ? 'Chỉnh sửa Form' : 'Tạo mới Form'} openPopup={openPopUp} setOpenPopup={setOpenPopUp} >
        {isEditing ? (
          <EditForm formId={currentFormID} setOpenPopup={setOpenPopUp} />
        ) : (
          <AddForm setOpenPopup={setOpenPopUp} />
        )
        }
      </Popup>
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
            options={campus}
            getOptionLabel={(option: any) => option.campusName || ''}
            value={campus.find((c: any) => c.id === selectedCampus) || null}
            onChange={(event, newValue) => {
              if (newValue) {
                setSelectedCampus(newValue ? newValue.id : null);
                handleCampusSelect(newValue ? newValue.id : '');
              }
              else {
                setSelectedCampus(null);
                setBlocks([]);
                setSelectedBlocks(null);
                setFloors([]);
                setSelectedFloor(null);
                setRooms([]);
                setSelectedRoom(null);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Chọn cơ sở"
                variant="outlined"
              />
            )}
            noOptionsText="Không có dữ liệu cơ sở"
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
          <Autocomplete
            fullWidth
            sx={{ flex: 1 }}
            options={blocks}
            getOptionLabel={(option: any) => option.blockName || ''}
            value={blocks.find((b: any) => b.id === selectedBlocks) || null}
            onChange={(event, newValue) => {
              if (newValue) {
                setSelectedBlocks(newValue ? newValue.id : null);
                handleBlockSelect(newValue ? newValue.id : '');
              }
              else {
                setSelectedBlocks(null);
                setFloors([]);
                setSelectedFloor(null);
                setRooms([]);
                setSelectedRoom(null);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Chọn tòa nhà"
                variant="outlined"
              />
            )}
            noOptionsText="Không có dữ liệu tòa nhà"
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
          <Autocomplete
            fullWidth
            sx={{ flex: 1 }}
            options={floors}
            getOptionLabel={(option: Floor) => option.floorName || ''}
            value={floors.find(floor => floor.id === selectedFloor) || null}
            onChange={(event, newValue) => {
              if (newValue) {
                setSelectedFloor(newValue ? newValue.id : null);
                handleFloorSelect(newValue ? newValue.id : '');
              }
              else {
                setSelectedFloor(null);
                setRooms([]);
                setSelectedRoom(null);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Chọn tầng"
                variant="outlined"
              />
            )}
            noOptionsText="Không có dữ liệu tầng"
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
          <Autocomplete
            fullWidth
            sx={{ flex: 1 }}
            options={rooms}
            getOptionLabel={(option: any) => option.roomName || ''}
            value={rooms.find(room => room.id === selectedRoom) || null}
            onChange={(event, newValue) => {
              setSelectedRoom(newValue ? newValue.id : null);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Chọn phòng"
                variant="outlined"
              />
            )}
            noOptionsText="Không có dữ liệu phòng"
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead sx={{ width: 1 }}>
              <TableRow>
                <TableCell align='center' sx={{ width: '5px' }}>STT</TableCell>
                <TableCell align='center'>Cơ sở</TableCell>
                <TableCell align='center'>Tòa nhà</TableCell>
                <TableCell align="center">Tầng</TableCell>
                <TableCell align="center">Khu vực</TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterFormList?.map((form: any, index) => (
                <TableRow key={form.id} sx={{ marginTop: '5px' }}>
                  <TableCell align='center' sx={{ width: '5px' }}>{index + 1}</TableCell>
                  <TableCell align='center'>
                    {form.campusName}
                  </TableCell>
                  <TableCell align='center'>
                    {form.blockName}
                  </TableCell>
                  <TableCell align='center'>
                    {form.floorName}
                  </TableCell>
                  <TableCell align='center'>
                    {form.roomName}
                  </TableCell>
                  <TableCell align='center' sx={{ width: '2px' }}>
                    <div>
                      <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={(event) => handleClick(event, form)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        id="long-menu"
                        MenuListProps={{
                          'aria-labelledby': 'long-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                      >
                        <MenuItem onClick={handleClose}>
                          <Link href={`/dashboard/group/detail/${currentFormID}`} sx={{ display: 'flex' }} underline='none'>
                            <VisibilityOutlinedIcon sx={{ marginRight: '5px', color: 'black' }} /> View
                          </Link>
                        </MenuItem>
                        <MenuItem onClick={() => { handleClose(); handleEditClick() }}>
                          <Link sx={{ display: 'flex' }} underline='none' onClick={() => setOpenPopUp(true)}   >
                            <EditOutlinedIcon sx={{ marginRight: '5px', color: 'black' }}>
                              <Popup title={isEditing ? 'Tạo mới Form' : 'Chỉnh sửa Form'} openPopup={openPopUp} setOpenPopup={setOpenPopUp} formId={currentFormID} >
                                <EditForm formId={currentFormID} setOpenPopup={setOpenPopUp} />
                              </Popup>
                            </EditOutlinedIcon>
                            Edit
                          </Link>
                        </MenuItem>
                      </Menu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

    </Box>
    <Stack spacing={2} sx={{ display: 'flex', justifyContent: 'center', margin: '10px', float: 'right' }}>
      <Pagination count={totalPages} color="primary" page={page} onChange={handlePageChange} />
    </Stack>
  </Container>
);
}
