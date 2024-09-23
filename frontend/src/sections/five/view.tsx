"use client"
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import "src/global.css";
import { Autocomplete, Button, Chip, Stack, TextField, Pagination } from '@mui/material';
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
import DeleteIcon from '@mui/icons-material/Delete';
import Popup from 'src/sections/components/form/Popup';
import AddCriteria from 'src/sections/components/form/AddCriteria';
import CriteriaService from 'src/@core/service/criteria';
import TagService from 'src/@core/service/tag';
import RoomCategoryService from 'src/@core/service/RoomCategory';

dayjs.locale('vi');

type Criteria = {
  id: string,
  criteriaName: string,
  roomCategoryId: string,
  criteriaType: string,
  createAt: string,
  updateAt: string,
  tags: Tag[],
  roomName: string
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
  const [totalPages, setTotalPages] = useState(0);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [openAutocomplete, setOpenAutocomplete] = useState<{ [key: string]: boolean }>({});
  const [openPopUp, setOpenPopUp] = useState(false);
  const [page, setPage] = useState(1);


  const fetchCriteriaAndTags = async (pageNumber: number) => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch Criteria
      const criteriaResponse = await CriteriaService.getAllCriteria(pageNumber);
      const tagsResponse = await TagService.getAllTags();
      const totalPages = Math.ceil(criteriaResponse.data.totalValue / 10);
      setTotalPages(totalPages);

      // Fetch tags for each criteria
      const criteriaWithTags = await Promise.all(criteriaResponse.data.criterias.map(async (criteria: Criteria) => {
        try {
          const tagsResponse = await TagService.getTagsByCriteriaId(criteria.id);
          const roomCategoryResponse = await RoomCategoryService.getRoomCategoryById(criteria.roomCategoryId);
          return { ...criteria, tags: tagsResponse.data, roomName: roomCategoryResponse.data.categoryName };
        } catch (tagError) {
          console.error(`Lỗi khi lấy tags cho criteria ${criteria.id}:`, tagError);
          return { ...criteria, tags: [] };
        }
      }));
      setCriteriaList(criteriaWithTags);
      setAllTags(tagsResponse.data);
    } catch (error) {
      setError(error.message);
      console.error('Chi tiết lỗi khi lấy Criteria:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCriteriaAndTags(page);
    console.log("totalPages",totalPages);
  }, [page]);


  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  const filteredCriteriaList = criteriaList.filter((criteria) => {
    const matchesCriteria = !selectedCriteria || criteria.id === selectedCriteria.id;
    const matchesTags = selectedTags.length === 0 || selectedTags.every(selectedTag =>
      criteria.tags.some(tag => tag.tagName === selectedTag.tagName)
    );

    return matchesCriteria && matchesTags;
  });

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

  const handleTagChange = (event: any, newValue: Tag[]) => {
    const updatedTagsSelected: Tag[] = newValue.map((tag) => {
      return tag;
    });
    setSelectedTags(updatedTagsSelected);
  };

  const HandleRemoveCriteria = (criteriaId: string) => {
    CriteriaService.disableCriteria(criteriaId);
    alert('Xóa thành công');
    window.location.reload();
  }
  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={criteriaList}
            getOptionLabel={(option) => option.criteriaName}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Tìm kiếm tiêu chí" />}
            onChange={(event, newValue: Criteria | null) => setSelectedCriteria(newValue)}
          />
          <Autocomplete
            multiple
            options={allTags}
            getOptionLabel={(option) => option.tagName}
            value={selectedTags}
            sx={{ width: 300 }}
            onChange={(e, value) => handleTagChange(e, value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Lọc theo tag"
                placeholder="Chọn tag"
              />
            )}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip
                  label={option.tagName}
                  {...getTagProps({ index })}
                  key={option.id}
                />
              ))
            }
          />
        </Box>

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
              <TableCell align="center"></TableCell>
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
                <TableCell align="center">
                  <DeleteIcon sx={{ marginRight: '5px', color: 'black', cursor: 'pointer' }} onClick={() => HandleRemoveCriteria(criteria.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack spacing={2} sx={{ display: 'flex', justifyContent: 'center', margin: '10px', float: 'right' }}>
        <Pagination count={totalPages} color="primary" page={page} onChange={handlePageChange}/>
      </Stack>
    </Container>
  );
}
