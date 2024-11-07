import Handlebars from 'handlebars';
import moment from 'moment';

/**
 * Custom helper functions for Handlebars
 */
const customHelpers = {
    /**
     * Debug helper for logging data to the server console
     * @param {string} data - The data to log
     */
    debug: function (data) {
        console.log(data);
    },

    /**
     * Helper to load a CSS file dynamically within templates
     * @param {string} filename - The name of the CSS file (without .css extension)
     * @returns {SafeString} - HTML link tag for the specified CSS file
     */
    loadCss: function (filename) {
        return new Handlebars.SafeString(`<link rel="stylesheet" href="/css/${filename}.css" crossorigin="anonymous">`);
    },

    /**
     * Helper to load a JS file dynamically within templates
     * @param {string} filename - The name of the js file (without .js extension)
     * @returns {SafeString} - HTML script tag for the specified JS file
     */
    loadScript: function (filename) {
        return new Handlebars.SafeString(`<script src="/js/${filename}.js"></script>`);
    },

    /**
     * Helper for conditional comparison
     * @param {any} arg1 - First argument to compare
     * @param {any} arg2 - Second argument to compare
     * @param {object} options - Handlebars options object
     */
    ifEquals: function (arg1, arg2, options) {
        try {
            const val1 = arg1?.toHexString ? arg1.toHexString() : arg1;
            const val2 = arg2?.toHexString ? arg2.toHexString() : arg2;
            if (val1 === val2) {
                return options.fn(this);
            }
            return options.inverse(this);
        } catch (error) {
            return options.inverse(this);
        }
    },

    /**
     * Helper to format timestamps using moment.js
     * @param {number|string|Date} timestamp - The timestamp to format
     * @returns {string} - Formatted date string
     */
    timeFormat: function (timestamp) {
        return moment(timestamp).format('DD/MM/YYYY');
    },
};

/**
 * Register all helpers in Handlebars
 */
export const registerHelpers = () => {
    Object.keys(customHelpers).forEach((helperName) => {
        Handlebars.registerHelper(helperName, customHelpers[helperName]);
    });
};
