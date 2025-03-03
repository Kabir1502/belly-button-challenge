// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    var metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");

    // Loop through each key-value pair and append to the panel
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    var samples = data.samples;

    // Filter the samples for the object with the desired sample number
    var sampleArray = samples.filter(sampleObj => sampleObj.id == sample);
    var sampleData = sampleArray[0];

    // Get the otu_ids, otu_labels, and sample_values
    var otu_ids = sampleData.otu_ids;
    var otu_labels = sampleData.otu_labels;
    var sample_values = sampleData.sample_values;

    // Build a Bubble Chart
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    }];

    // Render the Bubble Chart
    var bubbleLayout = {
      title: "OTU IDs vs. Sample Values",
      xaxis: { title: "OTU ID" },
      margin: { t: 30 },
      hovermode: "closest"
    };
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    var barData = [{
      x: sample_values.slice(0, 10).reverse(),
      y: yticks,
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    }];

    // Render the Bar Chart
    var barLayout = {
      title: "Top 10 OTUs Found",
      margin: { t: 30, l: 150 }
    };
    Plotly.newPlot("bar", barData, barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    var sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    var selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    sampleNames.forEach((sample) => {
      selector.append("option")
              .text(sample)
              .property("value", sample);
    });

    // Get the first sample from the list
    var firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
