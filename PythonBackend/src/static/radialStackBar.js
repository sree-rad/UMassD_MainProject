width = 300
height = width
innerRadius = 100
outerRadius = Math.min(width, height) / 2

const MAX_YEAR = '2020'
const TOP_N = 50

var margin = { top: 50, right: 50, bottom: 5, left: 50 },
        svgWidth = 300, svgHeight = 300,
        chartWidth = svgWidth,
        chartHeight = svgHeight ;

function parseFloatCustom(val) {
    if(val == undefined || val == "") return 0;
    
    return parseFloat(val)
}

function drawRSB(countries, inputData) {

    const svg = d3.select("#radialStackBar")
        .append("svg")
        .attr("viewBox", `-180 -150, 360 300`)
        .style("width", "100%")
        .style("height", "100%")
        .style("font", "8px sans-serif");

    fullData = []
    columns = ['iso_code', 'Cement', 'Coal', 'Flaring', 'Gas', 'Oil', 'Others']
    inputData.filter(d => d.year == MAX_YEAR && d.iso_code != "" && d.iso_code != "OWID_WRL")
    .forEach(d => {

        record = {}
        record.iso_code = d.iso_code
        record.country = d.country
        record.Cement = d.cement_co2_per_capita
        record.Coal = d.coal_co2_per_capita
        record.Flaring = d.flaring_co2_per_capita
        record.Gas = d.gas_co2_per_capita
        record.Oil = d.oil_co2_per_capita
        record.Others = d.other_co2_per_capita
        
        record.total = parseFloatCustom(record['Cement']) +
            parseFloatCustom(record['Coal']) + parseFloatCustom(record['Flaring']) +
            parseFloatCustom(record['Gas']) + parseFloatCustom(record['Oil']) +
            parseFloatCustom(record['Others']);
        
            fullData.push(record)
    });

    data = fullData.sort(function(a, b){return a.total - b.total}).reverse().slice(0, TOP_N)

    data.sort(() => Math.random() - 0.5)

    x = d3.scaleBand()
        .domain(data.map(d => d.iso_code))
        .range([0, 2 * Math.PI])
        .align(0)

    y = d3.scaleRadial()
        .domain([0, d3.max(data, d => d.total)])
        .range([innerRadius, outerRadius])

    z = d3.scaleOrdinal()
        .domain(columns.slice(1))
        .range(["#FFBF00", "#40E0D0", "#DE3163", "#6495ED", "#FF7F50", "#CCCCFF", "#9FE2BF"])

    arc = d3.arc()
        .innerRadius(d => y(d[0]))
        .outerRadius(d => y(d[1]))
        .startAngle(d => x(d.data.iso_code))
        .endAngle(d => x(d.data.iso_code) + x.bandwidth())
        .padAngle(0.01)
        .padRadius(innerRadius)

    xAxis = g => g
        .attr("text-anchor", "middle")
        .call(g => g.selectAll("g")
            .data(data)
            .join("g")
            .attr("transform", d => `
          rotate(${((x(d.iso_code) + x.bandwidth() / 2) * 180 / Math.PI - 90)})
          translate(${innerRadius},0)
        `)
            .call(g => g.append("line")
                .attr("x2", -5)
                .attr("stroke", "#fff"))
            .call(g => g.append("text")
                .attr("transform", d => (x(d.iso_code) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI
                    ? "rotate(90)translate(0,12)"
                    : "rotate(-90)translate(0,-9)")
                    .attr("fill", "#fff")
                    .attr("font-size", ".4em")
                .text(d => d.iso_code)))

    yAxis = g => g
        .attr("text-anchor", "middle")
        .call(g => g.selectAll("g")
            .data(y.ticks(5).slice(1))
            .join("g")
            .attr("fill", "none")
            .call(g => g.append("circle")
                .attr("stroke", "#fff")
                .attr("stroke-opacity", 0.5)
                .attr("r", y))
            .call(g => g.append("text")
                .attr("y", d => -y(d))
                .attr("dy", "0.35em")
                .attr("fill", "#fff")
                .attr("stroke-width", 25)
                .attr("font-size", ".6em")
                .text(y.tickFormat(5, "s"))
                .clone(true)
                .attr("fill", "#fff")
                .attr("stroke", "none")))

    legend = g => g.append("g")
        .selectAll("g")
        .data(columns.slice(1).reverse())
        .join("g")
        .attr("transform", (d, i) => `translate(-40,${(i - (columns.length - 1) / 2) * 12})`)
        .call(g => g.append("rect")
            .attr("x", 20)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", z))
        .call(g => g.append("text")
            .attr("x", 35)
            .attr("y", 5)
            .attr("dy", "0.35em")
            .attr("fill", "#fff")
            .attr("font-size", ".6em")
            .text(d => d))


    svg.append("g")
        .selectAll("g")
        .data(d3.stack().keys(columns.slice(1))(data))
        .join("g")
        .attr("fill", d => z(d.key))
        .selectAll("path")
        .data(d => d)
        .join("path")
        .attr("d", arc);

    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

    svg.append("g")
        .call(legend);

    
}