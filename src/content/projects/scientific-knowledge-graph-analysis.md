---
title: "Scientific Knowledge Graph Analysis"
description: "A bottom-up method for measuring how scientific knowledge graphs agree and disagree when categorizing research."
year: 2024
status: "Published research"
category: "Data"
tags: ["Scientific knowledge graphs", "Alignment", "OpenAlex", "OpenAIRE"]
technologies: ["Python", "RDF", "Data Analysis", "Semantic Alignment"]
featured: true
order: 2
links:
  - label: "View analysis repository"
    href: "https://github.com/kuefmz/skg_metadata_comparative_analysis"
  - label: "Read the paper"
    href: "/publications/assessing-skg-overlap/"
---

Scientific knowledge graphs describe publications, people, organizations, software, and datasets at enormous scale. But each graph uses its own taxonomy, creating ambiguity when systems are queried or combined.

This project developed a quantitative, bottom-up method for assessing category overlap based on annotations attached to shared instances.

## Evidence at scale

The method was evaluated on 100,000 publications present in both OpenAlex and OpenAIRE. It produced an alignment of 71 categories and exposed where the graphs agree, where they diverge, and where their taxonomies leave structural gaps.

The result is useful both as an analysis technique and as a practical foundation for more reliable cross-graph querying.
