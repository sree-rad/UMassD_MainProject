var containerWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    containerHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

let globeVizDiv = document.querySelector('#globeViz');
let width = globeVizDiv.offsetWidth - 150;
let height = width;
let isSingleMode = true
var selectedPolygons = new Set(); 

function hide(hideID) {
    hideID.style.display = "none"; 
}

$('.timelineIcon').click(function () {
    var div = document.getElementById('timelineIconWId');
    div.style.display = div.style.display == "block" ? "none" : "block"
});

function hideElement(eid) {
    var link = document.getElementById(eid);
    link.style.display = 'none'
}

function showElement(eid) {
    var link = document.getElementById(eid);
    link.style.display = 'block'
}

$(document).ready(function(){
    $(".btn").click(function(e){
        if(e.target.htmlFor === 'btnradio1') {
            isSingleMode = true
            hideElement('multimode_detail');
            showElement('singlemode_detail')

        } else if(e.target.htmlFor === 'btnradio2') {
            isSingleMode = false
            hideElement('singlemode_detail');
            showElement('multimode_detail')
        }

        selectedPolygons = new Set();
    });
});

const colorScale = d3.scaleSequentialSqrt(d3.interpolateYlOrRd);

function transformCountryName(country) {
    if (country === 'United States of America')
        return 'United States'

    return country
}

const getVal = (d, data) => {
    if (data == undefined) return;
    return data.filter(c => c.country === transformCountryName(d.properties.ADMIN) && c.year == MAX_YEAR)
        .map(c => c.co2_per_capita)
};

function buildCountrySummaryPolygonLabel(country, code, gdp, population, co2) {
    return `<div class="polLabel">
            <div class="countryHeader"><b>${country}</b></div>
            <div class="countryDetail">
            <b>GDP:</b> ${gdp.toLocaleString()} M$<br/>
            <b>Population:</b> ${population.toLocaleString()}<br/>
            <b>CO2 Per Capita:</b> ${co2}
            </div>
            </div>
            `
}

Promise.all([
    d3.json("https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson"),
    d3.csv("https://raw.githubusercontent.com/owid/co2-data/master/owid-co2-data.csv")
]).then(d => {
    const countries = d[0];
    const data = d[1];
    drawGlobe(countries, data);
    drawRSB(countries, data);
})

function isSelectedPolygon(polygon) {
    return selectedPolygons.filter(e => e === polygon).length > 0;
}

function drawGlobe(countries, data) {

    const maxVal = Math.max(...data.filter(c => c.year == MAX_YEAR).map(c => c.co2_per_capita));
    colorScale.domain([0, maxVal]);
    const world = Globe()
        .width(width)
        .height(height)
        (document.getElementById('globeViz'))
        .globeImageUrl('http://cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg')
        .polygonsData(countries.features)
        .polygonAltitude(0.06)
        .polygonCapColor(feat => colorScale(getVal(feat, data)))
        .polygonSideColor(() => 'rgba(0, 100, 0, 0.15)')
        .polygonStrokeColor(() => '#111');

    world.polygonLabel(({ properties: d }) => {
        co2Data = data.filter(c => c.country === transformCountryName(d.ADMIN))
        maxYear = Math.max(...co2Data.map(o => o.year))
        co2PerCapita = co2Data.filter(c => c.year == maxYear)
            .map(c => c.co2_per_capita)

        return buildCountrySummaryPolygonLabel(d.ADMIN, d.ISO_A2, d.GDP_MD_EST, d.POP_EST, co2PerCapita)
    }).onPolygonHover(polygon => 
        world
            .polygonAltitude(d => d === polygon || selectedPolygons.has(d) ? 0.12 : 0.06)
    ).onPolygonClick( (polygon, event) => { 
        
        if(isSingleMode) {
            selectedPolygons = new Set();
            selectedPolygons.add(polygon);

            stackedAreaData = {
                year: [],
                Others: [],
                Oil: [],
                Gas: [],
                Flaring: [],
                Coal: [],
                Cement: []
            }

            data.filter(c => c.country === transformCountryName(polygon.properties.ADMIN) && parseInt(c.year) >= 1980)
                .map(c => {
                    stackedAreaData.year.push(parseInt(c.year));
                    stackedAreaData.Others.push(parseFloat(c.other_co2_per_capita));
                    stackedAreaData.Oil.push(parseFloat(c.oil_co2_per_capita));
                    stackedAreaData.Gas.push(parseFloat(c.gas_co2_per_capita));
                    stackedAreaData.Flaring.push(parseFloat(c.flaring_co2_per_capita));
                    stackedAreaData.Coal.push(parseFloat(c.coal_co2_per_capita));
                    stackedAreaData.Cement.push(parseFloat(c.cement_co2_per_capita));
                }
            )

            drawStackedArea(stackedAreaData);

        } else {
            if(selectedPolygons.has(polygon)) {
                selectedPolygons.delete(polygon);
            } else {
                selectedPolygons.add(polygon);
            }
        }

        world
            .polygonAltitude(d => d === polygon || selectedPolygons.has(d) ? 0.12 : 0.06)
            .polygonCapColor(d => selectedPolygons.has(d) ? 'steelblue': colorScale(getVal(d, data)))

        selectedCountries = []
        selectedPolygons.forEach(d => {selectedCountries.push(d.properties.ISO_A3)})
        drawLineRace(data, selectedCountries)
            
    }).polygonsTransitionDuration(300)

    window.addEventListener('resize', (event) => {
        let width = globeVizDiv.offsetWidth;
        let height = globeVizDiv.offsetHeight;
        world.width([width])
    });
};
