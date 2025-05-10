# graphql-benchmark

## Start servers

```
cd node/<server>
node index.mjs
```

## Start benchmark

```
PORT=4000 node index.js -q simple -d 40 -c 1000 
```

`-d`: duration in seconds
`-c`: connections
`-q`: query type

- simple
- medium
- complex
- super-complex


# Results 

## Simple query
```
PORT=4000 node index.js -q simple -d 40 -c 1000
```

### Overview

| Server         | Runtime | Avg Latency (ms) | Requests/sec | Throughput (MB/s) | Errors (Timeouts) |
|---------------|---------|------------------|--------------|-------------------|-------------------|
| Yoga          | Bun     | 71.02            | 13,983.6     | 20.56             | 0                 |
| Mercurius     | Node    | 76.82            | 13,175.8     | 19.98             | 19 (0)            |
| Yoga          | Node    | 81.75            | 12,844.4     | 19.46             | 57 (0)            |
| Yoga          | Deno    | 108.38           | 9,185.21     | 13.71             | 0                 |
| Apollo        | Node    | 226.02           | 5,278.73     | 8.62              | 967 (314)         |

- **Avg Latency (ms):** Lower is better.
- **Requests/sec:** Higher is better.
- **Throughput (MB/s):** Higher is better.
- **Errors (Timeouts):** Lower is better.

> **Note:** All results are for the "simple" query with 1000 connections over 40 seconds.

### Yoga (Node)

🚀 Running benchmark with simple query
URL: http://localhost:4000/graphql
Connections: 1000
Duration: 40s

Running 40s test @ http://localhost:4000/graphql
1000 connections


| Stat    | 2.5%  | 50%   | 97.5%  | 99%    | Avg      | Stdev    | Max     |
|---------|-------|-------|--------|--------|----------|----------|---------|
| Latency | 72 ms | 76 ms | 154 ms | 163 ms | 81.75 ms | 34.36 ms | 1475 ms |

| Stat      | 1%    | 2.5%  | 50%     | 97.5%   | Avg      | Stdev   | Min   |
|-----------|-------|-------|---------|---------|----------|---------|-------|
| Req/Sec   | 8,839 | 8,839 | 12,975  | 13,111  | 12,844.4 | 655.33  | 8,838 |
| Bytes/Sec | 14 MB | 14 MB | 20.6 MB | 20.8 MB | 20.4 MB  | 1.04 MB | 14 MB |

Req/Bytes counts sampled once per second.
\# of samples: 40

515k requests in 40.08s, 816 MB read
57 errors (0 timeouts)

✅ Benchmark completed

Query Type: simple
Latency (ms): avg: 81.75, min: 69, max: 1475
Requests/sec: 12844.4
Throughput: 19.46 MB/s

### Yoga (Deno)

🚀 Running benchmark with simple query
URL: http://localhost:8000/graphql
Connections: 1000
Duration: 40s

Running 40s test @ http://localhost:8000/graphql
1000 connections


| Stat    | 2.5%  | 50%    | 97.5%  | 99%    | Avg       | Stdev    | Max    |
|---------|-------|--------|--------|--------|-----------|----------|--------|
| Latency | 73 ms | 110 ms | 118 ms | 121 ms | 108.38 ms | 10.04 ms | 172 ms |

| Stat      | 1%      | 2.5%    | 50%     | 97.5%   | Avg      | Stdev  | Min     |
|-----------|---------|---------|---------|---------|----------|--------|---------|
| Req/Sec   | 8,839   | 8,839   | 9,223   | 9,495   | 9,185.21 | 205.59 | 8,833   |
| Bytes/Sec | 13.8 MB | 13.8 MB | 14.4 MB | 14.9 MB | 14.4 MB  | 321 kB | 13.8 MB |

Req/Bytes counts sampled once per second.
\# of samples: 40

368k requests in 40.09s, 575 MB read

✅ Benchmark completed

Query Type: simple
Latency (ms): avg: 108.38, min: 70, max: 172
Requests/sec: 9185.21
Throughput: 13.71 MB/s

