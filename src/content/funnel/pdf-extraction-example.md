---
title: "PDF Extraction Example: Document, Structured Output, and Review"
description: "Follow a synthetic invoice from source text to structured fields, deliberate extraction errors, reviewed corrections, and a reproducible scoring example."
route: "/examples/pdf-extraction/"
publishedAt: "2026-11-15T09:00:00+01:00"
category: "Example"
---

This synthetic invoice shows the decisions around structured document extraction. The document text and extraction outputs below are authored examples. No OCR engine or extraction model produced these results, and the numbers are not a performance claim about a system.

The example is intentionally small so you can compare each output with its source. A business pilot would need a representative set of documents and reviewed labels.

## Inspect the source document

Imagine a one-page, native-text PDF with the following visible content. This text is the complete source for the example. It is a transcription in the page, rather than a downloadable PDF or an OCR benchmark.

```text
SYNTHETIC INVOICE — EXAMPLE ONLY
Supplier: Example Workshop
Invoice number: DEMO-1042
Issue date: 2026-10-20
Currency: CHF

Description                 Amount
Document preparation        100.00
Layout check                 20.00
Total                       120.00

Purchase order: not provided
```

The required output fields are invoice number, issue date, currency, and total. Purchase order is optional. A reviewer records the expected values directly from the source and marks the purchase order as absent.

## Compare a simulated extraction with the labels

The simulated extractor below drops the final digit of the invoice number, misreads the total, and invents a purchase order. These errors demonstrate why valid JSON is only the start of validation.

| Field | Reviewed expected value | Simulated prediction | Review action |
| --- | --- | --- | --- |
| invoice_number | DEMO-1042 | DEMO-104 | Correct from source |
| issue_date | 2026-10-20 | 2026-10-20 | Confirm |
| currency | CHF | CHF | Confirm |
| total | 120.00 | 170.00 | Correct from source |
| purchase_order | Absent | PO-1042 | Remove invented value |

A line-item check would also flag that 100.00 plus 20.00 differs from the predicted total of 170.00. That check detects an inconsistency. A reviewer still needs to establish the correct value from the source.

## Preserve provenance and review state

A downstream record could keep the source identifier, reviewed values, and the reason review was required together.

```json
{
  "source_id": "synthetic-invoice-demo-1042",
  "source_page": 1,
  "review_state": "reviewed",
  "review_reasons": ["identifier_mismatch", "total_mismatch", "unsupported_purchase_order"],
  "fields": {
    "invoice_number": "DEMO-1042",
    "issue_date": "2026-10-20",
    "currency": "CHF",
    "total": "120.00",
    "purchase_order": null
  }
}
```

In a real workflow, preserve the original prediction and the correction history separately from the approved record. Restrict document access to the people who need it. Agreement on source retention belongs in the project scope.

## Reproduce the scoring

This Python example uses exact matching on the already normalized labels above. An incorrect supplied required value counts as both a false positive and a false negative. An invented optional value counts as a false positive. Expected missing values do not count as fields to recover.

```python
expected = {
    "invoice_number": "DEMO-1042",
    "issue_date": "2026-10-20",
    "currency": "CHF",
    "total": "120.00",
    "purchase_order": None,
}
predicted = {
    "invoice_number": "DEMO-104",
    "issue_date": "2026-10-20",
    "currency": "CHF",
    "total": "170.00",
    "purchase_order": "PO-1042",
}
true_positives = sum(
    value is not None and predicted.get(field) == value
    for field, value in expected.items()
)
false_positives = sum(
    value is not None and expected.get(field) != value
    for field, value in predicted.items()
)
false_negatives = sum(
    value is not None and predicted.get(field) != value
    for field, value in expected.items()
)
precision = true_positives / (true_positives + false_positives)
recall = true_positives / (true_positives + false_negatives)
print(f"Precision: {precision:.0%}")
print(f"Recall: {recall:.0%}")
```

The example prints 40% precision and 50% recall. Neither percentage estimates expected performance on your documents. With only one authored invoice, it demonstrates the scoring convention. No complete, correct document was produced by the simulated extraction before review.

## What a pilot needs beyond this example

A pilot should include real layout variation, reviewed field definitions, a held-out set, and review-time measurements. Test scans and multi-page tables when they occur in the workload. Decide whether tolerances or normalization rules are justified before scoring.

The [PDF accuracy guide](/blog/evaluate-pdf-extraction-accuracy-python/) develops the evaluation method. The next step for a business workflow is agreeing which documents, fields, and review decisions the first implementation will cover.

<a class="button button-primary" href="/work-with-me/pdf-automation/" data-analytics-event="cta_click" data-analytics-cta-id="pdf_example_offer" data-analytics-location="example_end">See the PDF automation approach</a>
