import "highlight.js/styles/vs2015.css"

const javascript = require("highlight.js/lib/languages/javascript");
const typescript = require("highlight.js/lib/languages/typescript");

const highlight = require("rehype-highlight/light");

export const highlightPlugin : any = [highlight,{languages:{javascript,typescript}}];
