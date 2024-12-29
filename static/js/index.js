const switchElement = document.querySelector('input[type="checkbox"]');
let isAscending = false;
let sortBy = 'Global_Sales';
switchElement.addEventListener('change', async () => {
    // Check if the switch is checked (ascending) or not (descending)
    isAscending = switchElement.checked;

    if (isAscending) {
        console.log('Ascending');
        // You can trigger the sorting logic here for ascending order
    } else {
        console.log('Descending');
        // You can trigger the sorting logic here for descending order
    }

    // Optionally, trigger a function to update the chart or sorting order
    const data = await fetchData(sortBy, isAscending);
    updateChart(data, 'Name', sortBy);
});



// Fetch Data Method (with default query params)
async function fetchData(sortBy = 'Global_Sales', ascending = false) {
    const order = ascending ? 'true' : 'false';
    const url = `http://127.0.0.1:4000/games?sort_by=${sortBy}&ascending=${order}`;
    const response = await fetch(url);
    if (!response.ok) {
        console.error('Failed to fetch data');
        return [];
    }
    return await response.json();
}

// Set dimensions and margins for the chart
const margin = { top: 20, right: 40, bottom: 120, left: 150 };  // Increased bottom margin for label space
let width = 800 - margin.left - margin.right;
let height = 500 - margin.top - margin.bottom;

// Create the SVG container
const svg = d3.select("#chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Function to update the chart with new data
// Function to update the chart with new data
function updateChart(data, yAccessor = 'Name', xAccessor = 'Global_Sales') {
    const margin = { top: 20, right: 40, bottom: 150, left: 250 };  // Increase left margin for long names
    const width = 1200 - margin.left - margin.right;  // Increase width to fit more data
    let height = Math.max(500, data.length * 40);  // Dynamically adjust height based on the number of data points

    // Create the scales
    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[xAccessor])])
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(data.map(d => d[yAccessor]))
        .range([0, height])
        .padding(0.1);

    // Select the SVG container and set its dimensions
    const svg = d3.select("#chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    // Clear previous content
    svg.selectAll("*").remove();

    // Create the chart group that will contain everything
    const chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Append Y-axis with better formatting for long names
    const yAxis = chartGroup.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y).tickSize(0));

    // Style Y-axis labels
    yAxis.selectAll("text")
        .style("font-size", "14px")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em");

    // Append X-axis with scaling
    const xAxis = chartGroup.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format(".2s")));

    // Style X-axis labels
    xAxis.selectAll("text")
        .style("font-size", "14px")
        .style("fill", "#333")
        .style("text-anchor", "middle")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)"); // Rotate X-axis labels to avoid overlap

    // Create the bars with dynamic height and width, with transition animation
    const bars = chartGroup.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", 0)  // Start the bars at the left margin
        .attr("y", d => y(d[yAccessor]))  // Position bars according to Y scale
        .attr("width", 0)  // Initially set width to 0 for the transition effect
        .attr("height", y.bandwidth())
        .style("fill", (d, i) => d3.schemeCategory10[i % 10]); // Color the bars differently

    // Animate bars width transition from 0 to final value
    bars.transition()
        .duration(1000)  // Duration of 1000ms for the animation
        .attr("width", d => x(d[xAccessor]))  // Animate the width to the desired value

    // Optional: Add a title on hover (tooltips)
    chartGroup.selectAll(".bar")
        .on("mouseover", function(event, d) {
            d3.select(this).style("fill", "orange");
            tooltip.transition().duration(200).style("opacity", .9);
            tooltip.html(`${d[yAccessor]}: ${d[xAccessor]}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            d3.select(this).style("fill", (d, i) => d3.schemeCategory10[i % 10]);
            tooltip.transition().duration(500).style("opacity", 0);
        });

    // Append the tooltip div for hovering
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("opacity", 0)
        .style("background-color", "lightgrey")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("text-align", "center");

    // Ensure the container is scrollable if the chart exceeds the viewport
    const chartContainer = d3.select("#chart-container");
    chartContainer.style("overflow", "auto");

    // If there's more data, the container will become scrollable
    chartContainer.style("height", "600px"); // Set height for scrolling
}








// Handle navbar click to change sort order and y-axis
document.getElementById('sort-global').addEventListener('click', async () => {
    sortBy='Global_Sales';
    const data = await fetchData(sortBy, isAscending);
    updateChart(data, 'Name', sortBy);
});

document.getElementById('sort-eu').addEventListener('click', async () => {
    sortBy='EU_Sales';
    const data = await fetchData(sortBy, isAscending);
    updateChart(data, 'Name', sortBy);
});

document.getElementById('sort-na').addEventListener('click', async () => {
    sortBy='NA_Sales';
    const data = await fetchData(sortBy, isAscending);
    updateChart(data, 'Name', sortBy);
});

document.getElementById('sort-jp').addEventListener('click', async () => {
    sortBy='JP_Sales';
    const data = await fetchData(sortBy,isAscending);
    updateChart(data, 'Name', sortBy);
});

document.getElementById('sort-rating').addEventListener('click', async () => {
    sortBy='Rating';
    const data = await fetchData(sortBy,isAscending);
    updateChart(data, 'Name', sortBy);
});

// Default data load (Global Sales by default)
(async () => {
    sortBy='Global_Sales';
    const data = await fetchData(sortBy);
    updateChart(data, 'Name', sortBy);
})();
