var pieChartDom = document.getElementById('pieChart');
var pieChartChart = echarts.init(pieChartDom, 'dark');
var app = {}
var pieChartOption;

function drawPieChart(data) {
    pieChartOption = {
        color: ["#FFBF00", "#40E0D0", "#DE3163", "#6495ED", "#FF7F50", "#CCCCFF"],
        backgroundColor: '#0a0a2b',
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '0%',
          left: 'center'
        },
        series: [
          {
            name: 'Contribution From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 5,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '20',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: data
          }
        ]
      };
      
      pieChartOption && pieChartChart.setOption(pieChartOption);      
}

if (pieChartOption && typeof pieChartOption === 'object') {
    pieChartChart.setOption(pieChartOption);
  }
  
  window.addEventListener('resize', pieChartChart.resize);