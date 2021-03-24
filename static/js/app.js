// console.log("oki doki")
// Initial function to set up the dropdown menu
function init(){
    fillDropdown();
    optionChanged(940);
    createGauge(940);
};
// Function connected to html dropdown menu, it receives the Test Subject ID
function optionChanged(id){
    createCharts(id);
    createDemoInfo(id);
    createGauge(id);
};
// Button of the dropdown menu
let subjectID = d3.select("#selDataset").on("click", fillDropdown);
// Fill the dropdown menu
function fillDropdown(){
    d3.json("/static/data/samples.json").then((data) => {
        data.names.forEach(id => {
            subjectID.append("option").text(id).property("value", id);
        });
    });
};
// Create the plots
function createCharts(id){
    // Read the json file and pass the data to the function
    d3.json("/static/data/samples.json").then((data) => {
        let sample = data.samples.filter(sampleObj => sampleObj.id == id)[0]; 
        // Set up bar plot values
        let barPlot = [
            {
                y: sample.otu_ids.slice(0, 10).map(otu_id_label => `OTU ${otu_id_label}`).reverse(),
                x: sample.sample_values.slice(0, 10).reverse(),
                text: sample.otu_labels.slice(0, 10).reverse(),
                type: "bar",
                orientation: "h"
            }
        ];
        let barLayout = {
            title: "Top 10 Bacteria Types in Belly Button"
        }
        // Plot the bar chart to the html in the id = "bar" section
        Plotly.newPlot("bar", barPlot, barLayout);
        // Set up the bubble plot
        let bubblePlot =[
            {
                x: sample.otu_ids,
                y: sample.sample_values,
                mode: 'markers',
                text: sample.otu_labels,
                marker: {
                    size: sample.sample_values,
                    color: sample.otu_ids
                }
            }
        ];
        let bubbleLayout = {
            title: "Bacteria Types in Belly Button",
            xaxis: { title: "OTU ID"}
        };
        // Plot the bubble chart
        Plotly.newPlot("bubble", bubblePlot, bubbleLayout);

    });
};
// Fill the Demographic Info panel-card
function createDemoInfo(id){
    d3.json("/static/data/samples.json").then((data) => {
        let meta = data.metadata.filter(metadataObj => metadataObj.id == id)[0];
        let panelCard = d3.select("#sample-metadata");
        panelCard.text("");
        Object.entries(meta).forEach(([key, value]) => {
            panelCard.append("p").text(`${key.toUpperCase()}:  ${value}`).style("text-align: justify;");
        });
    });
};
// Create a Gauge Indicator with week frequency washing belly button 
function createGauge(id){
    d3.json("/static/data/samples.json").then((data) => {
        let meta = data.metadata.filter(metadataObj => metadataObj.id == id)[0];
        // console.log(meta.wfreq)
        var data = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: meta.wfreq,
                title: { text: "Belly Button Washing Frequency per Week" },
                type: "indicator",
                mode: "gauge+number",
                delta: { reference: 4 },
                gauge: {
                    axis: { range: [0, 9] },
                    steps : [
                        {range: [0, 1], color: "rgba(255, 255, 255, 0)"},
                        {range: [1, 2], color: "rgba(240, 230, 215, .5)"},
                        {range: [2, 3], color: "rgba(232, 226, 202, .5)"},
                        {range: [3, 4], color: "rgba(210, 206, 145, .5)"},
                        {range: [4, 5], color: "rgba(202, 209, 95, .5)"},
                        {range: [5, 6], color: "rgba(170, 202, 42, .5)"},
                        {range: [6, 7], color: "rgba(110, 154, 22, .5)"},
                        {range: [7, 8], color: "rgba(10, 120, 22, .5)"},
                        {range: [8, 9], color: "rgba(0, 105, 11, .5)"},
                    ]
                }
            }
        ];
        var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
        // Plot de Gauge dashboard
        Plotly.newPlot('gauge', data, layout);
    });
};




init();