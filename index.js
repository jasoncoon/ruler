paper.install(window);

let outlinePath;

let mm = true;
let inches = false;

let width = 100;
let height = 25;

let largeHeight = 10;
let largeSpacing = 10;
let largeNumbers = true;
let largeNumberSize = 5;
let largeNumberFill = true;

let mediumHeight = 5;
let mediumSpacing = 1;
let mediumNumbers = false;
let mediumNumberSize = 0.65;
let mediumNumberFill = true;

let smallGrid = false;
let smallHeight = 5;
let smallSpacing = 1;
let smallNumbers = false;
let smallNumberSize = 0.65;
let smallNumberFill = true;

let inputWidth;
let inputHeight;
let inputLargeSpacing;
let inputLargeHeight;
let inputMediumSpacing;
let inputMediumHeight;
let inputSmallGrid;

window.onload = function () {
  paper.setup("canvas");

  draw();

  inputWidth = initFloatInput("width", width, (value) => (width = value));
  inputHeight = initFloatInput("height", height, (value) => (height = value));

  inputLargeSpacing = initFloatInput(
    "largeSpacing",
    largeSpacing,
    (value) => (largeSpacing = value)
  );
  inputLargeHeight = initFloatInput(
    "largeHeight",
    largeHeight,
    (value) => (largeHeight = value)
  );
  initFloatInput(
    "largeNumberSize",
    largeNumberSize,
    (value) => (largeNumberSize = value)
  );

  inputMediumSpacing = initFloatInput(
    "mediumSpacing",
    mediumSpacing,
    (value) => (mediumSpacing = value)
  );
  inputMediumHeight = initFloatInput(
    "mediumHeight",
    mediumHeight,
    (value) => (mediumHeight = value)
  );
  initFloatInput(
    "mediumNumberSize",
    mediumNumberSize,
    (value) => (mediumNumberSize = value)
  );

  inputSmallSpacing = initFloatInput(
    "smallSpacing",
    smallSpacing,
    (value) => (smallSpacing = value)
  );
  inputSmallHeight = initFloatInput(
    "smallHeight",
    smallHeight,
    (value) => (smallHeight = value)
  );

  initCheckedInput(
    "largeNumbers",
    largeNumbers,
    (checked) => (largeNumbers = checked)
  );
  initCheckedInput(
    "largeNumberFill",
    largeNumberFill,
    (checked) => (largeNumberFill = checked)
  );

  initCheckedInput(
    "mediumNumbers",
    mediumNumbers,
    (checked) => (mediumNumbers = checked)
  );
  initCheckedInput(
    "mediumNumberFill",
    mediumNumberFill,
    (checked) => (mediumNumberFill = checked)
  );

  initCheckedInput("mm", mm, (checked) => {
    mm = checked;
    inches = !checked;
    updateUnitDefaults();
  });
  initCheckedInput("inches", inches, (checked) => {
    inches = checked;
    mm = !checked;
    updateUnitDefaults();
  });

  inputSmallGrid = initCheckedInput(
    "smallGrid",
    smallGrid,
    (checked) => (smallGrid = checked)
  );

  let button = document.getElementById("saveSvg");
  button.onclick = (event) => {
    saveSvg();
  };

  button = document.getElementById("redraw");
  button.onclick = (event) => {
    draw();
  };
};

function initFloatInput(name, value, onChange) {
  let input = document.getElementById(name);
  if (!input) {
    console.error(`input not found: ${name}`);
    return;
  }

  input.value = value;
  input.onchange = (event) => {
    onChange(Number.parseFloat(event.target.value));
    draw();
  };

  return input;
}

function initCheckedInput(name, value, onChange) {
  let input = document.getElementById(name);
  if (!input) {
    console.error(`input not found: ${name}`);
    return;
  }

  input.checked = value;
  input.onchange = (ev) => {
    onChange(ev.target.checked);
    draw();
  };

  return input;
}

