var pubnub = PUBNUB({
    subscribe_key: 'sub-c-6f08dafe-ef69-11e5-872f-02ee2ddab7fe',
    publish_key: 'pub-c-d499c43e-d44f-4daf-b7af-23414ef0019a'
});

pubnub.subscribe({
  channel : 'room',
  callback: function(data) {
    frequencies[data.frequency].gain.gain.value = data.value;
  },
  error: function(err) {
      console.log(err);
  }
})

function send(data) {
  pubnub.publish({
    channel: 'room',
    message: data
  });
}
