//// URL checker
document.getElementById('processUrls').addEventListener('click', async () => {
  const urlInput = document.getElementById('urlInput').value;
  const inputs = urlInput.split('\n').map(input => input.trim()).filter(input => input);

  const resultsList = document.getElementById('results');
  resultsList.innerHTML = '';

  const outputLines = []; // Collect results for copying

  for (const input of inputs) {
    const originalText = input.split('https://')[0]; // Get everything before the URL
    const urlMatch = input.match(/https:\/\/[^\s]+/); // Extract the URL

    if (urlMatch) {
      const originalUrl = urlMatch[0]; // The URL part of the input
      try {
        const finalUrl = await fetchRedirectUrl(originalUrl);

        // Load the final URL in a background tab
        loadInBackgroundTab(finalUrl);

        const resultLine = `${originalText}${finalUrl}`;
        outputLines.push(resultLine);

        const li = document.createElement('li');
        li.textContent = resultLine; // Rebuild the input with the redirected URL
        resultsList.appendChild(li);
      } catch (err) {
        console.error(err);
        const resultLine = `${input} (Error: ${err.message})`;
        outputLines.push(resultLine);

        const li = document.createElement('li');
        li.textContent = resultLine;
        resultsList.appendChild(li);
      }
    } else {
      const resultLine = `${input} (No valid URL found)`;
      outputLines.push(resultLine);

      const li = document.createElement('li');
      li.textContent = resultLine;
      resultsList.appendChild(li);
    }
  }



  // Store results for copying
  document.getElementById('copyResults').dataset.output = outputLines.join('\n');
});

// Copy the results to clipboard when the "Copy Output" button is clicked
document.getElementById('copyResults').addEventListener('click', () => {
  const output = document.getElementById('copyResults').dataset.output;
  if (output) {
    navigator.clipboard.writeText(output)
      .then(() => {
        const message = document.createElement('div');
        message.textContent = 'Output copied';
        document.body.appendChild(message); 

        setTimeout(() => {
          message.remove();
        }, 1000); 
      });
  }
});



async function fetchRedirectUrl(url) {
  const response = await fetch(url, { redirect: 'follow' });
  return response.url; // Final redirected URL
}

function loadInBackgroundTab(url) {
  chrome.tabs.create({ url, active: false }, (tab) => {
    console.log(`Opened tab ${tab.id} in the background for URL: ${url}`);
  });
}












/////// Counter Logic
document.getElementById('processUrls').addEventListener('click', () => {
  const urlInput = document.getElementById('urlInput').value;
  const inputs = urlInput.split('\n').map(input => input.trim()).filter(input => input);

  // Counter for valid URLs
  let linkCount = 0;

  for (const input of inputs) {
    const urlMatch = input.match(/https:\/\/[^\s]+/); // Extract the URL
    if (urlMatch) {
      linkCount++; // Increment the counter for valid URLs
    }
  }

  // Update the count display
  document.getElementById('countDisplay').textContent = `= ${linkCount}`;
});


