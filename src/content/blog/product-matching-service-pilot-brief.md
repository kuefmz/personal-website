---
title: "Product Matching Across Retailers: What to Include in a Pilot"
description: "Scope a product matching pilot for retailer catalogs with identifier checks, variant rules, reviewed examples, and measurable false-match rates."
publishedAt: 2026-11-09
tags: ["Product Matching", "Entity Resolution", "E-commerce", "Data Engineering"]
category: "Data Engineering"
draft: false
---

Matching the same products across retailers requires a shared definition of product identity. Different store SKUs can describe the same item, while almost identical titles can describe different pack sizes, colors, or models. A useful pilot tests those distinctions before automating catalog merges.

If you are comparing a product matching service with a custom pipeline, ask how it handles uncertain matches and how a reviewer can inspect its decisions. A list of matched titles is not enough to judge the risk.

## Agree the matching unit

Decide whether a match refers to a product family, an exact variant, or a retailer offer. These levels answer different business questions. A price comparison normally needs the same purchasable variant and quantity, while discovery may group a wider family.

Write explicit rules for bundles, refurbished items, regional models, and multi-packs. Keep retailer offers separate from the normalized product so prices and availability can change without changing product identity.

## Provide representative data

Include the identifiers, brand, title, model, variant attributes, quantity, currency, source URL, and collection time where available. Preserve raw values as well as normalized fields. A reviewer may need to see whether the source actually said “two pack” before accepting a correction.

Identifiers are useful evidence, but they can be missing, malformed, or copied incorrectly. Check identifier quality rather than assuming every shared value is decisive. Text similarity should generate candidates, not silently override conflicting model numbers.

## Evaluate three decision outcomes

| Outcome | Operational treatment |
| --- | --- |
| Accepted match | Link the offer to the normalized variant with evidence |
| Rejected candidate | Keep the records separate and preserve the reason |
| Uncertain candidate | Send to review or leave unmatched |

Prepare reviewed positive and negative examples. Include confusing near-matches: different capacities, accessories sharing a brand name, and identical model names with different regional specifications.

Measure precision among accepted matches and recall against the reviewed set. Report the review queue size and unmatched share too. High precision achieved by matching only a tiny easy subset may not satisfy the business requirement.

## Plan corrections and incremental updates

Catalogs change. Store match versions and make it possible to unlink an incorrect offer. Re-evaluate changed attributes deliberately, and avoid treating a retailer SKU as globally unique across all stores.

Agree which business process consumes the matches. Search, comparison, analytics, and automated purchasing have different tolerances for mistakes. Start with a reviewed output before allowing matches to trigger irreversible downstream actions.

My [cross-store matching article](/blog/ecommerce-product-matching-across-stores-languages/) explains the engineering approach, and [Orgelia](/projects/orgelia/) provides public context for my catalog and product discovery work. To discuss a matching pipeline, [send me the catalog sizes, languages, variant rules, and intended output](/contact/#project-request). A small redacted sample and a few difficult pairs are especially useful.
