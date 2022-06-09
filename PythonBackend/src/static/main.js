var containerWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
    containerHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

let globeVizDiv = document.querySelector('#globeViz');
let width = globeVizDiv.offsetWidth-150;
let height = width;

$('.timelineIcon').click(function () {
    var div = document.getElementById('timelineIconWId');
    div.style.display = div.style.display == "block" ? "none" : "block"
});

const colorScale = d3.scaleSequentialSqrt(d3.interpolateYlOrRd);
// GDP per capita (avoiding countries with small pop)
// const getVal = feat => feat.properties.GDP_MD_EST / Math.max(1e5, feat.properties.POP_EST);

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

function drawGlobe(countries, data) {
    //const maxVal = Math.max(...countries.features.map(getVal));
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
        //console.log(d.ADMIN)
        co2Data = data.filter(c => c.country === transformCountryName(d.ADMIN))
        maxYear = Math.max(...co2Data.map(o => o.year))
        co2PerCapita = co2Data.filter(c => c.year == maxYear)
            .map(c => c.co2_per_capita)

        //console.log(co2Data)
        //console.log(co2PerCapita)
        return buildCountrySummaryPolygonLabel(d.ADMIN, d.ISO_A2, d.GDP_MD_EST, d.POP_EST, co2PerCapita)
    }
    )
        .onPolygonHover(hoverD => world
            .polygonAltitude(d => d === hoverD ? 0.12 : 0.06)
            .polygonCapColor(d => d === hoverD ? colorScale(getVal(d)) : colorScale(getVal(d)))
        )
        .polygonsTransitionDuration(300)
        (document.getElementById('globeViz'))

    window.addEventListener('resize', (event) => {
        //console.log(event)

        let width = globeVizDiv.offsetWidth;
        let height = globeVizDiv.offsetHeight;

        world.width([width])
        //world.height([event.target.innerHeight])
    });
};
