// import React, { useState } from 'react'
// import ContentCard from '../../../components/card-content/ContentCard';
// import {
//     Radio
// } from "@material-tailwind/react";
// import { Helmet } from "react-helmet";
// import GateIPCard from './widgets/GateIP'
// import AOS from "aos";
// import "aos/dist/aos.css";
// import "../style.css";

// const Devices = () => {
//     const [view, setView] = useState('viewLocation')
//     AOS.init();
//     AOS.refresh();
//     return (
//         <>
//             <Helmet>
//                 <title>JICT OCR Monitoring | IP Mapping</title>
//             </Helmet>
//             <section className="bg-[#f3f4f7]  p-8 ml-4 mr-4 rounded-lg">
//                 <h3
//                     data-aos="zoom-in-right"
//                     data-aos-duration="1000"
//                     className="text-[#3d3d3d] font-bold text-2xl mb-4"
//                 >
//                     DEVICES
//                 </h3>
//                 <ContentCard>
//                     <div className="flex m-5">
//                         <div className="flex items-center me-4">
//                             <div className="flex md:gap-7 mb-5">
//                                 <Radio name="type" onClick={() => setView('viewLocation')} label="LOCATION" defaultChecked />
//                                 <Radio name="type" onClick={() => setView('viewIn')} label="IN" />
//                                 <Radio name="type" onClick={() => setView('viewOut')} label="OUT" />
//                                 <Radio name="type" onClick={() => setView('viewSwitch')} label="SWITCH" />
//                             </div>
//                         </div>
//                     </div>
//                     <GateIPCard view={view} />
//                 </ContentCard>
//             </section>
//         </>

//     )
// }

// export default Devices