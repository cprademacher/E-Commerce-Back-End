const requestOptions = {
  method: "POST",
  headers: {
    "Content-Type": "application/json", // Set the Content-Type header to JSON
  },
  body: JSON.stringify(postData), // Convert the JavaScript object to a JSON string
};

fetch("/api/categories", requestOptions)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log(error);
  });

// Make the POST request
fetch("/api/tags", requestOptions)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json(); // Parse the JSON response
  })
  .then((data) => {
    // Handle the response data here
    console.log(data);
  })
  .catch((error) => {
    // Handle errors here
    console.error("Error:", error);
  });
