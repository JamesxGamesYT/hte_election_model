
let configuredStateLineChart;
let StateLineConfig;

let DATA_COLORS_LEN = 25
dataColors = [
    "rgb(111, 175, 103)",
]
for (i = 0; i < DATA_COLORS_LEN; i++) {
    let color = dataColors[dataColors.length-1]

    let endIndex = color.indexOf(",", 4) 
    let red = String((Number(color.slice(4,endIndex)) + 80) % 256)

    let previousEndIndex = endIndex + 2
    endIndex = color.indexOf(",", endIndex+1)
    let green = String((Number(color.slice(previousEndIndex,endIndex)) + 50) % 256)

    previousEndIndex = endIndex + 2
    endIndex = color.indexOf(")", endIndex)
    let blue = String((Number(color.slice(previousEndIndex,endIndex)) + 30) % 256)

    for (let colorType of [red, green, blue]) {
        if (Number(colorType) < 30) {
            colorType = String(Number(colorType) + 30)
        }
    }
    if(Number(blue) > 230) {
        blue = String(256 - Number(blue))
    }

    dataColors.push("rgb(" + red + ", " + green + ", " + blue + ")")
}

Chart.defaults.global.elements.point.radius = 3;
function loadStateLineChart(mode){
    if (configuredStateLineChart) {
        configuredStateLineChart.destroy();
    }
    graph = document.getElementById("state-chart")
    
    let stateGridLineColor = Array(11).fill(getCssletiable("--section-bg"))
    stateGridLineColor[5] = "rgb(255,255,255)"
    // stateGridLineColor[5] = "rgb(0,0,0)"

    let stateTickColors = Array(6).fill("#6E90FF").concat(Array(7).fill("#FF6868"))
    stateTickColors[5] = "#FFFFFF"
    // stateTickColors[0] = "000000"

    console.log(stateTickColors)
    let times = []
    Object.keys(STATE_CHANCES).forEach(time => {
        times.push(time)
    })
    stateLineConfig = {
        type: 'line',
        data: {
            labels: times,
            datasets: []
        },
        options: {
            // padding: "50",
            responsive: true,
            tooltips: {
                intersect: false,
                // mode: "index"
            },
            legend: {
                fontColor: getCssletiable("--section-bg"),
                display: false,
            },
            layout: {
                padding: {
                  left: 75,
                    right: 75,
                    // top: 30,
                    bottom: 10,
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        // min: -0.0,
                        // max: 100,
                        // fontColor: getCssletiable("--section-bg"),
                        // stepSize: 10,
                        callback: function(value, index, values) {
                            return Math.abs(value) + '%';
                        },
                        // fontColor: stateTickColors
                    },
                    gridLines: {
                        // color: stateGridLineColor,
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontColor: getCssletiable("--section-bg"),
                        minRotation: 45,
                    },
                    gridLines: {
                        color: getCssletiable("--section-bg"),
                    }
                }]
            }
        }
    };
  
    if (mode == "pv") {
        stateLineConfig.options.scales.yAxes[0].ticks.min = -15
        stateLineConfig.options.scales.yAxes[0].ticks.max = 15
        stateLineConfig.options.scales.yAxes[0].ticks.stepSize = 3
        stateLineConfig.options.scales.yAxes[0].ticks.fontColor = stateTickColors 
        stateLineConfig.options.scales.yAxes[0].ticks.callback = function(value, index, values) {
            return Math.abs(value) + '%';
        }, 
        stateLineConfig.options.scales.yAxes[0].gridLines.color = stateTickColors
        stateLineConfig.options.scales.yAxes[0].gridLines.zeroLineColor = "rgb(255, 255, 255)"
        stateLineConfig.options.scales.xAxes[0].gridLines.zeroLineColor = "rgb(255,255,255)"
    }
    else {
        stateLineConfig.options.scales.yAxes[0].ticks.min = -0.0
        stateLineConfig.options.scales.yAxes[0].ticks.max = 100
        stateLineConfig.options.scales.yAxes[0].ticks.stepSize = 10
        stateLineConfig.options.scales.yAxes[0].ticks.fontColor = stateTickColors
        stateLineConfig.options.scales.yAxes[0].ticks.callback = function(value, index, values) {
            if (value < 50) {
                return Math.abs(value-50)+ 50 + '%';
            }
            else {
                return Math.abs(value) + '%';
            }
        }, 
        stateLineConfig.options.scales.yAxes[0].gridLines.color = stateTickColors
        stateLineConfig.options.scales.yAxes[0].gridLines.zeroLineColor = "rgb(255, 104, 104)"
        stateLineConfig.options.scales.xAxes[0].gridLines.zeroLineColor = "rgb(255,255,255)"
    }
    console.log(stateLineConfig)
    for (let state of stateResults) {
        addGraphState(state, mode)
    }
    configuredStateLineChart = new Chart(graph, stateLineConfig);
    configuredStateLineChart.update(); 
}

