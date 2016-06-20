var sample = [{},{},{}];
var buffer = [];
var files;
var audio_context;
var compressor;
var gain;
var destination;
start_web_audio();

function start_web_audio(){
  audio_context = new (window.AudioContext || window.webkitAudioContext)();
  compressor = audio_context.createDynamicsCompressor();
  compressor.threshold.value = -50;
  compressor.knee.value = 40;
  compressor.ratio.value = 24;
  compressor.reduction.value = -20;
  gain = audio_context.createGain();
  gain.gain.value = 1;
  gain.connect(audio_context.destination);
  destination = gain;
  compressor.connect(gain);
}

function play(pos){
  var source = audio_context.createBufferSource();
  var sound = buffer[pos].shift().charCodeAt(0);
  if(sample[folder][sound]===0) sound = 0;
  source.buffer = sample[folder][sound];
  source.connect(destination);
  source.onended = function(){if(buffer.length != 0 && buffer[pos] != '' ) play(pos);};
  source.start(0);
}

$(function(){
  init();  
});

function init(){
  files = 0;
  var format = ['.mp3' /*'.ogg', /*'.wav'*/];
  for(i=0;i<=FOLDERS;i++){
    load_folder(i, format[0]);
  }
}

function load_folder(folder, format){
  load(folder, 0, format);
  for(var i=32; i<127; i++) load(folder, i, format);
  for(var i=127; i<256; i++) sample[folder][i] = 0;
}

var total;
function load(folder, file, format){
  files++; total = files;
  var request = new XMLHttpRequest();
  request.onload = function() {
    files--;
    $('#percent').html(Math.floor((total-files)/total*100)+'%');
    if (this.status === 404) {if(!sample[folder][file]) sample[folder][file] = 0; if(files<50) loaded();}
    else {
      audio_context.decodeAudioData(request.response, function(buffer) {
        sample[folder][file] = buffer;
        if(files<50) loaded();
      }, on_error);
    }
  };
  request.open('GET', 'samples_'+folder+'/'+file+format, true);
  request.responseType = 'arraybuffer';
  request.send();
}

function on_error(e){
  console.log('Error: '+e);
  if(files<50) loaded();
}
