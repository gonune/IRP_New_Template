import { ARMTemplate } from '../resourceFactory/ARMTemplate';
import { AzureResourceType } from '../resourceFactory/types';
import { SupportedPlatforms } from '../resourceFactory/resourceClasses';
import {
  Resource,
  SupportedResourceTypes,
  StorageAccount,
  Application,
  SupportedPlatform,
  Database,
  DatabaseFirewallRule
} from '../types/Resources';
import { Tag, ResourceTagGroups } from '../types/Tag';

interface defineResources {
  tags: ResourceTagGroups;
  SAs: StorageAccount[];
  FAs: Application[];
  APSs: Application[];
  PGs: Database[];
}

const formatTags = ({ tags, SAs, FAs, APSs, PGs }: defineResources) => {
  let type = '';
  let tagIndex = 0;
  let updatedTags: any = [];
  let updatedSAs = [...SAs];
  let updatedFAs = [...FAs];
  let updatedAPSs = [...APSs];
  let updatedPGs = [...PGs];

  function flattenKeyStructure(tag: Tag) {
    const tagName = Object.values(tag)[0];
    const tagValue = Object.values(tag)[1];
    return { [`${tagName}`]: tagValue };
  }

  function formatTagsForEach(
    resourceType: SupportedResourceTypes,
    resourceList: Resource[]
  ) {
    resourceList.forEach((resource: any, index: number) => {
      updatedTags = []; // Reset
      for (const [key, value] of Object.entries(tags)) {
        type = key.split('-')[0]; // eg. SA
        tagIndex = Number(key.split('-')[1]); // eg. 0

        if ((type === resourceType && index === tagIndex) || type === 'ALL') {
          value.tagList.forEach((tag: Tag) => {
            const updatedTag = flattenKeyStructure(tag);
            if (Object.keys(updatedTag)[0] !== '') {
              updatedTags.push(updatedTag);
            }
          });
        }
      }
      resource.tags = updatedTags;
    });
  }

  formatTagsForEach('SA', updatedSAs);
  formatTagsForEach('FA', updatedFAs);
  formatTagsForEach('APS', updatedAPSs);
  formatTagsForEach('PG', updatedPGs);

  return { updatedSAs, updatedFAs, updatedAPSs, updatedPGs };
};

const encodePlatform = (platformString: SupportedPlatform) => {
  if (platformString === 'DotNet 6') {
    return SupportedPlatforms.DOTNET6;
  } else if (platformString === 'DotNet 7') {
    return SupportedPlatforms.DOTNET7;
  } else if (platformString === 'Node 16') {
    return SupportedPlatforms.NODE16;
  } else if (platformString === 'Node 18') {
    return SupportedPlatforms.NODE18;
  } else if (platformString === 'Python 3.8') {
    return SupportedPlatforms.PYTHON38;
  } else if (platformString === 'Python 3.9') {
    return SupportedPlatforms.PYTHON39;
  }
};

export const defineResources = ({
  tags,
  SAs,
  FAs,
  APSs,
  PGs
}: defineResources) => {
  let arm = new ARMTemplate(
    'https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#',
    '1.0.0.0',
    {}
  );

  const { updatedSAs, updatedFAs, updatedAPSs, updatedPGs } = formatTags({
    tags,
    SAs,
    FAs,
    APSs,
    PGs
  });

  updatedSAs.forEach((SA) => {
    arm.createStorageAccount(SA.name, SA.tags);
  });

  updatedFAs.forEach((FA) => {
    let encodedPlatform = encodePlatform(FA.platform);
    if (encodedPlatform) {
      arm.createApplication(
        AzureResourceType.FUNCTION_APP,
        FA.name,
        encodedPlatform,
        FA.tags,
        FA.skuName,
        FA.appInsights
      );
    }
  });

  updatedAPSs.forEach((APS) => {
    let encodedPlatform = encodePlatform(APS.platform);
    if (encodedPlatform) {
      arm.createApplication(
        AzureResourceType.APP_SERVICE,
        APS.name,
        encodedPlatform,
        APS.tags,
        APS.skuName,
        APS.appInsights
      );
    }
  });

  updatedPGs.forEach((PG) => {
    let dbNames: string[] = [];
    for (const [key, value] of Object.entries(PG.databaseNames)) {
      dbNames.push(value);
    }

    let fwRules: DatabaseFirewallRule[] = [];
    for (const [key, value] of Object.entries(PG.firewallRules)) {
      fwRules.push(value);
    }

    arm.createPostgreSQL(PG.name, PG.tags, dbNames, fwRules);
  });

  const result = arm.produceTemplate();

  return result;
};
