---
title: "Research Software Classification"
description: "Methods for classifying research software using repository data, machine learning, and scientific taxonomies."
date: "2025-11-04"
status: "PhD research"
category: "Data"
tags: ["Research software", "FAIR", "Taxonomies", "NLP"]
technologies: ["Python", "Transformers", "Knowledge Graphs", "SOMEF"]
featured: true
previewImage: "/images/projects/research-software-classification-desktop.png"
previewImageAlt: "Desktop screenshot of the SOMEF documentation website"
previewUrl: "https://somef.readthedocs.io/en/latest/"
links:
  - label: "View research repository"
    href: "https://github.com/kuefmz/rolf"
  - label: "Read the latest paper"
    href: "/publications/automated-research-software-classification/"
---

Research software is difficult to discover and compare because repositories often lack consistent metadata and scientific categories.

## Context

My PhD research examines which repository and publication attributes support classification, how community taxonomies align with scientific knowledge graphs, and which machine-learning methods produce interpretable results.

## My role

I work on the research questions, data preparation, model evaluation, semantic alignment analysis, and public writing around the project. Earlier work from my master's thesis was implemented into SOMEF, an open-source framework for extracting software metadata.

## Approach

- Link software repositories with publication and metadata signals.
- Compare textual attributes such as README files, abstracts, and category descriptions.
- Evaluate machine-learning and embedding methods for classification.
- Inspect taxonomies through semantic alignment with scientific knowledge graphs.
- Keep the methodology interpretable enough for research software discovery use cases.

## Outcomes

An earlier implementation reached 92% F1 during training and 76% on the test set, compared with a 36% prior baseline. The method was integrated into SOMEF, an open-source framework for extracting software metadata.

## Related pages

- [Research overview](/research/)
- [Automated Research Software Classification paper](/publications/automated-research-software-classification/)
- [Methodology thesis](/publications/research-software-classification-thesis/)

## Lessons

Research software classification is not only an NLP task. The quality of the result depends on metadata availability, taxonomy design, scientific context, and the ability to explain why a repository belongs to a category.
