accept-evaluation
=================

####Overview

This repository contains a jQuery client that can be used to implement Machine Translated(MT) content Evaluation within Web based environments. To achieve such functionality some prior steps are needed.

- First of all, an instance of the ACCEPT API needs to be up and running.
- Having an ACCEPT Portal instance deployed is not mandatory. However, having one in place, might help by providing an UI which facilitates some actions, such as Evaluation projects creation and collected data display functionalities. But this actions can also be undertaken using the ACCEPT API directly. 
- Having the just described environment in place, the next step is to create an Evaluation project. Note this client is aimed to work only with External projects(Internal projects evaluation process happens within the ACCEPT Portal). The idea here is to use the here presented client to "transport" the MT content Evaluation functionality to any other Web environment and still be able to collect the called "votes" from online communities. 
- The immediate step after creating a project is to create a project question. This question and respective response options will be displayed in a form of a Web Form(labels for the Form submit button and thank message can be configured when creating a question).

More detailed information can be found in the [documentation repository](../../../../accept-project/accept-docs//tree/master/evaluation).

####Evaluation Project Management

Detailed information available [here](https://github.com/accept-project/accept-docs/blob/master/evaluation/management.rst).

####The Evaluation API

More info on the REST API available [here](https://github.com/accept-project/accept-docs/blob/master/evaluation/api.rst).

####Client Side

An Use Case available [here](https://github.com/accept-project/accept-docs/blob/master/evaluation/client_example.rst).




