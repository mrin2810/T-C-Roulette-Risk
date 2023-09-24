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
    
        summaryButton.addEventListener('click', function() {
            const highlightedData = document.querySelector("#highlighted-data");
            const summaryData = document.querySelector('#summary').value;

            var raw = JSON.stringify({
            "page_data": summaryData
            });

            var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow',
            //  mode: 'no-cors'
            };

            fetch("https://uxb6df64xcgfe7d754aw5k5lyu0giion.lambda-url.us-east-1.on.aws", requestOptions)
            .then((response) => {
                return response.json();
            })
            .then((result) => {
                result = JSON.parse(result.body);
                highlightedData.innerHTML = result["Negative Response"];
                highlightedData.innerHTML += result["Positive Response"];
            })
            .catch(error => console.log('error', error));

        });
    
        saveButton.addEventListener('click', function() {
            const companyName = document.querySelector('#company-name').value;
            const summaryData = document.querySelector('#summary').value;
            data[companyName] = summaryData;
            chrome.storage.sync.set({"data": data}, function() {
                console.log("Data Saved");
            });
        });
    });
});
