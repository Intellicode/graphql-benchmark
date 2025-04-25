#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const autocannon = require("autocannon");
const { promisify } = require("util");
const readFileAsync = promisify(fs.readFile);

// Default configuration
const DEFAULT_CONFIG = {
  url: "http://localhost:4000/graphql",
  method: "POST",
  connections: 10,
  pipelining: 1,
  duration: 10,
  headers: {
    "content-type": "application/json",
  },
};

// Available query types
const QUERY_TYPES = ["simple", "medium", "complex", "super-complex"];

async function loadQuery(type) {
  try {
    const queryPath = path.join(__dirname, "..", "queries", `${type}.graphql`);
    const content = await readFileAsync(queryPath, "utf8");
    // Remove comments and trim whitespace
    return content.replace(/\/\/.*$/gm, "").trim();
  } catch (error) {
    console.error(`Error loading query ${type}:`, error.message);
    process.exit(1);
  }
}

async function runBenchmark({
  url = DEFAULT_CONFIG.url,
  connections = DEFAULT_CONFIG.connections,
  duration = DEFAULT_CONFIG.duration,
  queryType = "simple",
}) {
  if (!QUERY_TYPES.includes(queryType)) {
    console.error(
      `Invalid query type: ${queryType}. Available types: ${QUERY_TYPES.join(
        ", "
      )}`
    );
    process.exit(1);
  }

  console.log(`\n🚀 Running benchmark with ${queryType} query`);
  console.log(`URL: ${url}`);
  console.log(`Connections: ${connections}`);
  console.log(`Duration: ${duration}s\n`);

  const query = await loadQuery(queryType);
  const body = JSON.stringify({
    query,
    variables: {},
  });

  const instance = autocannon({
    ...DEFAULT_CONFIG,
    url,
    connections,
    duration,
    setupClient: (client) => {
      client.setBody(body);
    },
  });

  autocannon.track(instance);

  // Print results when done
  instance.on("done", (results) => {
    console.log("\n✅ Benchmark completed\n");
    console.log(`Query Type: ${queryType}`);
    console.log(
      `Latency (ms): avg: ${results.latency.average.toFixed(2)}, min: ${
        results.latency.min
      }, max: ${results.latency.max}`
    );
    console.log(`Requests/sec: ${results.requests.average}`);
    console.log(
      `Throughput: ${(results.throughput.average / 1024 / 1024).toFixed(
        2
      )} MB/s`
    );
    console.log("\n");
  });

  // Handle interrupts
  process.once("SIGINT", () => {
    autocannon.stop(instance);
  });
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    url: DEFAULT_CONFIG.url,
    connections: DEFAULT_CONFIG.connections,
    duration: DEFAULT_CONFIG.duration,
    queryType: "simple",
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--url" || arg === "-u") {
      options.url = args[++i];
    } else if (arg === "--connections" || arg === "-c") {
      options.connections = parseInt(args[++i], 10);
    } else if (arg === "--duration" || arg === "-d") {
      options.duration = parseInt(args[++i], 10);
    } else if (arg === "--query" || arg === "-q") {
      options.queryType = args[++i];
    } else if (arg === "--help" || arg === "-h") {
      console.log(`
GraphQL Benchmark Tool

Options:
  --url, -u          GraphQL endpoint URL (default: ${DEFAULT_CONFIG.url})
  --connections, -c  Number of concurrent connections (default: ${
    DEFAULT_CONFIG.connections
  })
  --duration, -d     Duration of the test in seconds (default: ${
    DEFAULT_CONFIG.duration
  })
  --query, -q        Query type to use: ${QUERY_TYPES.join(
    ", "
  )} (default: simple)
  --help, -h         Show this help message

Examples:
  $ node index.js -q simple -d 20
  $ node index.js --url http://localhost:3000/graphql --connections 50 --duration 30 --query complex
`);
      process.exit(0);
    }
  }

  return options;
}

// Run benchmark with command line args
runBenchmark(parseArgs()).catch(console.error);