function addGraphState(state, mode) {
    console.log(stateColors)
    if (state == "ES") {
        addGraphState("SC", mode)
        addGraphState("GA", mode)
        addGraphState("FL", mode)
        addGraphState("NC", mode)
        addGraphState("VA", mode)
        addGraphState("NH", mode)
        addGraphState("ME-2", mode)
        return;
    }
    else if (state == "GP") {
        addGraphState("MO", mode)
        addGraphState("KS", mode)
        addGraphState("NE-1", mode)
        addGraphState("NE-2", mode)
        addGraphState("TX", mode)
        addGraphState("IA", mode)
        return;
    }
    else if (state == "WS") {
        addGraphState("AK", mode)
        addGraphState("MT", mode)
        addGraphState("NV", mode)
        addGraphState("AZ", mode)
        addGraphState("CO", mode)
        addGraphState("NM", mode)
        return;
    }
    else if (state == "MW") {
        addGraphState("MN", mode)
        addGraphState("WI", mode)
        addGraphState("MI", mode)
        addGraphState("PA", mode)
        addGraphState("OH", mode)
        addGraphState("IN", mode)
        return;
    }
    let data = {}
    let currentDataColors = []
    let dataColor = dataColors[(stateColors.indexOf(state)) % dataColors.length]
    
    console.log(STATEUNABBR[state])
    if (mode == "pv") {
        Object.keys(STATE_MARGINS).forEach(time => {
            let value = STATE_MARGINS[time][STATEUNABBR[state]][1]
            data[time] = (value).toFixed(3);
        })
    }
    else {
        Object.keys(STATE_CHANCES).forEach(time => {
            let value = STATE_CHANCES[time][STATEUNABBR[state]]
            data[time] = (value*100).toFixed(3);
        })
    }
    let dataDict = {
        label: capitalize(STATEUNABBR[state]),
        data: Object.values(data),
        fill: false,
        // borderColor: getCssletiable("--card-bg"),
        borderWidth: 5,
        pointBackgroundColor: dataColor,
        pointBorderColor: dataColor,
        borderColor: dataColor,
    }
    stateLineConfig["data"]["datasets"].push(dataDict)
}

function removeGraphState(state) {
    let dataset = configuredStateLineChart["data"]["datasets"]
    console.log(stateColors, state)
    dataset.splice(stateColors.indexOf(state),1);
    console.log(dataset)
    for (let i = 0; i < dataset.length; i++) {
        dataset[i]["pointBackgroundColor"] = dataColors[i % DATA_COLORS_LEN]
        dataset[i]["pointBorderColor"] = dataColors[i % DATA_COLORS_LEN]
        dataset[i]["borderColor"] = dataColors[i % DATA_COLORS_LEN]
    }
    console.log(stateResults)
    configuredStateLineChart.update(); 
}

function addStateLineChart(state, mode) {
    addGraphState(state, mode)
    configuredStateLineChart.update(); 
}
