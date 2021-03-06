import "./index.pug";
import "./css/index.sass";
import {random} from "lodash";

import $ from "jquery";
window.jQuery = $;

import customSelect from "custom-select";

import flatpickr from "flatpickr";

import dt from "datatables.net";
$.fn.dataTable = dt;

import {ChannelPerformance, ChannelSplit, NewVsReturning, Stats, WeekChart,} from "./js/charts";

import weekData from "./js/data";
import generateWeekData from "./js/generateWeekData";



customSelect("select");
const dateInput = document.querySelectorAll(".date-input");

flatpickr(dateInput, {
    mode: "range",
    dateFormat: "d/M/Y",
    locale: {
        rangeSeparator: " - ",
    },
});


$(document).ready(function () {
    $("#menu").on("click", function(){
        const $menuButton = $(this);
        const $body = $("body");
        const $menuBlock = $(".menu", $body);

        $menuButton.toggleClass("active");
        $body.toggleClass("menu-active");
        $menuBlock.toggleClass("menu--active");
    });

    $(".checkbox__input").on("click", function () {
        const $this = $(this);

        $this.parent(".checkbox").toggleClass("checkbox--checked");
    });

    $("table").dataTable({
        "paging": false,
        "info": false,
        "searching": false,
        "autoWidth": false,
        "columnDefs": [
            {"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9,], orderable: false,},
        ],
    });

    const data = [
        {
            title: "Video",
            value: 3500,
        },
        {
            title: "Social",
            value: 2200,
        },
    ];

    const statsData = [
        {
            title: "Video",
            value: 3500,
        },
        {
            title: "Social",
            value: 2200,
        },
        {
            title: "Social",
            value: 2200,
        },
    ];

    const channelPerformance = new ChannelPerformance({
        width: 750, height: 250,
        data: data, selector: ".channel-perf__svg",
        className: "channel-performance-chart",
        blockHeight: 65,
        blockMargin: 35,
    });
    const channelSplit = new ChannelSplit({
        width: 350, height: 300,
        innerRadius: 115,
        outerRadius: 150,
        data: 79, selector: ".channel-split__svg",
        className: "channel-split-chart",
    });

    const newVsReturning = new NewVsReturning({
        width: 350, height: 300,
        innerRadius: 115,
        outerRadius: 150,
        data: 80, selector: ".new-vs-returning__svg",
        className: "new-vs-returning-chart",
    });

    const statsChart = new Stats({
        width: 750, height: 240,
        data: statsData, selector: ".stats__svg",
        className: "stats-chart",
        blockHeight: 55,
        blockMargin: 25,
    });

    const weekChart = new WeekChart({
        width: 1351, height: 450,
        data: weekData, selector: ".week_chart__svg",
        className: "week-chart-svg",
        blockWidth: 30,
        blockMargin: 25,
    });

    setInterval(() => {
        channelSplit.updateData(random(0, 100));
    }, 2000);

    setInterval(() => {
        newVsReturning.updateData(random(0, 100));
    }, 2000);

    setInterval(() => {
        channelPerformance.updateData([
            {
                title: "Video",
                value: random(0, 4000),
            },
            {
                title: "Social",
                value: random(0, 4000),
            },
        ]);

    }, 2000);

    setInterval(() => {
        statsChart.updateData([
            {
                title: "Video",
                value: random(0, 4000),
            },
            {
                title: "Social",
                value: random(0, 4000),
            },
            {
                title: "Social",
                value: random(0, 4000),
            },
        ]);

    }, 2000);

    setInterval(() => {
        weekChart.updateData(generateWeekData());
    }, 4000);

    $(".menu").height($(document).height());
});
$(document).on("resize", function(){
    $(".menu").height($(document).height());

})

