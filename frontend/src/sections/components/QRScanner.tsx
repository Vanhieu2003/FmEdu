// components/QRCodeScanner.tsx

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
    Button, 
    Modal, 
    Box, 
    IconButton, 
    Typography,
    styled
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const StyledModal = styled(Modal)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
});

const ModalContent = styled(Box)(({ theme }) => ({
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '8px',
    padding: theme.spacing(4),
    maxWidth: '90vw',
    maxHeight: '90vh',
    outline: 'none'
}));

const CloseButton = styled(IconButton)({
    position: 'absolute',
    right: 8,
    top: 8
});

const QRCodeScanner: React.FC = () => {
    const qrReaderRef = useRef<HTMLDivElement | null>(null);
    const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const key = searchParams.get('key');


    const requestCameraPermission = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                await navigator.mediaDevices.getUserMedia({ video: true });
                console.log("Camera permission granted.");
                startScanner(); // Chỉ khởi động trình quét sau khi có quyền truy cập
            } catch (error) {
                console.error("Camera permission denied:", error);
                alert("Vui lòng cấp quyền truy cập camera để sử dụng tính năng quét QR.");
                setIsModalOpen(false); // Đóng modal nếu không có quyền truy cập
            }
        } else {
            console.error("Camera API không được hỗ trợ trên trình duyệt này.");
            alert("Trình duyệt của bạn không hỗ trợ quyền truy cập camera.");
            setIsModalOpen(false);
        }
    };
    useEffect(() => {
        if (key) {
            //Gọi API để lấy ra thông tin form
        }
    }, [searchParams]);

    const startScanner = () => {
        if (qrReaderRef.current) {
            const html5QrCode = new Html5Qrcode(qrReaderRef.current.id);
            html5QrCodeRef.current = html5QrCode;

            html5QrCode.start(
                { facingMode: 'environment' },
                {
                    fps: 10,
                    qrbox:300,
                },
                (decodedText, decodedResult) => {
                    setResult(decodedText);
                    if (isValidUrl(decodedText)) {
                        router.replace(decodedText);
                    } else {
                        console.warn('Nội dung không phải là URL hợp lệ:', decodedText);
                    }
                },
                (errorMessage) => {
                    console.warn('Lỗi quét: ', errorMessage);
                }
            ).catch((err) => {
                console.error('Lỗi khởi động camera: ', err);
            });
        }
    };

    const stopScanner = () => {
        const html5QrCode = html5QrCodeRef.current;
        if (html5QrCode) {
            html5QrCode.stop().then(() => {
                html5QrCode.clear();
                setIsScanning(false);
                setIsModalOpen(false);
            }).catch((err) => {
                console.error('Lỗi khi dừng quét: ', err);
            });
        }
    };

    const handleStartButtonClick = () => {
        setIsScanning(true);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (isModalOpen) {
            setTimeout(() => {
                requestCameraPermission();
            }, 300); // Độ trễ 300ms
        } else {
            stopScanner();
        }
    }, [isModalOpen]);

    const isValidUrl = (text: string): boolean => {
        try {
            new URL(text);
            return true;
        } catch {
            return false;
        }
    };

    return (
        <div>
            <Button 
                onClick={handleStartButtonClick} 
                disabled={isScanning} 
                variant='contained'
            >
                Quét Mã QR
            </Button>

            <StyledModal
                open={isModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="qr-scanner-modal"
            >
                <ModalContent>
                    <CloseButton onClick={handleCloseModal}>
                        <CloseIcon />
                    </CloseButton>

                    <Typography variant="h6" component="h2" color='#000'>
                        Quét Mã QR
                    </Typography>

                    <Box sx={{ mt: 2 }}>
                        <div 
                            id="qr-reader" 
                            ref={qrReaderRef} 
                            style={{ 
                                width: '300px', 
                           
                                margin: '0 auto'
                            }}
                        />
                    </Box>

                    {result && (
                        <Typography sx={{ mt: 2 }}>
                            Kết quả: {result}
                        </Typography>
                    )}
                </ModalContent>
            </StyledModal>
        </div>
    );
};

export default QRCodeScanner;
