window.onload = function () {
  const userQuestionInput = document.getElementById("user-question");
  const userInputInput = document.getElementById("user-input");
  const questionErrorMessage = document.getElementById("question-error-message");
  const userInputErrorMessage = document.getElementById("user-input-error-message");
  const wordCountElement = document.getElementById("word-count");
  const modelAnswerBtn = document.getElementById("model-answer-btn");
  const getSuggestionBtn = document.getElementById("get_suggestion");
  const submitBtn = document.getElementById("submitBtn");
  const resetBtn = document.getElementById("resetBtn");
  const resultDiv = document.getElementById("result");
  const uplaod = document.getElementById("uploadBtn")
  const uploadSpinner = document.getElementById("uploadSpinner"); 

  let spinnerDiv; 

  let submitButtonClicked = false;
  let modelAnswerClicked = false;
  let suggestionClicked = false;

  modelAnswerBtn.disabled = true;
  getSuggestionBtn.disabled = true;

  const enableButtons = () => {
    modelAnswerBtn.disabled = false;
    getSuggestionBtn.disabled = false;
  };

  const resetOverallScore = () => {
    document.getElementById("overall-score").innerText = "";
  };

  const createSmallSpinner = () => {
    const spinner = document.createElement("div");
    spinner.classList.add("small-spinner");
    return spinner;
  };

  function displayErrorBox(errorData) {
    const errorBox = document.getElementById("error-box");
    const errorContent = document.getElementById("user-input-error");
  
  
    errorContent.innerHTML = '';
  
   
    if (errorData.length > 0) {
      errorBox.style.display = "block";
  
    
      let originalText = document.getElementById("user-input").value;
  
 
      const highlightedTextDiv = document.createElement("div");
  
 
      errorData.forEach((error) => {

        const errorSpan = document.createElement("span");
        errorSpan.innerHTML = `<span class="error-word" data-suggestion="${error.suggestions[0].suggestion}">${error.text}</span> `;
        

        highlightedTextDiv.appendChild(errorSpan);
  

        originalText = originalText.replace(error.text, errorSpan.outerHTML);
      });
  

      errorContent.innerHTML = originalText;
  

    } else {

      errorBox.style.display = "none";
    }
  }
  
  document.getElementById("chat-form").addEventListener("submit", function (event) {
    event.preventDefault();

    if (submitButtonClicked) {
      alert("You have already submitted the form.");
      return;
    }

    submitButtonClicked = true;

    let userQuestion = userQuestionInput.value;
    let userInput = userInputInput.value;

    if (userQuestion.trim() === "") {
      questionErrorMessage.style.display = "block";
      submitButtonClicked = false; // Reset the submit flag
      return;
    } else {
      questionErrorMessage.style.display = "none";
    }

    if (userInput.trim() === "") {
      userInputErrorMessage.style.display = "block";
      submitButtonClicked = false; // Reset the submit flag
      return;
    } else {
      userInputErrorMessage.style.display = "none";
    }

    const minEssayWordCount = 50; // Adjust this based on your criteria
    const wordCount = userInput.split(/\s+/).filter(function (word) {
      return word.length > 0;
    }).length;

    if (wordCount < minEssayWordCount) {
      alert("Your input is too short to be considered an essay. Please provide a longer response.");
      submitButtonClicked = false; // Reset the submit flag
      return;
    }

    if (userQuestion.trim() === userInput.trim()) {
      alert("The question and user input cannot be equal.");
      submitButtonClicked = false; // Reset the submit flag
      return;
    }

    let fullUserInput = `Question: ${userQuestion}\n\n${userInput}`;


    resultDiv.innerHTML = ''; 
    spinnerDiv = document.createElement("div");
    spinnerDiv.classList.add("spinner");
    resultDiv.appendChild(spinnerDiv); 

    const formData = new FormData();
    formData.append('user_input', fullUserInput);

    fetch('/gpt3', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {

        let content = data.content;
        let overallScore = data.overall_score;
        let overallScoreElement = document.getElementById("overall-score");
        overallScoreElement.innerText = `${overallScore}`;


        spinnerDiv.style.display = 'none';
        content = content.replace(/\n/g, "<br>");
        resultDiv.innerHTML = content;


        submitBtn.disabled = false;
        enableButtons();
      })
      .catch((error) => {
        console.error("Error fetching response:", error);
        submitButtonClicked = false; // Reset the submit flag
      });

      fetch('/text', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          // Extract the content from the data received
          let textData = data.text;
          console.log("Extracted Text:", textData);
          displayErrorBox(textData);
        })
        
      
        .catch((error) => {
          console.error("Error fetching response:", error);
        });

  });

  userQuestionInput.addEventListener("input", function () {
    if (this.value.trim() === "") {
      questionErrorMessage.style.display = "block";
    } else {
      questionErrorMessage.style.display = "none";
    }
  });

  userInputInput.addEventListener("input", function () {
    if (this.value.trim() === "") {
      userInputErrorMessage.style.display = "block";
    } else {
      userInputErrorMessage.style.display = "none";
    }

    const userInput = this.value;
    const wordCount = userInput.split(/\s+/).filter(function (word) {
      return word.length > 0;
    }).length;
    const paragraphCount = (this.value.match(/\n{2,}/g) || []).length + 1;
    document.getElementById("word-count").innerText = `Word count: ${wordCount} | Paragraph count: ${paragraphCount}`;
  });

  modelAnswerBtn.addEventListener("click", function (event) {
    event.preventDefault();

    if (submitButtonClicked && !modelAnswerClicked && !modelAnswerBtn.disabled) {
      modelAnswerClicked = true;
      modelAnswerBtn.disabled = true;

      const userInput = document.getElementById("user-input").value;


      const spinner = createSmallSpinner();
      modelAnswerBtn.appendChild(spinner);

      const formData = new FormData();
      formData.append('user_input', userInput);

      fetch('/model_a', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          let content = data.content;
          let resultDiv = document.getElementById("model");
          content = content.replace(/\n/g, "<br>");
          resultDiv.innerHTML = content;


          spinner.remove();
        })
        .catch((error) => {
          console.error("Error fetching model answer:", error);
        });
    } else if (!submitButtonClicked) {
      alert("Please submit the form before requesting the model answer.");
    } else {
      alert("Model Answer has already been generated.");
    }
  });

  getSuggestionBtn.addEventListener("click", function (event) {
    event.preventDefault();

    if (submitButtonClicked && !suggestionClicked && !getSuggestionBtn.disabled) {
      suggestionClicked = true;
      getSuggestionBtn.disabled = true;

      const userInput = document.getElementById("user-input").value;

      const spinner = createSmallSpinner();
      getSuggestionBtn.appendChild(spinner);

      const formData = new FormData();
      formData.append('user_input', userInput);

      fetch('/suggest', {
        method: 'POST',
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          let content = data.content;
          let resultDiv = document.getElementById("sg");
          content = content.replace(/\n/g, "<br>");
          resultDiv.innerHTML = content;


          spinner.remove();
        })
        .catch((error) => {
          console.error("Error fetching suggestion:", error);
        });
    } else if (!submitButtonClicked) {
      alert("Please submit the form before requesting a suggestion.");
    } else {
      alert("Suggestion has already been generated.");
    }
  });

  resetBtn.addEventListener("click", function () {
    userQuestionInput.value = "";
    userInputInput.value = "";
    questionErrorMessage.style.display = "none";
    userInputErrorMessage.style.display = "none";
    wordCountElement.innerText = "Word count: 0 | Paragraph count: 0";

    document.getElementById("result").innerHTML = "";
    document.getElementById("model").innerHTML = "";
    document.getElementById("sg").innerHTML = "";

    const errorBox = document.getElementById("error-box");
    const errorContent = document.getElementById("user-input-error");
    errorContent.innerHTML = "";
    errorBox.style.display = "none";;

    submitButtonClicked = false;
    submitBtn.disabled = false;

    modelAnswerClicked = false;
    modelAnswerBtn.disabled = false;

    suggestionClicked = false;
    getSuggestionBtn.disabled = false;

    resetOverallScore();


    if (spinnerDiv) {
      spinnerDiv.remove();
    }
  });
  uplaod.addEventListener("click", function (event) {
    event.preventDefault();
      uploadSpinner.style.display = "inline-block";


      const fileInput = document.getElementById("photo-upload");
      const file = fileInput.files[0];
  
      const formData = new FormData();
      formData.append("file", file);

      fetch("/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
           const extractedText = data.text;
           const userInputInput = document.getElementById("user-input");
           userInputInput.value += "\n\n" + extractedText; // Append extracted text to user-input
           uploadSpinner.style.display = "none";
        })
        .catch((error) => {
           console.error("Error uploading file:", error);
           uploadSpinner.style.display = "none";
        });
  });
  document.getElementById("user-input-error").addEventListener("mouseover", function (event) {
    const target = event.target;
    if (target.classList.contains("error-word")) {
      const suggestion = target.dataset.suggestion;
      if (suggestion) {
        // Show suggestion on hover
        alert(`Suggestion: ${suggestion}`);
      }
    }
  });
};
