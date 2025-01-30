//// URL opener
// document.addEventListener('DOMContentLoaded', () => {
//   const processUrlsButton = document.getElementById('processUrls');
//   const urlInput = document.getElementById('urlInput');
//   const countDisplay = document.getElementById('countDisplay');

//   if (processUrlsButton && urlInput && countDisplay) {
//     processUrlsButton.addEventListener('click', () => {
//       const inputs = urlInput.value.split('\n'); // Split input by new lines
//       let count = 0;

//       for (const input of inputs) {
//         const urlMatch = input.match(/https:\/\/[^\s]+/); // Extract the URL
//         if (urlMatch) {
//           const url = urlMatch[0];
//           chrome.tabs.create({ url: url, active: false }); // Open URL in background
//           count++; // Increment counter
//         }
//       }

//       // Update the counter display
//       countDisplay.textContent = `= ${count}`;
//     });
//   } else {
//     console.error('Required elements not found!');
//   }
// });







////URL checker, copy
document.addEventListener('DOMContentLoaded', () => {
  const processUrlsButton = document.getElementById('processUrls');
  const copyResultsButton = document.getElementById('copyResults');
  const urlInput = document.getElementById('urlInput');
  const countDisplay = document.getElementById('countDisplay');

  let results = []; // Store processed URLs and their original text

  if (processUrlsButton && copyResultsButton && urlInput && countDisplay) {
    processUrlsButton.addEventListener('click', async () => {
      const inputs = urlInput.value.split('\n'); // Split input by new lines
      let count = 0;
      results = []; // Reset results

      for (const input of inputs) {
        const urlMatch = input.match(/https:\/\/[^\s]+/); // Extract the URL
        if (urlMatch) {
          const originalText = input.split('https://')[0].trim(); // Get text before URL and trim spaces
          const url = urlMatch[0];

          try {
            // Fetch the final URL after redirection
            const response = await fetch(url, { method: 'HEAD', redirect: 'follow' });
            const finalUrl = response.url; // Get the final URL after redirection

            // Store the result with original text and final URL
            results.push({ originalText, finalUrl });

            chrome.tabs.create({ url: finalUrl, active: false }); // Open final URL in background
            count++; // Increment counter
          } catch (error) {
            console.error(`Error fetching URL: ${url}`, error);
          }
        }
      }

      // Update the counter display
      countDisplay.textContent = `= ${count}`;
    });

    copyResultsButton.addEventListener('click', () => {
      if (results.length > 0) {
        // Format results: originalText + finalUrl (remove spaces before https://)
        const output = results
          .map(({ originalText, finalUrl }) => `${originalText} ${finalUrl}`) // Add space here
          .join('\n');

        // Copy to clipboard message
        navigator.clipboard
          .writeText(output)
          .then(() => {
            // Show message
            const message = document.createElement('div');
            message.textContent = 'Output copied';
            document.body.appendChild(message); 
            // Remove message after 1 second
            setTimeout(() => {
              document.body.removeChild(message);
            }, 1000);
          })
          .catch((error) => {
            console.error('Failed to copy results:', error);
          });
      } else {
        alert('No results to copy!');
      }
    });
  } else {
    console.error('Required elements not found!');
  }
});

