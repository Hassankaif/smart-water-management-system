import React, { useEffect } from 'react';
import Plotly from 'plotly.js-dist';
import waterConsumptionData from '../data/water_consumption.json';

const WaterConsumptionPlot = () => {
    useEffect(() => {
        const trace = {
            x: waterConsumptionData.dates,
            y: waterConsumptionData.consumption,
            type: 'scatter',
            mode: 'lines',
            name: 'Building Water Consumption',
            line: {
                color: '#2196f3',
                width: 2
            }
        };

        const layout = {
            title: 'Building Daily Water Consumption',
            xaxis: {
                title: 'Date',
                showgrid: true,
                gridcolor: '#E4E4E4'
            },
            yaxis: {
                title: 'Water Usage (Liters)',
                showgrid: true,
                gridcolor: '#E4E4E4'
            },
            template: 'plotly_white',
            hovermode: 'x unified',
            height: 400,
            margin: {
                l: 50,
                r: 50,
                t: 50,
                b: 50
            },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)'
        };

        Plotly.newPlot('waterConsumptionPlot', [trace], layout);
    }, []);

    return <div id="waterConsumptionPlot" className="w-full h-[400px]" />;
};

export default WaterConsumptionPlot; 