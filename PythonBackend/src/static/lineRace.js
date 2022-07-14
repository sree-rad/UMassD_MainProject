var lineRaceDom = document.getElementById('lineRace');
var lineRaceChart = echarts.init(lineRaceDom, 'dark');
var app = {}
var lineRaceOption;

function drawLineRace(data, countries) {

  fullData = [['iso_code', 'country', 'year', 'co2_per_capita']]

  data.filter(d => parseInt(d.year) >= 1950 && d.iso_code != "" && d.iso_code != "OWID_WRL")
    .filter(d => countries.includes(d.iso_code))
    .forEach(d => {
      record = [d.iso_code, d.country, parseInt(d.year), parseFloat(d.co2_per_capita)]
      fullData.push(record)
    });

  run(fullData, countries)
}

function run(fullData, countries) {
  const datasetWithFilters = [];
  const seriesList = [];
  echarts.util.each(countries, function (iso_code) {
    var datasetId = 'dataset_' + iso_code;
    datasetWithFilters.push({
      id: datasetId,
      fromDatasetId: 'dataset_raw',
      transform: {
        type: 'filter',
        config: {
          and: [
            { dimension: 'year', gte: 1950 },
            { dimension: 'iso_code', '=': iso_code }
          ]
        }
      }
    });
    seriesList.push({
      type: 'line',
      datasetId: datasetId,
      showSymbol: false,
      name: iso_code,
      endLabel: {
        show: true,
        formatter: function (params) {
          return params.value[1] + ': ' + params.value[3];
        }
      },
      labelLayout: {
        moveOverlap: 'shiftY'
      },
      emphasis: {
        focus: 'series'
      },
      encode: {
        x: 'year',
        y: 'co2_per_capita',
        label: ['iso_code', 'co2_per_capita'],
        itemName: 'year',
        tooltip: ['co2_per_capita']
      }
    });
  });

  lineRaceOption = {
    animationDuration: 10000,
    backgroundColor: "#000011",
    dataset: [
      {
        id: 'dataset_raw',
        source: fullData
      },
      ...datasetWithFilters
    ],
    tooltip: {
      order: 'valueDesc',
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      nameLocation: 'middle'
    },
    yAxis: {
      name: 'co2_per_capita'
    },
    grid: {
      right: 140
    },
    series: seriesList
  };

  lineRaceChart.setOption(lineRaceOption);
}


if (lineRaceOption && typeof lineRaceOption === 'object') {
  lineRaceChart.setOption(lineRaceOption);
}

window.addEventListener('resize', lineRaceChart.resize);