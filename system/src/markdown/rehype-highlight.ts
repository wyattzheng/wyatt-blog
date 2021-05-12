const javascript = require("highlight.js/lib/languages/javascript");
const typescript = require("highlight.js/lib/languages/typescript");

const highlight = require("rehype-highlight/light");

export const RehypeHighlight : any = [highlight,{languages:{javascript,typescript}}];
