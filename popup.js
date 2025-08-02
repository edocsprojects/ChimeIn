document.addEventListener('DOMContentLoaded', () => {
  // Request stored responses from background script
  chrome.runtime.sendMessage({type: "getStoredResponses"}, function(response) {
    const responses = response.data;
    const correctList = document.getElementById('correctAnswers');
    const incorrectList = document.getElementById('incorrectAnswers');

    // Clear any previous entries
    correctList.innerHTML = '';
    incorrectList.innerHTML = '';

    // Display responses
    responses.forEach(res => {
      const listItem = document.createElement('li');
      listItem.innerHTML = res.text;

      if (res.correct) {
        correctList.appendChild(listItem);
      } else {
        incorrectList.appendChild(listItem);
      }
    });
  });
});
