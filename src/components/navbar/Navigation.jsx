import React, { useState, useEffect, useRef } from 'react';
import DropdownLogout from "./DropdownLogout";
import logo from "../../assets/jict-logo.png";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    Assessment as AssessmentIcon, ReceiptLong as ReceiptLongIcon, Dashboard as DashboardIcon, AccountBox as AccountBoxIcon,
    SettingsSuggest as SettingsSuggestIcon, Inventory as InventoryIcon, Adjust as AdjustIcon, PowerSettingsNew as PowerSettingsNewIcon,
    Cast as CastIcon, ContentPasteSearch as ContentPasteSearchIcon, GppBad as GppBadIcon, Notifications as NotificationsIcon,
    ExpandMore as ExpandMoreIcon, Close as CloseIcon
} from '@mui/icons-material';
import {
    Button, Box, Typography, Accordion, AccordionSummary,
    AccordionDetails, IconButton, Popover, Alert, AlertTitle, Badge
} from '@mui/material';
import { io } from 'socket.io-client';
import * as signalR from '@microsoft/signalr';
import ReactAudioPlayer from 'react-audio-player';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import StorageIcon from '@mui/icons-material/Storage';
import sound from '../../assets/antipolisi.mp3'
const NOTIFICATION_HUB_URL = import.meta.env.VITE_REACT_APP_API_URL;

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const location = useLocation();
    const currentPath = location.pathname;
    const dataUser = sessionStorage.getItem('role');
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [searchQuery, setSearchQuery] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [showBadge, setShowBadge] = useState(false);

    const [lastNotificationTime, setLastNotificationTime] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [autoCloseTimeout, setAutoCloseTimeout] = useState(null);
    const [progressWidth, setProgressWidth] = useState(100);

    useEffect(() => {
        if (currentPath === '/dashboard') {
            setActiveMenu('dashboard');
        } else if (currentPath === '/transaction') {
            setActiveMenu('transaction');
        }
    }, [currentPath]);

    const handleMenuClick = (menu, path) => {
        setActiveMenu(menu);
        if (menu === 'testdata') {
            setIsSidebarOpen(false);
        } else if (currentPath !== path) {
            setActiveMenu(menu);
        } else {
            setIsSidebarOpen(false);
        }
    };

    const navigate = useNavigate();

    const handleSearch = (event) => {
        event.preventDefault();
        navigate(`/search?query=${searchQuery}`);
    };

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${NOTIFICATION_HUB_URL}/notificationhub`, {
                accessTokenFactory: () => sessionStorage.getItem('jwtToken')
            })
            .build();

        connection.on("Alert", (notification) => {
            handleNewNotification(notification, 'alert');
        });

        connection.on("Init", (notifications) => {
            handleInitNotification(notifications);
        });

        connection.start().catch(err => console.error(err.toString()));

        return () => {
            connection.stop();
        };
    }, []);
    const audioRef = useRef(null);

    const handleNotificationClick = (event) => {
        setAnchorEl(event.currentTarget);
        setShowBadge(false);
        setPopoverOpen(true);
    };

    const playNotificationSound = () => {
        if (audioRef.current) {
            audioRef.current.audioEl.current.play();
        }
    };
    const MAX_NOTIFICATIONS = 10;
    const handleInitNotification = (notifications, type) => {
        setNotifications(notifications);
        setShowBadge(true);
    };
    const handleNewNotification = (notification, type) => {
        const now = new Date();
        const newNotification = { ...notification, time: now, type };
        setNotifications(prevNotifications => {
            const updatedNotifications = [...prevNotifications, newNotification].slice(-MAX_NOTIFICATIONS);
            return updatedNotifications;
        });

        setLastNotificationTime(now);
        setPopoverOpen(true);
        playNotificationSound();
        setShowBadge(true);

        if (document.visibilityState !== 'visible') {
            const visibilityChangeListener = () => {
                if (document.visibilityState === 'visible') {
                    playNotificationSound();
                    document.removeEventListener('visibilitychange', visibilityChangeListener);
                }
            };
            document.addEventListener('visibilitychange', visibilityChangeListener);
        }

        clearTimeout(autoCloseTimeout);
        const timeout = setTimeout(() => {
            handleClose();
        }, 4000);
        setAutoCloseTimeout(timeout);

        let progress = 100;
        const interval = setInterval(() => {
            progress -= 5;
            setProgressWidth(progress);
            if (progress <= 0) {
                clearInterval(interval);
                handleClose();
            }
        }, 200);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setPopoverOpen(false);
        setProgressWidth(100);
        clearTimeout(autoCloseTimeout);
        setShowBadge(true);
    };
    useEffect(() => {
        //const storedNotifications = JSON.parse(sessionStorage.getItem('notifications')) || [];
        // setNotifications(storedNotifications.map(notification => ({
        //     ...notification,
        //     time: new Date(notification.time)
        // })));
        setShowBadge(true);
    }, []);
    const open = Boolean(anchorEl) || popoverOpen;
    const id = open ? 'notification-popover' : undefined;

    const style = {
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: '10px',
        p: 4,
    };
    const iconColor = notifications.length > 0 ? '#7752FE' : 'black';
    const handleDeleteAllNotifications = () => {
        setNotifications([]);
        handleClose();
    };
    const notificationTime = new Date();

    const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    };

    const tanggalTerformat = notificationTime.toLocaleDateString('id-ID', options);

    const waktuTerformat = `${notificationTime.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    })}`;
    // const handleDeleteNotification = (index) => {
    //     setNotifications(prevNotifications => {
    //         const updatedNotifications = [...prevNotifications];
    //         updatedNotifications.splice(index, 1);
    //         return updatedNotifications;
    //     });
    // };

    const handleDeleteNotification = (index) => {
        setNotifications(prevNotifications => {
            const updatedNotifications = [...prevNotifications];
            updatedNotifications.splice(index, 1);
            if (updatedNotifications.length === 0) {
                setShowBadge(false);
            }
            return updatedNotifications;
        });
    };
    return (
        <>
            <ReactAudioPlayer
                src={sound}
                ref={audioRef}
                autoPlay={false}
                controls={false}
                style={{ display: 'none' }}

            />
            {/* Top Bar Navigation */}
            <nav className={`fixed w-full bg-[#f3f4f7] ${isSidebarOpen ? " transition-all duration-500 ease-out" : "transition-all duration-500 ease-out"} right-0`}>
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start rtl:justify-end">
                            {/* burger desktop */}
                            <img src={logo} className={`h-9 ms-4 hidden lg:inline ${isSidebarOpen ? 'transition-all duration-500 ease-out' : 'hidden transition-all duration-500 ease-out'}`} alt="Flowbite Logo" />
                            <button className="flex ms-2 md:me-20" onClick={() => setIsSidebarOpen(!isSidebarOpen)} >
                                <svg className={`w-6 h-6 mt-1 md:ms-9 ${isSidebarOpen ? "text-[#7752FE]" : ""}`} aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                                </svg>
                            </button>
                            <form onSubmit={handleSearch} className="flex gap-2 ">
                                <input
                                    type="text"
                                    id="myInput"
                                    name="myInput"
                                    placeholder='Pencarian...'
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ textTransform: 'uppercase' }}
                                    className="shadow bg-[#d8feff] appearance-none border rounded w-full py-2 px-3 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                                />
                                <Button sx={{ backgroundColor: '#7752FE' }} variant='contained' type="submit">
                                    <ContentPasteSearchIcon fontSize='small' /> Search
                                </Button>
                            </form>
                            <div className={`${isSidebarOpen ? 'hidden transition-all duration-500 ease-out' : ' transition-all duration-500 ease-out'}`}>
                                <ul className="flex items-center ms-5 gap-2 justify-center  md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0  ">
                                    <li onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
                                        <p onClick={() => handleMenuClick('dashboard')} className={`flex gap-3 items-center p-2 rounded-lg text-gray-500 ${activeMenu === 'dashboard' ? 'bg-[#7752FE] dark:bg-[#7752FE] text-white' : 'hover:bg-[#7752FE] dark:hover:bg-[#7752FE]  group'
                                            }`}>
                                            <DashboardIcon />
                                            <Link to='/dashboard' className='hidden lg:inline'>Dashboard</Link>
                                        </p>
                                    </li>

                                    <li onClick={() => navigate('/transaction')} style={{ cursor: 'pointer' }}>
                                        <p onClick={() => handleMenuClick('transaction', '/transaction')} className={`flex gap-3 items-center p-2 rounded-lg text-gray-500 ${activeMenu === 'transaction' ? 'bg-[#7752FE] dark:bg-[#7752FE] text-white' : 'hover:bg-[#7752FE] dark:hover:bg-[#7752FE] group'}`}
                                        >
                                            <ReceiptLongIcon />
                                            <Link to='/transaction'>Transaction</Link>
                                        </p>
                                    </li>
                                    <li onClick={() => navigate('/autogateerror')} style={{ cursor: 'pointer' }}>
                                        <p onClick={() => handleMenuClick('autogateerror', '/autogateerror')} className={`flex gap-3 items-center p-2 rounded-lg text-gray-500 ${activeMenu === 'autogateerror' ? 'bg-[#7752FE] dark:bg-[#7752FE] text-white' : 'hover:bg-[#7752FE] dark:hover:bg-[#7752FE] group'}`}
                                        >
                                            <GppBadIcon />
                                            <Link to='/autogateerror'>AutoGate Error</Link>
                                        </p>
                                    </li>
                                    {dataUser === "Admin" || dataUser === "SUPERADMIN" ? (
                                        <li onClick={() => navigate('/ocr')} style={{ cursor: 'pointer' }}>
                                            <p onClick={() => handleMenuClick('ocr')} className={`flex gap-3 items-center p-2 rounded-lg text-gray-500 ${activeMenu === 'ocr' ? 'bg-[#7752FE] dark:bg-[#7752FE]  text-white' : 'hover:bg-[#7752FE] dark:hover:bg-[#7752FE] group'
                                                }`}>
                                                <AdjustIcon />
                                                <Link to='/ocr' className='hidden lg:inline'>OCR Data</Link>
                                            </p>
                                        </li>
                                    ) : null}

                                    <li onClick={() => navigate('/gate')} style={{ cursor: 'pointer' }}>
                                        <p onClick={() => handleMenuClick('gate')} className={`flex gap-3 items-center p-2 rounded-lg text-gray-500 ${activeMenu === 'gate' ? 'bg-[#7752FE] dark:bg-[#7752FE]  text-white' : 'hover:bg-[#7752FE] dark:hover:bg-[#7752FE] group'
                                            }`}>
                                            <InventoryIcon />
                                            <Link to='/gate' className='hidden lg:inline'>Gate</Link>
                                        </p>
                                    </li>
                                    <li onClick={() => navigate('/server')} style={{ cursor: 'pointer' }}>
                                        <p onClick={() => handleMenuClick('server')} className={`flex gap-3 items-center p-2 rounded-lg text-gray-500 ${activeMenu === 'server' ? 'bg-[#7752FE] dark:bg-[#7752FE] text-white' : 'hover:bg-[#7752FE] dark:hover:bg-[#7752FE]  group'
                                            }`}>
                                            <StorageIcon />
                                            <Link to='/server' className='hidden lg:inline'>Server</Link>
                                        </p>
                                    </li>
                                    {dataUser === "Admin" || dataUser === "SUPERADMIN" ? (
                                        <li onClick={() => navigate('/config')} style={{ cursor: 'pointer' }}>
                                            <p onClick={() => handleMenuClick('config')} className={`flex gap-3 items-center p-2 rounded-lg text-gray-500 ${activeMenu === 'config' ? 'bg-[#7752FE] dark:bg-[#7752FE]  text-white' : 'hover:bg-[#7752FE] dark:hover:bg-[#7752FE] group'
                                                }`}>
                                                <PowerSettingsNewIcon />
                                                <Link to='/config' className='hidden lg:inline'>Config</Link>
                                            </p>
                                        </li>
                                    ) : null}
                                </ul>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="flex items-center  gap-2">
                                <h5 className='hidden lg:inline'>{sessionStorage.getItem('fullname')}</h5>
                                <IconButton onClick={handleNotificationClick}>
                                    <Badge
                                        badgeContent={showBadge ? notifications.length : 0}
                                        color="error"
                                        sx={{
                                            '& .MuiBadge-badge': {
                                                top: 9,
                                                right: 7,
                                                border: `2px solid ${iconColor}`,
                                                padding: '0 4px',
                                                backgroundColor: '#ff0000',
                                                color: '#fff'
                                            },
                                            mr: 2,
                                        }}
                                    >
                                        <NotificationsIcon
                                            sx={{
                                                color: iconColor,
                                                width: 40,
                                                height: 40,
                                            }}
                                        />
                                    </Badge>
                                </IconButton>
                                <DropdownLogout />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            {/* Side Bar Navigation */}
            <div className={`fixed top-0 left-0 w-52 h-screen mt-16 transition-transform -translate-x-full sm:translate-x-0`} aria-label="Sidebar">
                <div className={`h-full px-3 pb-4 overflow-y-auto bg-[#f3f4f7] ${isSidebarOpen ? 'transition-all duration-500 ease-out' : 'hidden transition-all duration-500 ease-out'}`}>
                    <ul className="space-y-2 font-medium mt-6 ms-2 ">
                        <li onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
                            <p onClick={() => handleMenuClick('dashboard')} className={`flex gap-3 items-center p-2 rounded-lg text-gray-500 ${activeMenu === 'dashboard' ? 'bg-[#7752FE] dark:bg-[#7752FE] text-white' : 'hover:bg-[#7752FE] dark:hover:bg-[#7752FE]  group'
                                }`}>
                                <DashboardIcon />
                                <Link to='/dashboard'>Dashboard</Link>
                            </p>
                        </li>
                        <li onClick={() => navigate('/transaction')} style={{ cursor: 'pointer' }}>
                            <p onClick={() => handleMenuClick('transaction', '/transaction')} className={`flex gap-3 items-center p-2 rounded-lg text-gray-500 ${activeMenu === 'transaction' ? 'bg-[#7752FE] dark:bg-[#7752FE] text-white' : 'hover:bg-[#7752FE] dark:hover:bg-[#7752FE] group'}`}
                            >
                                <ReceiptLongIcon />
                                <Link to='/transaction'>Transaction</Link>
                            </p>
                        </li>
                        <li onClick={() => navigate('/autogateerror')} style={{ cursor: 'pointer' }}>
                            <p onClick={() => handleMenuClick('autogateerror', '/autogateerror')} className={`flex gap-3 items-center p-2 rounded-lg text-gray-500 ${activeMenu === 'autogateerror' ? 'bg-[#7752FE] dark:bg-[#7752FE] text-white' : 'hover:bg-[#7752FE] dark:hover:bg-[#7752FE] group'}`}
                            >
                                <GppBadIcon />
                                <Link to='/autogateerror'>AutoGate Error</Link>
                            </p>
                        </li>
                        {dataUser === "Admin" || dataUser === "SUPERADMIN" ? (
                            <li onClick={() => navigate('/ocr')} style={{ cursor: 'pointer' }}>
                                <p onClick={() => handleMenuClick('ocr')} className={`flex gap-3 items-center p-2 rounded-lg text-gray-500 ${activeMenu === 'ocr' ? 'bg-[#7752FE] dark:bg-[#7752FE]  text-white' : 'hover:bg-[#7752FE] dark:hover:bg-[#7752FE] group'
                                    }`}>
                                    <AdjustIcon />
                                    <Link to='/ocr' className='hidden lg:inline'>OCR Data</Link>
                                </p>
                            </li>
                        ) : null}
                        {dataUser === "Admin" || dataUser === "SUPERADMIN" ? (
                        <li onClick={() => navigate('/gate')} style={{ cursor: 'pointer' }}>
                            <p onClick={() => handleMenuClick('gate')} className={`flex gap-3 items-center p-2 rounded-lg text-gray-500 ${activeMenu === 'gate' ? 'bg-[#7752FE] dark:bg-[#7752FE]  text-white' : 'hover:bg-[#7752FE] dark:hover:bg-[#7752FE] group'
                                }`}>
                                <InventoryIcon />
                                <Link to='/gate' className='hidden lg:inline'>Gate</Link>
                            </p>
                        </li>
                        ) : null}
                        {dataUser === "Admin" || dataUser === "SUPERADMIN" ? (
                        <li onClick={() => navigate('/server')} style={{ cursor: 'pointer' }}>
                            <p onClick={() => handleMenuClick('server')} className={`flex gap-3 items-center p-2 rounded-lg text-gray-500 ${activeMenu === 'server' ? 'bg-[#7752FE] dark:bg-[#7752FE] text-white' : 'hover:bg-[#7752FE] dark:hover:bg-[#7752FE]  group'
                                }`}>
                                <StorageIcon />
                                <Link to='/server' className='hidden lg:inline'>Server</Link>
                            </p>
                            </li>
                        ) : null}
                        {dataUser === "Admin" || dataUser === "SUPERADMIN" ? (
                            <li onClick={() => navigate('/config')} style={{ cursor: 'pointer' }}>
                                <p onClick={() => handleMenuClick('config')} className={`flex gap-3 items-center p-2 rounded-lg text-gray-500 ${activeMenu === 'config' ? 'bg-[#7752FE] dark:bg-[#7752FE]  text-white' : 'hover:bg-[#7752FE] dark:hover:bg-[#7752FE] group'
                                    }`}>
                                    <PowerSettingsNewIcon />
                                    <Link to='/config'>Config</Link>
                                </p>
                            </li>
                        ) : null}
                    </ul>
                </div>
            </div>

            {/* popup notif */}
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                sx={{ marginTop: '50px' }}
            >
                <Box sx={style}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: 'red',
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <Box className='flex gap-1'>
                        <Typography id="modal-title" variant="h6" component="h2">
                            Notifications
                        </Typography>
                        {notifications.length > 1 && (
                            <IconButton
                                onClick={handleDeleteAllNotifications}
                                aria-label="delete"
                                sx={{ color: 'red', marginTop:'-3px', marginLeft:'-3px' }}
                            >
                                <ClearAllIcon />
                            </IconButton>
                        )}
                    </Box>
                    <Box id="modal-description" sx={{ mt: 2 }}>
                        {notifications.length > 0 ? (
                            <>
                                {notifications.slice().reverse().map((notification, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            mb: 2,
                                            p: 2,
                                            borderRadius: '10px',
                                            backgroundColor: index === 0 ? '#B4D4FF' : '#e0f7fa',
                                            border: index === 0 ? '2px solid #124076' : '#e0f7fa',
                                        }}
                                    >
                                        <Box sx={{ flexShrink: 0, mr: 2 }}>
                                            <NotificationsIcon sx={{ color: '#00796b' }} />
                                        </Box>
                                        <Box sx={{ flexGrow: 1 }}>

                                            <Typography variant="body2" sx={{ color: '#973131' }}>
                                                {`${notification.user} - ${tanggalTerformat}  ${waktuTerformat}`}
                                            </Typography>



                                            <Typography variant="p" sx={{ fontWeight: 'bold', color: '#4a4a4a' }}>
                                                {notification.message}
                                            </Typography>
                                        </Box>
                                        <IconButton
                                            onClick={() => handleDeleteNotification(index)}
                                            aria-label="delete"
                                            sx={{ ml: 2, color: 'red' }}
                                        >
                                            <DeleteForeverIcon />
                                        </IconButton>
                                    </Box>
                                ))}
                                {/* Progress bar untuk auto close */}
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 2 }}>
                                    <Box sx={{ height: 5, width: '100%', backgroundColor: '#ddd', borderRadius: 5 }}>
                                        <Box
                                            sx={{
                                                height: '100%',
                                                width: `${progressWidth}%`,
                                                backgroundColor: '#00796b',
                                                borderRadius: 5,
                                                transition: 'width 0.2s ease-in-out',
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </>
                        ) : (
                            <Alert severity="error" icon={<GppBadIcon fontSize="inherit" />}>
                                <AlertTitle>No new notifications</AlertTitle>
                                You have no new notifications at this time.
                            </Alert>
                        )}
                    </Box>
                </Box>
            </Popover>
        </>
    );
};

export default Sidebar;