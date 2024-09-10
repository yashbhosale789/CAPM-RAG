# Agents Hands-On
The core idea of agents is to use a language model to choose a sequence of actions to take. In chains, a sequence of actions is hardcoded (in code). In agents, a language model is used as a reasoning engine to determine which actions to take and in which order.

## Pre-requisites:

1. Subscription to SAP Business Application Studio.
2. Generative AI Hub Credentials (As used previously)

## Getting started

- Navigate to SAP Business Application Studio
- Click on Create Dev Space & provide a name for it.
- Choose application type as full stack application & select Python Tools from Additional SAP Extensions & click on create space

    ![devspace](images/devSpace.png)

- Click on Clone from git & add the repo URL "https://github.com/AjitKP91/cpa-rag-usecase.git"

    ![clone](images/clone.png)

- Open the cloned repo & navigate to Agents.ipynb file in the Agents folder.
- Click on Select Kernel, choose python environments & click on create Python environments.

    ![clone](images/kernel.png)

- Click on Venv as environment type.

    ![clone](images/venv.png)

- Select /usr/bin/python3 for Python installation to create virtual environment.

    ![clone](images/python3.png)

- Tick mark the requirements.txt check box to install the required packages.

    ![clone](images/requirements.png)

- You're now all set to try out the Agentic workflow with csv agents!


## Reference

- https://python.langchain.com/v0.1/docs/modules/agents/
- https://python.langchain.com/v0.1/docs/modules/agents/concepts/
- https://python.langchain.com/v0.2/docs/integrations/toolkits/csv/
- https://python.langchain.com/v0.1/docs/modules/agents/quick_start/
