import { AzureResourceFactory } from './Factory';
import {
  AzureResource,
  SupportedPlatforms,
  StorageAccount,
  Application,
  PostgreSQL
} from './resourceClasses';
import { AzureResourceType, JSONSerializedARMTemplateResult } from './types';

// NOTES
// - Usage examples and planned enhancements exist in ../README.md
// - To support those enhancements, the ARMTemplate class will need to be updated to expose
//   a generic create method like what is provided in the factory so that it's purpose can
//   be simplified to managing the collection of resources and producing the template from them

export class ARMTemplate {
  arf: AzureResourceFactory;
  schema: string;
  contentVersion: string;
  resources: AzureResource[];
  outputs: any;

  constructor(schema: string, contentVersion: string, outputs: any) {
    this.schema = schema;
    this.contentVersion = contentVersion;
    this.resources = [];
    this.outputs = outputs;
    this.arf = new AzureResourceFactory();
  }

  // Because the Factory only has a generalized create method, calling it directly gives
  // no indication of the available arguments and their types. Separate 'create' methods
  // for each supported Azure Resource Type allows us to create individual interfaces so
  // we can define and alert the caller to the configurable settings for that resource
  // type via specific type-casted arguments.

  createStorageAccount(name: string, tags: { [key: string]: string }[] = []) {
    // TODO: Error handling with try, catch
    let resource = this.arf.create(StorageAccount, name, tags);
    this.addResourceToCollection(resource);
  }

  createApplication(
    type: AzureResourceType.FUNCTION_APP | AzureResourceType.APP_SERVICE,
    name: string,
    platform: SupportedPlatforms,
    tags: { [key: string]: string }[] = [],
    skuName:
      | 'B1'
      | 'B2'
      | 'B3'
      | 'S1'
      | 'S2'
      | 'S3'
      | 'P1V2'
      | 'P2V2'
      | 'P3V2'
      | 'P1V3'
      | 'P2V3'
      | 'P3V3' = 'B1',
    appInsights: boolean = false
  ) {
    // TODO: Error handling with try, catch
    let resource = this.arf.create(
      Application,
      type,
      name,
      tags,
      skuName,
      platform,
      appInsights
    );
    // We don't want to add Function Apps themselves to the collection because the top-level resource
    // is only a container of sub-resources
    this.addSubResourcesToCollection(resource);
  }

  createPostgreSQL(
    name: string,
    tags: { [key: string]: string }[] = [],
    databaseNames?: string[],
    firewallRules?: {
      name: string;
      startIpAddress: string;
      endIpAddress: string;
    }[]
  ) {
    // TODO: Error handling with try, catch
    let resource = this.arf.create(
      PostgreSQL,
      name,
      tags,
      databaseNames,
      firewallRules
    );
    this.addResourceToCollection(resource);
  }

  addResourceToCollection(resource: AzureResource) {
    this.resources.push(resource);

    if (resource.subResources.length > 0) {
      this.addSubResourcesToCollection(resource);
    }
  }

  addSubResourcesToCollection(resource: AzureResource) {
    resource.subResources.map((resource) => {
      this.resources.push(resource);
    });
  }

  produceTemplate(): JSONSerializedARMTemplateResult {
    let resourcesJSON: any = [];
    this.resources.map((resource) => {
      resourcesJSON.push(resource.toJSON());
    });

    const result: JSONSerializedARMTemplateResult = {
      $schema: this.schema,
      contentVersion: this.contentVersion,
      resources: resourcesJSON,
      outputs: this.outputs
    };

    return result;
  }
}
