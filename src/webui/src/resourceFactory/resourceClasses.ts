import { AzureResourceType, JSONSerializedResourceResult } from './types';

// Requested platforms are provided on a best-effort basis; for example,
// if the user asks for a dotnet7 functionapp, we're only going to give them
// version 6 because Azure doesn't support 7 for functionapps yet
// Note that Azure-supported versions are determined from the output of:
// az functionapp list-runtimes --os linux -o table
// az webapp list-runtimes --os linux -o table
export class SupportedPlatforms {
  static readonly DOTNET7 = new SupportedPlatforms('DOTNET7', {
    functionAppValue: 'DOTNET|6.0',
    appServiceValue: 'DOTNETCORE|7.0'
  });
  static readonly DOTNET6 = new SupportedPlatforms('DOTNET6', {
    functionAppValue: 'DOTNET|6.0',
    appServiceValue: 'DOTNETCORE|6.0'
  });
  static readonly NODE18 = new SupportedPlatforms('NODE18', {
    functionAppValue: 'NODE|18-lts',
    appServiceValue: 'NODE|18-lts'
  });
  static readonly NODE16 = new SupportedPlatforms('NODE16', {
    functionAppValue: 'NODE|16-lts',
    appServiceValue: 'NODE|16-lts'
  });
  static readonly PYTHON39 = new SupportedPlatforms('PYTHON39', {
    functionAppValue: 'PYTHON|3.9',
    appServiceValue: 'PYTHON|3.9'
  });
  static readonly PYTHON38 = new SupportedPlatforms('PYTHON38', {
    functionAppValue: 'PYTHON|3.8',
    appServiceValue: 'PYTHON|3.8'
  });

  // private to disallow creating other instances of this type
  private constructor(
    private readonly key: string,
    public readonly value: any
  ) {}

  toString() {
    return this.key;
  }
}

export abstract class AzureResource {
  abstract type: AzureResourceType;
  subResources: AzureResource[];
  apiVersion: string;
  name: string;
  tags: { [key: string]: string }[];
  location = '[resourceGroup().location]';
  dependsOn: string[];
  properties: any;
  sku: {
    name: string;
    tier?: string;
  };
  kind: string;

  constructor(
    apiVersion: string,
    name: string,
    tags: { [key: string]: string }[]
  ) {
    this.apiVersion = apiVersion;
    this.name = name;
    this.tags = tags;
    this.dependsOn = [];
    this.properties = [];
    this.sku = { name: '' };
    this.kind = '';
    this.subResources = [];
  }

  addDependsOn(resource: string) {
    this.dependsOn.push(resource);
  }

  private arrayToDict(array: any[]): any {
    let resultDict: any = {};
    array.forEach((property: any, i: any) => {
      const k = Object.keys(property)[0];
      const v = Object.values(property)[0];
      resultDict[k] = v;
    });
    return resultDict;
  }

  toJSON(): JSONSerializedResourceResult {
    const result: JSONSerializedResourceResult = {
      type: this.type,
      apiVersion: this.apiVersion,
      name: this.name,
      location: this.location,
      properties: this.arrayToDict(this.properties)
    };

    if (this.dependsOn.length > 0) {
      result['dependsOn'] = this.dependsOn;
    }

    if (this.tags.length > 0) {
      result['tags'] = this.arrayToDict(this.tags);
    }

    if (this.sku.name !== '') {
      result['sku'] = this.sku;
    }

    if (this.kind !== '') {
      result['kind'] = this.kind;
    }

    //console.log(`${JSON.stringify(result)}`)
    return result;
  }
}

