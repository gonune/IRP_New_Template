# Project Dynamic ARM Template Generation: Resource Factory

Language: TypeScript

This project provides a factory for generating new instances of the concrete implementations of the abstract AzureResource class. Each concrete implementation represents one of the Azure resource types that we support dynamic generation of:
- Storage Accounts
- App Services
- Function Apps
- PostgreSQL instances

Once all the instances of each resource type(s) that should be included in the template to generate have been created, a method to produce an Azure ARM template to deploy all of those resources can be called which will return a JSON file that can be deployed to Azure, either manually via the Azure Portal or by other means such as with GitHub Actions.

### Requirements

- Node v16
- All packages as defined in `./package-lock.json`

### Getting Started

1. Create a new instance of the ARMTemplate class. Note that the empty object passed as the last argument to this constructor is a placeholder for future support of generating Azure ARM Template Outputs.
    ```
    import { ARMTemplate } from "../ARMTemplate";
    import { AzureResourceType } from "../types";
    import { SupportedPlatforms } from "../resourceClasses";

    let arm = new ARMTemplate(
        "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
        "1.0.0.0",
        {}
    );
    ```
2. Create resources using the provided interfaces
    ```
    arm.createStorageAccount(
        "dynamicarmtest",
        [{someTag: "someTagValue"}, {someOtherTag: "someOtherTagValue"}]
    );

    arm.createApplication(
        AzureResourceType.FUNCTION_APP,
        "function-test",
        SupportedPlatforms.PYTHON39,
        [{anotherTag: "anotherTagValue"}],
        undefined,
        true
    );

    arm.createApplication(
        AzureResourceType.APP_SERVICE,
        "service-test",
        SupportedPlatforms.DOTNET7,
        [{yetAnotherTag: "yetAnotherTagValue"}],
        undefined,
        true
    );

    arm.createPostgreSQL(
        "dynamicarmtest",
        [{andYetSomeOtherTag: "andYetSomeOtherTag"}],
        ["testdb"],
        [
            {name: "testrule", startIpAddress: "52.177.169.150", endIpAddress: "52.177.169.150"}
        ]
    );

    // ...
    ```
3. Produce an ARM Template which includes those resources
    ```
    arm.produceTemplate();
    ```

### Notes
- For generated Azure Function Apps, `localhost:3000` through `localhost:3009` (all ports between and including) are automatically added to the CORS allowed origins list for that app
- For generated Azure App Services, inbound requests are automatically restricted to 149.173.0.0.0/16

### Planned future developments
- The separate methods in the ARMTemplate class will be compiled into a single, generalized method for creating `AzureResource`s
- The ARMTemplate class and the Factory will be separated into a backend project
- Individual methods for generating specific resources (similar to the createXXX() methods that exist on the ARMTemplate class today) will be surfaced via a JavaScript Express API which will communicate with the generic method in the backend and eventually onto the factory to create the resources
- Additional functionality in the new JavaScript Express API will be developed to support a "shopping basket" for each user of the frontend application to keep track of the Azure resources that are currently "in their cart" as well as "checkout" functionality to produce the ARM Template for them when they're ready ([reference](https://www.delftstack.com/howto/node.js/node.js-send-file/), [reference](https://blog.devgenius.io/react-tips-back-button-stop-event-bubbling-merging-states-5aca03bf50f9))
- A React frontend application will be responsible for the user experience by providing a form that will allow them to select and configure the resources that they want to create and ultimately generate them by making calls to the JavaScript Express API via an `onSubmit` handler.


### Contributing

Please see [this section](/docs/gettingStarted/README.md#contributing--developing) for expectations and details on how to contribute to this code base.
