var myStackedAreaChartDom = document.getElementById('stackedAreaChart');
var myStackedAreaChart = echarts.init(myStackedAreaChartDom, 'dark');
var myStackedAreaOption;

function drawStackedArea(chartData) {

  myStackedAreaOption = {
    color: ["#CCCCFF", "#FF7F50", "#6495ED", "#DE3163", "#40E0D0", "#FFBF00"],
    backgroundColor: '#000011',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: ['Others', 'Oil', 'Gas', 'Flaring', 'Coal', 'Cement']
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: chartData.year
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: 'Others',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: chartData.Others
      },
      {
        name: 'Oil',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: chartData.Oil
      },
      {
        name: 'Gas',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: chartData.Gas
      },
      {
        name: 'Flaring',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: chartData.Flaring
      },
      {
        name: 'Coal',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: chartData.Coal
      },
      {
        name: 'Cement',
        type: 'line',
        stack: 'Total',
        label: {
          show: false,
          position: 'top'
        },
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: chartData.Cement
      }
    ]
  };
  
  myStackedAreaOption && myStackedAreaChart.setOption(myStackedAreaOption);

}