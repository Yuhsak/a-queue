exports.createAsyncQueue=function(a){var q=[];function p(f){var p=(q.length?q.pop():Promise.resolve(a)).then(f);q.push(p);return p};function s(f){return function(...a){return p(function(){return f(...a)})}};return {push:p,sequence:s}}
