"use client"
import React, { useState, useEffect } from 'react';
import { Box, Button, Container, FormControl, IconButton, InputLabel, Link, Menu, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, alpha } from '@mui/material';
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


// type Floor = {
//   id: string,
//   floorCode: string,
//   floorName: string,
//   description: string,
//   floorOrder: number,
//   basementOrder: number,
//   sortOrder: number,
//   notes: string,
//   createdAt: string,
//   updatedAt: string
// };

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
  Id: number;
  name: string;
};
type House = {
  HouseID: number;
  Name: string;
};

type Floor = {
  FloorID: number;
  Name: string;
  HouseID: number;
};

type Area = {
  AreaID: number;
  Name: string;
  FloorID: number;
};

type Criteria = {
  CriteriaID: number;
  Name: string;
  ratingtype?: string;
  tags?: Tag[];
};

type Form = {
  ID: string;
  Name: string;
  HouseID: number;
  FloorID: number;
  AreaID: number;
  Criteria: Criteria[];
};
const mockHouses: House[] = [
  { HouseID: 1, Name: 'Cơ sở A' },
  { HouseID: 2, Name: 'Cơ sở B' }
];

const mockFloors: { [key: number]: Floor[] } = {
  1: [
    { FloorID: 1, Name: 'Tầng 1', HouseID: 1 },
    { FloorID: 2, Name: 'Tầng 2', HouseID: 1 }
  ],
  2: [
    { FloorID: 3, Name: 'Tầng 1', HouseID: 2 },
    { FloorID: 4, Name: 'Tầng 2', HouseID: 2 }
  ]
};

const mockAreas: { [key: number]: Area[] } = {
  1: [
    { AreaID: 1, Name: 'Khu vực 1', FloorID: 1 },
    { AreaID: 2, Name: 'Khu vực 2', FloorID: 1 }
  ],
  2: [
    { AreaID: 3, Name: 'Khu vực 1', FloorID: 2 },
    { AreaID: 4, Name: 'Khu vực 2', FloorID: 2 }
  ],
  3: [
    { AreaID: 5, Name: 'Khu vực 1', FloorID: 3 },
    { AreaID: 6, Name: 'Khu vực 2', FloorID: 3 }
  ],
  4: [
    { AreaID: 7, Name: 'Khu vực 1', FloorID: 4 },
    { AreaID: 8, Name: 'Khu vực 2', FloorID: 4 }
  ]
};



