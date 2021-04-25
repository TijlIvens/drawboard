const amountOfColumns = 100;
const colors = ["fuchsia", "red", "blue", "yellow", "aqua"];
let selectedColor = 0;

const margin = 2;
const contextMenuItemSize = 30;
const borderSize = 1;
const contextMenuOffset = 20;

const calculateContextMenuWidth = () => {
  return (
    (contextMenuItemSize + borderSize * 2 + margin * 2) * colors.length +
    borderSize * 2
  );
};

const calculateContextMenuHeight = (itemHeight, margin, borderSize) => {
  return itemHeight + borderSize * 2 + margin * 2 + borderSize * 2;
};

const positionWithBorder = (
  relativePosition,
  containerLength,
  contextLength
) => {
  if (relativePosition - contextMenuOffset <= 0) {
    return 0;
  }
  if (relativePosition - contextMenuOffset >= containerLength - contextLength) {
    return containerLength - contextLength;
  }

  return relativePosition - contextMenuOffset;
};

const getContextPosition = (drawingBoardContainer, event) => {
  const drawingBoardContainerBox = drawingBoardContainer.getBoundingClientRect();

  let left = positionWithBorder(
    event.clientX - drawingBoardContainerBox.left,
    drawingBoardContainerBox.width,
    calculateContextMenuWidth()
  );
  let top = positionWithBorder(
    event.clientY - drawingBoardContainerBox.top,
    drawingBoardContainerBox.height,
    calculateContextMenuHeight()
  );

  return { left, top };
};

const contextListener = (drawingBoardContainer, contextMenu) => {
  drawingBoardContainer.addEventListener("contextmenu", (event) => {
    event.preventDefault();

    const position = getContextPosition(drawingBoardContainer, event);

    contextMenu.style.left = `${position.left}px`;
    contextMenu.style.top = `${position.top}px`;
    contextMenu.style.visibility = "visible";
    contextMenu.style.opacity = 1;
  });

  contextMenu.addEventListener("mouseleave", () => {
    contextMenu.style.visibility = "hidden";
    contextMenu.style.opacity = 0;
  });
};

const createContextMenuItem = (color, index, contextMenu) => {
  const contextMenuItem = document.createElement("div");
  contextMenuItem.classList.add("context-menu-item");
  contextMenuItem.style.backgroundColor = color;

  contextMenuItem.addEventListener("click", () => {
    selectedColor = index;
    contextMenu.style.visibility = "hidden";
    contextMenu.style.opacity = 0;
  });

  return contextMenuItem;
};

const createContextMenu = (contextMenu) => {
  colors.forEach((color, index) => {
    contextMenu.appendChild(createContextMenuItem(color, index, contextMenu));
  });
};

const activateCell = (node) => {
  node.style.backgroundColor = colors[selectedColor];
};

const changeColor = (node) => {
  if (node.style.backgroundColor === "") {
    activateCell(node);
  } else {
    node.style.backgroundColor = "";
  }
};

const addListeners = (node) => {
  node.addEventListener("click", (event) => changeColor(event.target));
  node.addEventListener(
    "mousemove",
    (event) => event.buttons === 1 && activateCell(event.target)
  );
};

const createCell = (number) => {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.id = `cell-${number}`;

  addListeners(cell);

  return cell;
};

const addAllCells = (amountOfCells, drawingBoard) => {
  for (i = 0; i < amountOfCells; i++) {
    drawingBoard.appendChild(createCell(i));
  }
};

const calculateAmountOfRows = (node, amountOfColumns) => {
  const width = node.clientWidth;
  const height = node.clientHeight;

  return Math.floor(height / (width / amountOfColumns + 1));
};

window.onload = () => {
  const drawingBoard = document.getElementById("drawing-board");
  const drawingBoardContainer = document.getElementById(
    "drawing-board-container"
  );
  const contextMenu = document.getElementById("context-menu");

  const amountOfRows = calculateAmountOfRows(
    drawingBoardContainer,
    amountOfColumns
  );

  addAllCells(amountOfColumns * amountOfRows, drawingBoard);

  createContextMenu(contextMenu);

  contextListener(drawingBoardContainer, contextMenu);
};
