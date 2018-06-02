import * as d3 from "d3";

class Chart {
    constructor({width, height, selector, data = [],}) {
        this.width = width;
        this.height = height;
        this.data = data.slice();
        this.selector = selector;

        this.svg = d3.select(this.selector);
        this.basicTransition = d3.transition().duration(750).ease(d3.easeBackInOut);
    }

    static valueToKNotation(val) {
        // vaToKNotation(500) => 500
        // vaToKNotation(1500) => 1.5K
        if (val >= 1000) {
            return `${val / 1000}K`;
        } else {
            return val;
        }
    }

    static numberWithCommas(x) {
        // numberWithCommas(1200) => 1,200
        return x.toLocaleString("en-US");
    }

    setCanvasSizes() {
        this.svg.attr("width", this.width);
        this.svg.attr("height", this.height);
    }
}

class RadialChart extends Chart {
    constructor({selector, width, height, innerRadius, outerRadius, data, BEMName,}) {
        super({selector, width, height,});
        this.data = data;
        this.bemName = BEMName;
        this.innerRadius = innerRadius;
        this.outerRadius = outerRadius;
        this.fullCircle = Math.PI * 2;

        this.arc = d3.arc()
            .innerRadius(this.innerRadius)
            .outerRadius(this.outerRadius)
            .startAngle(0);

        this.setCanvasSizes();
        this.render();
    }

    static percentsToMedians(percent) {
        return (Math.PI * 2) * percent / 100;
    }

    arcTween(newAngle) {
        // Returns a tween for a transition’s "d" attribute, transitioning any selected
        // arcs from their current angle to the specified new angle.
        // http://bl.ocks.org/mbostock/5100636
        const self = this;
        return function (d) {
            const interpolate = d3.interpolate(d.endAngle, newAngle);
            return function (t) {
                d.endAngle = interpolate(t);
                return self.arc(d);
            };
        };
    }

    updateData(data) {
        this.data = data;

        this.foregroundArc.transition()
            .duration(750)
            .attrTween("d", this.arcTween(RadialChart.percentsToMedians(this.data)));

        this.text.transition(this.basicTransition).text(`${this.data}%`);
    }

    render() {
        const groupClass = `${this.bemName}__group`;
        const valueTextClass = `${this.bemName}__text-value`;
        const valueDescriptionClass = `${this.bemName}__text-description`;

        this.group = this.svg.append("g").attr("class", `radial-chart__group ${groupClass}`)
            .attr("transform", `translate(${this.width / 2}, ${this.height / 2})`);

        this.text = this.group.append("text").attr("class", `radial-chart__value ${valueTextClass}`)
            .attr("text-anchor", "middle")
            .text(`${this.data}%`);

        this.group.append("text")
            .attr("class", () => `radial-chart__description ${valueDescriptionClass}`)
            .attr("text-anchor", "middle")
            .text("Conversions");

        this.backgroundArc = this.group.append("path")
            .datum({endAngle: this.fullCircle,})
            .style("fill", "#a5dd85")
            .attr("d", this.arc);

        this.foregroundArc = this.group.append("path")
            .datum({endAngle: RadialChart.percentsToMedians(this.data),})
            .style("fill", "#85dcf8")
            .attr("d", this.arc);
    }

}

class BlockChart extends Chart {
    constructor({className, blockHeight, blockMargin,}) {
        super(...arguments);

        this.className = className;
        this.blockHeight = blockHeight;
        this.blockMargin = blockMargin;

        // sum of all blocks height and space between
        this.chartSize = (this.data.length * this.blockHeight) + (this.data.length * this.blockMargin);

        this.xScale = d3.scaleLinear().domain([0, 4000,]).range([0, 555,]);
        this.xAxis = d3.axisBottom().scale(this.xScale).tickFormat(Chart.valueToKNotation).tickSize(-this.chartSize);
        this.svg.append("g").attr("id", "xAxisGroup").attr("transform", `translate(80, ${this.chartSize})`).call(this.xAxis);


        this.yScale = d3.scaleOrdinal().domain(["video", "social",]).range([0, this.chartSize,]);
        this.yAxis = d3.axisRight().scale(this.yScale).tickValues(() => "").tickSize(0);
        this.svg.append("g").attr("id", "yAxisGroup").attr("transform", "translate(80, 0)").call(this.yAxis);


        this.setCanvasSizes();
        this.render();
    }

    updateData(data) {
        const self = this;

        this.data = data.slice();

        this.svg.selectAll("g.dataGroup").data(this.data).select("rect")
            .transition(this.basicTransition)
            .attr("width", d => this.xScale(d.value));

        this.svg.selectAll("g.dataGroup").data(this.data).select("text.channel-performance")
            .text(d => Chart.numberWithCommas(d.value));

        this.svg.selectAll("g.dataGroup text.channel-performance").each(function () {
            const text = d3.select(this);
            const textWidth = this.clientWidth;
            text
                .transition(self.basicTransition)
                .attr("transform", d => {
                    // ensure self text inside svg canvas
                    // else put text inside block
                    let textX = self.xScale(d.value) + 20;

                    if (textX + textWidth + 20 >= self.width) {
                        textX = textX - 120;
                    }
                    return `translate(${textX}, 45)`;
                });
        });
    }

    render() {
        const self = this;

        this.svg.select("#xAxisGroup").append("line")
            .attr("class", "xAxisBase")
            .attr("stroke", "#000")
            .attr("x1", "90%");

        this.svg.selectAll("g.dataGroup")
            .data(this.data)
            .enter()
            .append("g")
            .attr("class", "dataGroup")
            .attr("transform", (d, i) => `translate(80, ${i * 100})`)
            .append("rect")
            .attr("height", 65)
            .attr("fill", "#00B7F1")
            .attr("fill-opacity", "0.49")
            .transition(this.basicTransition)
            .attr("width", d => this.xScale(d.value));

        this.svg.selectAll("g.dataGroup").each(function (d) {
            const group = d3.select(this);

            group.append("text").attr("class", "channel-performance").text(Chart.numberWithCommas(d.value));
            group.append("text").attr("class", "channel-performance__label").text(d.title);
        });

        this.svg.selectAll("g.dataGroup text.channel-performance").each(function () {
            const text = d3.select(this);
            const textWidth = this.clientWidth;
            text
                .transition(self.basicTransition)
                .attr("transform", d => {
                    // ensure self text inside svg canvas
                    // else put text inside block
                    let textX = self.xScale(d.value) + 20;

                    if (textX + textWidth + 20 >= self.width) {
                        textX = textX - 120;
                    }
                    return `translate(${textX}, 45)`;
                });
        });

        this.svg.selectAll("g.dataGroup text.channel-performance__label").each(function () {
            const text = d3.select(this);
            text.attr("transform", "translate(-75, 40)");
        });
    }


}

class ChannelPerformance extends BlockChart{
    constructor(){
        super(...arguments);
    }
}

class ChannelSplit extends RadialChart {
    constructor() {
        super(...arguments);
    }

}

export {ChannelPerformance, ChannelSplit,} ;