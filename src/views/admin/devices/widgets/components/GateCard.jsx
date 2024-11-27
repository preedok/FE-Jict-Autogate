// // GateCard.js
// import React, {
//     useState, useEffect
// } from 'react';
// import {
//     Card,
//     CardHeader,
//     CardFooter,
//     Typography,
// } from "@material-tailwind/react";
// import Paper from '@mui/material/Paper';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import api from '../../../../../service/api';
// import FormGroup from '@mui/material/FormGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Switch from '@mui/material/Switch';
// import Tooltip from "@mui/material/Tooltip";
// import { Oval } from "react-loader-spinner";
// const renderField = (field) => {
//     return field !== '' && field !== null ? field : <span></span>;
// };

// const GateCard = ({ location, id}) => {
//     const [loading, setLoading] = useState(true);
//     const [gateFetch, setGateFetch] = useState({});
//     const [data, setData] = useState(null);
//     const [refreshEnabled, setRefreshEnabled] = useState(true);
//     const handleRefreshChange = () => {
//         setRefreshEnabled(!refreshEnabled);
//     };

//     useEffect(() => {
//         const fetchDataInterval = setInterval(() => {
//             if (refreshEnabled) {
//                 fetchData(id);
//             }
//         }, 5000);

//         return () => clearInterval(fetchDataInterval);

//     }, [id, refreshEnabled]);
//     const fetchData = async (id) => {
//         try {
//             setLoading(true);
//             const response = await api.get(`/Device/${id}`);
//             console.log('Data Status:', response.data ? response.data.status : 'No data');
//             if (response.status === 204) {
//                 setData(null);
//                 setGateFetch((prevGateFetch) => ({
//                     ...prevGateFetch,
//                     [id]: 'No data found for ' + id,
//                 }));
//             } else {
//                 setData(response.data);
//             }
//         } catch (error) {
//             setGateFetch((prevGateFetch) => ({
//                 ...prevGateFetch,
//                 [id]: 'No Gate found for ' + id,
//             }));
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchData(id);
//     }, [id]);
//     return (
//         <>
//             <Card style={{
//                 height: '300px',
//                 width: '100%',
//                 maxWidth: '385px',
//                 backgroundColor: data && data.status ? '#CDFAD5' : '#FDE5D4',
//             }} className="mt-10 w-full md:mb-0 flex-grow md:w-1/2 lg:w-1/3 xl:w-1/4">
//                 <CardHeader
//                     variant="gradient"
//                     style={{
//                         backgroundColor: data && data.status ? '#9ADE7B' : 'red',
//                         position: 'relative'
//                     }}
//                     className="mb-4 grid place-items-center relative"
//                 >
//                     <div style={{ position: 'absolute', top: 0, right: 0, marginTop: '5px' }}>
//                         <FormGroup>
//                             <Tooltip title={`Auto Refresh ${location}`} arrow>
//                                 <FormControlLabel
//                                     control={<Switch size="small" checked={refreshEnabled} onChange={handleRefreshChange} />}
//                                     className='text-white'
//                                 />
//                             </Tooltip>
//                         </FormGroup>
//                     </div>
//                     <div className="flex flex-col my-3 items-center">
//                         <Typography className="flex gap-3" variant="h5" color="white">
//                             {loading ? (
//                                 <Oval
//                                     height={23}
//                                     width={23}
//                                     color="#ffff"
//                                     wrapperStyle={{}}
//                                     wrapperClass=""
//                                     visible={true}
//                                     ariaLabel='oval-loading'
//                                     secondaryColor="#4fa94d"
//                                     strokeWidth={2}
//                                     strokeWidthSecondary={2}

//                                 />
//                             ) : (
//                                 <svg
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     fill="none"
//                                     viewBox="0 0 24 24"
//                                     strokeWidth="1.5"
//                                     stroke="currentColor"
//                                     className="w-6 h-6"
//                                 >
//                                     <path
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
//                                     />
//                                     <path
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
//                                     />
//                                 </svg>

//                             )}
//                             {location}
//                         </Typography>
//                     </div>
//                 </CardHeader>
//                 <p style={{ textAlign: 'center' }} className='my-2'>
//                     <span style={{ color: data && data.status ? 'green' : 'red' }}>
//                         {data && data.status ? 'Connected' : 'Not Connected'}
//                     </span>
//                 </p>
//                 <CardFooter>
//                     <Paper sx={{ width: '100%', overflow: 'hidden' }}>
//                         <TableContainer sx={{ maxHeight: 440, overflow: 'hidden' }}>
//                             <Table stickyHeader aria-label="sticky table">
//                                 <TableHead>
//                                     <TableRow>
//                                         <TableCell style={{ textAlign: 'center', backgroundColor: '#F9FAFC' }}>NAME</TableCell>
//                                         <TableCell style={{ textAlign: 'center', backgroundColor: '#F9FAFC' }}>IP</TableCell>
//                                         <TableCell style={{ textAlign: 'center', backgroundColor: '#F9FAFC' }}>INSTALATION</TableCell>
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     <TableRow>
//                                         <TableCell style={{ textAlign: 'center' }} className="container">
//                                             {renderField(data?.deviceName)}&nbsp;
//                                         </TableCell>
//                                         <TableCell style={{ textAlign: 'center' }}>
//                                             {renderField(data?.ip)}&nbsp;
//                                         </TableCell>
//                                         <TableCell style={{ textAlign: 'center' }}>
//                                             <div className={`px-3 py-1 text-white w-[90px] m-auto rounded-xl ${data?.responseTimeMs === 1 ? 'bg-[#8ADAB2]' : 'bg-red-500'}`}>
//                                                 {renderField(data?.responseTimeMs === 1 ? 'Done' : 'Not Done')}&nbsp;
//                                             </div>
//                                         </TableCell>
//                                     </TableRow>
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                     </Paper>
//                 </CardFooter>
//             </Card>
//         </>
//     );
// };

// export default GateCard;