export class StorageAccount extends AzureResource {
  type = AzureResourceType.STORAGE_ACCOUNT;
  kind = 'StorageV2';
  sku = {
    name: 'Standard_RAGRS',
    tier: 'Standard'
  };
  // Property-value combos that are required for this resource type
  requiredProperties = [
    { minimumTlsVersion: 'TLS1_2' },
    { allowBlobPublicAccess: false },
    {
      networkAcls: {
        bypass: 'AzureServices',
        virtualNetworkRules: [],
        ipRules: [],
        defaultAction: 'Allow'
      }
    },
    { supportsHttpsTrafficOnly: true },
    {
      encryption: {
        services: {
          file: {
            keyType: 'Account',
            enabled: true
          },
          blob: {
            keyType: 'Account',
            enabled: true
          }
        },
        keySource: 'Microsoft.Storage'
      }
    },
    { accessTier: 'Hot' }
  ];
  // Configurable property-value combos for this resource type
  randomString?: string;
  // Resources this resource type requires
  blobServices: BlobServices;
  queueServices: QueueServices;
  fileShareServices: FileShareServices;
  tableServices: TableServices;

  constructor(
    name: string,
    tags: { [key: string]: string }[],
    randomString?: string
  ) {
    const apiVersion = '2019-06-01';
    let random = '';
    if (!randomString) {
      random = Math.random().toString(36).slice(2, 10);
    } else {
      random = randomString;
    }
    const uniqueName = name + random;
    const storageAccountName = uniqueName.replace(/-/g, '');
    super(apiVersion, storageAccountName, tags);
    this.requiredProperties.map((property) => {
      this.properties.push(property);
    });

    this.blobServices = new BlobServices(
      `[concat('${storageAccountName}', '/default')]`,
      tags,
      [
        `[resourceId('Microsoft.Storage/storageAccounts', '${storageAccountName}')]`
      ]
    );
    this.subResources.push(this.blobServices);
    this.queueServices = new QueueServices(
      `[concat('${storageAccountName}', '/default')]`,
      tags,
      [
        `[resourceId('Microsoft.Storage/storageAccounts', '${storageAccountName}')]`
      ]
    );
    this.subResources.push(this.queueServices);
    this.fileShareServices = new FileShareServices(
      `[concat('${storageAccountName}', '/default')]`,
      tags,
      [
        `[resourceId('Microsoft.Storage/storageAccounts', '${storageAccountName}')]`
      ]
    );
    this.subResources.push(this.fileShareServices);
    this.tableServices = new TableServices(
      `[concat('${storageAccountName}', '/default')]`,
      tags,
      [
        `[resourceId('Microsoft.Storage/storageAccounts', '${storageAccountName}')]`
      ]
    );
    this.subResources.push(this.tableServices);
  }
}

class BlobServices extends AzureResource {
  type = AzureResourceType.BLOB_SERVICES;
  sku = {
    name: 'Standard_RAGRS',
    tier: 'Standard'
  };
  // Property-value combos that are required for this resource type
  requiredProperties = [
    {
      cors: {
        corsRules: [
          {
            allowedOrigins: ['*'],
            allowedMethods: [
              'DELETE',
              'GET',
              'HEAD',
              'MERGE',
              'POST',
              'OPTIONS',
              'PUT'
            ],
            maxAgeInSeconds: 86400,
            exposedHeaders: ['*'],
            allowedHeaders: ['*']
          }
        ]
      }
    },
    {
      deleteRetentionPolicy: {
        allowPermanentDelete: false,
        enabled: true,
        days: 7
      }
    },
    { isVersioningEnabled: false },
    {
      changeFeed: {
        enabled: false
      }
    },
    {
      restorePolicy: {
        enabled: false
      }
    },
    {
      containerDeleteRetentionPolicy: {
        enabled: true,
        days: 7
      }
    }
  ];
  // This resource type doesn't exist on its own, its dependencies must be included
  needs: string[];

  constructor(
    name: string,
    tags: { [key: string]: string }[],
    needs: string[]
  ) {
    const apiVersion = '2022-05-01';
    super(apiVersion, name, tags);
    this.requiredProperties.map((property) => {
      this.properties.push(property);
    });
    this.needs = needs;
    needs.map((need) => {
      this.addDependsOn(need);
    });
  }
}

