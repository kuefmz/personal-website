---
title: "Research Software Classification"
description: "A semantic and machine-learning methodology for making research software easier to discover, compare, and reuse."
year: 2025
status: "PhD research"
category: "Data"
tags: ["Research software", "FAIR", "Taxonomies", "NLP"]
technologies: ["Python", "Transformers", "Knowledge Graphs", "SOMEF"]
featured: true
order: 1
links:
  - label: "View research repository"
    href: "https://github.com/kuefmz/rolf"
  - label: "Read the latest paper"
    href: "/publications/automated-research-software-classification/"
---

Research software is essential to modern science, yet it is still difficult to find, understand, and reuse. Repositories frequently lack consistent metadata, scientific categories, and links to the publications they support.

This research investigates which software attributes are most useful for classification, how community taxonomies align with scientific knowledge graphs, and which machine-learning approaches provide robust, interpretable results.

## The approach

The work combines publication abstracts, repository documentation, metadata, and source-code features. These signals are evaluated with embedding strategies and transformer-based classifiers, then semantically aligned with broader scientific taxonomies.

An earlier implementation reached a 92% F1 score during training and 76% on the test set, substantially outperforming the prior baseline. The classification method was integrated into SOMEF, an open-source software metadata extraction framework.

## Why it matters

Treating software as a first-class research output requires more than storing a repository URL. Structured classification supports discovery, reuse, attribution, and integration with scholarly infrastructure.
