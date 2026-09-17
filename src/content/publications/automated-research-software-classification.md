---
title: "Attributes, Taxonomies and Semantic alignment for Automated Research Software Classification"
abstract: "Research software (RS) plays a critical role in computational science, yet remains poorly categorized and difficult to discover or reuse. This research explores RS classification by investigating how textual and metadata attributes can be leveraged to develop scalable, interpretable classification methodologies. Existing taxonomies are evaluated through alignment with scientific knowledge graphs to identify redundancies and structural gaps. Labeled datasets are constructed by linking publications to software repositories, and RS attributes, such as README files, abstracts, and source code features are benchmarked using multiple machine learning models and embedding strategies. A methodology that integrates semantic enrichment and transformer-based models is proposed for robust RS classification. Preliminary findings highlight the informativeness of publication abstracts for classification tasks and expose limitations in current community-defined taxonomies."
authors: ["Jenifer Tabita Ciuciu-Kiss"]
date: "2025-10-26"
venue: "ISWC 2025 Companion Volume, Nara, Japan"
type: "Conference paper"
keywords: ["Research Software", "Software Taxonomy", "Software Classification", "FAIR", "Software Metadata", "Scientific Knowledge Graphs", "Machine Learning"]
featured: true
pdf: "/assets/iswc25-research-software-classification.pdf"
bibtex: |
  @inproceedings{ciuciukiss2025researchsoftware,
    title={Attributes, Taxonomies and Semantic Alignment for Automated Research Software Classification},
    author={Ciuciu-Kiss, Jenifer Tabita},
    booktitle={ISWC 2025 Companion Volume},
    year={2025}
  }
citation: "Ciuciu-Kiss, J. T. (2025). Attributes, Taxonomies and Semantic Alignment for Automated Research Software Classification. ISWC 2025 Companion Volume."
project: "research-software-classification"
links:
  - label: "Research repository"
    href: "https://github.com/kuefmz/rolf"
---

## What problem this work addresses

Research software is essential to computational science, but software repositories are often difficult to discover, compare, and reuse because they do not share a consistent classification system. This work studies how research software can be categorized using signals that are already available in repositories and associated scientific publications.

## Classification signals evaluated

The study considers several sources of information for automated research software classification:

- publication abstracts linked to software repositories;
- README content and repository metadata;
- source-code-derived features;
- software and scientific category descriptions.

These signals are benchmarked with multiple machine-learning models and embedding strategies to understand which representations are most useful for classification.

## Taxonomies and scientific knowledge graphs

A second part of the work examines the taxonomies used to describe research software. Existing category systems are aligned with scientific knowledge graphs to identify overlaps, redundancies, and structural gaps.

That matters because classification performance depends not only on the model, but also on whether the target taxonomy represents the scientific software landscape clearly enough.

## Methodological direction

The proposed methodology combines semantic enrichment with transformer-based models. Labeled datasets are constructed by linking publications to software repositories, allowing publication text and repository-level signals to be evaluated within the same classification workflow.

## Preliminary findings

The preliminary results reported in the paper indicate that publication abstracts are particularly informative for research software classification. The analysis also exposes limitations in existing community-defined software taxonomies, which motivates further work on taxonomy design and semantic alignment.

## Related work on this site

For the broader research context, see the [Research Software Classification project](/projects/research-software-classification/) and my article on [software taxonomy design for research software](/blog/software-taxonomy-for-research-software/). The [research overview](/research/) links this work to my other knowledge-graph and software-metadata research.