class QueueServices extends AzureResource {
  type = AzureResourceType.QUEUE_SERVICES;
  // Property-value combos that are required for this resource type
  requiredProperties = [
    {
      cors: {
        corsRules: []
      }
    }
  ];
  // This resource type doesn't exist on its own, its dependencies must be included
  needs: string[];

  constructor(
    name: string,
    tags: { [key: string]: string }[],
    needs: string[]
  ) {
    const apiVersion = '2022-05-01';
    super(apiVersion, name, tags);
    this.requiredProperties.map((property) => {
      this.properties.push(property);
    });
    this.needs = needs;
    needs.map((need) => {
      this.addDependsOn(need);
    });
  }
}

class FileShareServices extends AzureResource {
  type = AzureResourceType.FILE_SHARE_SERVICES;
  sku = {
    name: 'Standard_RAGRS',
    tier: 'Standard'
  };
  // Property-value combos that are required for this resource type
  requiredProperties = [
    {
      shareDeleteRetentionPolicy: {
        enabled: true,
        days: 7
      }
    }
  ];
  // This resource type doesn't exist on its own, its dependencies must be included
  needs: string[];

  constructor(
    name: string,
    tags: { [key: string]: string }[],
    needs: string[]
  ) {
    const apiVersion = '2022-05-01';
    super(apiVersion, name, tags);
    this.requiredProperties.map((property) => {
      this.properties.push(property);
    });
    this.needs = needs;
    needs.map((need) => {
      this.addDependsOn(need);
    });
  }
}

class TableServices extends AzureResource {
  type = AzureResourceType.TABLE_SERVICES;
  // Property-value combos that are required for this resource type
  requiredProperties = [
    {
      cors: {
        corsRules: []
      }
    }
  ];
  // This resource type doesn't exist on its own, its dependencies must be included
  needs: string[];

  constructor(
    name: string,
    tags: { [key: string]: string }[],
    needs: string[]
  ) {
    const apiVersion = '2022-05-01';
    super(apiVersion, name, tags);
    this.requiredProperties.map((property) => {
      this.properties.push(property);
    });
    this.needs = needs;
    needs.map((need) => {
      this.addDependsOn(need);
    });
  }
}

// https://github.com/Azure-Samples/function-app-arm-templates/blob/main/function-app-dedicated-plan/azuredeploy.json
// https://learn.microsoft.com/en-us/azure/app-service/quickstart-arm-template?source=recommendations&pivots=platform-linux
export class Application extends AzureResource {
  type: AzureResourceType.FUNCTION_APP | AzureResourceType.APP_SERVICE;
  // Configurable property-value combos for this resource type
  kind = 'linux';
  sku: {
    name:
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
      | 'P3V3';
  };
  platform: SupportedPlatforms;
  appInsights: boolean;
  // Resources this resource type requires
  storageAccount: StorageAccount;
  serverFarm: ServerFarm;
  site: Site;
  hostNameBindings: HostnameBindings;
  applicationInsights?: ApplicationInsights;

