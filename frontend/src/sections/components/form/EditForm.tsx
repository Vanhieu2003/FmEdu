"use client"
import React, { useEffect, useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { floor } from 'lodash';
import  RoomService  from '@mui/icons-material';
import  BlockService from 'src/@core/service/block';
import  FloorService  from 'src/@core/service/floor';

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
  id: string,
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



const mockCriteriaList = [
  { CriteriaID: 1, Name: 'Lau kính và vách buồng xung quanh thang máy' },
  { CriteriaID: 2, Name: 'Thường xuyên kiểm tra thang máy có vết dơ làm ngay' },
  { CriteriaID: 3, Name: 'Xịt mùi thơm' },
  { CriteriaID: 4, Name: 'Lau quét bụi trần, quạt gió' },
  { CriteriaID: 5, Name: 'Đánh bóng vách bên trong' },
  { CriteriaID: 6, Name: "Hút bụi và lau sàn thang máy" },
  { CriteriaID: 7, Name: "Kiểm tra và làm sạch nút bấm trong thang máy" },
  { CriteriaID: 8, Name: "Làm sạch gương và tay vịn trong thang máy" },
  { CriteriaID: 9, Name: "Lau chùi cửa thang máy cả bên trong và bên ngoài" },
  { CriteriaID: 10, Name: "Kiểm tra và làm sạch các khe cửa thang máy" },
  { CriteriaID: 11, Name: "Đảm bảo thùng rác (nếu có) trong thang máy luôn sạch sẽ" },
  { CriteriaID: 12, Name: "Kiểm tra và thay đèn chiếu sáng nếu cần" },
  { CriteriaID: 13, Name: "Đảm bảo không có mùi khó chịu trong thang máy" },
  { CriteriaID: 14, Name: "Làm sạch và kiểm tra hệ thống thông gió của thang máy" },
  { CriteriaID: 15, Name: "Kiểm tra và vệ sinh các biển chỉ dẫn và bảng thông báo" }
];

type EditFormProps = {
  Form: Form;
  onSave: (newForm: Form) => void;
  setOpenPopup: (open: boolean) => void;
};

const EditForm = ({ Form, onSave, setOpenPopup }: EditFormProps) => {
  const [Campus, setCampus] = useState<Campus[]>([]);
  const [Blocks, setBlocks] = useState<Blocks[]>([]);
  const [Floors, setFloors] = useState<Floor[]>([]);
  const [Rooms, setRooms] = useState<Room[]>([]);
  const [Criteria, setCriteria] = useState<Criteria[]>([]);
  const [selectedHouse, setSelectedHouse] = useState<number | null>(Form.HouseID);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(Form.FloorID);
  const [selectedArea, setSelectedArea] = useState<number | null>(Form.AreaID);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [selectedCriteriaList, setSelectedCriteriaList] = useState<Criteria[]>(Form.Criteria);

  console.log("floor: ", selectedFloor)
  useEffect(() => {
    setSelectedHouse(Form.HouseID);
    setSelectedFloor(Form.FloorID);
    setSelectedArea(Form.AreaID);
    setSelectedCriteriaList(Form.Criteria);
  }, [Form]);

  useEffect(() => {
    if (selectedHouse !== null) {
      setFloors(mockFloors[selectedHouse] || []);
      setAreas([]);
    }
  }, [selectedHouse]);

  useEffect(() => {
    if (selectedFloor !== null) {
      setAreas(mockAreas[selectedFloor] || []);
    }
  }, [selectedFloor]);

  const handleCriteriaChange = (criteria: Criteria) => {
    setSelectedCriteriaList((prevSelectedCriteriaList) => {
      let newSelectedCriteriaList;
      if (prevSelectedCriteriaList.some((c) => c.CriteriaID === criteria.CriteriaID)) {
        newSelectedCriteriaList = prevSelectedCriteriaList.filter((c) => c.CriteriaID !== criteria.CriteriaID);
      } else {
        newSelectedCriteriaList = [...prevSelectedCriteriaList, criteria];
      }
      return newSelectedCriteriaList;
    });
  };

  const handleSave = () => {
    const idForm = Form.ID;

    if (selectedHouse === null) {
      alert('Vui lòng chọn cơ sở');
      return;
    }
    if (selectedFloor === null) {
      alert('Vui lòng chọn tầng');
      return;
    }
    if (selectedArea === null) {
      alert('Vui lòng chọn khu vực');
      return;
    }

    const Criterialist = selectedCriteriaList;
    if (Criterialist.length === 0) {
      alert('Vui lòng chọn ít nhất 1 tiêu chí');
      return;
    }

    const newForm: Form = {
      ID: idForm, // Dummy ID for the new Form
      Name: 'Form1',
      HouseID: selectedHouse || 1,
      FloorID: selectedFloor || 1,
      AreaID: selectedArea || 1,
      Criteria: Criterialist
    };
    onSave(newForm);
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
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ position: 'relative' }}>
        <InputLabel id="demo-simple-select-house-label">Chọn cơ sở</InputLabel>
        <Select
          labelId="demo-simple-select-house-label"
          id="demo-simple-select-house"
          value={selectedHouse}
          label="Chọn cơ sở"
          onChange={(e) => setSelectedHouse(parseInt(e.target.value as string))}
          sx={{ width: "100%" }}
        >
          {mockHouses.map(house => (
            <MenuItem key={house.HouseID} value={house.HouseID}>{house.Name}</MenuItem>
          ))}
        </Select>

        <InputLabel id="demo-simple-select-floor-label">Chọn tầng</InputLabel>
        <Select
          labelId="demo-simple-select-floor-label"
          id="demo-simple-select-floor"
          value={selectedFloor}
          label="Chọn tầng"
          onChange={(e) => setSelectedFloor(parseInt(e.target.value as string))}
          sx={{ width: "100%" }}
          disabled={!selectedHouse}
        >
          {floors.map(floor => (
            <MenuItem key={floor.FloorID} value={floor.FloorID}>{floor.Name}</MenuItem>
          ))}
        </Select>

        <InputLabel id="demo-simple-select-area-label">Chọn khu vực</InputLabel>
        <Select
          labelId="demo-simple-select-area-label"
          id="demo-simple-select-area"
          value={selectedArea}
          label="Chọn khu vực"
          onChange={(e) => setSelectedArea(parseInt(e.target.value as string))}
          sx={{ width: "100%" }}
          disabled={!selectedFloor}
        >
          {areas.map(area => (
            <MenuItem key={area.AreaID} value={area.AreaID}>{area.Name}</MenuItem>
          ))}
        </Select>

        <Typography variant="h6">Chọn tiêu chí</Typography>
        <FormGroup>
          {mockCriteriaList.map((criteria) => (
            <FormControlLabel
              key={criteria.CriteriaID}
              control={<Checkbox checked={selectedCriteriaList.some(c => c.CriteriaID === criteria.CriteriaID)} onChange={() => handleCriteriaChange(criteria)} />}
              label={criteria.Name}
            />
          ))}
        </FormGroup>
      </Box>
      <Button onClick={handleSave} variant='outlined' sx={{ float: 'right' }}>Tạo</Button>
    </Box>
  );
};

export default EditForm;
