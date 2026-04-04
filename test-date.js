const d = new Date();
const tzOffset = d.getTimezoneOffset() * 60000;
const localIso = new Date(d.getTime() - tzOffset).toISOString().slice(0, -1);
console.log('localIso:', localIso);
console.log('today:', localIso.slice(0,10));
