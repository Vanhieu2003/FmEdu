import React, { useEffect, useState } from 'react';
import { Autocomplete, Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, IconButton, InputLabel, MenuItem, Popover, Select, TextField, Typography } from '@mui/material';
import RoomService from 'src/@core/service/room';
import BlockService from 'src/@core/service/block';
import CampusService from 'src/@core/service/campus';
import  CriteriaService  from 'src/@core/service/criteria';
import FloorService from 'src/@core/service/floor';
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
  id: string,
  criteriaName: string,
  roomCategoryId: string,
  criteriaType: string,
  tags?: Tag[]
};

type Form = {
  id?: string,
  formName: string,
  campusId: string,
  blockId: string,
  floorId: string,
  roomId: string,
  campusName?: string,
  blockName?: string,
  floorName?: string,
  roomName?: string
};



type AddFormProps = {
  onSave: (newForm: Form) => void;
  setOpenPopup: (open: boolean) => void;
}
const AddForm = ({ onSave, setOpenPopup }: AddFormProps) => {
  const [campus, setCampus] = useState<Campus[]>([]);
  const [blocks, setBlocks] = useState<Blocks[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [criteriaList, setCriteriaList] = useState<Criteria[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCampus, setSelectedCampus] = useState<string | null>(null);
  const [selectedBlocks, setSelectedBlocks] = useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedCriteriaList, setSelectedCriteriaList] = useState<Criteria[]>([]);

  const handleSave = async() => {
    if (selectedCampus === null) {
      alert('Vui lòng chọn cơ sở');
      return;
    }
    if (selectedBlocks === null) {
      alert('Vui lòng chọn tòa nhà');
      return;
    }
    if (selectedFloor === null) {
      alert('Vui lòng chọn tầng');
      return;
    }
    if (selectedRoom === null) {
      alert('Vui lòng chọn phòng');
      return;
    }

    const Criterialist = selectedCriteriaList;
    if (Criterialist.length === 0) {
      alert('Vui lòng chọn ít nhất 1 tiêu chí');
      return;
    }
    const newForm = {
      formName: 'Form2',
      campusId: selectedCampus,
      blockId: selectedBlocks,
      floorId: selectedFloor,
      roomId: selectedRoom,
      createAt: new Date().toISOString(),
      updateAt: new Date().toISOString()
    };
    const criteriaList = selectedCriteriaList;
    const formResponse = await CleaningFormService.postCleaningForm(newForm);
    console.log(newForm)
    const newCriteriaPerForm = {
        formId: formResponse.data.id,
        criteriaList: criteriaList.map((criteria) => ({id:criteria.id})),
    }
    console.log(newCriteriaPerForm)
    await CleaningFormService.postCriteriaPerForm(newCriteriaPerForm);
    onSave(newForm);
    setOpenPopup(false);
  }


  const handleCriteriaChange = (criteria: Criteria) => {
    setSelectedCriteriaList((prevSelectedCriteriaList) => {
      let newSelectedCriteriaList;
      if (prevSelectedCriteriaList.some((c) => c.id === criteria.id)) {
        newSelectedCriteriaList = prevSelectedCriteriaList.filter((c) => c.id !== criteria.id);
      } else {
        newSelectedCriteriaList = [...prevSelectedCriteriaList, criteria];
      }
      return newSelectedCriteriaList;
    });
    
  };
  useEffect(() => {
    const fetchCampus = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response1 = await CampusService.getAllCampus();
        setCampus(response1.data);
      }
      catch (error) {
        setError(error.message);
        console.error('Chi tiết lỗi:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCampus();
  }, []);

  useEffect(()=>{
    setSelectedBlocks(null);
    setSelectedFloor(null);
    setSelectedRoom(null);
  },[selectedCampus]);
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

  const handleRoomSelect = async (roomId:string)=>{
    var roomCategoryId = rooms.find(room=>room.id === roomId)?.roomCategoryId;
    console.log("room",roomCategoryId);
    const response = await CriteriaService.getCriteriaByRoomCategoryId(roomCategoryId||'');
    setCriteriaList(response.data);
    console.log("Data",response.data);
  }

  useEffect(()=>{
    console.log("Criteria",selectedCriteriaList);
  },[selectedCriteriaList]);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ position: 'relative' }}>
        <Autocomplete
          fullWidth
          sx={{marginY:2}}
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
          sx={{marginY:2}}
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
          sx={{marginY:2}}

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
          sx={{marginY:2}}
          options={rooms}
          getOptionLabel={(option: any) => option.roomName || ''}
          value={rooms.find(room => room.id === selectedRoom) || null}
          onChange={(event, newValue) => {
            if (newValue) {
              setSelectedRoom(newValue ? newValue.id : null);
              handleRoomSelect(newValue ? newValue.id : '');
            }
            else {
              setSelectedRoom(null);
              setCriteriaList([]);
            }
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
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {option.roomName}
            </li>
          )}
        />
        <Typography variant="h6">Chọn tiêu chí</Typography>
        <FormGroup>
          {criteriaList.map((criteria) => (
            <FormControlLabel
              key={criteria.id}
              control={<Checkbox checked={selectedCriteriaList.includes(criteria)} onChange={() => handleCriteriaChange(criteria)} />}
              label={criteria.criteriaName}
            />
          ))}
        </FormGroup>
      </Box>
      <Button onClick={handleSave} variant='outlined' sx={{ float: 'right' }}>Tạo</Button>
    </Box>
  );
};

export default AddForm;
