export function createAsyncQueue(a) {var q = [];return {push:function(f){var p=(q.length?q.pop():Promise.resolve(a)).then(f);q.push(p.catch(()=>{}));return p}}}
