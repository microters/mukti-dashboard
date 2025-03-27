import React, { Component } from "react";
import ReactApexChart from "react-apexcharts"; // Import the React wrapper for ApexCharts

class DonutChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      series: [20, 60, 30], 
      options: {
        chart: {
            type: 'donut',
        },
        legend: {
          position: "bottom", 
          show: false,
        },
        colors: ['#465DFF', '#6AC75A', '#67BAF1'], 
        labels: ['Team A', 'Team B', 'Team C'], 
        dataLabels: {
          enabled: false, 
        },
        plotOptions: {
          pie: {
            donut: {
              size: "70%", // Size of the donut hole
              labels: {
                show: true, 
                fontSize: "26px", 
                fontWeight: 600, 
                color: "#333",
              },
            },
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 150, 
              },
              legend: {
                position: "bottom", 
              },
            },
          },
        ],
      },
    };
  }

  render() {
    return (
      <div>
        <div id="chart">
          <ReactApexChart
            options={this.state.options}
            series={this.state.series}
            type="donut"
            height={220}
          />
        </div>
      </div>
    );
  }
}

export default DonutChart;
