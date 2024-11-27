import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Legend, Bar, CartesianGrid, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './components/card';
import {
    Alert,
    AlertTitle,
    AlertDescription,
} from './components/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/tabs';
import { Progress } from './components/progress';
import { Cpu, HardDrive } from 'lucide-react';
import api from '../../../service/api'
import ContentCard from '../../../components/card-content/ContentCard';

const dummyData = {
    tablespaceUsage: [
        { tablespace: "SYSAUX", usedPercentage: 80, freePercentage: 20 },
        { tablespace: "SYSTEM", usedPercentage: 75, freePercentage: 25 },
        { tablespace: "USERS", usedPercentage: 60, freePercentage: 40 },
    ],
    diskSpaceUsage: [
        { mountpoint: "/", usedPercentage: 70, totalSpaceGB: 100, usedSpaceGB: 70 },
        { mountpoint: "/home", usedPercentage: 50, totalSpaceGB: 500, usedSpaceGB: 250 },
    ],
    systemMetrics: {
        cpuUsagePercentage: 45,
        memoryUsagePercentage: 60,
        totalMemoryGB: 16,
        usedMemoryGB: 9.6,
    },
    historicalData: [
        { timestamp: "19:36", cpu: 25.01, memory: 25.89 },
        { timestamp: "19:37", cpu: 25.66, memory: 25.89 },
        { timestamp: "19:38", cpu: 25.15, memory: 26.22 },
        // ... (more data points)
    ],
};

const COLORS = ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#8b5cf6'];

