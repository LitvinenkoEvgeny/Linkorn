import "./index.pug";
import "./css/index.sass";
import {random} from 'lodash';

import $ from "jquery";
window.jQuery = $;

import customSelect from "custom-select";

import flatpickr from "flatpickr";

import dt from "datatables.net";
$.fn.dataTable = dt;

import {ChannelPerformance, ChannelSplit} from "./js/charts";


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

    const channelPerformance = new ChannelPerformance({
        width: 750, height: 250,
        data: data, selector: ".channel-perf__svg",
        className: "channel-performance-chart",
        blockHeight: 65,
        blockMargin: 35,
    });
    const channelSplit = new ChannelSplit({
        width: 350, height: 300,
        innerRadius: 90,
        outerRadius: 130,
        data: 79, selector: ".channel-split__svg",
        className: "channel-split-chart",
    });

    setInterval(() => {
        channelSplit.updateData(random(0, 100));
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
});

