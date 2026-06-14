---
title: "Breaking Accessibility Barriers: An Ontology Proxy with Failure Recovery and Time Travel Capabilities"
abstract: "This paper introduces a novel concept and implementation of an ontology proxy designed to seamlessly enhance accessibility and reliability of the Web of Ontologies by addressing challenges such as link rot, evolution inconsistencies, and communication failures. The proxy features a time travel mode, powered by DBpedia Archivo, that provides access to archived and versioned snapshots of ontologies. This enables failure recovery and the emulation of a consistent state in time, supporting reproducible research and enhancing the FAIRness of ontologies and associated (meta)data in a plug-and-play manner. Initial evaluations show significant improvements in ontology retrieval success rates, underscoring the proxy's potential as a viable interface for breaking accessibility barriers."
authors: ["Johannes Frey", "Jenifer Tabita Ciuciu-Kiss", "Natanael Arndt"]
date: "2025-05-08"
venue: "Companion Proceedings of the ACM Web Conference 2025"
type: "Conference paper"
keywords: ["Ontologies", "Versioning", "Failure Recovery", "DBpedia"]
featured: true
doi: "https://doi.org/10.1145/3701716.3715531"
bibtex: |
  @inproceedings{frey2025ontologyproxy,
    title={Breaking Accessibility Barriers: An Ontology Proxy with Failure Recovery and Time Travel Capabilities},
    author={Frey, Johannes and Ciuciu-Kiss, Jenifer Tabita and Arndt, Natanael},
    booktitle={Companion Proceedings of the ACM Web Conference 2025},
    pages={966--970},
    year={2025},
    doi={10.1145/3701716.3715531}
  }
citation: "Frey, J., Ciuciu-Kiss, J. T., & Arndt, N. (2025). Breaking Accessibility Barriers: An Ontology Proxy with Failure Recovery and Time Travel Capabilities. Companion Proceedings of the ACM Web Conference 2025, 966–970."
project: "dbpedia-ontology-time-machine"
links:
  - label: "Ontology time machine"
    href: "https://github.com/kuefmz/ontology-time-machine"
  - label: "DBLP record"
    href: "https://dblp.org/rec/conf/www/FreyCA25"
---

This work presents a proxy that recovers from unavailable ontology resources and retrieves historical versions. It applies the DBpedia Ontology Time Machine research to more dependable Semantic Web infrastructure.