  constructor(
    type: AzureResourceType.FUNCTION_APP | AzureResourceType.APP_SERVICE,
    name: string,
    tags: { [key: string]: string }[],
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
    platform: SupportedPlatforms,
    appInsights: boolean = false
  ) {
    const apiVersion = '2022-03-01';
    const randomStr = Math.random().toString(36).slice(2, 10);
    const uniqueName = name + '-' + randomStr;
    super(apiVersion, uniqueName, tags);
    this.type = type;
    this.sku = { name: skuName };
    this.platform = platform;
    this.appInsights = appInsights;
    // Pass the same random string to the StorageAccount constructor so it gets named like our app
    this.storageAccount = new StorageAccount(name, tags, randomStr);
    this.subResources.push(this.storageAccount);
    this.storageAccount.subResources.forEach((resource) =>
      this.subResources.push(resource)
    );

    let siteDependsOn: string[] = [];
    if (appInsights) {
      this.applicationInsights = new ApplicationInsights(uniqueName, tags);
      this.subResources.push(this.applicationInsights);
      siteDependsOn = [
        `[resourceId('Microsoft.Web/serverfarms', '${uniqueName}')]`,
        `[resourceId('Microsoft.Storage/storageAccounts', '${this.storageAccount.name}')]`,
        `[resourceId('Microsoft.Insights/components', '${uniqueName}')]`
      ];
    } else {
      siteDependsOn = [
        `[resourceId('Microsoft.Web/serverfarms', '${uniqueName}')]`,
        `[resourceId('Microsoft.Storage/storageAccounts', '${this.storageAccount.name}')]`
      ];
    }

    this.serverFarm = new ServerFarm(uniqueName, tags, skuName);
    this.subResources.push(this.serverFarm);
    this.site = new Site(
      uniqueName,
      tags,
      this.type,
      this.storageAccount.name,
      platform,
      siteDependsOn
    );
    this.subResources.push(this.site);
    this.hostNameBindings = new HostnameBindings(
      `[concat('${uniqueName}', '/', '${uniqueName}', '.azurewebsites.net')]`,
      tags,
      [`[resourceId('Microsoft.Web/sites', '${uniqueName}')]`]
    );
    this.subResources.push(this.hostNameBindings);
  }
}

class ServerFarm extends AzureResource {
  type = AzureResourceType.SERVER_FARM;
  // Property-value combos that are required for this resource type
  requiredProperties = [{ reserved: true }];
  // Configurable property-value combos for this resource type
  kind = 'linux';
  sku: {
    name:
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
      | 'P3V3';
  };

  constructor(
    name: string,
    tags: { [key: string]: string }[],
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
      | 'P3V3' = 'B1'
  ) {
    const apiVersion = '2022-03-01';
    super(apiVersion, name, tags);
    this.sku = { name: skuName };
    this.requiredProperties.map((property) => {
      this.properties.push(property);
    });
    this.properties.push({ name: this.name });
  }
}

class Site extends AzureResource {
  type = AzureResourceType.SITE;
  // Property-value combos that are required for this resource type
  requiredProperties = [{ reserved: true }, { httpsOnly: true }];
  // Configurable property-value combos for this resource type
  serverFarmType:
    | AzureResourceType.FUNCTION_APP
    | AzureResourceType.APP_SERVICE;
  platform: SupportedPlatforms;
  storageAccountName: string;
  // This resource type doesn't exist on its own, its dependencies must be included
  needs: string[];