### Mercurius (Node)

🚀 Running benchmark with simple query
URL: http://localhost:4000/graphql
Connections: 1000
Duration: 40s

Running 40s test @ http://localhost:4000/graphql
1000 connections


| Stat    | 2.5%  | 50%   | 97.5% | 99%    | Avg      | Stdev    | Max    |
|---------|-------|-------|-------|--------|----------|----------|--------|
| Latency | 72 ms | 75 ms | 95 ms | 150 ms | 76.82 ms | 11.78 ms | 354 ms |

| Stat      | 1%      | 2.5%    | 50%     | 97.5%   | Avg      | Stdev   | Min     |
|-----------|---------|---------|---------|---------|----------|---------|---------|
| Req/Sec   | 10,743  | 10,743  | 13,255  | 13,511  | 13,175.8 | 444.13  | 10,739  |
| Bytes/Sec | 17.1 MB | 17.1 MB | 21.1 MB | 21.5 MB | 20.9 MB  | 705 kB  | 17.1 MB |

Req/Bytes counts sampled once per second.
\# of samples: 40

528k requests in 40.07s, 838 MB read
19 errors (0 timeouts)

✅ Benchmark completed

Query Type: simple
Latency (ms): avg: 76.82, min: 69, max: 354
Requests/sec: 13175.8
Throughput: 19.98 MB/s

### Apollo (Node)

🚀 Running benchmark with simple query
URL: http://localhost:4000/graphql
Connections: 1000
Duration: 40s

Running 40s test @ http://localhost:4000/graphql
1000 connections


| Stat    | 2.5%   | 50%    | 97.5%  | 99%    | Avg       | Stdev     | Max      |
|---------|--------|--------|--------|--------|-----------|-----------|----------|
| Latency | 115 ms | 158 ms | 692 ms | 864 ms | 226.02 ms | 506.79 ms | 26093 ms |

| Stat      | 1%      | 2.5%    | 50%     | 97.5%   | Avg      | Stdev  | Min     |
|-----------|---------|---------|---------|---------|----------|--------|---------|
| Req/Sec   | 4,003   | 4,003   | 5,291   | 5,463   | 5,278.73 | 219.71 | 4,003   |
| Bytes/Sec | 6.86 MB | 6.86 MB | 9.06 MB | 9.36 MB | 9.04 MB  | 376 kB | 6.86 MB |

Req/Bytes counts sampled once per second.
\# of samples: 40

213k requests in 40.08s, 362 MB read
967 errors (314 timeouts)

✅ Benchmark completed

Query Type: simple
Latency (ms): avg: 226.02, min: 103, max: 26093
Requests/sec: 5278.73
Throughput: 8.62 MB/s

### Yoga (Bun)
🚀 Running benchmark with simple query
URL: http://localhost:4000/graphql
Connections: 1000
Duration: 40s

Running 40s test @ http://localhost:4000/graphql
1000 connections

| Stat    | 2.5%  | 50%   | 97.5% | 99%   | Avg      | Stdev   | Max    |
|---------|-------|-------|-------|-------|----------|----------|---------|
| Latency | 70 ms | 71 ms | 73 ms | 74 ms | 71.02 ms | 4.33 ms | 184 ms |

| Stat      | 1%    | 2.5%  | 50%     | 97.5%   | Avg      | Stdev   | Min   |
|-----------|-------|-------|---------|---------|----------|---------|-------|
| Req/Sec   | 12,375  | 12,375  | 14,031  | 14,095  | 13,983.6 | 263.19  | 12,375  |
| Bytes/Sec | 19.1 MB | 19.1 MB | 21.6 MB | 21.7 MB | 21.6 MB  | 405 kB | 19.1 MB |

Req/Bytes counts sampled once per second.
\# of samples: 40

560k requests in 40.07s, 862 MB read

✅ Benchmark completed

Query Type: simple
Latency (ms): avg: 71.02, min: 70, max: 184
Requests/sec: 13983.6
Throughput: 20.56 MB/s
