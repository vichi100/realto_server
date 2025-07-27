const path = require('path');

async function runJob(jobPath) {
  try {
    console.log(`🚀 Running job: ${jobPath}`);
    require(jobPath); // This starts the job immediately (as it's scheduled inside the script)
  } catch (err) {
    console.error(`❌ Failed to run ${jobPath}:`, err.message);
  }
}

// Resolve paths to the job files
const jobs = [
  './residentialRentPropertyMatchJob.js',
  './residentialBuyPropertyMatchJob.js',
  './commercialRentPropertyMatchJob.js',
  './commercialBuyPropertyMatchJob.js'
];

// Run all jobs
(async () => {
  for (const jobFile of jobs) {
    await runJob(path.resolve(__dirname, jobFile));
  }

  console.log('✅ All match jobs initiated.');
})();


// Run it using: node run_all_match_jobs.js
//vichirajan@192 jobs % node run_all_match_jobs.js