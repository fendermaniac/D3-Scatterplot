const margin = {left: 100, right: 50, top: 100, bottom: 50};
const width  = 1000 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom; 

//formatTime
const parseTime = d3.timeParse("%M:%S");
const formatTime = d3.timeFormat("%M:%S");
const parseYear = d3.timeParse("%Y");
const formatYear = d3.timeFormat("%Y");

// append the canvas to body
const svg = d3.select("body").append("svg")
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)

const chartGroup = svg.append('g')
.attr('transform', `translate(${margin.left},${margin.top})`);

// append tooltip to web page
const tooltip = d3.select('body').append('div')
.attr('class', 'tooltip')
.attr('id', 'tooltip')
.style('opacity', 0);

//load in dataset
d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json').then((data)=>{

  
 data.forEach(d => {
    d.Time = parseTime(d.Time);
    d.Year = parseYear(d.Year);
  });
 
  console.log(data[0].Time);
  
console.log(formatTime(data[0].Time));

  // Set up X.
const xValue = (d) => d.Year;
const xScale = d3.scaleTime().range([0, width]).domain(d3.extent(data, d => d.Year));
const xMap = d => xScale(xValue(d));
const xAxis = d3.axisBottom(xScale);

// Set up Y.
const yValue = (d) => d.Time;
const yScale = d3.scaleTime()
      .range([height, 0]).domain(d3.extent(data, d => d.Time));
const yMap = d => yScale(yValue(d));
const yAxis = d3.axisLeft(yScale).ticks(9).tickFormat(d3.timeFormat("%M:%S"));

// Configure fill color
const cColor = (d) => {
  if (d.Doping === ""){
  return "green"; }
  else { return "red"; }
};
  
  const color =[{'text': "Caught Doping",
                 'color': 'red'},{'text': "Not caught Doping",
                 'color': 'green'}];
  
  chartGroup.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("class","text")
        .attr("id", "title")
        .attr("text-anchor", "middle")  
        .style("font-size", "24px") 
        .style("text-decoration", "underline")  
        .text("Prevalance of Doping in Professional Cycling 1994-2014");
  
    chartGroup.append("text")
        .attr("x", (width / 2))             
        .attr("y",24 - (margin.top / 2))
        .attr("class","text")
        .attr("id", "title")
        .attr("text-anchor", "middle")  
        .style("font-size", "12px") 
        .style("text-decoration", "underline")  
        .text("35 Fastest times up Alpe d'Huez");

   
  //x-axis
  chartGroup.append('g')
  .attr('class','x axis')
  .attr('id', 'x-axis')
  .attr('transform', `translate(0,${height})`)
  .call(xAxis)
  .append('text')
  .attr('class','label')
  .style("font-size", "24px") 
  .attr('x', width)
  .attr('y', 6)
  .style('text-anchor', 'middle')
  .text('Time');
  
  //y-axis
  chartGroup.append('g')
  .attr('class','y axis')
  .attr('id', 'y-axis')
  .call(yAxis)
  .append('text')
  .attr('class','label')
  .attr('y', 6)
  .attr('xy', '.71em')
  .style('text-anchor', 'end')
  .text('Year');
  
  // draw dots
 
  svg.selectAll('.dot')
  .data(data)
  .enter().append('circle')
  .attr('transform', `translate(${margin.left},${margin.top})`)
  .attr('class', 'dot')
  .attr('r', 5)
  .attr('cx', d => xMap(d))
  .attr('cy', d => yMap(d))
  .attr('data-xvalue', d => formatYear(d.Year))
  .attr('data-yvalue', d => d.Time)
  .style('fill', d => cColor(d))
  .on('mouseover', d => { 
    tooltip.transition()
    .duration(200)
    .style('opacity', 1);
    
    tooltip.html(`Cyclist: ${d.Name} <br/>
                  Nationality: ${d.Nationality} <br/>
                  Year: ${formatYear(d.Year)} <br/>
                  Time: ${formatTime(d.Time)} <br/>
                  Doping: ${d.Doping}`)
   .style('left', d3.event.pageX + 15 + "px")
   .style('top', d3.event.pageY + 15 + "px");
    
  tooltip.attr('data-year', formatYear(d.Year));
  })
  .on('mouseout', () => {
    tooltip
    .transition()
    .duration(50)
    .style('opacity',0)
  });
  
    const legend = svg.selectAll('.legend')
  .data(color)
  .enter().append('g')
  .attr('class', 'legend')
    .attr('id', 'legend')
  .attr('transform', (d,i) => `translate(0,${height + i * 20})`);
  
  legend.append('rect')
    .attr('x', width - 18)
    .attr('width', 18)
    .attr('height', 18)
  .attr('id', (d,i) => color[i].color)
  .style('fill', (d,i) => color[i].color)
  
  legend.append('text')
  .attr('x', width + 4.5)
  .attr('y', 9)
   .attr('transform', (d,i) => `translate(0,-555)`)
  .attr('dy', '35em')
  .attr('fill', 'black')
  .style('text-anchor', 'top')
  
  .text((d,i) => color[i].text)

});