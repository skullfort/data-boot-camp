// Define the URL from which the D3 library reads the JSON file.
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

/*
The JSON file consists of a single Javascript object with 3 properties named 'names', 'metadata', and 'samples'.
The value of 'names' is an array of ids that represent the participants of the Belly Button Biodiversity study.
The value of 'metadata' is an array of objects, each of which pertains to a participant and contains 7 properties: the participant 'id', 'ethnicity', 'gender', 'age', 'location', 'bbtype' (belly button type), and 'wfreq' (frequency of washing).
The value of 'samples' is an array of objects, each of which pertains to a participant (referred to by their 'id') and contains information of the OTUs found in their belly button, including 'otu_ids', 'sample_values' (number of reads), and 'otu_labels'.
The 'id' of a participant is referenced in each property. Note that it is of the string type in 'names' and 'samples' and of the int type in 'metadata'.  
*/

// This function initializes the web elements with the data associated with the first participant in the JSON file.
function init() {
    // Locate in the HTML document the drop-down list for selecting participants and the panel for displaying the selected participant's metadata.
    // Either HTML element can be idenfied by its unique 'id' attribute using #.
    let dropdown = d3.select('#selDataset');
    let summary = d3.select('#sample-metadata');

    // Use the Promise object returned by d3.json() to retrieve the JSON file asynchronously.
    d3.json(url).then(function(data) {
        // Define a variable called 'pcps' (short for participants) to hold all participant ids.
        let pcps = data.names;
        // Use the array of ids to populate the dropdown list by appending the <option> elements to the <select> element.
        for (let pcp of pcps) {
            dropdown
                .append('option')
                .text(pcp) // The content of the <option> element, specified by text(), is displayed in the dropdown list. 
                .property('value', pcp); // The 'value' attribute of the <option> element, specified by property(), is passed to the event callback function to handle selection change.
        }

        // Define a variable to hold all the metadata.
        let metadata = data.metadata;
        // Use the property names of the first participant's metadata to create placeholders in the summary panel.
        for (let key of Object.keys(metadata[0])) {
            summary
                .append('h5') // Append an empty <h5> element to the panel body for each metadata property.
                .attr('id', key); // Assign the name of that property to the 'id' attribute of the <h5> element to facilitate selecting it and updating its content upon dropdown selection change. 
        }

        // Display the first participant's metadata and OTUs, which the web page defaults to when initialized.
        displayMetaData(pcps[0]);
        displayOTUs(pcps[0]);
    })
}

// This function takes in a participant id and displays the metadata of the participant.
// It is called inside init() as well as optionChanged().
function displayMetaData(pcp) {
    // Again, locate the panel for displaying the metadata.
    let summary = d3.select("#sample-metadata");

    d3.json(url).then(function(data) {
        // Find the 'metadata' object from the JSON file with the id matching the input id.
        // The id obtained from the 'metadata' object is an int, so the string being compared (which either comes directly from pcps during initialiation or event dispatch) needs to be converted to an int.
        let match = data.metadata.find(x => x.id === parseInt(pcp));
        // Update the metadata properties in the summary panel by overwriting the text contents of its child elements, which are the <h5> elements created during initialization.
        for (var key of Object.keys(match)) {
            summary
                .select(`#${key}`) // Each <h5> element can be idenfied by its id referencing a metadata property name. 
                .text(`${key}: ${match[key]}`); // Update the content of each <h5> element with the corresponding metadata property.
        }

        // Create a gauge chart for belly button washing frequency. This function is defined in bonus.js.
        createGaugeChart(match.wfreq);
    })
}

// This function takes in a participant id and creates a horizontal bar chart and a bubble chart displaying the number of reads of the OTUs found in the participant.
// It is called inside init() as well as optionChanged().
function displayOTUs(pcp) {
    d3.json(url).then(function(data) {
        // Find the 'samples' object from the JSON file with the id matching the input id.
        // Note the change in the relationship expression (i.e. pcp no longer converted to an int) due to id being of the string type in 'samples'.
        var match = data.samples.find(x => x.id === pcp);

        // Create a horizontal bar chart to display the top 10 OTUs in terms of the number of reads.
        var bartrace = {
            // The 'otu_ids' and 'sample_values' arrays from the 'samples' object are already arranged from the highest to the lowest number of reads.
            // The sliced results need to be reordered through reverse() for Plotly to display them in descending order. 
            x: match.sample_values.slice(0,10).reverse(),
            y: match.otu_ids.map(id=>`OTU ${id}`).slice(0,10).reverse(),
            text: match.otu_labels.slice(0,10).reverse(),
            type: 'bar',
            orientation: 'h'
        };
        var barlayout = {
            title: {text: `Top 10 OTUs for Participant ${pcp}`},
            xaxis: {title: 'Number of Reads'}
        };
        Plotly.newPlot('bar', [bartrace], barlayout);

        // Create a bubble chart to display the number of reads of all OTUs found in the participant. 
        var bubbletrace = {
            x: match.otu_ids,
            y: match.sample_values,
            text: match.otu_labels,
            mode: 'markers',
            marker: {color: match.otu_ids, size: match.sample_values, colorscale: 'Bluered'}
        };
        var bubblelayout = {
            title: {text: `Number of Reads of OTUs for Participant ${pcp}`},
            xaxis: {title: 'OTU ID'},
            yaxis: {title: 'Number of Reads'}
        };
        Plotly.newPlot('bubble', [bubbletrace], bubblelayout);
    })
}

// This function is assigned to the 'onchange' attribute of the <select> element in the HTML document and is called when the selected option is changed.
// The input 'this.value' to the function in the HTML document refers to the value of the <option> element that is selected, which is the participant id.
function optionChanged(pcp) {
    // Call displaymetadata() to update the web elements related to the metadata of the selected participant.
    displayMetaData(pcp);
    // Call displayotus() to update the wb elements related to the OTUs found in the selected participant's belly button.
    displayOTUs(pcp);
}

// Execute the webpage initialization.
init();