import { RGBAColor } from 'deck.gl';

export const colorSchemes = {
  3: ['#a6cee3', '#1f78b4', '#b2df8a'],
  4: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c'],
  5: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99'],
  6: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c'],
  7: [
    '#a6cee3',
    '#1f78b4',
    '#b2df8a',
    '#33a02c',
    '#fb9a99',
    '#e31a1c',
    '#fdbf6f',
  ],
  8: [
    '#a6cee3',
    '#1f78b4',
    '#b2df8a',
    '#33a02c',
    '#fb9a99',
    '#e31a1c',
    '#fdbf6f',
    '#ff7f00',
  ],
  9: [
    '#a6cee3',
    '#1f78b4',
    '#b2df8a',
    '#33a02c',
    '#fb9a99',
    '#e31a1c',
    '#fdbf6f',
    '#ff7f00',
    '#cab2d6',
  ],
  10: [
    '#a6cee3',
    '#1f78b4',
    '#b2df8a',
    '#33a02c',
    '#fb9a99',
    '#e31a1c',
    '#fdbf6f',
    '#ff7f00',
    '#cab2d6',
    '#6a3d9a',
  ],
  11: [
    '#a6cee3',
    '#1f78b4',
    '#b2df8a',
    '#33a02c',
    '#fb9a99',
    '#e31a1c',
    '#fdbf6f',
    '#ff7f00',
    '#cab2d6',
    '#6a3d9a',
    '#ffff99',
  ],
  12: [
    '#a6cee3',
    '#1f78b4',
    '#b2df8a',
    '#33a02c',
    '#fb9a99',
    '#e31a1c',
    '#fdbf6f',
    '#ff7f00',
    '#cab2d6',
    '#6a3d9a',
    '#ffff99',
    '#b15928',
  ],
};

export const toHex = (color: RGBAColor = [0, 0, 0]): string => {
  let output = '#';
  for (let i = 0; i < 3; i++) {
    let char = color[i]?.toString(16).split(".")[0];
    if (char === '0') char = '00';
    output += char;
  }
  return output;
};

export const toRGBA = (color: string = '#000000'): RGBAColor => {
  let colorString = color.replace('#', '');
  const red = `${colorString[0]}${colorString[1]}`;
  const green = `${colorString[2]}${colorString[3]}`;
  const blue = `${colorString[4]}${colorString[5]}`;
  return [parseInt(red, 16), parseInt(green, 16), parseInt(blue, 16), 255];
};

export interface Color {
  rgba: RGBAColor;
  hex: string;
}

export const getColor = (length: number, index: number): Color => {
  let color: Color;
  let _length = length > 12 ? 12 : length;
  if (_length >= 3) {
    const scheme = _length as keyof typeof colorSchemes;
    const hex = colorSchemes[scheme][index % _length];
    color = { hex, rgba: toRGBA(hex) };
  } else {
    const hex = colorSchemes[3][index === 0 ? 0 : 2];
    color = { hex, rgba: toRGBA(hex) };
  }
  return color;
};

export const percentShift = (color: Color, amount: number): Color => {
  const shiftedRGBA: RGBAColor = [
    color.rgba[0] * amount,
    color.rgba[1] * amount,
    color.rgba[2] * amount,
    255
  ];
  const shiftedHex = toHex(shiftedRGBA);
  return { hex: shiftedHex, rgba: shiftedRGBA };
};
