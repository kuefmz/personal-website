---
title: "DBpedia Ontology Time Machine"
description: "Tools for tracing changes across DBpedia ontology versions and retrieving historical resources."
date: "2025-05-08"
status: "Research prototype"
category: "Data"
tags: ["DBpedia", "Ontology evolution", "Versioning", "Semantic Web"]
technologies: ["Python", "RDF", "SPARQL", "Knowledge Graphs"]
featured: false
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

This research prototype traces classes, properties, and structural changes across DBpedia ontology versions. A related package manager supports access to historical resources when the current ontology is unavailable or no longer matches an application.
