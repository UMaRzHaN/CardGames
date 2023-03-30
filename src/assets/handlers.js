export function handleDragStart(e) {
  e.dataTransfer.setData("card", e.target.id);
}
export function handleDragOver(e) {
  e.preventDefault();
}
export const column = (array, colum) =>
  array.length > 0
    ? [
        array.slice(-1)[0].color,
        array.slice(-1)[0].number,
        array.slice(-1)[0].suit,
        array.slice(-1)[0].img,
        array.slice(-1)[0].name,
        array.slice(-1)[0].selected,
        array.slice(-1)[0].id,
        colum,
      ]
    : colum;
export const card = (arg) => [
  arg.color,
  arg.number,
  arg.suit,
  arg.img,
  arg.name,
  arg.selected,
  arg.id,
];
export const copyToClipboard = (state) => {
  navigator.clipboard
    .writeText(state)
    .then(() => console.log("Done!"))
    .catch((err) => console.error(err));
};
