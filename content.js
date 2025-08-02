console.log("Content script running");

// Extract the x-digit number from the current page URL
const urlPattern = /chimeParticipant\/(\d{4})/;
const match = window.location.href.match(urlPattern);

if (match) {
  const dynamicNumber = match[1];
  console.log(`Extracted number from URL: ${dynamicNumber}`);

  // Store the extracted number in background script
  chrome.runtime.sendMessage({type: "storeDynamicNumber", number: dynamicNumber}, function(response) {
    console.log("Response from background script:", response);
  });

  // Function to construct the dynamic URL
  function getDynamicUrl(number) {
    return `https://chimein2.cla.umn.edu/api/chime/${number}/openQuestions`;
  }

  // Construct the URL with the dynamic number
  let url = getDynamicUrl(dynamicNumber);

  // Fetch data from the dynamically constructed URL
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Data received:', data);

      // Access the question responses
      const questionResponses = data.sessions[0].question.question_info.question_responses;

      // Prepare responses for sending to background script
      const responses = questionResponses.map(response => ({
        text: response.text,
        correct: response.correct
      }));

      // Send the responses to the background script
      chrome.runtime.sendMessage({type: "storeResponses", data: responses}, function(response) {
        console.log("Response from background script:", response);
      });
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
} else {
  console.error("Could not extract the number from URL.");
}
