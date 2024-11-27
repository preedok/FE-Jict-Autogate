const getColor = (percentage) => {
    if (percentage > 90) return '#008000'; 
    if (percentage > 50) return '#FFA500'; 
    return '#FF0000';                       
};



const CardTransaction = ({ isActive, onClick, title, count, imageUrl, percen }) => {
    const percentageColor = getColor(parseFloat(percen));
    return (
        <div onClick={onClick} style={{ backgroundColor: isActive ? '#C4E4FF' : 'white', cursor: 'pointer' }} className="w-[100%] rounded overflow-hidden shadow-lg m-2 py-2" >
            <div className="flex justify-between ">
                <div className="p-4 mb-4" style={{ fontWeight: '800', fontSize: '23px' }}>{imageUrl}</div>
                <div >
                    <p  className="text-[25px] ms-[12px] font-bold" style={{ color: percentageColor }}>{count}</p>
                    <p className="p-[9px] text-[20px] font-bold" style={{ color: '#7752FE' }}>{percen}</p>
                </div>
            </div>
            <div className="px-4">
                <div className="font-bold text-md">{title}</div>
            </div>
        </div>
    );
};

export default CardTransaction;