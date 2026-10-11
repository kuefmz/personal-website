---
title: "How to Evaluate PDF Extraction Accuracy with Python"
description: "Evaluate PDF extraction against reviewed labels using field-level precision, recall, document completeness, and a reproducible Python scoring example."
seoTitle: "Evaluate PDF Extraction with Python"
publishedAt: 2026-10-12
tags: ["PDF Processing", "Python", "OCR", "Evaluation", "Document AI"]
category: "Document AI"
draft: false
---

Evaluate PDF extraction with a reviewed set of documents, explicit field-matching rules, and metrics that reflect the output your workflow actually needs. Successful parsing and valid JSON do not prove that extracted values are correct.

For a field-extraction pipeline, measure correct values, missed values, and unsupported values separately. Add whole-document completeness and human-review effort before deciding whether a parser or model is useful. A small evaluation that exposes failure types is more informative than a polished demonstration on one easy PDF.

The [PDF processing architecture guide](/blog/pdf-document-processing-python-pipeline/) describes ingestion, OCR, validation, and review. This article adds the evaluation loop for choosing and maintaining those stages.

## Define the task before selecting a metric

PDF processing can mean recovering text, reconstructing tables, extracting a fixed schema, or answering questions with citations. These require different evaluation units.

| Task | Unit to review | Useful measurement |
| --- | --- | --- |
| Text recognition | Characters or words | Character/word error rate |
| Fixed fields | Field and value | Precision, recall, normalized match |
| Tables | Cell, row, and header association | Cell accuracy and structural correctness |
| Document completion | Required field set | Fully correct document rate |
| Retrieval answers | Answer and evidence | Supported correctness and citation quality |

