import "./index.pug";
import "./css/index.sass";

import $ from "jquery";
window.jQuery = $;

import customSelect from "custom-select";

import flatpickr from "flatpickr";

customSelect("select");
const dateInput = document.querySelectorAll(".date-input");

flatpickr(dateInput, {
    mode: "range",
    dateFormat: "d/M/Y",
    locale: {
        rangeSeparator: " - ",
    },
});

