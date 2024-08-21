import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as echarts from 'echarts';
import useStore from '../store/filterStore'; // Import the Zustand store
import { LegalitasLahan } from '../types/legalitasLahan';
import { GetAllLegalitasLahan } from '../Services/legalitasLahanServices';
import { DataPemetaanKebun } from '../types/dataPemetaanKebun';
import { GetAllDataPemetaanKebun } from '../Services/pemetaanKebunServices';

const MyChartComponent: React.FC = () => {
    const setSelectedCategory = useStore((state) => state.setSelectedCategory);
    const [stdbs, setStdbs] = useState<LegalitasLahan[]>([]);
    const [error, setError] = useState<string | null>(null);
    const selectedCategory = useStore((state) => state.selectedCategory);
    const [dataPemetaan, setDataPemetaan] = useState<DataPemetaanKebun[]>([]);

    useEffect(() => {
        const fetchSTDBS = async () => {
            try {
                const data = await GetAllLegalitasLahan();
                setStdbs(data);
                console.log('data legalitas', data);
            } catch (error) {
                console.error('Failed to fetch STDBS:', error);
                setError('Failed to fetch data');
            }
        };

        fetchSTDBS();
    }, []);

    useEffect(() => {
        const fetchDataPemetaanKebun = async () => {
            try {
                const data = await GetAllDataPemetaanKebun();
                setDataPemetaan(data);
                console.log('data pemetaan', data);
            } catch (error) {
                console.error('Failed to fetch Data Pemetaan Kebun:', error);
            }
        };
        fetchDataPemetaanKebun();
    }, []);
    const filterDataPenerbitan = (data: LegalitasLahan[]) => {
        return data.filter((item) => item.nipPenerbitLegalitas !== 'False');
    };
    const mergeData = (
        stdbs: LegalitasLahan[],
        dataPemetaan: DataPemetaanKebun[],
    ) => {
        return stdbs.map((stdb) => {
            const matchingPemetaan = dataPemetaan.find(
                (pemetaan) => pemetaan.idPemetaanKebun === stdb.idPemetaanKebun,
            );
            return {
                ...stdb,
                ...matchingPemetaan,
            };
        });
    };

    const combinedData = mergeData(stdbs, dataPemetaan);

    useEffect(() => {
        initializeChart(combinedData);
    }, [stdbs]);

    const initializeChart = (data: LegalitasLahan[]) => {
        const categories: { [key: string]: number } = {};
        filterDataPenerbitan(data).forEach((item) => {
            if (categories[item.statusKawasan]) {
                categories[item.statusKawasan] +=
                    Number(item.produksiPerHaPertahun) || 0;
            } else {
                categories[item.statusKawasan] =
                    Number(item.produksiPerHaPertahun) || 0;
            }
        });

        const categoryKeys = Object.keys(categories);
        const categoryValues = Object.values(categories);

        const colors = categoryKeys.map((category) => {
            if (category === 'didalam kawasan') {
                return '#FF0000';
            } else if (category === 'sebagian memasuki kawasan') {
                return '#FFFF00';
            } else if (category === 'diluar kawasan') {
                return '#0000FF';
            } else {
                return '#00000';
            }
        });

        const option = {
            title: {
                text: 'Status Kawasan Lahan Sawit',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                },
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true,
            },
            xAxis: [
                {
                    type: 'category',
                    data: categoryKeys,
                    axisTick: {
                        alignWithLabel: true,
                    },
                },
            ],
            yAxis: [
                {
                    type: 'value',
                },
            ],
            series: [
                {
                    name: 'Luas Lahan (Ha)',
                    type: 'bar',
                    barWidth: '60%',
                    data: categoryValues,
                    itemStyle: {
                        color: (params: any) => colors[params.dataIndex],
                    },
                },
            ],
        };

        const chartDom = document.getElementById('chart') as HTMLElement;
        const myChart = echarts.init(chartDom);
        myChart.setOption(option);

        // Add click event listener
        myChart.on('click', function (params) {
            setSelectedCategory(params.name);
        });
    };

    useEffect(() => {
        if (selectedCategory) {
            const filteredData = combinedData.filter(
                (item) => item.statusKawasan === selectedCategory,
            );
            initializeChart(filteredData);
        } else {
            initializeChart(combinedData);
        }
    }, [selectedCategory, stdbs]);

    return (
        <div className="mt-4 ">
            {error && <div className="text-red-500">{error}</div>}
            <div
                id="chart"
                className=" sm:w-full lg:w-4/5  h-64 md:h-80 lg:h-96 chart"
            ></div>
        </div>
    );
};

export default MyChartComponent;