The [multi-task PDF extraction benchmark](https://arxiv.org/abs/2303.09957) evaluates different content elements rather than treating extraction as a single undifferentiated task. Use that principle to design a workload-specific evaluation; published scores are not a substitute for testing your documents.

An invoice parser might recognize most words correctly and still associate the wrong amount with the total. A table extractor might recover every cell's text but attach the wrong column header. Preserve these associations in labels instead of scoring a flattened bag of words.

## Build a representative reviewed set

Sample documents across the sources and layouts that occur in the workflow. Include native-text PDFs, scans, mixed documents, rotated pages, multi-column layouts, unusual number formats, and missing sections when those occur in practice.

Keep the sampling rule and source distribution alongside the dataset. A set dominated by one supplier template can hide failures on another. Report results by document type as well as overall results.

Assign stable document IDs and checksums. Record the correct value, page, and supporting region or text where available. Have ambiguous labels reviewed rather than forcing the annotator to guess. Separate unavailable fields from fields that the extractor failed to recover.

Use a development set for rules and prompts, then a held-out set for the final comparison. When several documents share almost identical templates, splitting only by random page can leak layout information between those sets. Consider holding out sources or template families.

## Write matching rules that preserve meaning

Normalization should remove irrelevant formatting differences without hiding real errors. Whitespace normalization may be appropriate for names. A known monetary field can be parsed into an exact decimal after its locale is resolved. An identifier may require exact characters, including leading zeros.

Do not strip every punctuation mark or compare every field with fuzzy similarity. `AB-012` and `AB012` may be equivalent in one system and different in another. A one-digit error in a bank or document identifier is still an error even if the strings are almost identical.

Store raw values and normalized values together so disagreements can be inspected. Version the normalization rules with the scorer. Otherwise a parser can appear to improve because the evaluation became more forgiving.

## A runnable field-level Python scorer

This example scores one value per field. It treats a wrong supplied value as both a false positive and a false negative: the prediction is incorrect, and the expected value was not recovered. Optional fields labeled `None` do not count as expected values, but invented predictions for them count as false positives.

Save as `score_fields.py` and run `python score_fields.py`. This code scores extracted outputs; it does not parse a PDF.

```python
from decimal import Decimal, InvalidOperation


def normalize(field, value):
    if value is None or str(value).strip() == "":
        return None
    text = " ".join(str(value).split())
    if field == "total":
        try:
            amount = Decimal(text)
        except InvalidOperation:
            return ("invalid_amount", text)
        if not amount.is_finite():
            return ("invalid_amount", text)
        return amount
    return text


def score(labels, predictions, fields):
    if set(predictions) - set(labels):
        raise ValueError("predictions contain unknown document IDs")
    results = {}
    for field in fields:
        tp = fp = fn = 0
        for doc_id, expected in labels.items():
            if field not in expected:
                raise ValueError("label must specify each field, including None")
            gold = normalize(field, expected[field])
            actual = normalize(field, predictions.get(doc_id, {}).get(field))
            if gold is not None and actual == gold:
                tp += 1
            else:
                fp += int(actual is not None)
                fn += int(gold is not None)
        results[field] = {
            "tp": tp, "fp": fp, "fn": fn,
            "precision": tp / (tp + fp) if tp + fp else None,
            "recall": tp / (tp + fn) if tp + fn else None,
        }
    return results


if __name__ == "__main__":
    labels = {
        "a": {"invoice_id": "001", "total": "12.50"},
        "b": {"invoice_id": "002", "total": "20.00"},
    }
    predictions = {
        "a": {"invoice_id": "001", "total": "12.5"},
        "b": {"invoice_id": "002", "total": "21.00"},
    }
    result = score(labels, predictions, ["invoice_id", "total"])
    assert result["total"]["precision"] == 0.5
    assert result["total"]["recall"] == 0.5
    assert result["invoice_id"]["recall"] == 1.0
    print(result)
```

The synthetic fixtures demonstrate scorer behavior; they are not performance results for any extraction tool. This amount normalizer expects a decimal point and no grouping separator. Resolve currency and locale before using it on real documents. Do not assume that `1,234` has the same meaning everywhere.

For dates, specify the accepted source format and output format. For repeated line items, replace this single-value scorer with row matching that respects item identity and associations. A list sorted differently should not automatically fail, but an amount attached to the wrong item should.

## Measure complete documents and review workload

Calculate how many documents have every required field correct. Field-level averages can conceal a workflow where nearly every document still needs manual intervention.

Track abstentions separately: an extractor that sends uncertain values to review can be preferable to one that confidently supplies incorrect values. Measure error rate among automatically accepted documents, the fraction routed to review, and correction time.

If the system exposes confidence scores, calibrate thresholds on held-out examples. A model's confidence label is not automatically a probability of correctness. Review performance separately for each major document class before selecting an automation threshold.

Need to compare extraction approaches on your documents? [Describe the document types, required fields, and review workflow](/contact/#project-request).

## Keep the comparison reproducible

Record parser/model versions, OCR settings, prompts, schema version, normalization rules, and document checksums. Save outputs so a scorer change can be evaluated without rerunning expensive extraction.

Measure latency and cost under the same conditions. Distinguish cached from uncached requests and local processing from hosted calls. Run failures belong in the comparison rather than disappearing from the denominator.

Inspect disagreements in a simple review table with expected value, actual value, page evidence, and error category. Useful categories include OCR error, wrong reading order, missed section, incorrect association, normalization error, and unsupported output.

## Use failures to improve the pipeline

Repeated heading failures may need the [missing-headings extraction strategy](/blog/pdf-section-extraction-missing-headings/). Retrieval failures belong in the [LlamaIndex PDF querying workflow](/blog/llamaindex-for-pdf-processing/), where answer support and citations matter alongside extraction.

Keep regression examples for each repaired failure and maintain a separate untouched evaluation set. Review new template families before treating previous performance as transferable.

## Next step

Start with a small reviewed dataset and two baselines. Define field matching, count missing and unsupported values, and inspect failures before adding complexity. [Send an inquiry about your document-processing pipeline](/contact/#project-request) if you need help building an evaluation that matches its operational requirements.
