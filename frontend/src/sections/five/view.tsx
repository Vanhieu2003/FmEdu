"use client"
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import "src/global.css";
import { Autocomplete, Button, Chip, FormControl, IconButton, InputLabel, Link, MenuItem, Popover, Popper, Select, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import RenderRatingInput from 'src/sections/components/rating/renderRatingInput';

import Popup from 'src/sections/components/form/Popup';
import AddCriteria from 'src/sections/components/form/AddCriteria';
import  CriteriaService  from 'src/@core/service/criteria';
import  TagService  from 'src/@core/service/tag';
import  RoomCategoryService  from 'src/@core/service/RoomCategory';
dayjs.locale('vi');

type Criteria = {
  id: string,
  criteriaName: string,
  roomCategoryId: string,
  criteriaType: string,
  createAt: string,
  updateAt: string,
  tags: Tag[],
  roomName:string
};
type Tag = {
  id: number;
  tagName: string;
};



export default function FiveView() {
  const [criteriaList, setCriteriaList] = useState<Criteria[]>([]);
  const [selectedCriteria, setSelectedCriteria] = useState<Criteria | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [allOptions, setAllOptions] = useState<Tag[]>(() => criteriaList.flatMap(criteria => criteria.tags || []));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isModified, setIsModified] = useState(false);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const [openAutocomplete, setOpenAutocomplete] = useState<{ [key: string]: boolean }>({});
  const [openPopUp, setOpenPopUp] = useState(false);


  const handleClose = () => {
    setAnchorEl(null);
    setSelectedCriteria(null);
  };

  useEffect(() => {
    const fetchCriteriaAndTags = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch Criteria
        const criteriaResponse = await CriteriaService.getAllCriteria();
        console.log('Dữ liệu Criteria:', criteriaResponse.data);
        
        // Fetch tags for each criteria
        const criteriaWithTags = await Promise.all(criteriaResponse.data.map(async (criteria: Criteria) => {
          try {
            const tagsResponse = await TagService.getTagsByCriteriaId(criteria.id);
            const roomCategoryResponse = await RoomCategoryService.getRoomCategoryById(criteria.roomCategoryId);
            return { ...criteria, tags: tagsResponse.data,roomName: roomCategoryResponse.data.categoryName };
          } catch (tagError) {
            console.error(`Lỗi khi lấy tags cho criteria ${criteria.id}:`, tagError);
            return { ...criteria, tags: [] };
          }
        }));
        setCriteriaList(criteriaWithTags);
      } catch (error) {
        setError(error.message);
        console.error('Chi tiết lỗi khi lấy Criteria:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchCriteriaAndTags();
  }, []);

  useEffect(() => {
    console.log("criteriaWithTags", criteriaList);
  }, [criteriaList]);
  

  // const handleTypeChange = (criteriaID: number, event: React.ChangeEvent<{ value: string }>) => {
  //   setRatingTypesSelected((prevTypes) => {
  //     const newTypes = {
  //       ...prevTypes,
  //       [criteriaID]: event.target.value as string,
  //     };
  //     // Check if any value is different from the default
  //     const isModified = Object.keys(newTypes).some(
  //       (id) => newTypes[parseInt(id)] !== mockCriteriaList.find((criteria) => criteria.criteriaID === parseInt(id))?.ratingType
  //     );
  //     setIsModified(isModified);
  //     return newTypes;
  //   });
  //   handleClose(); // Close the popover after changing the type
  // };

  const filteredCriteriaList = selectedCriteria
    ? criteriaList.filter((criteria) => criteria.id === selectedCriteria.id)
    : criteriaList;

  //   console.log("filteredCriteriaList",filteredCriteriaList)
  const handleAutocompleteChange = (criteriaID: string, newValue: (Tag | null)[]) => {
    const updatedTags = criteriaList.map((criteria) => {
      if (criteria.id === criteriaID) {
        return {
          ...criteria,
          tags: newValue.filter((tag): tag is Tag => tag !== null && tag !== undefined),
        };
      }
      return criteria;
    });
    setSelectedCriteria(
      updatedTags.find((criteria) => criteria.id === criteriaID) || null
    );
  };



  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={criteriaList}
          getOptionLabel={(option) => option.criteriaName}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Tìm kiếm tiêu chí" />}
          onChange={(event, newValue: Criteria | null) => setSelectedCriteria(newValue)}
        />
        <Button variant='contained' onClick={() => setOpenPopUp(true)}>Tạo mới</Button>
        <Popup title='Form đánh giá' openPopup={openPopUp} setOpenPopup={setOpenPopUp} >
          <AddCriteria setOpenPopup={setOpenPopUp} />
        </Popup>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead sx={{ width: 1 }}>
            <TableRow>
              <TableCell align='center'>Tiêu chí</TableCell>
              <TableCell align="center">Đánh giá</TableCell>
              <TableCell align="center">Khu vực</TableCell>
              <TableCell align="center">Phân loại</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCriteriaList.map((criteria) => (
              <TableRow key={criteria.id}>
                <TableCell>{criteria.criteriaName}</TableCell>
                <TableCell>
                  <Box sx={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <RenderRatingInput criteriaID={criteria.id} inputRatingType={criteria.criteriaType} disabled={true} />
                  </Box>
                </TableCell>
                <TableCell align="center">{criteria.roomName}</TableCell>
                <TableCell>
                  <Stack direction='row' spacing={1}>
                    {criteria.tags?.map((tag) =>
                      <Chip key={tag.id} label={tag.tagName} />
                    )}
                  </Stack>
                  {openAutocomplete[criteria.id] && (
                    <Autocomplete
                      multiple
                      id="tags-outlined"
                      options={criteria.tags || []}
                      freeSolo
                      value={criteria.tags || []}
                      onChange={(event, newValue) => handleAutocompleteChange(criteria.id, newValue as Tag[])}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Tiêu chí"
                          placeholder="Select or add criteria"
                        />
                      )}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {isModified && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="contained" onClick={() => console.log('Saving...')}>
            Lưu
          </Button>
        </Box>
      )}
    </Container>
  );
}
