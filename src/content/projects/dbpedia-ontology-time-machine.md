---
title: "DBpedia Ontology Time Machine"
description: "Tools for tracing changes across DBpedia ontology versions and retrieving historical resources."
date: "2025-05-08"
status: "Research prototype"
category: "Data"
tags: ["DBpedia", "Ontology evolution", "Versioning", "Semantic Web"]
technologies: ["Python", "RDF", "SPARQL", "Knowledge Graphs"]
featured: false
previewImage: "/images/projects/dbpedia-ontology-time-machine-desktop.png"
previewImageAlt: "Desktop screenshot of the DBpedia website"
previewUrl: "https://www.dbpedia.org/"
links:
  - label: "View ontology time machine"
    href: "https://github.com/kuefmz/ontology-time-machine"
  - label: "Read the weekly blog"
    href: "https://kuefmz.github.io/gsoc24_blog/"
  - label: "Check out the blog repo"
    href: "https://github.com/kuefmz/gsoc24_blog"
---

Ontologies change over time, which can affect downstream data, queries, and applications.

## Context

This research prototype traces classes, properties, and structural changes across DBpedia ontology versions. A related package manager supports access to historical resources when the current ontology is unavailable or no longer matches an application.

## My role

I worked on public tooling and documentation around ontology versioning in the DBpedia ecosystem. The work connected semantic web infrastructure, reproducibility, historical ontology access, and open-source collaboration.

## Approach

- Inspect ontology versions and structural changes over time.
- Support access to archived or historical semantic web resources.
- Document progress and design decisions in a public GSoC project journal.
- Connect the prototype to broader ontology accessibility and failure recovery research.

## Related pages

- [Ontology proxy publication](/publications/ontology-proxy-time-travel/)
- [Knowledge graph and semantic web research](/projects/knowledge-graphs/)
- [GSoC 2024 project journal](/projects/gsoc-2024-project-journal/)

## Lessons

Semantic web systems need reliable access to historical context. Ontology evolution is a practical engineering concern when downstream applications depend on stable meaning over time.
