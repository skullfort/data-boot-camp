// This function takes in the number of times a participant washes their belly button and displays it in a gauge chart.
// It is called inside displayMetaData().
function createGaugeChart(wfreq) {

    // Define cutom colors.
    // The RGB values (https://waldyrious.net/viridis-palette-generator/) are based on the number of categories set to 9 (since the number of scrubs per week ranges from 0 to 9, resulting in 9 intervals) and the color palette set to viridis.
    let customrgbs = [
        [68, 1, 84],
        [71, 45, 123],
        [59, 82, 139],
        [44, 114, 142],
        [33, 145, 140],
        [40, 174, 128],
        [94, 201, 98],
        [173, 220, 48],
        [253, 231, 37]
    ];

    // Format the array of RGB colors to be used for defining the steps for the gauge chart.
    let customsteps = customrgbs.map(function(x, index) {
        let step = {};
        step.range = [index, index+1];
        step.color = `rgba(${x.join()}, 0.5)`;
        return step;
    });

    let gaugedata = {
        domain: {x:[0,1], y:[0,1]},
        value: wfreq,
        title: {text: 'Scrubs per Week'},
        type: 'indicator',
        mode: 'gauge+number',
        gauge: {
            axis: {
                range: [null, 9],
                tickmode: 'array',
                tickvals: Array.from(Array(10).keys())
            },
            bar: {
                // Set the bar color to transparent since the number of steps is displayed dynamically.
                color: 'rgba(0, 0, 0, 0)'
            },
            bgcolor: 'rgba(211, 211, 211, 0.5)',
            // The number of steps varies depending on the number of scrubs per week.
            steps: customsteps.slice(0, wfreq)
        }
    }
    let gaugelayout = {
        title: {text: 'Belly Button Washing Frequency'}
    }
    Plotly.newPlot('gauge', [gaugedata], gaugelayout);
}