paper.install(window);

let outlinePath;
let gridPaths = [];

let width = 500;
let height = 50;

let majorHeight = 10;
let majorSpacing = 10;

let minorHeight = 5;
let minorSpacing = 1;

let strokeWidth = 0.3;

window.onload = function () {
  paper.setup("canvas");

  create();

  let inputWidth = document.getElementById("width");
  inputWidth.value = width;
  inputWidth.onchange = (event) => {
    width = Number.parseFloat(event.target.value);
    create();
  };

  let inputHeight = document.getElementById("height");
  inputHeight.value = height;
  inputHeight.onchange = (event) => {
    height = Number.parseFloat(event.target.value);
    create();
  };

  let inputMajorSpacing = document.getElementById("majorSpacing");
  inputMajorSpacing.value = majorSpacing;
  inputMajorSpacing.onchange = (event) => {
    majorSpacing = Number.parseFloat(event.target.value);
    create();
  };

  let inputMajorHeight = document.getElementById("majorHeight");
  inputMajorHeight.value = majorSpacing;
  inputMajorHeight.onchange = (event) => {
    majorHeight = Number.parseFloat(event.target.value);
    create();
  };

  let inputMinorSpacing = document.getElementById("minorSpacing");
  inputMinorSpacing.value = minorSpacing;
  inputMinorSpacing.onchange = (event) => {
    minorSpacing = Number.parseFloat(event.target.value);
    create();
  };

  let inputMinorHeight = document.getElementById("minorHeight");
  inputMinorHeight.value = minorSpacing;
  inputMinorHeight.onchange = (event) => {
    minorHeight = Number.parseFloat(event.target.value);
    create();
  };

  let buttonSaveSvg = document.getElementById("saveSvg");
  buttonSaveSvg.onclick = (event) => {
    saveSvg();
  };
};

function create() {
  const scale = 96 / 25.4;
  view.scaling = scale;

  let viewWidth = view.size.width ?? width;
  const zoom = (viewWidth / width) * 3;

  console.log({ scale, zoom, viewWidth, width });
  view.zoom = zoom;

  view.center = new Point(width / 2, height / 2);

  if (outlinePath) {
    outlinePath.remove();
  }

  for (let path of gridPaths) {
    path.remove();
  }

  console.log({ width, height });

  let outlineRectangle = new Rectangle(
    new Point(0, 0),
    new Point(width, height)
  );
  outlinePath = new Path.Rectangle(outlineRectangle);
  outlinePath.strokeColor = "black";
  outlinePath.strokeWidth = strokeWidth;
  outlinePath.shadowBlur = 0;
  outlinePath.shadowColor = null;
  outlinePath.shadowOffset = 0;

  for (let x = majorSpacing; x < width; x += majorSpacing) {
    let path = new Path();
    path.strokeColor = "black";
    path.strokeWidth = strokeWidth;
    path.add(new Point(x, 0));
    path.add(new Point(x, majorHeight));
    gridPaths.push(path);
  }

  for (let x = minorSpacing; x < width; x += minorSpacing) {
    let path = new Path();
    path.strokeColor = "black";
    path.strokeWidth = strokeWidth;
    path.add(new Point(x, 0));
    path.add(new Point(x, minorHeight));
    gridPaths.push(path);
  }
}

function saveSvg() {
  var svg = project.exportSVG({ asString: true });
  var svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  var svgUrl = URL.createObjectURL(svgBlob);
  var downloadLink = document.createElement("a");
  downloadLink.href = svgUrl;
  downloadLink.download = "rule.svg";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
