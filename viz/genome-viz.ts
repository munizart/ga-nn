import * as d3 from 'd3'

export function printGenome(selector, genome: Genome) {
  const data = {
    nodes: genome.nodes,
    links: genome.connections.map(({ from, to, enabled, weight }) => ({
      source: from,
      target: to,
      value: weight,
      enabled
    }))
  }

  // set the dimensions and margins of the graph
  const margin = { top: 10, right: 30, bottom: 30, left: 40 }
  const width = window.innerWidth - margin.left - margin.right
  const height = 400 - margin.top - margin.bottom

  var catScale = d3.scalePoint()
    .domain(['input', 'hidden', 'output'].reverse())
    .range([0, height])
    .padding(0.5);

  var svg = d3.select(selector)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")")

    var defs = svg.append('defs')
    defs.append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("markerWidth", 10)
      .attr("markerHeight", 10)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("class", "arrowHead");


  var link = svg
    .selectAll("line")
    .data(data.links)
    .enter()
    .append("line")
    .style("stroke", "#aaa")
    .style('stroke-dasharray', c => c.enabled ? 'none' : '5,5')
    .attr("marker-end", "url(#arrow)")

  // Initialize the nodes
  var node = svg
    .selectAll("circle")
    .data(data.nodes)
    .enter()
    .append("circle")
    .attr("r", 10)
    .style("fill", x => {
      if (x.type === 'input') return "#69b3a2"
      if (x.type === 'output') return '#a269b3'
      return '#a2b369'
    })

  var label = svg.append("g")
    .attr("class", "labels")
    .selectAll("text")
    .data(data.nodes)
    .enter().append("text")
    .attr("class", "label")
    .text(function (d) { return d.activation })
    .style("fill", "black")

  d3.forceSimulation(data.nodes)                 // Force algorithm is applied to data.nodes
    .force("link", d3.forceLink()                               // This force provides links between nodes
      .id(function (d) { return d.id })                     // This provide  the id of a node
      .links(data.links)                                    // and this the list of links
      .strength(l => {
        const { target, source, enabled } = l
        if (!enabled) return 0
        if (target.type !== source.type) return 1
        return 0.12
      })
    )
    .force("charge", d3.forceManyBody().strength(-3450))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
    .force("center", d3.forceCenter(width / 2, height / 2))     // This force attracts nodes to the center of the svg area
    .force("y", d3.forceY(d => catScale(d.type)).strength(1))
    .on("tick", ticked)

  // This function is run at each iteration of the force algorithm, updating the nodes position.
  function ticked() {
    link
      .attr("x1", function (d) { return d.source.x })
      .attr("y1", function (d) { return d.source.y })
      .attr("x2", function (d) { return d.target.x })
      .attr("y2", function (d) { return d.target.y })

    node
      .attr("cx", function (d) { return d.x })
      .attr("cy", function (d) { return d.y })

    label
      .attr("x", function (d) { return d.x - 50 })
      .attr("y", function (d) { return d.y + 30 })
      .style("font-size", "1em")
  }

  console.log(data.links)
}
