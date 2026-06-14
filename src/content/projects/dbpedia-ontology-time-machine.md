---
title: "DBpedia Ontology Time Machine"
description: "A system for examining how a widely used public ontology changes across versions and over time."
year: 2025
status: "Research prototype"
category: "Data"
tags: ["DBpedia", "Ontology evolution", "Versioning", "Semantic web"]
technologies: ["Python", "RDF", "SPARQL", "Knowledge Graphs"]
featured: false
order: 5
links:
  - label: "View ontology time machine"
    href: "https://github.com/kuefmz/ontology-time-machine"
  - label: "View ontology package manager"
    href: "https://github.com/kuefmz/ontology-package-manager"
  - label: "Read the project journal"
    href: "https://github.com/kuefmz/gsoc24_blog"
---

Ontologies evolve as domains, communities, and modeling decisions change. Those changes can silently affect downstream data, queries, and applications.

The DBpedia Ontology Time Machine is a prototype for tracing classes, properties, and structural changes across ontology versions. It aims to make evolution inspectable rather than treating the latest ontology release as the only relevant state.

The project builds on earlier research into version-aware semantic program graphs and applies that perspective to public knowledge infrastructure.