  constructor(
    name: string,
    tags: { [key: string]: string }[],
    serverFarmType:
      | AzureResourceType.FUNCTION_APP
      | AzureResourceType.APP_SERVICE,
    storageAccountName: string,
    platform: SupportedPlatforms,
    needs: string[]
  ) {
    const apiVersion = '2022-03-01';
    super(apiVersion, name, tags);
    this.serverFarmType = serverFarmType;
    this.platform = platform;
    this.storageAccountName = storageAccountName;
    this.needs = needs;
    needs.map((need) => {
      this.addDependsOn(need);
    });
    this.requiredProperties.map((property) => {
      this.properties.push(property);
    });
    this.properties.push({ name: this.name });
    this.properties.push({
      serverFarmId: `[resourceId('Microsoft.Web/serverfarms', '${this.name}')]`
    });

    let siteConfig: any = {
      alwaysOn: true,
      appSettings: [
        {
          name: 'AzureWebJobsStorage',
          value: `[format('DefaultEndpointsProtocol=https;AccountName={0};EndpointSuffix={1};AccountKey={2}', '${this.storageAccountName}', environment().suffixes.storage, listKeys(resourceId('Microsoft.Storage/storageAccounts', '${this.storageAccountName}'), '2022-05-01').keys[0].value)]`
        }
      ]
    };

    if (this.serverFarmType === AzureResourceType.APP_SERVICE) {
      this.kind = 'app,linux';
      siteConfig[
        'linuxFxVersion'
      ] = `${this.platform.value['appServiceValue']}`;
      siteConfig['ipSecurityRestrictions'] = [
        {
          ipAddress: '149.173.0.0/16',
          action: 'Allow',
          tag: 'Default',
          priority: 50,
          name: 'CaryNT'
        },
        {
          ipAddress: 'Any',
          action: 'Deny',
          priority: 2147483647,
          name: 'Deny all',
          description: 'Deny all access'
        }
      ];
    } else if (this.serverFarmType === AzureResourceType.FUNCTION_APP) {
      this.kind = 'functionapp,linux';
      siteConfig[
        'linuxFxVersion'
      ] = `${this.platform.value['functionAppValue']}`;
      siteConfig['cors'] = {
        allowedOrigins: [
          'http://localhost:3000',
          'http://localhost:3001',
          'http://localhost:3002',
          'http://localhost:3003',
          'http://localhost:3004',
          'http://localhost:3005',
          'http://localhost:3006',
          'http://localhost:3007',
          'http://localhost:3008',
          'http://localhost:3009'
        ]
      };
      siteConfig.appSettings.push({
        name: 'FUNCTIONS_EXTENSION_VERSION',
        value: '~4'
      });
    }

    if (
      this.needs.includes(
        `[resourceId('Microsoft.Insights/components', '${this.name}')]`
      )
    ) {
      siteConfig.appSettings.push({
        name: 'APPINSIGHTS_INSTRUMENTATIONKEY',
        value: `[reference(resourceId('Microsoft.Insights/components', '${this.name}'), '2015-05-01').InstrumentationKey]`
      });
    }

    this.properties.push({ siteConfig: siteConfig });
  }
}

class HostnameBindings extends AzureResource {
  type = AzureResourceType.HOSTNAMES_BINDING;
  // Property-value combos that are required for this resource type
  requiredProperties = [{ hostNameType: 'Verified' }];
  // This resource type doesn't exist on its own, its dependencies must be included
  needs: string[];

  constructor(
    name: string,
    tags: { [key: string]: string }[],
    needs: string[]
  ) {
    const apiVersion = '2018-11-01';
    super(apiVersion, name, tags);
    this.needs = needs;
    needs.map((need) => {
      this.addDependsOn(need);
    });
    this.requiredProperties.map((property) => {
      this.properties.push(property);
    });
    this.properties.push({ siteName: this.name });
  }
}

class ApplicationInsights extends AzureResource {
  type = AzureResourceType.APPLICATION_INSIGHTS;
  kind = 'web';
  // Property-value combos that are required for this resource type
  requiredProperties = [{ Application_Type: 'web' }];

  constructor(name: string, tags: { [key: string]: string }[]) {
    const apiVersion = '2020-02-02';
    super(apiVersion, name, tags);
    this.requiredProperties.map((property) => {
      this.properties.push(property);
    });
  }
}

export class PostgreSQL extends AzureResource {
  type = AzureResourceType.POSTGRESQL_INSTANCE;
  sku = {
    name: 'Standard_B1ms',
    tier: 'Burstable'
  };
  // Property-value combos that are required for this resource type
  requiredProperties = [
    { version: '14' },
    { administratorLogin: 'postgres' },
    { availabilityZone: '3' },
    {
      storage: {
        storageSizeGB: 32
      }
    },
    {
      backup: {
        backupRetentionDays: 7,
        geoRedundantBackup: 'Disabled'
      }
    },
    {
      highAvailability: {
        mode: 'Disabled'
      }
    },
    {
      maintenanceWindow: {
        customWindow: 'Disabled',
        dayOfWeek: 0,
        startHour: 0,
        startMinute: 0
      }
    }
  ];
  // Resources this resource type requires
  sasVPNFirewallRule: PostgreSQLFirewallRule;
  // Configurable property-value combos for this resource type
  databaseNames?: string[];
  firewallRules?: {
    name: string;
    startIpAddress: string;
    endIpAddress: string;
  }[];

