// import React, { useState, useEffect } from 'react';
// import AOS from 'aos';
// import 'aos/dist/aos.css';
// import GateCard from './components/GateCard';
// import api from '../../../../service/api';

// const GateIP = ({ view }) => {
//     AOS.init();
//     AOS.refresh();
//     const [gateData, setGateData] = useState([]);
//     const [searchInput, setSearchInput] = useState('');
//     const [sortOrder, setSortOrder] = useState('asc');
//     const fetchGateData = async () => {
//         try {
//             const response = await api.get('/Device');
//             if (response.status === 200) {
//                 setGateData(response.data);
//             } else {
//                 console.error('Failed to fetch gate data:', response);
//             }
//         } catch (error) {
//             console.error('Error fetching gate data:', error);
//         }
//     };
//     useEffect(() => {
//         fetchGateData();
//     }, []);
//     const handleSearchInputChange = (e) => {
//         setSearchInput(e.target.value);
//     };
//     const handleSortOrderChange = (e) => {
//         setSortOrder(e.target.value);
//     };
//     const renderGateCards = (locationType) => {
//         const filteredGates = gateData.filter(
//             (gate) => gate.locationType.toLowerCase() === locationType.toLowerCase() &&
//                 (gate.deviceName.toLowerCase().includes(searchInput.toLowerCase()) ||
//                     gate.ip.toLowerCase().includes(searchInput.toLowerCase()) ||
//                     gate.location.toLowerCase().includes(searchInput.toLowerCase()) ||
//                     gate.status.toLowerCase().includes(searchInput.toLowerCase()))
//         );
//         const sortedGates = filteredGates.sort((gate1, gate2) => {
//             const fieldToSortBy = 'location';
//             const value1 = gate1[fieldToSortBy].toLowerCase();
//             const value2 = gate2[fieldToSortBy].toLowerCase();

//             if (sortOrder === 'asc') {
//                 return value1.localeCompare(value2);
//             } else {
//                 return value2.localeCompare(value1);
//             }
//         });
//         const renderedCards = sortedGates.map((gate) => (
//             <GateCard
//                 key={gate.id}
//                 location={`${gate.location}`}
//                 gateDevice={gate.gateDevice}
//                 id={gate.id}
//                 className="w-full md:w-1/2 lg:w-1/3"
//             />
//         ));
//         return renderedCards;
//     };
//     return (
//         <div>
//             <div className='flex gap-2 justify-end relative'>
//                 {/* <select
//                     className="block p-2 border border-gray-300 rounded-md mb-2"
//                 >
//                     <option selected>Filter</option>
//                     <option value="location">Location</option>
//                 </select> */}
//                 <select
//                     className="block p-2 border border-gray-300 rounded-md mb-2"
//                     value={sortOrder}
//                     onChange={handleSortOrderChange}
//                 >
//                     <option value="asc">ASC</option>
//                     <option value="desc">DESC</option>
//                 </select>
//                 <input
//                     type="text"
//                     id="myInput"
//                     name="myInput"
//                     placeholder='Search...'
//                     value={searchInput}
//                     onChange={handleSearchInputChange}
//                     className="block p-2 border h-[36px] border-gray-300 rounded-md shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 />
//             </div>
//             {/* Gate IN Cards */}
//             {view === 'viewLocation' || view === 'viewIn' ? (
//                 <>
//                     <div>
//                         <h1 style={{ fontSize: '20px', fontWeight: '600', textAlign: 'center' }}>
//                             LIST DEVICE IN
//                         </h1>
//                         <div className='w-16 h-1 bg-[#7752FE] m-auto'></div>
//                     </div>

//                     <div className="flex flex-col justify-center m-3 md:flex-row md:flex-wrap px-3 mt-10  gap-4 ">
//                         {renderGateCards('IN')}
//                     </div>
//                 </>
//             ) : null}

//             {/* Gate OUT Cards */}
//             {view === 'viewLocation' || view === 'viewOut' ? (
//                 <>
//                     <div className='mt-10'>
//                         <h1 style={{ fontSize: '20px', fontWeight: '600', textAlign: 'center' }}>
//                             LIST DEVICE OUT
//                         </h1>
//                         <div className='w-16 h-1 bg-[#7752FE] m-auto'></div>
//                     </div>

//                     <div className="flex flex-col justify-center m-3 md:flex-row md:flex-wrap px-3 mt-10  gap-4 ">
//                         {renderGateCards('OUT')}
//                     </div>
//                 </>
//             ) : null}

//             {view === 'viewLocation' || view === 'viewSwitch' ? (
//                 <>
//                     <div className='mt-10'>
//                         <h1 style={{ fontSize: '20px', fontWeight: '600', textAlign: 'center' }}>
//                             SWITCH
//                         </h1>
//                         <div className='w-16 h-1 bg-[#7752FE] m-auto'></div>
//                     </div>

//                     <div className="flex flex-col justify-center m-3 md:flex-row md:flex-wrap px-3 mt-10  gap-4 ">
//                         {renderGateCards('SWITCH')}
//                     </div>
//                 </>
//             ) : null}

//         </div>
//     );
// };

// export default GateIP;