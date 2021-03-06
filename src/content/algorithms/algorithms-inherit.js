document.getElementById("container").innerHTML += `
  <div class="panel panel-default" style="margin: 27px 0 15px; background-color:#222; border: 1px solid #080808;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 1);">
    <div class="panel-body" style="padding: 5px 3px 2px;">

      <p class="pull-left" style="color:#dce9f2; margin: 5px; font-size:20px; font-family: 'Hammersmith One', sans-serif;">` + routes["displayName"] + `</p>

      <div class="pull-right">
        <div class="col-md-6 col-sm-6">

        <select class="form-control input-sm" id="selectMethod">
          <option>Choose Method</option>
          <!-- Algorithm methods will be inserted here -->
        </select>

        </div>

        <div class="col-md-6 col-sm-6">

        <select class="form-control input-sm" id="selectInput" onchange="onInvoke();">
          <option>Choose Input</option>
          <!-- Input datasets will be inserted here -->
        </select>
        </div>

      </div>
    </div>
  </div>

  <div class="visible-xs visible-sm" id="sm-device-btn">
  </div>


  <div id="codeNote">
  </div>
  <div class="row" style="height:85%">
    <div class="col-xs-12 col-sm-12 col-md-6" style="height:100%">
      <div class="panel panel-default" style="height:100%; box-shadow: 0 8px 10px 0 rgba(0, 0, 0, 1);">
        <div class="panel-body" style="height:100%">
          <div id="visualization" class="visualization" style="width:100%; height:100%">
            <!-- Visualization will be inserted here -->
          </div>
        </div>
      </div>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-6" style="height:100%">
      <div class="panel panel-default" style="height:100%; box-shadow: 0 8px 10px 0 rgba(0, 0, 0, 1);">

   <div class="infoPane">
			<p id="infoPane">
			
			<!-- Info pane will be inserted here -->
			</p>
	  </div>
        <pre style="height:84%;background-color:#f5f5f5">
          <code id="codePane" style="background-color:#f5f5f5">
            <!-- Code pane will be inserted here -->
          </code>
        </pre>
      </div>
    </div>
  </div>

  <div class="pull-right">
    <button type="button" class="btn btn-primary btn-lg outline" data-toggle="tooltip" data-placement="bottom" title="Re-invoke" onclick="onInvoke()">
      <span class="glyphicon glyphicon-repeat icon-repeat" aria-hidden="true"></span>
    </button>
    <button type="button" id="idj-play-button" class="btn btn-primary btn-lg outline" onclick="onPlayPause()">
      <span class="glyphicon glyphicon-play icon-play" aria-hidden="true"></span>
    </button>
    <button type="button" id="idj-pause-button" class="btn btn-primary btn-lg outline hide" onclick="onPlayPause()">
      <span class="glyphicon glyphicon-pause icon-play" aria-hidden="true"></span>
    </button>
    <button type="button" class="btn btn-primary btn-lg outline" data-toggle="tooltip" data-placement="bottom" title="Step" onclick="onNext()" id="next">
      <span class="glyphicon glyphicon-step-forward icon-step" aria-hidden="true"></span>
    </button>
  </div>
  <div class="pull-left">
    <button type="button" class="btn btn-primary btn-lg outline" data-toggle="tooltip" data-placement="bottom" title="Export" onclick="onExport()">
      <span class="glyphicon glyphicon-save-file icon-export" aria-hidden="true"></span>
    </button>
  </div>`;

document.getElementById("sm-device-btn").innerHTML +=
  `<div class="pull-right">
    <button type="button" id="sm-repeat-button" class="btn btn-primary btn-lg outline" onclick="onInvoke()">
      <span class="glyphicon glyphicon-repeat icon-repeat" aria-hidden="true"></span>
    </button>
    <button type="button" id="sm-play-button" class="btn btn-primary btn-lg outline" onclick="onPlayPause()">
      <span class="glyphicon glyphicon-play icon-play" aria-hidden="true"></span>
    </button>
    <button type="button" id="sm-pause-button" class="btn btn-primary btn-lg outline hide" onclick="onPlayPause()">
      <span class="glyphicon glyphicon-pause icon-play" aria-hidden="true"></span>
    </button>
     <button type="button" class="btn btn-primary btn-lg outline" onclick="onNext()" id="next">
       <span class="glyphicon glyphicon-step-forward icon-step" aria-hidden="true"></span>
     </button>
   </div>
   <div class="pull-left">
     <button type="button" class="btn btn-primary btn-lg outline" onclick="onExport()">
       <span class="glyphicon glyphicon-save-file icon-export" aria-hidden="true"></span>
     </button>
   </div>`;

var vm = new VirtualMachine();
vm.dur = 500;

var v = document.getElementById("visualization").getBoundingClientRect();
var svgW = v.width;
var svgH = v.height;
// window.onresize = resize;
d3.select(".visualization")
  .append("svg")
  .attr("width", svgW)
  .attr("height", svgH)
  .attr('id', svgCanvasName);

var onNext = function() {
  if (paused == true && vm.getFrame() !== undefined) {
    vm.next();
  }
};

let playInterval;
var paused = true;

var onPlayPause = function() {
  if (paused === true) {
    paused = false;
    $('#idj-play-button').addClass('hide');
    $('#idj-pause-button').removeClass('hide');
    $('#sm-play-button').addClass('hide');
    $('#sm-pause-button').removeClass('hide');
    playInterval = window.setInterval(onPlayInterval, vm.dur);
  } else {
    paused = true;
    $('#idj-pause-button').addClass('hide');
    $('#idj-play-button').removeClass('hide');
    $('#sm-pause-button').addClass('hide');
    $('#sm-play-button').removeClass('hide');
  }
}

var onPlayInterval = function() {
  if (vm.getFrame() === undefined || paused === true) {
    paused = true;
    $('#idj-pause-button').addClass('hide');
    $('#idj-play-button').removeClass('hide');
    $('#sm-pause-button').addClass('hide');
    $('#sm-play-button').removeClass('hide');
    window.clearInterval(playInterval);
  } else {
    vm.next();
  }
}

var onExport = function() {
  let doc = new jsPDF('p', 'pt', 'a4');
  for (let i = 0; i < vm.images.length; ++i) {
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvg(canvas, vm.images[i]);
    let imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 40, 40, vm.svgW, vm.svgH);
    doc.addPage();
  }
  doc.save("visualization.pdf");
}

let inputData;
let populateSelectInput = function(inputMap) {
  inputData = inputMap;
  for (let inputName in inputMap) {
    if (inputMap.hasOwnProperty(inputName)) {
      document.getElementById('selectInput').innerHTML
        += `<option value="` + inputName + `">` + inputName + `</option>`;
    }
  }
};

// Populate the list of available methods
for (let method of routes["methods"]) {
  document.getElementById("selectMethod").innerHTML += `<option value="` + method["name"] + `">` + method["displayName"] + `</option>`;
}
