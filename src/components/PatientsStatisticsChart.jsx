import React from "react";
import ReactApexChart from "react-apexcharts";

const MayDataChart = () => {
  const state = {
    series: [
      {
        name: "Out Patient",
        type: "column", // Bar chart type for "Out Patient"
        data: [
          20000, 22000, 24000, 19000, 23000, 25000, 21000, 20000, 21000, 22000,
          24000, 23000, 25000, 26000, 27000, 28000, 26000, 25000, 24000, 23000,
          22000, 21000, 24000, 25000, 23000, 26000, 27000, 28000, 29000, 30000,
          32000,
        ],
      },
      {
        name: "In Patient",
        type: "line", // Line chart type for "In Patient"
        data: [
          15000, 17000, 18000, 16000, 17000, 19000, 18000, 17000, 16000, 18000,
          17000, 16000, 15000, 16000, 17000, 16000, 15000, 14000, 13000, 14000,
          16000, 15000, 17000, 16000, 17000, 18000, 19000, 20000, 21000, 22000,
          24000,
        ],
      },
    ],
    options: {
      chart: {
        height: 400,
        type: "line",
        animations: {
          enabled: true,
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150,
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350,
          },
        },
        toolbar: {
            show: false,
        }
      },
      stroke: {
        width: [0, 5], // No stroke for column, and line for the line chart
        dashArray: [2, 0]
      },
      plotOptions: {
        bar: {
          borderRadius: 4, // Apply border radius to the bars (Out Patient data)
          borderRadiusApplication: 'all', // Apply border radius to all corners (both start and end)
        },
      },
      dataLabels: {
        enabled: false,
      },
      labels: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31",
      ],
      toolbar: {
        show: false,
      },
      yaxis: {
        labels: {
          show: true,
          showDuplicates: false,
          align: "left",
          minWidth: 0,
          maxWidth: 100,
          formatter: (val) => `${val / 1000}k`,
          style: {
            colors: ["#D7DBE0"],
            fontSize: "12px",
            fontFamily: "inter",
            fontWeight: 400,
            cssClass: "apexcharts-yaxis-label",
          },
          offsetX: 0,
          offsetY: 0,
          rotate: 0,
        },
        crosshairs: {
            show: true,
            width: 1,
            position: 'front',
            opacity: 1,        
            stroke: {
                color: '#F0F3F8',
                width: 1,
                dashArray: 5,
            },
            fill: {
                type: 'dashed',
                color: '#F0F3F8'
            },
        }
        
      },
      xaxis: {
        labels: {
          style: {
            colors: ["#D7DBE0"],
            fontSize: "12px",
            fontFamily: "inter",
            fontWeight: 400,
            cssClass: "apexcharts-xaxis-label",
          },
        },
        crosshairs: {
            show: true,
            width: 1,
            position: 'back',
            opacity: 1,        
            stroke: {
                color: '#ff0000',
                width: 1,
                dashArray: 5,
            },
            fill: {
                type: 'solid',
                color: '#ff0000'
            },
        }
      },
      colors: ["#1E40AF", "#7C3AED"], // Color for "Out Patient" (Blue) and "In Patient" (Purple)
    },
  };

  return (
    <div>
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="line"
        height={400}
      />
    </div>
  );
};

export default MayDataChart;
