import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import GateCard from './components/GateCard';
import { isAuth } from '../../../../utils/token';
import api from '../../../../service/api';
const GateAll = ({ view }) => {
    AOS.init();
    AOS.refresh();
    const [gateData, setGateData] = useState([]);
    const fetchGateData = async () => {
        const token = isAuth()
        try {
            const response = await api.get('/Gate', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                setGateData(response.data);
            } else {
                console.error('Failed to fetch gate data:', response);
            }
        } catch (error) {
            console.error('Error fetching gate data:', error);
        }
    };
    useEffect(() => {
        fetchGateData();
    }, []);
    const renderGateCards = (gateType) => {
        const filteredGates = gateData.filter(
            (gate) => gate.type.toLowerCase() === gateType.toLowerCase()
        );
        return filteredGates.map((gate) => (
            <GateCard
                key={gate.gateName}
                isActive={gate.active}
                title={`${gate.gateName}`}
                gateName={gate.gateName}
                className="w-full md:w-1/2 lg:w-1/3"
            />
        ));
    };
    return (
        <div>
            {/* Gate IN Cards */}
            {view === 'viewAll' || view === 'viewIn' ? (
                <>
                    <div>
                        <h1 style={{ fontSize: '20px', fontWeight: '600', textAlign: 'center' }}>
                            GATE IN
                        </h1>
                        <div className='w-16 h-1 bg-[#7752FE] m-auto'></div>
                    </div>

                    <div className="flex flex-col justify-center m-3 md:flex-row md:flex-wrap px-3 mt-10  gap-4 ">
                        {renderGateCards('IN')}
                    </div>
                </>
            ) : null}

            {/* Gate OUT Cards */}
            {view === 'viewAll' || view === 'viewOut' ? (
                <>
                    <div className='mt-10'>
                        <h1 style={{ fontSize: '20px', fontWeight: '600', textAlign: 'center' }}>
                            GATE OUT
                        </h1>
                        <div className='w-16 h-1 bg-[#7752FE] m-auto'></div>
                    </div>

                    <div className="flex flex-col justify-center m-3 md:flex-row md:flex-wrap px-3 mt-10  gap-4 ">
                        {renderGateCards('OUT')}
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default GateAll;