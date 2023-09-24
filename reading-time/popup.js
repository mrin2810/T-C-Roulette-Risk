// const requestConfig = {
//     headers: {
//       "Content-Type": "application/json"
//     },
//   };
  
//   const currentDate = new Date().toISOString().slice(0, 10);
//   console.log(currentDate); // output: 2023-04-06
  
// document.addEventListener('DOMContentLoaded', function() {
//     chrome.storage.sync.get(["data"], (result) => {
//         const data = result["data"] || {};
//         document.getElementById('history').addEventListener('click', function() {
//         chrome.tabs.create({ url: chrome.runtime.getURL('data.html') });
//         });
//         const summaryButton = document.getElementById('highlights');
//         const saveButton = document.getElementById('save');
    
//         summaryButton.addEventListener('click', function() {
//             const highlightedData = document.querySelector("#highlighted-data");
//             const summaryData = document.querySelector('#summary').value;
//             axios.post(
//                 "https://uxb6df64xcgfe7d754aw5k5lyu0giion.lambda-url.us-east-1.on.aws/",
//                 summaryData,
//                 requestConfig
//               )
//               .then((res) => {
//                 highlightedData.innerHTML = res.data;
//                 console.log(`Status: ${res.status}`);
//                 console.log("Body: ", res.data);
//               })
//               .catch((err) => {
//                 // console.log(err);
//                 console.error(err.response.status);
//                 console.error(err.response.statusText);
//                 console.error(err.code);
//               });
            
//             // const inputData = document.querySelector('#summary').value;
//         // Make API call with inputData
//         // Handle response from API
//         });
    
//         saveButton.addEventListener('click', function() {
//         const companyName = document.querySelector('#company-name').value;
//         const summaryData = document.querySelector('#summary').value;
//         data[companyName]= summaryData;
//         chrome.storage.sync.set({"data": data}, function() {
//             console.log("Data Saved")
//         });
//         });

//     });
//   });

var myHeaders = new Headers();
myHeaders.append("Accept", "application/json");
// myHeaders.append("Access-Control-Allow-Origin", "*");

const currentDate = new Date().toISOString().slice(0, 10);
console.log(currentDate); // output: 2023-04-06

document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.sync.get(["data"], (result) => {
        const data = result["data"] || {};
        document.getElementById('history').addEventListener('click', function() {
            chrome.tabs.create({ url: chrome.runtime.getURL('data.html') });
        });

        const summaryButton = document.getElementById('highlights');
        const saveButton = document.getElementById('save');
        const highlightedData = document.querySelector("#highlighted-data");
        const loader = document.querySelector("#loader");
        
        const summaryData = document.querySelector('#summary');
        const companyName = document.querySelector('#company-name');

        const errorElement = document.querySelector("#error-message");
        function checkInputContent() {
            if (summaryData.value.trim() !== '' && companyName.value.trim() !== '') {
                summaryButton.disabled = false;
                saveButton.disabled = false;
                errorElement.style.display = 'none'; 
            } else {
                summaryButton.disabled = true;
                saveButton.disabled = true;
                errorElement.style.display = 'inline-block'; // Show error message
            }
        }        

        // Add an event listener to the summary input to check content on input
        summaryData.addEventListener('input', checkInputContent);
        companyName.addEventListener('input', checkInputContent);

        summaryButton.addEventListener('click', function() {
            if (summaryData.value.trim() !== '' && companyName.value.trim() !== '') {
                console.log('s')
            loader.style.display = 'block';

            var raw = JSON.stringify({
            "page_data": summaryData.value
            });

            var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow',
            };

            fetch("https://uxb6df64xcgfe7d754aw5k5lyu0giion.lambda-url.us-east-1.on.aws", requestOptions)
            .then((response) => {
                return response.json();
            })
            .then((result) => {
                result = JSON.parse(result.body);
                highlightedData.innerHTML = result["Negative Response"];
                highlightedData.innerHTML += result["Positive Response"];
                loader.style.display = "none";                
            })
            .catch(error => {
                console.log('error', error)
                loader.style.display = "none";
            });
        }
        else
        {
            errorElement.style.display = 'inline-block'; // Show error message

        }
        });
    
        saveButton.addEventListener('click', function() {
            const companyName = document.querySelector('#company-name').value;
            const highlightedData = document.getElementById('highlighted-data').innerHTML;
            data[companyName] = highlightedData;
            chrome.storage.sync.set({"data": data}, function() {
                console.log("Data Saved");
            });
        });
    });
});
