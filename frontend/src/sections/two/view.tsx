'use client';

import { useSettingsContext } from 'src/components/settings';
import { useEffect, useState } from 'react';
import {
  Container, Typography, Box, TextField, Paper, TableContainer, Table, TableHead, TableRow,
  TableCell, TableBody, MenuItem, FormControl, InputLabel, Select
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/vi';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Link from '@mui/material/Link';
import moment from 'moment';
import RenderProgressBar from '../components/renderProgressBar';
import CampusService from 'src/@core/service/campus';
import BlockService from 'src/@core/service/block';
import FloorService from 'src/@core/service/floor';
import axios from 'axios';

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






type Criteria = {
  CriteriaID: number;
  Name: string;
  AreaID: number;
};



const mockCleaningCriteria: { [key: string]: Criteria[] } = {
  1: [
    { CriteriaID: 1, Name: 'Tiêu chí 1', AreaID: 1 },
    { CriteriaID: 2, Name: 'Tiêu chí 2', AreaID: 1 },
    { CriteriaID: 22, Name: 'Tiêu chí 3', AreaID: 1 },
    { CriteriaID: 23, Name: 'Tiêu chí 4', AreaID: 1 },
    { CriteriaID: 24, Name: 'Tiêu chí 5', AreaID: 1 }
  ],
  2: [
    { CriteriaID: 3, Name: 'Tiêu chí 1', AreaID: 2 },
    { CriteriaID: 4, Name: 'Tiêu chí 2', AreaID: 2 }
  ],
  3: [
    { CriteriaID: 5, Name: 'Tiêu chí 1', AreaID: 3 },
    { CriteriaID: 6, Name: 'Tiêu chí 2', AreaID: 3 }
  ],
  4: [
    { CriteriaID: 7, Name: 'Tiêu chí 1', AreaID: 4 },
    { CriteriaID: 8, Name: 'Tiêu chí 2', AreaID: 4 }
  ],
  5: [
    { CriteriaID: 9, Name: 'Tiêu chí 1', AreaID: 5 },
    { CriteriaID: 10, Name: 'Tiêu chí 2', AreaID: 5 }
  ],
  6: [
    { CriteriaID: 11, Name: 'Tiêu chí 1', AreaID: 6 },
    { CriteriaID: 12, Name: 'Tiêu chí 2', AreaID: 6 }
  ],
  7: [
    { CriteriaID: 13, Name: 'Tiêu chí 1', AreaID: 7 },
    { CriteriaID: 14, Name: 'Tiêu chí 2', AreaID: 7 }
  ],
  8: [
    { CriteriaID: 15, Name: 'Tiêu chí 1', AreaID: 8 },
    { CriteriaID: 16, Name: 'Tiêu chí 2', AreaID: 8 }
  ]
};

const mockReports = [
  { ReportID: 1, Date: '2024-05-01', CampusName: "Cơ sở A1 Nơ Trang Long", BlockName: "Tòa nhà 1", FloorName: 'Tầng 1', RoomName: 'Phòng học 1' },
  { ReportID: 2, Date: '2024-05-02', CampusName: "Cơ sở 351 Lạc Long Quân", BlockName: "Tòa nhà 1", FloorName: 'Tầng 2', RoomName: 'Phòng học 1' },
  { ReportID: 3, Date: '2024-05-03', CampusName: "Cơ sở 280 An Dương Vương", BlockName: "Tòa nhà 1", FloorName: 'Tầng 1', RoomName: 'Phòng học 1' },
  { ReportID: 4, Date: '2024-05-04', CampusName: "Cơ sở 222 Lê Văn Sỹ", BlockName: "Tòa nhà 1", FloorName: 'Tầng 2', RoomName: 'Phòng học 1' },
  { ReportID: 5, Date: '2024-05-03', CampusName: "Cơ sở 115 Hai Bà Trưng", BlockName: "Tòa nhà 1", FloorName: 'Tầng 1', RoomName: 'Phòng học 1' },
  { ReportID: 6, Date: '2024-05-04', CampusName: "Cơ sở Thuận An - Bình Dương", BlockName: "Tòa nhà 1", FloorName: 'Tầng 2', RoomName: 'Phòng học 1' },
];
// ----------------------------------------------------------------------

export default function TwoView() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentReportID, setCurrentReportID] = useState<any>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>, report: any) => {
    setAnchorEl(event.currentTarget);
    setCurrentReportID(report.ReportID);
  };

  const handleClose = () => {
    setAnchorEl(null);

  };

  const settings = useSettingsContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [campus, setCampus] = useState<Campus[]>([]);
  const [blocks, setBlocks] = useState<Blocks[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [selectedCampus, setSelectedCampus] = useState<string | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);
  const [selectedDateFormatted, setSelectedDateFormat] = useState<string|null>(null);
  const [reports, setReports] = useState<any[]>(mockReports);

  const filterReports = () => {
    let filteredReports = mockReports;
    if (selectedCampus !== null) {
      filteredReports = filteredReports.filter(report => report.CampusName === campus.find(campus => campus.id === selectedCampus)?.campusName);
    }
    if (selectedBlock !== null) {
      filteredReports = filteredReports.filter(report => report.BlockName === blocks.find(block => block.id === selectedBlock)?.blockName);
    }
    if (selectedFloor !== null) {
      filteredReports = filteredReports.filter(report => report.FloorName === floors.find(floor => floor.id === selectedFloor)?.floorName);
    }
    if (selectedRoom !== null) {
      filteredReports = filteredReports.filter(report => report.RoomName === rooms.find(room => room.id === selectedRoom)?.roomName);
    }
    if (selectedDate !== null && moment(selectedDate).isValid()) {
      const selectedDateISO = selectedDate.toDate().toISOString();
      console.log('Selected Date ISO:', selectedDateISO);
      
      const dateFormatted = moment(selectedDateISO).format('YYYY-MM-DD');
      console.log('Date Formatted:', dateFormatted);
      
      setSelectedDateFormat(dateFormatted);
      
      // Sử dụng dateFormatted trực tiếp thay vì selectedDateFormatted
      filteredReports = filteredReports.filter(report => report.Date === dateFormatted);
      console.log('Filtered Reports:', filteredReports);
    }
  
    if (filteredReports.length > 0) {
      setReports(filteredReports);
    } else {
      setReports([]);
    }
    
    // Sử dụng callback để log giá trị mới nhất của reports
    setReports(newReports => {
      console.log('Updated Reports:', newReports);
      return newReports;
    });
  };
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

  useEffect(() => {
    filterReports();

  }, [selectedCampus, selectedBlock, selectedFloor, selectedRoom,selectedDate]);

  useEffect(() => {
    if (selectedCampus !== null) {
      setSelectedBlock(null);
      setSelectedFloor(null);
      setSelectedRoom(null);
    }
  }, [selectedCampus]);
  const handleCampusSelect = async (CampusId: string) => {
    try {
      setSelectedCampus(CampusId);
      const response = await BlockService.getBlockByCampusId(CampusId);
      setBlocks(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tòa nhà:', error);
    }
  };

  const handleBlockSelect = async (BlockId: string) => {
    setSelectedBlock(BlockId);
    try {
      const response = await FloorService.getFloorByBlockId(BlockId);
      setFloors(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tầng:', error);
    }
  };

  const handleFloorSelect = async (floorId: string) => {
    setSelectedFloor(floorId);
    try {
      const response = await axios.get(`http://localhost:8000/api/Rooms/Floor/${floorId}`);
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
      <Typography variant="h4">Danh sách báo cáo vệ sinh hằng ngày</Typography>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
        marginBottom: 2,
        marginTop: 2,
      }}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
          <DatePicker
            label="Chọn thời gian"
            value={selectedDate}
            onChange={(newDate: any) => {
              if (newDate && moment(newDate).isValid()) {
                setSelectedDate(newDate);
              }
            }}
            onAccept={(newDate) => {
              if (newDate && moment(newDate).isValid()) {
                setSelectedDate(newDate);
              }
            }}
            format="DD/MM/YYYY"
            
          />
        </LocalizationProvider>
        <FormControl fullWidth sx={{ flex: 1 }}>
          <InputLabel id="demo-simple-select-label">Chọn cơ sở</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedCampus || ''}
            label="Chọn cơ sở"
            onChange={(e) => handleCampusSelect(e.target.value)}
          >
            {campus.map(campus => (
              <MenuItem key={campus.id} value={campus.id}>{campus.campusName}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ flex: 1 }}>
          <InputLabel id="demo-simple-select-label">Chọn tòa nhà</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedBlock !== undefined ? selectedBlock?.toString() : ''}
            label="Chọn tòa nhà"
            onChange={(e) => handleBlockSelect(e.target.value)}
          >
            {blocks.length === 0 ? (
              <MenuItem value="no_data" disabled>Không có dữ liệu tòa nhà</MenuItem>
            ) : (
              blocks.map((block: any) => (
                <MenuItem key={block.id} value={block.id}>{block.blockName}</MenuItem>
              ))
            )}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ flex: 1 }}>
          <InputLabel id="demo-simple-select-floor-label">Chọn tầng</InputLabel>
          <Select
            labelId="demo-simple-select-floor-label"
            id="demo-simple-select-floor"
            value={selectedFloor !== undefined ? selectedFloor?.toString() : ''}
            label="Chọn tầng"
            onChange={(e) => handleFloorSelect(e.target.value)}
          >
            {floors.length === 0 ? (
              <MenuItem value="no_data" disabled>Không có dữ liệu tầng</MenuItem>
            ) : (
              floors.map(floor => (
                <MenuItem key={floor.id} value={floor.id}>{floor.floorName}</MenuItem>
              ))
            )}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ flex: 1 }}>
          <InputLabel id="demo-simple-select-area-label">Chọn phòng</InputLabel>
          <Select
            labelId="demo-simple-select-area-label"
            id="demo-simple-select-area"
            value={selectedRoom !== undefined ? selectedRoom?.toString() : ''}
            label="Chọn khu vực"
            onChange={(e) => setSelectedRoom(e.target.value)}
          >
            {rooms.length === 0 ? (
              <MenuItem value="no_data" disabled>Không có dữ liệu phòng</MenuItem>
            ) : (
              rooms.map(room => (
                <MenuItem key={room.id} value={room.id}>{room.roomName}</MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="Danh sách báo cáo vệ sinh">
          <TableHead>
            <TableRow>
              <TableCell align="center">Ngày</TableCell>
              <TableCell align="center">Cơ sở</TableCell>
              <TableCell align="center">Tòa nhà</TableCell>
              <TableCell align="center">Tầng</TableCell>
              <TableCell align="center">Phòng</TableCell>
              <TableCell align="center">Tiến độ</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map(report => (
              <TableRow key={report.ReportID}>
                <TableCell align="center">{dayjs(report.Date).format('DD/MM/YYYY')}</TableCell>
                <TableCell align="center">{report.CampusName}</TableCell>
                <TableCell align="center">{report.BlockName}</TableCell>
                <TableCell align="center">{report.FloorName}</TableCell>
                <TableCell align="center">{report.RoomName}</TableCell>
                <TableCell align="center"><RenderProgressBar progress={80} /></TableCell>
                <TableCell align="center">
                  <div>
                    <IconButton
                      aria-label="more"
                      id="long-button"
                      aria-controls={open ? 'long-menu' : undefined}
                      aria-expanded={open ? 'true' : undefined}
                      aria-haspopup="true"
                      onClick={(event) => handleClick(event, report)}
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
                        <Link href={`/dashboard/two/details/${currentReportID}`} sx={{ display: 'flex' }} underline='none'>
                          <VisibilityOutlinedIcon sx={{ marginRight: '5px', color: 'black' }} /> View
                        </Link>
                      </MenuItem>
                      <MenuItem onClick={handleClose}>
                        <Link href={`/dashboard/two/edit/${currentReportID}`} sx={{ display: 'flex' }} underline='none' >
                          <EditOutlinedIcon sx={{ marginRight: '5px', color: 'black' }} /> Edit
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
    </Container>
  );
}
