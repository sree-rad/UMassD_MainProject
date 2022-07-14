var lineRaceDom = document.getElementById('lineRace');
var lineRaceChart = echarts.init(lineRaceDom, 'dark');
var lineRaceOption;

window.addEventListener('resize', lineRaceChart.resize);

function drawLineRace(data, selectedCountries) {
  // var countries = ['Australia', 'Canada', 'China', 'Cuba', 'Finland', 'France', 'Germany', 'Iceland', 'India', 'Japan', 'North Korea', 'South Korea', 'New Zealand', 'Norway', 'Poland', 'Russia', 'Turkey', 'United Kingdom', 'United States'];

  //console.log(selectedCountries)
  const MIN_YEAR = 1950
  const TOP_N = 50
  //selectedCountries = ['ZAF', 'IND' ]


  fullData = [['iso_code', 'country', 'year', 'co2_per_capita']]
  countryLevelData = {}

  data.filter(d => parseInt(d.year) >= MIN_YEAR && d.iso_code != "" && d.iso_code != "OWID_WRL")
    .filter(d => selectedCountries.includes(d.iso_code))
    .forEach(d => {

      record = [d.iso_code, d.country, parseInt(d.year), parseFloat(d.co2_per_capita)]

      fullData.push(record)

      if(countryLevelData[d.iso_code] == undefined) {
        countryLevelData[d.iso_code] = []
      }

      countryLevelData[d.iso_code].push([d.iso_code, d.country, parseInt(d.year), parseFloat(d.co2_per_capita)])

      //fullData.sort((a, b) => a[1] - b[1])
    });

  console.log(countryLevelData)

  var finaldata = fullData

  const datasetWithFilters = [];
  const seriesList = [];

    echarts.util.each(selectedCountries, function (iso_code) {
      var datasetId = 'dataset_' + iso_code;
      datasetWithFilters.push({
        id: datasetId,
        source: countryLevelData[iso_code]
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
        label: ['country', 'co2_per_capita'],
        itemName: 'year',
        tooltip: ['co2_per_capita']
      }
    });
  });

  lineRaceOption = {
    animationDuration: 10000,
    //color: ['#4992ff', '#7cffb2', '#fddd60', '#ff6e76', '#58d9f9', '#05c091', '#ff8a45', '#8d48e3', '#dd79ff'], 
    //
    backgroundColor: '#000011',
    dataset: [
      {
        id: 'dataset_raw',
        source: finaldata
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

  console.log(lineRaceOption)

  lineRaceChart.setOption(lineRaceOption);
}


lineRaceOption && lineRaceChart.setOption(lineRaceOption);