const MonitoringDashboard = () => {
    const [tablespaceUsage, setTablespaceUsage] = useState([]);
    const [diskSpaceUsage, setDiskSpaceUsage] = useState([]);
    const [systemMetrics, setSystemMetrics] = useState(null);
    const [historicalData, setHistoricalData] = useState([]);
    const [usingDummyData, setUsingDummyData] = useState(false);
    const [error, setError] = useState(null);

    const fetchTablespaceUsage = async () => {
        try {
            const response = await api.get('Monitoring/tablespace-usage', {
                mode: 'cors',
                credentials: 'same-origin',
            });
            setTablespaceUsage(response.data);
        } catch (err) {
            console.error('Failed to fetch tablespace usage:', err);
            setTablespaceUsage(dummyData.tablespaceUsage);
            setUsingDummyData(true);
            handleFetchError(err);
        }
    };

    const fetchDiskSpaceUsage = async () => {
        try {
            const response = await api.get('Monitoring/disk-space-usage', {
                mode: 'cors',
                credentials: 'same-origin',
            });
            setDiskSpaceUsage(response.data);
        } catch (err) {
            console.error('Failed to fetch disk space usage:', err);
            setDiskSpaceUsage(dummyData.diskSpaceUsage);
            setUsingDummyData(true);
            handleFetchError(err);
        }
    };

    const fetchSystemMetrics = async () => {
        try {
            const response = await api.get('Monitoring/system-metrics', {
                mode: 'cors',
                credentials: 'same-origin',
            });
            setSystemMetrics(response.data);
        } catch (err) {
            console.error('Failed to fetch system metrics:', err);
            setSystemMetrics(dummyData.systemMetrics);
            setUsingDummyData(true);
            handleFetchError(err);
        }
    };

    const fetchHistoricalData = async () => {
        try {
            const response = await api.get('Monitoring/historical-data?hours=1&stepMinutes=1', {
                mode: 'cors',
                credentials: 'same-origin',
            });
            setHistoricalData(response.data.historicalData);
        } catch (err) {
            console.error('Failed to fetch historical data:', err);
            setHistoricalData(dummyData.historicalData);
            setUsingDummyData(true);
            handleFetchError(err);
        }
    };

    const handleFetchError = (err) => {
        if (err.name === 'SecurityError') {
            setError('Content Security Policy blocked data fetching. Please check your CSP settings.');
        } else if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
            setError('Unable to connect to the API. Please check your network connection and API endpoint.');
        } else {
            setError(`An error occurred while fetching data: ${err.message}`);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    fetchTablespaceUsage(),
                    fetchDiskSpaceUsage(),
                    fetchSystemMetrics(),
                    fetchHistoricalData(),
                ]);
                setUsingDummyData(false);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch data:', err);
                setUsingDummyData(true);
            }
        };

        fetchData();
        const intervalId = setInterval(fetchData, 60000);

        return () => clearInterval(intervalId);
    }, []);

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
        const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className="bg-[#f3f4f7] p-8 ml-4 mr-4 rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Monitoring Dashboard</h1>
            <ContentCard>
                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {usingDummyData && (
                    <Alert className="mb-6">
                        <AlertTitle>Using Dummy Data</AlertTitle>
                        <AlertDescription>
                            Unable to fetch live data. Displaying dummy data for demonstration purposes.
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Server Metrics and Historical Data Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Server Metrics and Historical Data</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                {/* CPU Usage */}
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">CPU Usage</span>
                                        <Cpu className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="text-2xl font-bold">{systemMetrics?.cpuUsagePercentage.toFixed(1)}%</div>
                                    <Progress value={systemMetrics?.cpuUsagePercentage} className="mt-2" />
                                </div>
                                {/* Memory Usage */}
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Memory Usage</span>
                                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div className="text-2xl font-bold">{systemMetrics?.memoryUsagePercentage.toFixed(1)}%</div>
                                    <Progress value={systemMetrics?.memoryUsagePercentage} className="mt-2" />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {systemMetrics?.usedMemoryGB.toFixed(1)} GB / {systemMetrics?.totalMemoryGB.toFixed(1)} GB
                                    </p>
                                </div>
                            </div>
                            {/* Historical Data Chart */}
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={historicalData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="timestamp" />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="cpu" name="CPU Usage (%)" stroke="#8884d8" activeDot={{ r: 8 }} />
                                    <Line type="monotone" dataKey="memory" name="Memory Usage (%)" stroke="#82ca9d" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Tablespace and Disk Space Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Tablespace and Disk Space Usage</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="tablespace" className="space-y-4">
                                <TabsList>
                                    <TabsTrigger value="tablespace">Tablespace</TabsTrigger>
                                    <TabsTrigger value="disk">Disk Space</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="tablespace">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart layout="vertical" data={tablespaceUsage}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" domain={[0, 100]} />
                                            <YAxis dataKey="tablespace" type="category" width={150} />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="usedPercentage" name="Used %" fill="#3b82f6" stackId="a" />
                                            <Bar dataKey="freePercentage" name="Free %" fill="#22c55e" stackId="a" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </TabsContent>
                                
                                <TabsContent value="disk">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {diskSpaceUsage.map((disk, index) => (
                                            <div key={index} className="space-y-2">
                                                <h3 className="text-lg font-semibold text-center">{disk.mountpoint}</h3>
                                                <ResponsiveContainer width="100%" height={150}>
                                                    <PieChart>
                                                        <Pie
                                                            data={[
                                                                { name: 'Used', value: disk.usedSpaceGB },
                                                                { name: 'Free', value: disk.totalSpaceGB - disk.usedSpaceGB }
                                                            ]}
                                                            cx="50%"
                                                            cy="50%"
                                                            labelLine={false}
                                                            label={renderCustomizedLabel}
                                                            outerRadius={60}
                                                            fill="#8884d8"
                                                            dataKey="value"
                                                        >
                                                            {[
                                                                { name: 'Used', value: disk.usedSpaceGB },
                                                                { name: 'Free', value: disk.totalSpaceGB - disk.usedSpaceGB }
                                                            ].map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip />
                                                        <Legend />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                                <p className="text-sm text-center text-muted-foreground">
                                                    Used: {disk.usedSpaceGB.toFixed(1)} GB / Total: {disk.totalSpaceGB.toFixed(1)} GB
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </ContentCard>
        </div>
    );
};

export default MonitoringDashboard;