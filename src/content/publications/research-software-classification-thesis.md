---
title: "A methodology for research software classification"
abstract: "An increasing number of scientific publications rely on computational experiments to deliver their intermediate and final results. Software developed for this purpose is known as research software and ranges from simple transformation or visualization scripts to complex computational pipelines.  Research software is critical for reproducibility, and therefore developers and researchers deposit their contributions in online repositories, such as GitHub. However, these repositories do not provide a feature for users to help them find similar software. Therefore, there is a need for an approach to automatically characterize research software according to common functionality or domain. This work proposes a flexible methodology to classify research software with similar functionality. We understand software with ‘same functionality’ as those to software repositories that belong to the same category, as agreed by the scientific community or external vocabularies. Our proposed methodology provides the means to classify new categories without the need to retrain previous classifiers. Our approach focuses  on three main research questions:  1) Can we identify common categories to group software from different domains?  2) Can we develop a flexible methodology for classifying these categories?  3) Can we define a methodology to incorporate new categories without having to retrain our classifiers for existing categories? In order to address our research questions, we explore and compare against state of the art techniques for software classification. We focused first on specific areas with existing annotated data (such as open platforms for machine learning), where papers and code have been made available by the community. We tested our methodology with lists of domain-specific software tools crowdsourced by the community. A key step of our methodology is to find out how to automatically incorporate new labelled datasets, which are costly to produce, and how to prepare data for successful classification of software projects based on their available documentation. Our approach was evaluated by using a separate test set containing multi-labeled test samples. The achieved result on the training set using cross validation is an f1 score of 92%. The result on the test set is is 76%. Considering that the state of the art approaches could achieve only an f1 score of 36% we could achieve an improvement of 40%. Once the methodology have been achieved a reasonable performance level, the results of our methodology have been implemented into an existing framework for software metadata extraction. Thanks to our approach, the extractor is able to group similar software together."
authors: ["Jenifer Tabita Ciuciu-Kiss"]
date: "2022-06-30"
venue: "Universidad Politécnica de Madrid"
type: "Thesis"
keywords: ["Research Software", "Zero-shot Learning", "Classification", "SOMEF"]
featured: true
doi: "https://oa.upm.es/71376/"
bibtex: |
  @mastersthesis{ciuciukiss2022methodology,
    title={A Methodology for Research Software Classification},
    author={Ciuciu-Kiss, Jenifer Tabita},
    school={Universidad Politécnica de Madrid},
    year={2022}
  }
citation: "Ciuciu-Kiss, J. T. (2022). A Methodology for Research Software Classification [Master's thesis, Universidad Politécnica de Madrid]."
project: "research-software-classification"
links:
  - label: "Research repository"
    href: "https://github.com/kuefmz/rolf"
---

Research software plays a critical role in modern science, yet finding software with similar functionality remains difficult. This work proposes a flexible methodology for automatically classifying research software using information extracted from repositories and associated publications.

The methodology enables the addition of new categories without retraining existing classifiers and was evaluated on community-curated datasets. The resulting classifier achieved an F1 score of 92% during cross-validation and 76% on an unseen test set, substantially outperforming previous approaches.

The research was integrated into existing software metadata extraction workflows, helping researchers discover and organize software projects based on their functionality and scientific domain.

