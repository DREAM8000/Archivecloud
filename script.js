var connectionNumberInput = document.getElementById('connectionNumber');
var fileInput = document.getElementById('fileInput');
var enterNumberButton = document.getElementById('enterNumberButton');
var connectButton = document.getElementById('connectButton');
var sendButton = document.getElementById('sendButton');
var progressBar = document.getElementById('progressBar');

var connected = false;
var peerConnection;

enterNumberButton.addEventListener('click', function() {
  var connectionNumber = connectionNumberInput.value;
  if (connectionNumber.trim() !== '') {
    connectButton.disabled = false;
    enterNumberButton.disabled = true;
  } else {
    console.error('Please enter a connection number');
  }
});

connectButton.addEventListener('click', function() {
  if (!connected) {
    var connectionNumber = connectionNumberInput.value;
    if (connectionNumber.trim() !== '') {
      peerConnection = new RTCPeerConnection();

      peerConnection.ondatachannel = function(event) {
        var receiveChannel = event.channel;

        receiveChannel.onmessage = function(event) {
          console.log('Received Message:', event.data);
        };
      };

      var sendChannel = peerConnection.createDataChannel('sendDataChannel');

      sendChannel.onopen = function() {
        console.log('Data channel is open');
        connected = true;
        sendButton.disabled = false;
      };

      sendChannel.onclose = function() {
        console.log('Data channel is closed');
        connected = false;
        sendButton.disabled = true;
      };

      var offerOptions = {
        offerToReceiveAudio: 0,
        offerToReceiveVideo: 0
      };

      peerConnection.createOffer(offerOptions)
        .then(function(offer) {
          return peerConnection.setLocalDescription(offer);
        })
        .then(function() {
          console.log('Offer created successfully');
        })
        .catch(function(err) {
          console.error('Error creating offer:', err);
        });
    } else {
      console.error('Please enter a connection number');
    }
  } else {
    console.log('Already connected');
  }
});

sendButton.addEventListener('click', function() {
  var file = fileInput.files[0];
  if (file) {
    var reader = new FileReader();
    reader.onloadend = function() {
      var data = reader.result;
      var sendChannel = peerConnection.createDataChannel('sendDataChannel');
      sendChannel.send(data);
      console.log('File sent successfully');
    };
    reader.readAsDataURL(file);
  } else {
    console.error('No file selected');
  }
});