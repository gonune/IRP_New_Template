# Getting Started

## Using the deployed version of this project

_Coming soon_

<br />
<br />

## Deploying this project

\*Note that these steps are here for reference and do not need to be performed in order to interact with the already-deployed version of this project, as instructed above.

See [this page](/docs/gettingStarted/deploy.md).

<br />
<br />

## Contributing / Developing

**Development SOPs**

- Always generate out .png versions of your PUML diagrams before you push your working branch
- Always create a README.md file in the top level of each `src/<csub-project>/` directory using [this template](/docs/template_README.md)
- See the individual `CONTRIB.md` pages in each top-level directory in `src` for sub-project level expectations and details on how to contribute to this code base.

**Setting up your local machine to edit and render PUML diagrams**

1. Install [jebbs.plantuml VSCode extension](https://marketplace.visualstudio.com/items?itemName=jebbs.plantuml) which will enable PlantUML rendering
2. Create a new workspace .vscode directory with a settings.json file inside it with the following contents:

   ```
   {
       "plantuml.server": "http://localhost:8888",
       "plantuml.render": "PlantUMLServer",
       "plantuml.diagramsRoot": "docs/diagrams/source",
       "plantuml.exportOutDir": "docs/diagrams/out"
   }
   ```

3. Start a PlantUML Server locally: `docker run -d -p 8888:8080 plantuml/plantuml-server:jetty`
4. Open any of the .puml files in docs/diagrams/source and use the `ALT+D` keystroke to view a dynamic rendering
