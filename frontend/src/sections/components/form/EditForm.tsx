"use client"
import React, { useEffect, useState } from 'react';
import { Autocomplete, Box, Button, Checkbox, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import RoomService from 'src/@core/service/room';
import BlockService from 'src/@core/service/block';
import FloorService from 'src/@core/service/floor';
import CleaningFormService from 'src/@core/service/form';
import CampusService from 'src/@core/service/campus';
import CriteriaService  from 'src/@core/service/criteria';

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
  CriteriaList?: Criteria[];
};

type EditFormProps = {
  formId: string;
  setOpenPopup: (open: boolean) => void;
};

const EditForm = ({ formId, setOpenPopup }: EditFormProps) => {
  const [campus, setCampus] = useState<Campus[]>([]);
  const [blocks, setBlocks] = useState<Blocks[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [form, setForm] = useState<Form>();
  const [formWithInfo, setFormWithInfo] = useState<any>();
  const [selectedCampus, setSelectedCampus] = useState<string | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [criteriaList, setCriteriaList] = useState<Criteria[]>([]);
  const [selectedCriteriaList, setSelectedCriteriaList] = useState<Criteria[] | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await CleaningFormService.getFormById(formId);
        const response2 = await CampusService.getAllCampus();
        const response3 = await CriteriaService.getCriteriaByFormId(formId);
        setForm(response1.data);
        setCampus(response2.data);
        setSelectedCriteriaList(response3.data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu form:', error);
      }
    };
    fetchData();

    setSelectedCriteriaList(criteriaList);
  }, [formId]);

  useEffect(() => {
    console.log("criteriaList",selectedCriteriaList);
  }, [selectedCriteriaList]);

  useEffect(() => {
    setSelectedCampus(form?.campusId || '');
    setSelectedBlock(form?.blockId || '');
    setSelectedFloor(form?.floorId || '');
    setSelectedRoom(form?.roomId || '');

    const fetchData = async () => {
      if (!form) return;

      try {
        const [CampusName, BlockName, FloorName, RoomName] = await Promise.all([
          CampusService.getCampusById(form.campusId || ''),
          BlockService.getBlockById(form.blockId || ''),
          FloorService.getFloorById(form.floorId || ''),
          RoomService.getRoomById(form.roomId || '')
        ]);

        const formWithFullInfo = {
          ...form,
          campusName: CampusName.data.campusName,
          blockName: BlockName.data.blockName,
          floorName: FloorName.data.floorName,
          roomName: RoomName.data.roomName
        };
        setFormWithInfo(formWithFullInfo);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin chi tiết:', error);
      }
    };

    fetchData();
  }, [form]);

  useEffect(() => {
    if (selectedCampus) {
      handleCampusSelect(selectedCampus);
    }
    if (selectedBlock) {
      handleBlockSelect(selectedBlock);
    }
    if (selectedFloor) {
      handleFloorSelect(selectedFloor);
    }
    if (selectedRoom) {
      handleRoomSelect(selectedRoom);
    }
  }, [selectedCampus, selectedBlock, selectedFloor,selectedRoom]);

  const handleCriteriaChange = (criteria: Criteria) => {
    setSelectedCriteriaList((prevSelectedCriteriaList) => {
      let newSelectedCriteriaList;
      if (prevSelectedCriteriaList?.some((c) => c.id === criteria.id)) {
        newSelectedCriteriaList = prevSelectedCriteriaList?.filter((c) => c.id !== criteria.id);
      } else {
        newSelectedCriteriaList = [...(prevSelectedCriteriaList || []), criteria];
      }
      return newSelectedCriteriaList;
    });
  };

  const handleSave = async() => {
    const idForm = form?.id;

    if (selectedCampus === null) {
      alert('Vui lòng chọn cơ sở');
      return;
    }
    if (selectedBlock === null) {
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
    if (Criterialist?.length === 0) {
      alert('Vui lòng chọn ít nhất 1 tiêu chí');
      return;
    }
    const newCriteria = selectedCriteriaList;
    const newForm = {
      formId: idForm, // Dummy ID for the new Form
      campusId: selectedCampus,
      blockId: selectedBlock,
      floorId: selectedFloor,
      roomId: selectedRoom,
      criteriaList: newCriteria?.map((criteria) => ({ id: criteria.id }))
    };
    console.log("newForm",newForm);
    await CleaningFormService.EditCleaningForm(newForm);
    window.location.reload();
    setOpenPopup(false);
  };

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
    const response = await CriteriaService.getCriteriaByRoomId(roomId);
    setCriteriaList(response.data);
  }

  useEffect(() => {
    console.log("criteriaList",criteriaList);
    console.log("selectedCriteriaList",selectedCriteriaList);
  }, [criteriaList,selectedCriteriaList]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ position: 'relative' }}>
        <Autocomplete
          fullWidth
          sx={{ marginY: 2 }}
          disabled={true}
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
              setSelectedBlock(null);
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
          sx={{ marginY: 2 }}
          disabled={true}
          options={blocks}
          getOptionLabel={(option: any) => option.blockName || ''}
          value={blocks.find((b: any) => b.id === selectedBlock) || null}
          onChange={(event, newValue) => {
            if (newValue) {
              setSelectedBlock(newValue ? newValue.id : null);
              handleBlockSelect(newValue ? newValue.id : '');
            }
            else {
              setSelectedBlock(null);
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
          sx={{ marginY: 2 }}
          fullWidth
          disabled={true}
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
          sx={{ marginY: 2 }}
          fullWidth
          disabled={true}
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
              control={<Checkbox checked={selectedCriteriaList?.some(selectedCriteria => selectedCriteria.id === criteria.id)} 
              onChange={() => handleCriteriaChange(criteria)} />}
              label={criteria.criteriaName}
            />
          ))}
        </FormGroup>
      </Box>
      <Button onClick={handleSave} variant='outlined' sx={{ float: 'right' }}>Sửa</Button>
    </Box>
  );
};

export default EditForm;
