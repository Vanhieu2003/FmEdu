// pages/upload.js
import { useEffect, useState } from 'react';
import FileService from 'src/@core/service/files';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Grid, IconButton, Modal } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React from 'react';


interface UploadProps {
    onImagesChange: (images: { [criteriaId: string]: string[] }) => void;
    criteriaId:string;
    images?:string[];
  }


export default function Upload({ onImagesChange,criteriaId,images}: UploadProps) {
    const [imageUrls, setImageUrls] = useState<string[]>(images?.length?images:[]);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [openModal, setOpenModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedImage(null);
    };


    // Hàm xử lý khi người dùng chọn file ảnh
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (e.target.files && e.target.files.length > 0) {
                const formData = new FormData();

                for (let i = 0; i < e.target.files.length; i++) {
                    formData.append('files', e.target.files[i]);
                }
                const res = await FileService.PostFile(formData);
                const newUrls = [...imageUrls, ...res.data.fileUrls];
                setImageUrls(newUrls);
                onImagesChange({ [criteriaId]: newUrls });
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        } catch (error) {
            console.error('Upload error:', error);
        }
    };
    
    const handleRemoveImage = async (urlToRemove: string) => {     
        const filename = urlToRemove.split('uploads/').pop();
        if (filename) {
            const res = await FileService.DeleteFile(filename);
            console.log(res)
            const newUrls = imageUrls.filter(url => url !== urlToRemove);
            setImageUrls(newUrls);
            onImagesChange({ [criteriaId]: newUrls }); // Thay đổi ở đây
        }
    };
 

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };
    return (
        <Box sx={{ padding: '20px' }}>
           <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                style={{ display: 'none' }}
                ref={fileInputRef}
            />
            <Button
                variant="contained"
                startIcon={<CloudUploadIcon />}
                onClick={handleButtonClick}
            >
                Chọn ảnh
            </Button>
            {imageUrls.length > 0 && (
                <Box>
                    <h3>Uploaded Images:</h3>
                    <Grid container spacing={2}>
                        {imageUrls.map((url, index) => (
                            <Grid item key={index}>
                                <Box sx={{ position: 'relative' }}>
                                    <img src={url} alt={`Uploaded ${index}`} width={100} height={100} style={{ objectFit: 'cover', cursor:'zoom-in' }} onClick={()=>handleImageClick(url)}/>
                                    <IconButton
                                        onClick={() => handleRemoveImage(url)}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            color: 'red'
                                        }}
                                        size="small"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                        maxHeight: "90%",
                        maxWidth: "90%",
                        overflow: "auto",
                    }}
                >
                    {selectedImage && (
                        <img
                            src={selectedImage}
                            alt="Zoomed"
                            style={{ width: "100%", height: "auto" }}
                        />
                    )}
                </Box>
            </Modal>
        </Box>
    );
}
