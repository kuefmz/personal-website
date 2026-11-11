---
title: "A Complete Example of an Automated Website Report"
description: "Inspect an illustrative website audit report with coverage, changed findings, ownership, verification steps, and the email summary a recipient receives."
route: "/examples/website-audit-report/"
publishedAt: "2026-11-13T09:00:00+01:00"
category: "Example"
---

This is a synthetic report for a fictional service website. The domain, findings, checks, and delivery states are invented to demonstrate a handover format. You can use it to decide what your own team would need to receive and act on.

The report separates the summary a recipient scans in an email from the evidence they need to investigate a finding. It does not estimate enquiries or revenue lost.

## The email summary

> Weekly website check for service-example.test, report DEMO-2026-11-13. Eight of ten agreed URLs were checked. One new enquiry-link failure needs review, one title finding is resolved, and one metadata issue remains open. Two URLs could not be checked. The full report records evidence, owners, and recheck steps.

A real email would link to the report at a destination appropriate for its access requirements. The recipient should be able to see incomplete coverage before reading an overall conclusion.

## Scope and comparison baseline

| Report property | Illustrative value |
| --- | --- |
| Current run | DEMO-2026-11-13, 08:00 UTC |
| Previous comparable run | DEMO-2026-11-06, 08:00 UTC |
| Scope | Ten agreed public pages, the same list in both runs |
| Check set | Status, internal enquiry links, titles, and descriptions, rules v1 |
| Coverage | Eight pages checked, two unavailable |
| Exclusions | Authentication, payment, booking completion, and live form submission |

Only compare completed observations. A page that timed out in this run has an unknown current state. A previously open finding on that page cannot be marked resolved from the missing observation.

## The findings register

| ID | State | Affected URL | Observation | Suggested owner |
| --- | --- | --- | --- | --- |
| F-01 | New | /services/assessment/ | Main enquiry link targets /get-in-touch/, which returns 404 in this run | Website maintainer |
| F-02 | Resolved | /services/follow-up/ | The previously missing title is now present | Content owner |
| F-03 | Open | /services/group/ | Description remains absent | Content owner |
| U-01 | Unavailable | /locations/east/ | Request timed out before a status was observed | Website maintainer |
| U-02 | Unavailable | /locations/west/ | Request timed out before a status was observed | Website maintainer |

These rows illustrate report states. They are not observations about an actual website.

## A finding ready for implementation

**F-01 needs prompt investigation because it blocks the tested enquiry link.** The proposed ticket would identify the source page, the link selector or accessible name, the destination observed, the response status, and the time of the check. A screenshot can supplement the recorded URL and response evidence.

The proposed fix is to update the link to the approved contact destination. Before implementing it, the maintainer should confirm that destination with the site owner. Acceptance means the link opens the intended page on mobile and desktop and the original source page no longer contains the obsolete destination.

That verifies navigation. Confirming that the form accepts and delivers an enquiry requires a separate permitted test.

## Priorities and unresolved coverage

The enquiry-link failure comes first because the tested path is blocked. The recurring description issue can enter the content backlog. The two unavailable pages need a retry or investigation before the report can characterize their current state.

Priority records a reason and an owner. An arbitrary combined score would hide the distinction between an observed failure, an editorial improvement, and missing evidence.

## Delivery and the next run

In this example, the report is stored and its email is queued under a stable report identifier. A provider acknowledgement is recorded as accepted. Delivery to a recipient server, a bounce, and human reading are separate observations if the integration supplies them.

For the next run, keep the same scope and rule version or explain the change. Recheck F-01 after repair, preserve the original finding, and attach the new evidence. For U-01 and U-02, record the successful retry or continued lack of coverage. Do not silently discard those rows.

## Adapt the format to your workflow

The useful questions are who receives the report, which failures need immediate attention, and where the owner records a fix. My [audit deliverables guide](/blog/website-audit-deliverables-action-plan/) explains the handover principles behind the format.

<a class="button button-primary" href="/work-with-me/website-audit-automation/" data-analytics-event="cta_click" data-analytics-cta-id="audit_example_offer" data-analytics-location="example_end">Explore an audit automation project</a>
