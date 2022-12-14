# Project: Dynamic ARM Template Generation

## Current status
[X] Architecture / design
<br />
[X] In active development
<br />
[ ] Preparing for handoff
<br />
[ ] Delivered to stakeholders

## Problem Statement
Manually deploying all of the Azure resources that are neccessary to support new development projects built in the Azure cloud is:
- Time consuming
- Error prone
- Subject to wildly differing standards across projects

## Impact of the Problem
The opportunity cost of the man hours that it takes to manually deploy Azure resources to support new development projects directly inhibits the human resource hours that could be spent developing the project's codebase. It's another manual effort to impose standards across those projects such as networking restrictions or tagging requirements.

## Goal
The goal of this project is to provide an easy-to-use web interface with form-based inputs to allow the rapid deployment of the Azure resources needed to support new projects while providing some simple configuration options for those resources. Any standards on the deployment of those Azure resources should be imposed behind the scenes and/or via required input fields and validation. When the user submits the form, the sytax required to define each of their selected resources should be generated and then compiled into an Azure ARM Template to be delivered back to the user.

The scope of this goal covers the Solutions Factory Incubation and Rapid Prototyping (IRP) team but its benefits are believed to extend to other development teams across SAS.

The first iteration of development on this project expects that the user will then import the ARM Template into the Azure Portal to deploy their resources. In the future we would like to also provide a GitHub Workflow in the [IRP_New_Projects](https://github.com/sas-institute-solutions-factory/IRP_New_Project) template that will create an Azure Resource Group if needed and then deploy the template into it. This project could ask the user which GitHub repository represents their new project and then upload the generated ARM Template to that repo in a directory that the Workflow expects it to be in.

## Objectives
- Reduce the time it takes to deploy the Azure resources that new IRP development projects require
- Improve standardization across IRP development projects

## Project Layout
- [The Getting Started page](/docs/gettingStarted/README.md) contains information on interacting with the deployed artifacts from this development project as well as instructions for contributing to and working with the code base.
- The `/docs/diagrams/out` directory contains architectural diagrams of various levels of technicality, produced from the plantUML source documents found in the `/docs/diagrams/source` directory.
- The sub-folders in the `src` directory contain the code bases for the individual sub-projects that make up this project. Each sub-folder has one or more additional README files documenting details for that project.
- [The Resource Links page](/docs/gettingStarted/resourceLinks.md) provides links to the Azure resources used to produce this project, accessible to those with the appropriate permissions.

## Development Steps
[X] 1. Develop resource factory for generating instances of the AzureResource concrete classes (initial set of supported resources is documented in `src/ResourceFactory/README.md`)
[X] 2. Develop functionality for creating a collection of those instances and then producing a syntactically valid Azure ARM Template from them
[ ] 3. Develop a ReactJS web frontend that meets the requirements documented above which includes:
    - Azure Active Directory authentication
    - Navigation that can support browser-level refresh and back button usage
    - RBAC-protected routes
[ ] 4. Implement a middleware layer of JWT checking and validation against Azure Active Directory via Azure APIM
[ ] 5. Separate the logic out into proper front, middle, and backend tiers (details documented in `src/resourceFactory/README.md`) where the backend should support RBAC-protected APIs using validated JWTs passed from the APIM instance. Note that this will require the frontend to be updated to make calls to the backend (and pass the JWT from login) rather than implementing all of the logic for creating ARM Templates itself.

[Link to this project's Confluence page]()