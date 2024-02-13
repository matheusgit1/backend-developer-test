import autocannon from "autocannon";
import { cpus } from "os";

async function test() {
  const results = await autocannon({
    title: "load test",
    url: "http://localhost:3001",
    connections: 500,
    duration: 60,
    pipelining: 15,
    workers: cpus().length,
    requests: [
      //health
      {
        path: "/health",
        method: "GET",
      },
      //companies
      {
        path: "/companies",
        method: "GET",
      },
      {
        path: `/companies/${crypto.randomUUID().toString()}`,
        method: "GET",
      },
      //jobs
      {
        path: `/job`,
        method: "POST",
        body: JSON.stringify({
          title: "title",
          description: "description",
          location: "location",
          notes: "notes",
        }),
        headers: {
          company_id: "474437b9-ffb9-4801-9cef-59efb6af995e",
        },
      },
      {
        path: `/job/${crypto.randomUUID().toString()}/publish`,
        method: "PUT",
        headers: {
          company_id: "company_id",
        },
      },
      {
        path: `/job/${crypto.randomUUID().toString()}`,
        method: "PUT",
        body: JSON.stringify({
          title: "title",
          description: "description",
          location: "location",
          notes: "notes",
        }),
        headers: {
          company_id: "company_id",
        },
      },
      {
        path: `/job/${crypto.randomUUID().toString()}`,
        method: "DELETE",
        headers: {
          company_id: "company_id",
        },
      },
      {
        path: `/job/${crypto.randomUUID().toString()}/archive`,
        method: "PUT",
        headers: {
          company_id: "company_id",
        },
      },
    ],
  });
  const size = (value: number): number => {
    return value;
  };

  console.table([
    ["Stat", "Avg", "Stdev", "Min", "Max", "Median", "total"], //estatistica, media, desvio padrão, menor valor, media, total
    [
      "Req/Sec",
      results.requests.average,
      results.requests.stddev,
      results.requests.min,
      results.requests.max,
      results.requests.mean,
      results.requests.total,
    ],
    [
      "Bytes/Sec",
      size(results.throughput.average),
      size(results.throughput.stddev),
      size(results.throughput.min),
      size(results.throughput.max),
      size(results.throughput.mean),
      size(results.throughput.total),
    ],
    [
      "Latency/Sec",
      size(results.latency.average),
      size(results.latency.stddev),
      size(results.latency.min),
      size(results.latency.max),
      size(results.latency.mean),
      size(results.latency.total),
    ],
    [
      "Retries",
      size(0),
      size(0),
      size(0),
      size(0),
      size(0),
      size(results.resets),
    ],
    [
      "Tempo",
      size(0),
      size(0),
      size(0),
      size(0),
      size(0),
      size(results.duration),
    ],
  ]);
}

test();
