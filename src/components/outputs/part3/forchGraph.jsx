import React , {Component} from 'react';
import * as d3 from 'd3'

import './graph.css'


class ForchGraph extends Component {
    state = {
        width: 800,
        height: 480
    }
  
  componentDidMount(){

    const {handleSelctedPeople, datas} = this.props;

    function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
    
        node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
        
        node_text.attr("x", function(d) { 
                        return d.x; 
                })
                .attr("y", function(d) { return d.y; });
    }
    
    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
      
    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }
      
    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
    

    let parentWidth = d3.select('div#forced-graph')
                        .node()
                        .parentNode.clientWidth;

    let margin_left_v = parentWidth * (3 /24);
        parentWidth = parentWidth * (16/24);

    let parentHeight = parentWidth * 0.8;

    const color = d3.scaleOrdinal(d3.schemeCategory20c);
    

    console.log(margin_left_v, 76)
    const svg = d3.select("svg#result")
                .attr('width', parentWidth)
                .attr('height', parentHeight)
                .style('margin-left', margin_left_v + 'px');

    const gMain = svg.append('g')
    .classed('g-main', true);

    const rect = gMain.append('rect')
    .attr('width', parentWidth)
    .attr('height', parentHeight)
    .style('fill', 'white');

    const gDraw = gMain.append('g');

    const zoom = d3.zoom()
    .on('zoom', zoomed)

    gMain.call(zoom);


    function zoomed() {
        gDraw.attr('transform', d3.event.transform);
    }

    const link = gDraw.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(datas.links)
        .enter().append("line")
        .attr("stroke-width", function(d) { return 1; })
        .attr("class", function(d){
            // console.log(Math.random()%3);
            const pku = d.value > 0 ? '-green': (d.value < 0 ? '-red': '')
            return 'line' + pku;
        });
    
    const node = gDraw.append("g")
        .attr("class", "node")
        .selectAll("circle")
        .data(datas.nodes)
        .enter().append("circle")
        .attr("r", 5)
        .attr("fill", function(d) { 
            return color(d.group); })
        .on("click", function(d){
            reset_selected_circle();
            const selected_circle = d3.select(this);
            selected_circle.attr("class", "selected");
            // console.log(handleSelctedPeople, 124)
            handleSelctedPeople(d.id, d.name);
        })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    function reset_selected_circle(){
        d3.selectAll("circle").classed('selected','')

    }
    
    const node_text = gDraw.append("g")
            .attr("class", "text")
            .selectAll("text")
            .data(datas.nodes)
            .enter().append("text")
            .attr("fill", function(d) { 
                if ('color' in d)
                    return d.color;
                else
                    return color(d.group); 
            })
            .attr('dx', function(d){return 10})
            .attr('dy', function(d){return 10})
            .text((d)=>{
                return d.name;
            })
            .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));
    

    node.append('title')
        .text(function(d) {
            return d.name;
        })
        
    
    const min_edge = d3.min(datas.links.map(d=> d.value));

    const simulation = d3.forceSimulation()
        .force("link", d3.forceLink()
                .id(function(d) { return d.id;})
                .distance(function(d){
                    const  dist = 200 / (d.value - min_edge + 1);
                    return dist; 
                })
            )
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(parentWidth / 2, parentHeight / 2))
            .force("x", d3.forceX(parentWidth/2))
            .force("y", d3.forceY(parentHeight/2));

    simulation
        .nodes(datas.nodes)
        .on("tick", ticked)

    simulation.force("link")
        .links(datas.links);

    rect.on('click', () => {
        node.each(function(d) {
            d.selected = false;
            d.previouslySelected = false;
        });
        node.classed("selected", false);
    });

    }

  
    render(){
        return (<svg  id="result">
                </svg>)
    }
    
};

export default ForchGraph;