  constructor(
    name: string,
    tags: { [key: string]: string }[],
    databaseNames?: string[],
    firewallRules?: {
      name: string;
      startIpAddress: string;
      endIpAddress: string;
    }[]
  ) {
    const apiVersion = '2022-01-20-preview';
    super(apiVersion, name, tags);
    this.requiredProperties.map((property) => {
      this.properties.push(property);
    });
    this.properties.push({
      AdministratorLoginPassword: this.generatePassword()
    });
    this.sasVPNFirewallRule = new PostgreSQLFirewallRule(
      `[concat('${this.name}', '/sas_vpn')]`,
      this.tags,
      '149.173.0.0',
      '149.173.255.255',
      [
        `[resourceId('Microsoft.DBforPostgreSQL/flexibleServers', '${this.name}')]`
      ]
    );
    this.subResources.push(this.sasVPNFirewallRule);
    if (databaseNames) {
      databaseNames.forEach((databaseName) => {
        let database = new PostgreSQLDatabase(
          `[concat('${this.name}', '/${databaseName}')]`,
          this.tags,
          [
            `[resourceId('Microsoft.DBforPostgreSQL/flexibleServers', '${this.name}')]`
          ]
        );
        this.subResources.push(database);
      });
    }
    if (firewallRules) {
      firewallRules.forEach((rule) => {
        let firewallRule = new PostgreSQLFirewallRule(
          `[concat('${this.name}', '/${rule.name}')]`,
          this.tags,
          rule.startIpAddress,
          rule.endIpAddress,
          [
            `[resourceId('Microsoft.DBforPostgreSQL/flexibleServers', '${this.name}')]`
          ]
        );
        this.subResources.push(firewallRule);
      });
    }
  }

  generatePassword() {
    const chars =
      '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const passwordLength = 12;
    let password = '';
    for (var i = 0; i <= passwordLength; i++) {
      var randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber + 1);
    }
    return password;
  }
}

class PostgreSQLDatabase extends AzureResource {
  type = AzureResourceType.POSTGRESQL_DATABASE;
  // Property-value combos that are required for this resource type
  requiredProperties = [{ charset: 'UTF8' }, { collation: 'en_US.utf8' }];
  // This resource type doesn't exist on its own, its dependencies must be included
  needs: string[];

  constructor(
    name: string,
    tags: { [key: string]: string }[],
    needs: string[]
  ) {
    const apiVersion = '2022-01-20-preview';
    super(apiVersion, name, tags);
    this.needs = needs;
    needs.map((need) => {
      this.addDependsOn(need);
    });
    this.requiredProperties.map((property) => {
      this.properties.push(property);
    });
  }
}

class PostgreSQLFirewallRule extends AzureResource {
  type = AzureResourceType.POSTGRESQL_FIREWALL_RULE;
  // Configurable property-value combos for this resource type
  startIpAddress: string;
  endIpAddress: string;
  // This resource type doesn't exist on its own, its dependencies must be included
  needs: string[];

  constructor(
    name: string,
    tags: { [key: string]: string }[],
    startIpAddress: string,
    endIpAddress: string,
    needs: string[]
  ) {
    const apiVersion = '2022-01-20-preview';
    super(apiVersion, name, tags);
    this.startIpAddress = startIpAddress;
    this.endIpAddress = endIpAddress;
    this.needs = needs;
    needs.map((need) => {
      this.addDependsOn(need);
    });
    this.properties.push({ startIpAddress: this.startIpAddress });
    this.properties.push({ endIpAddress: this.endIpAddress });
  }
}
