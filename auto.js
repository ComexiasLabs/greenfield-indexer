let iteration = 0;

const callApiAndSleep = async () => {
    iteration++;
    try {
        console.log(`API call ${iteration}`);
        const response = await fetch('http://localhost:3000/api/collect?env=mainnet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status !== 200) {
            console.error(`API Call ${iteration} Failed with status: ${response.status}`);
        }
    } catch (error) {
      console.error(`API Call ${iteration} Failed:`, error.message);
    }
  
    console.log('Sleeping for 10 seconds...');
    setTimeout(callApiAndSleep, 10000);
};

callApiAndSleep();
