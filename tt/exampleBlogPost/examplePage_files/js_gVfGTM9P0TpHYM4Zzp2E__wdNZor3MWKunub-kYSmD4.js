(function () {
  var xhr = new XMLHttpRequest();
  // Request the client IP from the endpoint made available by the module itself.
  xhr.open('GET', '/ip_anonymisation_helper/client_ip');
  xhr.onload = function() {
    if (xhr.status === 200) {
      // Push the client IP directly to the dataLayer.
      dataLayer = dataLayer || [];
      dataLayer.push(JSON.parse(xhr.responseText));
    }
  };
  xhr.send();
})();;
