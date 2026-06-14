---
title: "Towards Version Controlling in RefactorErl"
abstract: "An extension to the RefactorErl Semantic Program Graph that stores multiple source-code versions in a single graph with a reduced memory footprint."
authors: ["Jenifer Tabita Ciuciu-Kiss", "Melinda Tóth", "István Bozó"]
year: 2021
venue: "Acta Cybernetica 25"
type: "Conference paper"
keywords: ["Erlang", "RefactorErl", "Graph Version Control", "Optimization"]
featured: true
doi: "https://doi.org/10.14232/actacyb.289386"
pdf: "/assets/towards-version-controlling-refactorerl.pdf"
bibtex: |
  @article{ciuciukiss2021refactorerl,
    title={Towards Version Controlling in RefactorErl},
    author={Ciuciu-Kiss, Jenifer Tabita and Tóth, Melinda and Bozó, István},
    journal={Acta Cybernetica},
    volume={25},
    pages={205--221},
    year={2021},
    doi={10.14232/actacyb.289386}
  }
citation: "Ciuciu-Kiss, J. T., Tóth, M., & Bozó, I. (2021). Towards Version Controlling in RefactorErl. Acta Cybernetica, 25, 205–221."
links:
  - label: "RefactorErl project"
    href: "https://github.com/nox/refactorerl"
order: 4
---

Static analysis tools need to update their intermediate representations as source code changes, while developers may also need information about previous versions.

This work extended RefactorErl's Semantic Program Graph so multiple versions could be stored in one graph. The method reduced memory use by 30% compared with the available workaround.
