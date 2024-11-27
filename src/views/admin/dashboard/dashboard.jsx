import React, { useState } from 'react'
import ContentCard from '../../../components/card-content/ContentCard';
import {
    Radio
} from "@material-tailwind/react";
import { Helmet } from "react-helmet";
import GateAllCard from './widgets/GateAll'
import AOS from "aos";
import "aos/dist/aos.css";
import "../style.css";

const Dashboard = () => {
    const [view, setView] = useState('viewAll')
    AOS.init();
    AOS.refresh();
    return (
        <>
            <Helmet>
                <title>JICT OCR Monitoring | Dashboard</title>
            </Helmet>
            <section className="bg-[#f3f4f7]  p-8 ml-4 mr-4 rounded-lg">
                <h3
                    data-aos="zoom-in-right"
                    data-aos-duration="1000"
                    className="text-[#3d3d3d] font-bold text-2xl mb-4"
                >
                    OCR DASHBOARD
                </h3>
                <ContentCard>
                    <div className="flex m-5">
                        <div className="flex items-center me-4">
                            <div className="flex md:gap-7 mb-5">
                                <Radio name="type" onClick={() => setView('viewAll')} label="ALL" defaultChecked />
                                <Radio name="type" onClick={() => setView('viewIn')} label="IN" />
                                <Radio name="type" onClick={() => setView('viewOut')} label="OUT" />
                            </div>
                        </div>
                    </div>
                    <GateAllCard view={view} />
                </ContentCard>
            </section>
        </>

    )
}

export default Dashboard