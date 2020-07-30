export function calcNormal() {
  const r1 = Math.random();
  const r2 = Math.random();
  let value = Math.sqrt(-2.0 * Math.log(r1)) * Math.sin(2.0 * Math.PI * r2);
  value = (value + 3) / 6;
  return value;
}

export function r3() {
  return Math.random() * Math.random() * Math.random();
}

export function r2() {
  return Math.random() * Math.random();
}


export function saveCanvas() {
  const canvas = document.querySelector('canvas');

  const base64 = canvas.toDataURL('image/png');

  const a = document.createElement('a');
  a.href = base64;
  a.download = `${new Date().toString()}.png`;
  a.click();
}