function updateUnitDefaults() {
  if (mm) {
    width = inputWidth.value = 100;
    height = inputHeight.value = 25;

    largeSpacing = inputLargeSpacing.value = 10;
    largeHeight = inputLargeHeight.value = 10;

    mediumSpacing = inputMediumSpacing.value = 1;
    mediumHeight = inputMediumHeight.value = 5;

    smallGrid = inputSmallGrid.checked = false;
    smallSpacing = inputSmallSpacing.value = 0.5;
    smallHeight = inputSmallHeight.value = 2.5;
  } else if (inches) {
    width = inputWidth.value = 12;
    height = inputHeight.value = 1;

    largeSpacing = inputLargeSpacing.value = 1;
    largeHeight = inputLargeHeight.value = 0.4;

    mediumSpacing = inputMediumSpacing.value = 1 / 4;
    mediumHeight = inputMediumHeight.value = 0.2;

    smallGrid = inputSmallGrid.checked = true;
    smallSpacing = inputSmallSpacing.value = 0.125;
    smallHeight = inputSmallHeight.value = 0.1;
  }

  draw();
}

function draw() {
  project.activeLayer.removeChildren();

  let scale = 96 / 25.4;
  view.scaling = scale;

  let viewWidth = view.size.width;

  let factor = mm ? 1 : 25.4;

  let scaledWidth = width * factor;
  let scaledHeight = height * factor;

  let scaledLargeSpacing = largeSpacing * factor;
  let scaledMediumSpacing = mediumSpacing * factor;
  let scaledSmallSpacing = smallSpacing * factor;

  const zoom = (viewWidth / scaledWidth) * 3.75;
  view.zoom = zoom;

  view.center = new Point(scaledWidth / 2, scaledHeight / 2);

  if (outlinePath) {
    outlinePath.remove();
  }

  let strokeWidth = 0.4 / zoom;

  let outlineRectangle = new Rectangle(
    new Point(0, 0),
    new Point(scaledWidth, scaledHeight)
  );
  outlinePath = new Path.Rectangle(outlineRectangle);
  outlinePath.strokeColor = "black";
  outlinePath.strokeWidth = strokeWidth;
  outlinePath.shadowBlur = 0;
  outlinePath.shadowColor = null;
  outlinePath.shadowOffset = 0;

  // large
  drawGrid(
    scaledWidth,
    scaledLargeSpacing,
    largeHeight * factor,
    strokeWidth,
    null,
    largeNumbers,
    largeNumberSize,
    largeNumberFill
  );

  // medium
  drawGrid(
    scaledWidth,
    scaledMediumSpacing,
    mediumHeight * factor,
    strokeWidth,
    mm ? [] : [scaledLargeSpacing],
    mediumNumbers,
    mediumNumberSize,
    mediumNumberFill
  );

  // small
  if (smallGrid) {
    drawGrid(
      scaledWidth,
      scaledSmallSpacing,
      smallHeight * factor,
      strokeWidth,
      mm ? [] : [scaledLargeSpacing, scaledMediumSpacing]
    );
  }
}

function drawGrid(
  scaledWidth,
  scaledSpacing,
  scaledHeight,
  strokeWidth,
  linesToSkip,
  numbers,
  numberSize,
  numberFill
) {
  let number = 0;

  for (let i = scaledSpacing; i < scaledWidth; i += scaledSpacing) {
    number++;

    if (linesToSkip) {
      let skipLine = false;
      for (let lineToSkip of linesToSkip) {
        if (i % lineToSkip === 0) {
          skipLine = true;
          console.log({
            scaledSpacing,
            i,
            skipLine,
            skip: lineToSkip,
            mod: i % lineToSkip,
          });
          break;
        }
      }
      if (skipLine) continue;
    }

    let path = new Path();
    path.strokeColor = "black";
    path.strokeWidth = strokeWidth;
    path.add(new Point(i, 0));
    path.add(new Point(i, scaledHeight));

    if (numbers) {
      let text = new paper.PointText(new Point(i, scaledHeight + numberSize));
      text.content = number;
      text.justification = "center";
      text.fillColor = numberFill ? "black" : null;
      text.strokeColor = "black";
      text.strokeWidth = strokeWidth;
      text.fontSize = numberSize;
    }
  }
}

function saveSvg() {
  var svg = project.exportSVG({ asString: true });
  var svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  var svgUrl = URL.createObjectURL(svgBlob);
  var downloadLink = document.createElement("a");
  downloadLink.href = svgUrl;
  downloadLink.download = "ruler.svg";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
