import React, { useEffect, useState } from 'react';
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, IconButton, InputLabel, MenuItem, Popover, Select, TextField, Typography } from '@mui/material';

interface Tag {
  Id: number;
  name: string;
}
interface state {
  selected: null;
  hasError: false;
}
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
type Form = {
  ID: string;
  Name: string;
  HouseID: number;
  FloorID: number;
  AreaID: number;
  Criteria: Criteria[];
}
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

type Criteria = {
  CriteriaID: number;
  Name: string;
  ratingType?: string;
  tags?: Tag[];
};

type AddFormProps = {
  FormList: Form[];
  onSave: (newForm: Form) => void;
  setOpenPopup: (open: boolean) => void;
}
const AddForm = ({ FormList, onSave, setOpenPopup }: AddFormProps) => {
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [selectedArea, setSelectedArea] = useState<number | null>(null);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [selectedCriteriaList, setSelectedCriteriaList] = useState<Criteria[]>([]);

  const handleSave = () => {

    const idForm = String(FormList.length > 0 ? FormList[FormList.length - 1].ID + 1 : 1);

    //check if the user has selected House, Floor, Area
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
  }

  useEffect(() => {
    if (selectedHouse !== null) {
      setFloors(mockFloors[selectedHouse] || []);
      setSelectedFloor(null);
      setSelectedArea(null);
      setAreas([]);
    }

  }, [selectedHouse]);

  useEffect(() => {
    if (selectedFloor !== null) {
      setAreas(mockAreas[selectedFloor] || []);
      setSelectedArea(null);
    }

  }, [selectedFloor]);

  useEffect(() => {
  }, [selectedArea]);

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
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ position: 'relative' }}>
        <InputLabel id="demo-simple-select-floor-label">Chọn cơ sở</InputLabel>
        <Select
          labelId="demo-simple-select-floor-label"
          id="demo-simple-select-floor"
          value={selectedHouse}
          label="Chọn tầng"
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
        <InputLabel id="demo-simple-select-floor-label">Chọn khu vực</InputLabel>
        <Select
          labelId="demo-simple-select-floor-label"
          id="demo-simple-select-floor"
          value={selectedArea}
          label="Chọn tầng"
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
              control={<Checkbox checked={selectedCriteriaList.includes(criteria)} onChange={() => handleCriteriaChange(criteria)} />}
              label={criteria.Name}
            />
          ))}
        </FormGroup>
      </Box>
      <Button onClick={handleSave} variant='outlined' sx={{ float: 'right' }}>Tạo</Button>
    </Box>
  );
};

export default AddForm;
