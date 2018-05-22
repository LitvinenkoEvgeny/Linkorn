import "./index.pug";
import "./css/index.sass";

import $ from 'jquery';
window.jQuery = $;

import customSelect from "custom-select";
import 'custom-select/build/custom-select.css';

import flatpickr from "flatpickr";
import 'flatpickr/dist/flatpickr.min.css';
import { Russian } from "flatpickr/dist/l10n/ru.js"

customSelect('select');
const dateInput = document.querySelectorAll('.date-input');
flatpickr(dateInput, {
    dateFormat: "Y-m-d H:i",
    locale: Russian
});

