---
title: "Towards Version Controlling in RefactorErl"
abstract: "Static source code analyser tools are operating on an intermediate representation of the source code that is usually a tree or a graph. Those representations need to be updated according to the different versions of the source code. However, the developers might be interested in the changes or might need information about previous versions, therefore, keeping different versions of the source code analysed by the tools are required. RefactorErl is an open-source static analysis and transformation tool for Erlang that uses a graph representation to store and manipulate the source code. The aim of our research was to create an extension of the Semantic Program Graph of RefactorErl that is able to store different versions of the source code in a single graph. The new method resulted in 30% memory footprint decrease compared to the available workaround solutions."
authors: ["Jenifer Tabita Ciuciu-Kiss", "Melinda Tóth", "István Bozó"]
date: "2021-08-04"
venue: "Acta Cybernetica 25"
type: "Journal article"
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
  - label: "Visit the RefactorErl website"
    href: "https://plc.inf.elte.hu/erlang/"

---

This work extended RefactorErl's Semantic Program Graph to store multiple source-code versions in one graph. The method reduced memory use by 30% compared with the available workaround.
