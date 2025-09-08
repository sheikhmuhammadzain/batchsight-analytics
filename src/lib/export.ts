import { apiService } from "@/services/api";

function csvEscape(value: any): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes("\n") || str.includes('"')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function section(name: string): string {
  return `\n${csvEscape("Section")},${csvEscape(name)}\n`;
}

export async function exportAllDataToCSV(): Promise<{ url: string; filename: string; csv: string }> {
  // Fetch all datasets in parallel
  const [
    processedBatchData,
    processingDaysHistogram,
    delayShare,
    monthlyAverageDelay,
    lineAverageDelay,
    lineMonthlyAverageDelay,
    delayedBatchesByLine,
    delayedVsTotalBatches,
    topDelayFormulas,
    lineScrapFactor,
    monthlyDelayRate,
    delayReasonsByLine,
    topDelayReasons,
  ] = await Promise.all([
    apiService.getProcessedBatchData(),
    apiService.getProcessingDaysHistogram(),
    apiService.getDelayShare(),
    apiService.getMonthlyAverageDelay(),
    apiService.getLineAverageDelay(),
    apiService.getLineMonthlyAverageDelay(),
    apiService.getDelayedBatchesByLine(),
    apiService.getDelayedVsTotalBatches(),
    apiService.getTopDelayFormulas(),
    apiService.getLineScrapFactor(),
    apiService.getMonthlyDelayRate(),
    apiService.getDelayReasonsByLine(),
    apiService.getTopDelayReasons(),
  ]);

  let csv = "Export Date," + csvEscape(new Date().toISOString()) + "\n";

  // Processed Batch Data
  csv += section("Processed Batch Data");
  csv += [
    "WIP_BATCH_ID,PLAN_QTY,WIP_QTY,processing_days,SCRAP_FACTOR,is_delayed,line,formula",
    ...processedBatchData.map((d) => [
      d.WIP_BATCH_ID,
      d.PLAN_QTY,
      d.WIP_QTY,
      d.processing_days,
      d.SCRAP_FACTOR,
      d.is_delayed,
      d.line,
      d.formula,
    ].map(csvEscape).join(",")),
  ].join("\n") + "\n";

  // Processing Days Histogram
  if (processingDaysHistogram) {
    csv += section("Processing Days Histogram (bin_index,count,bin_edge_start,bin_edge_end,threshold) ");
    const bins = processingDaysHistogram.counts.length;
    for (let i = 0; i < bins; i++) {
      const start = processingDaysHistogram.bin_edges[i];
      const end = processingDaysHistogram.bin_edges[i + 1];
      csv += [i, processingDaysHistogram.counts[i], start, end, processingDaysHistogram.threshold]
        .map(csvEscape).join(",") + "\n";
    }
  }

  // Delay Share
  if (delayShare) {
    csv += section("Delay Share (category,percentage,threshold_days)");
    csv += "category,percentage,threshold_days\n";
    delayShare.categories.forEach((c, idx) => {
      csv += [c, delayShare.percentages[idx], delayShare.threshold_days].map(csvEscape).join(",") + "\n";
    });
  }

  // Monthly Average Delay
  if (monthlyAverageDelay) {
    csv += section("Monthly Average Delay (month,avg_processing_days,threshold)");
    csv += "month,avg_processing_days,threshold\n";
    monthlyAverageDelay.months.forEach((m, idx) => {
      csv += [m, monthlyAverageDelay.avg_processing_days[idx], monthlyAverageDelay.threshold].map(csvEscape).join(",") + "\n";
    });
  }

  // Line Average Delay
  if (lineAverageDelay) {
    csv += section("Line Average Delay (line,avg_processing_days,threshold)");
    csv += "line,avg_processing_days,threshold\n";
    lineAverageDelay.lines.forEach((line, idx) => {
      csv += [line, lineAverageDelay.avg_processing_days[idx], lineAverageDelay.threshold].map(csvEscape).join(",") + "\n";
    });
  }

  // Line Monthly Average Delay
  if (lineMonthlyAverageDelay) {
    csv += section("Line Monthly Average Delay (month,<line...>,threshold)");
    const lineKeys = Object.keys(lineMonthlyAverageDelay.lines);
    csv += ["month", ...lineKeys, "threshold"].map(csvEscape).join(",") + "\n";
    lineMonthlyAverageDelay.months.forEach((m, idx) => {
      const row = [m, ...lineKeys.map((k) => lineMonthlyAverageDelay.lines[k][idx] ?? ""), lineMonthlyAverageDelay.threshold];
      csv += row.map(csvEscape).join(",") + "\n";
    });
  }

  // Delayed Batches By Line
  if (delayedBatchesByLine) {
    csv += section("Delayed Batches By Line (line,delayed_batches)");
    csv += "line,delayed_batches\n";
    delayedBatchesByLine.lines.forEach((line, idx) => {
      csv += [line, delayedBatchesByLine.delayed_batches[idx]].map(csvEscape).join(",") + "\n";
    });
  }

  // Delayed vs Total Batches
  if (delayedVsTotalBatches) {
    csv += section("Delayed vs Total Batches (line,total_batches,delayed_batches,on_time_batches)");
    csv += "line,total_batches,delayed_batches,on_time_batches\n";
    delayedVsTotalBatches.lines.forEach((line, idx) => {
      csv += [
        line,
        delayedVsTotalBatches.total_batches[idx],
        delayedVsTotalBatches.delayed_batches[idx],
        delayedVsTotalBatches.on_time_batches[idx],
      ].map(csvEscape).join(",") + "\n";
    });
  }

  // Top Delay Formulas
  if (topDelayFormulas) {
    csv += section("Top Delay Formulas (formula_id,delay_rate)");
    csv += "formula_id,delay_rate\n";
    topDelayFormulas.formula_ids.forEach((id, idx) => {
      csv += [id, topDelayFormulas.delay_rates[idx]].map(csvEscape).join(",") + "\n";
    });
  }

  // Line Scrap Factor
  if (lineScrapFactor) {
    csv += section("Line Scrap Factor (line,avg_scrap_factor)");
    csv += "line,avg_scrap_factor\n";
    lineScrapFactor.lines.forEach((line, idx) => {
      const v = (lineScrapFactor as any).avg_scrap_factor?.[idx] ?? (lineScrapFactor as any)[idx]?.scrap_factor;
      csv += [line, v].map(csvEscape).join(",") + "\n";
    });
  }

  // Monthly Delay Rate
  if (monthlyDelayRate) {
    csv += section("Monthly Delay Rate (month,delay_rate,threshold)");
    csv += "month,delay_rate,threshold\n";
    monthlyDelayRate.months.forEach((m, idx) => {
      csv += [m, monthlyDelayRate.delay_rates[idx], monthlyDelayRate.threshold].map(csvEscape).join(",") + "\n";
    });
  }

  // Delay Reasons By Line
  if (delayReasonsByLine) {
    csv += section("Delay Reasons By Line (line,reason,count,threshold_days)");
    csv += "line,reason,count,threshold_days\n";
    Object.entries(delayReasonsByLine.delay_reasons_by_line).forEach(([line, reasons]) => {
      Object.entries(reasons as Record<string, number>).forEach(([reason, count]) => {
        csv += [line, reason, count, delayReasonsByLine.threshold_days].map(csvEscape).join(",") + "\n";
      });
    });
  }

  // Top Delay Reasons
  if (topDelayReasons) {
    csv += section("Top Delay Reasons (reason,count,share_percent,threshold_days)");
    csv += "reason,count,share_percent,threshold_days\n";
    topDelayReasons.top_delay_reasons.forEach((r) => {
      csv += [r.REASON, r.count, r.share_percent, topDelayReasons.threshold_days].map(csvEscape).join(",") + "\n";
    });
  }

  // Build Blob and link
  const filename = `berger-analytics-export-${new Date().toISOString().slice(0,10)}.csv`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  return { url, filename, csv };
}

export function triggerDownload(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
  }, 0);
}
