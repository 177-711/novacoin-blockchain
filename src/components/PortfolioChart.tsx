 import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: ['ETH', 'BTC', 'USDT'],
  datasets: [
    {
      data: [40, 35, 25],
      backgroundColor: ['#627EEA', '#F7931A', '#26A17B'],
    },
  ],
};

function PortfolioChart() {
  return <Doughnut data={data} />;
}

export default PortfolioChart;
