export enum AzureResourceType {
    RESOURCE_GROUP = "Microsoft.Resources/resourceGroups",
    STORAGE_ACCOUNT = "Microsoft.Storage/storageAccounts",
    BLOB_SERVICES = "Microsoft.Storage/storageAccounts/blobServices",
    QUEUE_SERVICES = "Microsoft.Storage/storageAccounts/queueServices",
    FILE_SHARE_SERVICES = "Microsoft.Storage/storageAccounts/fileServices",
    TABLE_SERVICES = "Microsoft.Storage/storageAccounts/tableServices",
    FUNCTION_APP = "function_app_top_level",
    APP_SERVICE = "app_service_top_level",
    SERVER_FARM = "Microsoft.Web/serverfarms",
    SITE = "Microsoft.Web/sites",
    HOSTNAMES_BINDING = "Microsoft.Web/sites/hostNameBindings",
    APPLICATION_INSIGHTS = "Microsoft.Insights/components",
    POSTGRESQL_INSTANCE = "Microsoft.DBforPostgreSQL/flexibleServers",
    POSTGRESQL_DATABASE = "Microsoft.DBforPostgreSQL/flexibleServers/databases",
    POSTGRESQL_FIREWALL_RULE = "Microsoft.DBforPostgreSQL/flexibleServers/firewallRules"
}

export type JSONSerializedResourceResult = {
    type: AzureResourceType;
    apiVersion: string;
    name: string;
    location: string;
    properties: any;
    dependsOn?: string[];
    tags?: any; // TODO: rid all the anys
    sku?: {
        name: string;
        tier?: string;
    };
    kind?: string;
};

export type JSONSerializedARMTemplateResult = {
    $schema: string;
    contentVersion: string;
    resources: any[];
    outputs: any;
};
