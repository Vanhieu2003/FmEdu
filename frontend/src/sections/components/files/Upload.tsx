// pages/upload.js
import { useEffect, useState } from 'react';
import FileService from 'src/@core/service/files';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Grid, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React from 'react';


interface UploadProps {
    onImagesChange: (images: string[]) => void;
  }


export default function Upload({ onImagesChange }: UploadProps) {
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

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
                onImagesChange(newUrls); // Gọi callback
            }
        } catch (error) {
            console.error('Upload error:', error);
        }
    };
    
    const handleRemoveImage = async (urlToRemove: string) => {
        console.log(urlToRemove)
        const filename = urlToRemove.split('uploads/').pop();
        if (filename) {
            const res = await FileService.DeleteFile(filename);
            console.log(res)
            const newUrls = imageUrls.filter(url => url !== urlToRemove);
            setImageUrls(newUrls);
            onImagesChange(newUrls); // Gọi callback
        }
    };
 

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };
    return (
        <div style={{ padding: '20px' }}>
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
                <div>
                    <h3>Uploaded Images:</h3>
                    <Grid container spacing={2}>
                        {imageUrls.map((url, index) => (
                            <Grid item key={index}>
                                <div style={{ position: 'relative' }}>
                                    <img src={url} alt={`Uploaded ${index}`} width={100} height={100} style={{ objectFit: 'cover' }} />
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
                                </div>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            )}
        </div>
    );
}
