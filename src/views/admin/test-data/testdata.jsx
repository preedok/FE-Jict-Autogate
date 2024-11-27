import React, { useEffect, useState } from 'react'
import ContentCard from '../../../components/card-content/ContentCard';
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import AlbumIcon from '@mui/icons-material/Album';
import api from "../../../service/api";
import Swal from 'sweetalert2';
const TestData = () => {
    const [dataGate, setDataGate] = useState([]);
    const [gate, setGate] = useState('')
    const [combo, setCombo] = useState('combo')
    const [axle, setAxle] = useState('axle4')
    const handleChange2 = (event) => {
        setCombo(event.target.value);
    };
    const [loading, setLoading] = useState(false);
    const handleChange1 = (event) => {
        setGate(event.target.value);
    };
    const handleChange3 = (event) => {
        setAxle(event.target.value);
    };
    const getDataGate = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/Gate`);
            setDataGate(response.data);
        } catch (error) {
            console.error("Error fetching data: ", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        getDataGate()
    }, [])

    const [selectedFiles, setSelectedFiles] = useState({
        Top: null,
        Left: null,
        Right: null,
        Rear: null,
        'Rear-Zoom': null,
    });

    const [imageReady, setImageReady] = useState({
        Top: false,
        Left: false,
        Right: false,
        Rear: false,
        'Rear-Zoom': false,
    });

    const handleFileChange = (event, id) => {
        const fileInput = event.target;
        const file = fileInput.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target.result;
                const imageElement = document.getElementById(`image-${id}`);
                if (imageElement) {
                    imageElement.style.backgroundImage = `url(${imageUrl})`;
                    document.getElementById(`uploadText-${id}`).innerText = '';
                }
                setSelectedFiles((prevFiles) => ({ ...prevFiles, [id]: file }));
                setImageReady((prevImageReady) => ({ ...prevImageReady, [id]: true }));
            };

            reader.readAsDataURL(file);
        } else {
            const imageElement = document.getElementById(`image-${id}`);
            if (imageElement) {
                imageElement.style.backgroundImage = 'none';
                document.getElementById(`uploadText-${id}`).innerText = `Upload ${id}`;
            }
            setSelectedFiles((prevFiles) => ({ ...prevFiles, [id]: null }));
            setImageReady((prevImageReady) => ({ ...prevImageReady, [id]: false }));
        }
    };

    const handleButtonClick = async (id) => {
        try {
            setLoading(true);
            const selectedGate = dataGate.find((item) => item.gateName === gate);
            if (!selectedGate) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid gate selection',
                });
                return;
            }
            const selectedDevice = selectedGate.gateDevices.find((device) => device.deviceName.includes(`${gate}-${id}`));
            if (!selectedDevice) {
                Swal.fire({
                    icon: 'error',
                    title: `Invalid device selection: ${id}`,
                });
                return;
            }
            const ocrDevice = selectedDevice.deviceName;
            const selectedFile = selectedFiles[id];
            if (!selectedFile) {
                Swal.fire({
                    icon: 'error',
                    title: `Please select a file for ${id}`,
                });
                return;
            }
            const formData = new FormData();
            formData.append('imageFile', selectedFile);
            const response = await api.post(`/OCRData/image?OCRDevice=${ocrDevice}`, formData);
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Image uploaded successfully!',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to upload image',
                });
            }
            console.log('Server response:', response.data);
        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <section className="bg-[#f3f4f7] p-8 h-full rounded-lg">
                <div className='flex items-center justify-center mt-[-20px] gap-5'>
                    <div className="flex flex-col items-center justify-center space-y-4">
                        {/* transaction */}
                        <ContentCard>
                            <div style={{ height: '250px', width: '500px' }}>
                                Transaction
                            </div>
                        </ContentCard>

                        {/* Button */}
                        <ContentCard>
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <div className="flex space-x-4">
                                    <Button
                                        onClick={() => handleButtonClick('Left')}
                                        variant="contained"
                                        size="small"
                                        sx={{ backgroundColor: imageReady.Left ? '#A6CF98' : 'red', width: '156px', height: '76px' }}
                                    >
                                        LEFT
                                    </Button>
                                    <Button
                                        onClick={() => handleButtonClick('Top')}
                                        variant="contained"
                                        size="small"
                                        sx={{ backgroundColor: imageReady.Top ? '#A6CF98' : 'red', width: '156px', height: '76px' }}
                                    >
                                        TOP
                                    </Button>
                                    <Button
                                        onClick={() => handleButtonClick('Right')}
                                        variant="contained"
                                        size="small"
                                        sx={{ backgroundColor: imageReady.Right ? '#A6CF98' : 'red', width: '156px', height: '76px' }}
                                    >
                                        RIGHT
                                    </Button>
                                </div>
                                <div className="flex space-x-4">
                                    <Button
                                        onClick={() => handleButtonClick('Rear')}
                                        variant="contained"
                                        size="small"
                                        sx={{ backgroundColor: imageReady.Rear ? '#A6CF98' : 'red', width: '156px', height: '76px' }}
                                    >
                                        REAR
                                    </Button>
                                    <Button
                                        onClick={() => handleButtonClick('Rear-Zoom')}
                                        variant="contained"
                                        size="small"
                                        sx={{ backgroundColor: imageReady.Rear ? '#A6CF98' : 'red', width: '156px', height: '76px' }}
                                    >
                                        REAR-ZOOM
                                    </Button>
                                </div>
                            </div>
                        </ContentCard>
                    </div>

                    <div className='flex flex-col space-y-4'>
                        <ContentCard>
                            <div className='flex flex-col lg:flex-row items-center gap-4'>
                                <div className='flex flex-col'>
                                    <div style={{ height: '170px', width: '125px', borderRadius: '12px' }} className="flex px-4 items-center justify-center relative bg-gradient-to-t from-red-300 via-red-500 to-red-700">
                                        <FormControl fullWidth sx={{ backgroundColor: 'white', width: '256px' }}>
                                            <select
                                                id="demo-simple-select-helper"
                                                className="py-2 rounded-sm"
                                                value={gate || ''}
                                                onChange={handleChange1}
                                                size="small"
                                            >  <option selected>
                                                    Pilih Gate
                                                </option>
                                                {dataGate.map((item, index) => (
                                                    <option key={index} value={item.gateName}>
                                                        {item.gateName}
                                                    </option>
                                                ))}
                                            </select>
                                        </FormControl>
                                    </div>

                                    <div style={{ height: '60px', width: '125px', borderRadius: '12px' }} className="flex px-4 mt-3 items-center justify-center relative bg-gradient-to-t bg-gray-200">
                                    </div>
                                </div>

                                <div className='flex flex-col items-start justify-center space-y-4'>
                                    <div className='flex gap-5'>
                                        <FormControl fullWidth sx={{ backgroundColor: 'white', width: '100px' }}>
                                            <select
                                                id="demo-simple-select-helper"
                                                className="px-1 py-2 rounded-sm"
                                                value={combo}
                                                onChange={handleChange2}
                                                size="small"
                                                style={{ border: '1px solid black' }}
                                            >
                                                <option value="combo">COMBO</option>
                                                <option value="single">SINGLE</option>
                                                <option value="noContainer">NO CONTAINER</option>
                                            </select>
                                        </FormControl>
                                        <input
                                            type="text"
                                            placeholder="chassisLength"
                                            className='py-1 px-1 w-[140px]'
                                            style={{ border: '1px solid black' }}
                                        />
                                    </div>

                                    <div className='flex gap-4'>
                                        <div style={{ border: '2px solid #F3B664', width: '130px', height: '115px', borderRadius: '8px', backgroundColor: '#F3B664' }}>
                                            <div className="relative w-10 h-10 m-2 rounded-md bg-[#EAECCC] text-black">
                                            </div>
                                            <input
                                                type="text"
                                                placeholder='tagNumber'
                                                className="w-[110px] px-3 h-7 m-2 rounded-md bg-[#ffffff] text-black"
                                            />
                                        </div>
                                        <div className='flex flex-col'>
                                            <div className='flex items-start gap-4 mb-2'>
                                                {combo === 'single' && (
                                                    <div className="relative w-[250px] h-24 p-2 rounded-md bg-[#DF826C] text-black">
                                                        <div className="relative">
                                                            <input
                                                                type="text"
                                                                placeholder='container1'
                                                                className='py-1 px-1'
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {combo === 'combo' && (
                                                    <div className='flex items-start gap-4 mb-2'>
                                                        <div className="relative w-[250px] h-24 p-2 rounded-md bg-[#DF826C] text-black">
                                                            <input
                                                                type="text"
                                                                placeholder='container1'
                                                                className='py-1 px-1'
                                                            />
                                                        </div>
                                                        <div className="relative w-[250px] h-24 p-2 rounded-md bg-[#6DB9EF] text-black">
                                                            <input
                                                                type="text"
                                                                placeholder="container2"
                                                                className='py-1 px-1'
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {combo === 'noContainer' && (
                                                    null
                                                )}

                                            </div>
                                            {combo !== 'noContainer' && (
                                                <div className='h-4 w-[515px] bg-[#B0A695]'>
                                                </div>
                                            )}
                                        </div>

                                    </div>

                                    <div className='flex items-center gap-5 ms-10'>
                                        <AlbumIcon style={{ width: '60px', height: '60px' }} />
                                        <AlbumIcon style={{ width: '60px', height: '60px' }} />
                                        <div>
                                            <FormControl fullWidth sx={{ backgroundColor: 'white', width: '100px' }}>
                                                <select
                                                    id="demo-simple-select-helper"
                                                    className="px-1 py-2 rounded-sm"
                                                    value={axle || ''}
                                                    onChange={handleChange3}
                                                    size="small"
                                                    style={{ border: '1px solid black' }}
                                                >
                                                    <option value='axle4'>
                                                        AXLE 4
                                                    </option>
                                                    <option value='axle5'>
                                                        AXLE 5
                                                    </option>
                                                    <option value='axle6'>
                                                        AXLE 6
                                                    </option>
                                                </select>
                                            </FormControl>
                                        </div>
                                        <div className='flex items-start gap-5'>
                                            {axle === 'axle4' && (
                                                <>
                                                    <AlbumIcon style={{ width: '60px', height: '60px' }} />
                                                    <AlbumIcon style={{ width: '60px', height: '60px' }} />
                                                </>
                                            )}
                                            {axle === 'axle5' && (
                                                <>
                                                    <AlbumIcon style={{ width: '60px', height: '60px' }} />
                                                    <AlbumIcon style={{ width: '60px', height: '60px' }} />
                                                    <AlbumIcon style={{ width: '60px', height: '60px' }} />
                                                </>
                                            )}
                                            {axle === 'axle6' && (
                                                <>
                                                    <AlbumIcon style={{ width: '60px', height: '60px' }} />
                                                    <AlbumIcon style={{ width: '60px', height: '60px' }} />
                                                    <AlbumIcon style={{ width: '60px', height: '60px' }} />
                                                    <AlbumIcon style={{ width: '60px', height: '60px' }} />
                                                </>
                                            )}
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="platNo"
                                            className='py-1 px-1 w-[100px]'
                                            style={{ border: '1px solid black' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </ContentCard>

                        <ContentCard>
                            <div className="flex gap-10 justify-between">
                                <div className="flex flex-col gap-4">
                                    {/* top */}
                                    <div className="relative">
                                        <div
                                            id="image-Top"
                                            style={{ borderRadius: '9px' }}
                                            className="h-[87px] lg:w-[500px] w-full bg-yellow-300 flex items-center justify-center"
                                        >
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, 'Top')}
                                                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <span id="uploadText-Top" className="z-10">Upload Top</span>
                                        </div>
                                    </div>
                                    {/* right */}
                                    <div className="relative">
                                        <div
                                            id="image-Right"
                                            style={{ borderRadius: '9px' }}
                                            className="h-[87px] lg:w-[500px] w-full bg-yellow-300 flex items-center justify-center"
                                        >
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, 'Right')}
                                                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <span id="uploadText-Right" className="z-10">Upload Right</span>
                                        </div>
                                    </div>
                                    {/* left */}
                                    <div className="relative">
                                        <div
                                            id="image-Left"
                                            style={{ borderRadius: '9px' }}
                                            className="h-[87px] lg:w-[500px] w-full bg-yellow-300 flex items-center justify-center"
                                        >
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, 'Left')}
                                                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <span id="uploadText-Left" className="z-10">Upload Left</span>
                                        </div>
                                    </div>
                                </div>
                                {/* rear */}
                                <div className="flex flex-col ms-auto gap-4">
                                    <div className="relative">
                                        <div
                                            id="image-Rear"
                                            style={{ borderRadius: '9px' }}
                                            className="h-[190px] lg:w-[320px] w-full bg-yellow-300 flex items-center justify-center"
                                        >
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, 'Rear')}
                                                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <span id="uploadText-Rear" className="z-10">Upload Rear</span>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <div
                                            id="image-Rear-Zoom"
                                            style={{ borderRadius: '9px' }}
                                            className="h-[87px] lg:w-[320px] w-full bg-yellow-300 flex items-center justify-center"
                                        >
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, 'Rear-Zoom')}
                                                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <span id="uploadText-Rear-Zoom" className="z-10">Upload Rear-Zoom</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ContentCard>
                    </div>
                </div>
            </section>
        </>
    )
}

export default TestData