const mockFormList: Form[] = [
]
const allFloors: Floor[] = Object.values(mockFloors).flatMap(floorArray => floorArray);
const allArea: Area[] = Object.values(mockAreas).flatMap(AreaArray => AreaArray);
export default function FourView() {
  const [formList, setFormList] = useState<Form[]>(mockFormList)
  const [campus, setCampus] = useState<Campus[]>([]);
  const [blocks, setBlocks] = useState<Blocks[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCampus, setSelectedCampus] = useState<string | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(Dayjs());
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [selectedArea, setSelectedArea] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [criteria, setCriteria] = useState<Criteria[]>([]);
  const [currentFormID, setCurrentFormID] = useState<string>('0');
  const [filterFormList, setFilterFormList] = useState<Form[]>(formList);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const fetchCampus = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await CampusService.getAllCampus();
        console.log('Dữ liệu Campus:', response.data);
        setCampus(response.data);
      } catch (error) {
        setError(error.message);
        console.error('Chi tiết lỗi:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCampus();
  }, []);
  const handleClick = (event: React.MouseEvent<HTMLElement>, form: Form) => {

    setCurrentFormID(form.ID);
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
    if (selectedHouse !== null) {
      setFloors(mockFloors[selectedHouse] || []);
      setSelectedFloor(null);
      setSelectedArea(null);
      setAreas([]);
      setCriteria([]);
      const formFilter = formList.filter(form => form.HouseID === selectedHouse);
      setFilterFormList(formFilter);
    }
  }, [selectedHouse]);

  useEffect(() => {
    if (selectedFloor !== null) {
      setAreas(mockAreas[selectedFloor] || []);
      setSelectedArea(null);
      setCriteria([]);
      const formFilter = formList.filter(form => form.HouseID === selectedHouse && form.FloorID === selectedFloor);
      setFilterFormList(formFilter);
    }
  }, [selectedFloor]);

  useEffect(() => {
    if (selectedArea !== null) {
      const formFilter = formList.filter(form => form.HouseID === selectedHouse && form.FloorID === selectedFloor && form.AreaID === selectedArea);
      setFilterFormList(formFilter);
    }
  }, [selectedArea]);

  const handleSave = (newForm: Form) => {
    console.log(newForm);
    if (formList.length !== 0) {
      formList.map((form) => {
        if (form.ID === newForm.ID) {
          form.Name = newForm.Name;
          form.HouseID = newForm.HouseID;
          form.FloorID = newForm.FloorID;
          form.AreaID = newForm.AreaID;
          form.Criteria = newForm.Criteria;
          console.log("OK")
        }
        else {
          const updatedFormList = [...formList, newForm];
          setFormList(updatedFormList);
          console.log("else")
        }
      })
    }
    else {
      const updatedFormList = [...formList, newForm];
      setFormList(updatedFormList);
    }
  };

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
  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4">Page four</Typography>
        <Button variant='contained' onClick={handleAddClick}>Tạo mới</Button>
        <Popup title={isEditing ? 'Tạo mới Form' : 'Chỉnh sửa Form'} openPopup={openPopUp} setOpenPopup={setOpenPopUp} >
          {isEditing ? (
            <EditForm Form={formList.find(c => c.ID === currentFormID) ?? {} as Form} onSave={handleSave} setOpenPopup={setOpenPopUp} />
          ) : (
            <AddForm FormList={formList} onSave={handleSave} setOpenPopup={setOpenPopUp} />
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

            <FormControl fullWidth sx={{ flex: 1 }}>
              <InputLabel id="demo-simple-select-label">Chọn cơ sở</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedCampus !== undefined ? selectedCampus?.toString() : ''}
                label="Chọn cơ sở"
                onChange={(e) => handleCampusSelect(e.target.value)}
              >
                {campus.map((c: any) => (
                  <MenuItem key={c.id} value={c.id}>{c.campusName}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ flex: 1 }} disabled={!selectedHouse}>
              <InputLabel id="demo-simple-select-floor-label">Chọn tầng</InputLabel>
              <Select
                labelId="demo-simple-select-floor-label"
                id="demo-simple-select-floor"
                value={selectedFloor || ''}
                label="Chọn tầng"
                onChange={(e) => setSelectedFloor(parseInt(e.target.value as string))}
              >
                {floors.map(floor => (
                  <MenuItem key={floor.FloorID} value={floor.FloorID}>{floor.Name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ flex: 1 }} disabled={!selectedFloor}>
              <InputLabel id="demo-simple-select-area-label">Chọn khu vực</InputLabel>
              <Select
                labelId="demo-simple-select-area-label"
                id="demo-simple-select-area"
                value={selectedArea || ''}
                label="Chọn khu vực"
                onChange={(e) => setSelectedArea(parseInt(e.target.value as string))}
              >
                {areas.map(area => (
                  <MenuItem key={area.AreaID} value={area.AreaID}>{area.Name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead sx={{ width: 1 }}>
                <TableRow>
                  <TableCell align='center' sx={{ width: '5px' }}>STT</TableCell>
                  <TableCell align='center'>Cơ sở</TableCell>
                  <TableCell align="center">Tầng</TableCell>
                  <TableCell align="center">Khu vực</TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterFormList.map((form) => (
                  <TableRow key={form.ID} sx={{ marginTop: '5px' }}>
                    <TableCell align='center' sx={{ width: '5px' }}>{form.ID}</TableCell>
                    <TableCell align='center'>
                      {mockHouses.map(house => house.HouseID === form.HouseID ? house.Name : '')}
                    </TableCell>
                    <TableCell align='center'>
                      {allFloors.map(floor => floor.FloorID === form.FloorID ? floor.Name : '')}
                    </TableCell>
                    <TableCell align='center'>
                      {allArea.map(area => area.AreaID === form.AreaID ? area.Name : '')}
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
                            <Link href={`/dashboard/group/details/${currentFormID}`} sx={{ display: 'flex' }} underline='none'>
                              <VisibilityOutlinedIcon sx={{ marginRight: '5px', color: 'black' }} /> View
                            </Link>
                          </MenuItem>
                          <MenuItem onClick={() => { handleClose(); handleEditClick() }}>
                            <Link sx={{ display: 'flex' }} underline='none' onClick={() => setOpenPopUp(true)}   >
                              <EditOutlinedIcon sx={{ marginRight: '5px', color: 'black' }}>
                                <Popup title={isEditing ? 'Tạo mới Form' : 'Chỉnh sửa Form'} openPopup={openPopUp} setOpenPopup={setOpenPopUp} formId={currentFormID} >
                                  {isEditing ? (
                                    <EditForm Form={formList.find(c => c.ID === currentFormID) ?? {} as Form} onSave={handleSave} setOpenPopup={setOpenPopUp} />
                                  ) : (
                                    <AddForm FormList={formList} onSave={handleSave} setOpenPopup={setOpenPopUp} />
                                  )
                                  }
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
    </Container>
  );
}
