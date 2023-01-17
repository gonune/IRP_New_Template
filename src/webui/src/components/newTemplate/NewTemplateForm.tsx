import React, { useState } from 'react';
import { Row, Col, Form, FormGroup, Input, Label } from 'reactstrap';

import { CustomButton } from '../../components/genericHOCs/CustomButton';
import { Tag, ResourceTagGroups, emptyTag } from '../../types/Tag';
import {
  SupportedPlatform,
  SupportedApplicationSku,
  DatabaseFirewallRule
} from '../../types/Resources';
import {
  SupportedResourceTypes,
  StorageAccount,
  Application,
  isASupportedApplicationSku,
  isASupportedPlatform,
  Database
} from '../../types/Resources';
import { ResourceInputs } from '../../components/newTemplate/ResourceInputs';
import { ResourceTagInputs } from '../../components/newTemplate/ResourceTagInputs';
import { defineResources } from '../../util/generateResourceDefinitions';

interface NewTemplateFormProps {
  toggleModal: Function;
  setContents: Function;
  operation: string;
  setOperation: Function;
  setOperationSelected: Function;
}

// TODO: Update from existing needs
// - Delete original file and upload the new one
// - Figure out how to update resource factory to intake pre-exising SA name for applications
// - Include monitoring box is checked no matter what
// TODO: Design stuff
// - Disabled buttons look like secondary buttons
// TODO: Code improvements
// - Reduce code duplication by addSA --> upsertSA and calling that from handleChange (for all resources)
// TODO: Etc
// - GitHub Apps authentication instead of PAT
// - A lot of validation
// - Better way to do mappings in handleApplicationSubResources()

// This component handles all state for the form
// Reusable componentry exists in stateless form in this sub-directory
// https://itnext.io/how-to-build-a-dynamic-controlled-form-with-react-hooks-2019-b39840f75c4f
export const NewTemplateForm: React.FC<NewTemplateFormProps> = ({
  toggleModal,
  setContents,
  operation,
  setOperation,
  setOperationSelected
}) => {
  const [existingTemplate, setExistingTemplate] = useState<any>('');

  const [cloudProvider, setCloudProvider] = useState('Azure');

  // What resource types are requested for progressive disclosure
  const [SAChecked, setSAChecked] = useState(false);
  const [FAChecked, setFAChecked] = useState(false);
  const [APSChecked, setAPSChecked] = useState(false);
  const [PGChecked, setPGChecked] = useState(false);

  // The input values for each resource type
  const [SAs, setSAs] = useState<StorageAccount[]>([]);
  const [FAs, setFAs] = useState<Application[]>([]);
  const [APSs, setAPSs] = useState<Application[]>([]);
  const [PGs, setPGs] = useState<Database[]>([]);

  // List of tags keyed by which resource they belong to
  const [tags, setTags] = useState<ResourceTagGroups>({
    [`ALL-0`]: {
      comesFromExisting: false,
      tagList: [{ ...emptyTag }]
    }
  });
  console.log(tags);

  // Resource tag handlers
  const addTagGroup = (type: SupportedResourceTypes, resourceIndex: number) => {
    setTags((prevState: any) => ({
      ...prevState,
      [`${type}-${resourceIndex}`]: {
        comesFromExisting: false,
        tagList: [{ ...emptyTag }]
      }
    }));
  };
  const addTagToGroup = (
    type: SupportedResourceTypes,
    resourceIndex: number
  ) => {
    const group = `${type}-${resourceIndex}`;
    const updatedTagList = tags[group].tagList;
    updatedTagList.push({ ...emptyTag });
    setTags((prevState: any) => ({
      ...prevState,
      [`${group}`]: {
        comesFromExisting: false,
        tagList: updatedTagList
      }
    }));
  };
  const removeTagGroup = (
    type: SupportedResourceTypes,
    resourceIndex: number,
    all: boolean = false
  ) => {
    if (all) {
      const updatedTags = { ...tags };
      for (const key in { ...tags }) {
        if (key.startsWith(type)) {
          delete updatedTags[`${key}`];
        }
      }
      setTags((prevState: any) => updatedTags);
    } else {
      const { [`${type}-${resourceIndex}`]: group, ...rest } = { ...tags };
      setTags((prevState: any) => rest);
    }
  };
  const removeTagFromGroup = (
    type: SupportedResourceTypes,
    resourceIndex: number,
    indexToRemove: number
  ) => {
    const group = `${type}-${resourceIndex}`;
    const tagList = tags[group].tagList;
    const updatedTagList = tagList.filter(
      (tag: Tag, index: number) => index !== indexToRemove
    );
    setTags((prevState: any) => ({
      ...prevState,
      [`${group}`]: {
        comesFromExisting: false,
        tagList: updatedTagList
      }
    }));
  };

  // Resource handlers for each type
  const addSA = (resourceIndex: number, name?: string) => {
    setSAs((prevState) => [
      ...prevState,
      {
        index: resourceIndex,
        comesFromExisting: name ? true : false,
        visible: true,
        name: name ? name : '',
        tags: []
      }
    ]);
    addTagGroup('SA', resourceIndex);
  };
  const removeSA = (indexToRemove: number) => {
    const updatedSAs = [...SAs];
    updatedSAs[indexToRemove]['visible'] = false;
    setSAs(updatedSAs);
    removeTagGroup('SA', indexToRemove);
    // If we're executing this on the last item then the length will be 1 until
    // after this function is done executing
    if (SAs.length <= 1) {
      setSAChecked(false);
    }
  };
  const addFA = (
    resourceIndex: number,
    name?: string,
    platform?: SupportedPlatform,
    skuName?: SupportedApplicationSku,
    appInsights?: boolean
  ) => {
    setFAs((prevState) => [
      ...prevState,
      {
        index: resourceIndex,
        comesFromExisting: name ? true : false,
        visible: true,
        name: name ? name : '',
        tags: [],
        platform: platform ? platform : 'DotNet 7',
        skuName: skuName ? skuName : 'B1',
        appInsights: appInsights ? appInsights : true
      }
    ]);
    addTagGroup('FA', resourceIndex);
  };
  const removeFA = (indexToRemove: number) => {
    const updatedFAs = [...FAs];
    updatedFAs[indexToRemove]['visible'] = false;
    setFAs(updatedFAs);
    removeTagGroup('FA', indexToRemove);
    // If we're executing this on the last item then the length will be 1 until
    // after this function is done executing
    if (FAs.length <= 1) {
      setFAChecked(false);
    }
  };
  const addAPS = (
    resourceIndex: number,
    name?: string,
    platform?: SupportedPlatform,
    skuName?: SupportedApplicationSku,
    appInsights?: boolean
  ) => {
    setAPSs((prevState) => [
      ...prevState,
      {
        index: resourceIndex,
        comesFromExisting: name ? true : false,
        visible: true,
        name: name ? name : '',
        tags: [],
        platform: platform ? platform : 'Node 18',
        skuName: skuName ? skuName : 'B1',
        appInsights: appInsights ? appInsights : true
      }
    ]);
    addTagGroup('APS', resourceIndex);
  };
  const removeAPS = (indexToRemove: number) => {
    const updatedAPSs = [...APSs];
    updatedAPSs[indexToRemove]['visible'] = false;
    setAPSs(updatedAPSs);
    removeTagGroup('APS', indexToRemove);
    // If we're executing this on the last item then the length will be 1 until
    // after this function is done executing
    if (APSs.length <= 1) {
      setAPSChecked(false);
    }
  };
  const addPG = (
    resourceIndex: number,
    name?: string,
    databaseNames?: string[],
    firewallRules?: DatabaseFirewallRule[]
  ) => {
    let databaseNameObj: any = {};
    databaseNames?.forEach((dbName, index: number) => {
      databaseNameObj[`PG-${resourceIndex}-dbName-${index}`] = dbName;
    });

    let firewallRulesObj: any = {};
    firewallRules?.forEach((fwRule, index: number) => {
      firewallRulesObj[`PG-${resourceIndex}-fwRule-${index}`] = fwRule;
    });

    setPGs((prevState) => [
      ...prevState,
      {
        index: resourceIndex,
        comesFromExisting: name ? true : false,
        visible: true,
        name: name ? name : '',
        tags: [],
        databaseNames: databaseNames
          ? databaseNameObj
          : { [`PG-${resourceIndex}-dbName-0`]: '' },
        firewallRules: firewallRules
          ? firewallRulesObj
          : {
              [`PG-${resourceIndex}-fwRule-0`]: {
                name: '',
                startIpAddress: '',
                endIpAddress: ''
              }
            }
      }
    ]);
    addTagGroup('PG', resourceIndex);
  };
  const removePG = (indexToRemove: number) => {
    const updatedPGs = [...PGs];
    updatedPGs[indexToRemove]['visible'] = false;
    setPGs(updatedPGs);
    removeTagGroup('APS', indexToRemove);
    // If we're executing this on the last item then the length will be 1 until
    // after this function is done executing
    if (PGs.length <= 1) {
      setPGChecked(false);
    }
  };
  const addDBToPG = (resourceIndex: number) => {
    const updatedPGs = [...PGs];
    const keys = Object.keys(updatedPGs[resourceIndex]['databaseNames']);
    const dbName = '';
    let dbNameIndex = 0;
    if (keys.length > 0) {
      const lastKey = keys[keys.length - 1];
      dbNameIndex = Number(lastKey.split('-')[3]);
    }
    updatedPGs[resourceIndex]['databaseNames'][
      `PG-${resourceIndex}-dbName-${dbNameIndex + 1}`
    ] = dbName;
    setPGs(updatedPGs);
  };
  const removeDBFromPG = (resourceIndex: number, dbNameIndex: number) => {
    const updatedPGs = [...PGs];
    const {
      [`PG-${resourceIndex}-dbName-${dbNameIndex}`]: dbNameToRemove,
      ...rest
    } = {
      ...updatedPGs[resourceIndex]['databaseNames']
    };
    updatedPGs[resourceIndex]['databaseNames'] = rest;
    setPGs(updatedPGs);
  };
  const addFWRuleToPG = (resourceIndex: number) => {
    const updatedPGs = [...PGs];
    const keys = Object.keys(updatedPGs[resourceIndex]['firewallRules']);
    let fwRuleIndex = 0;
    if (keys.length > 0) {
      const lastKey = keys[keys.length - 1];
      fwRuleIndex = Number(lastKey.split('-')[3]);
    }
    updatedPGs[resourceIndex]['firewallRules'][
      `PG-${resourceIndex}-fwRule-${fwRuleIndex + 1}`
    ] = {
      name: '',
      startIpAddress: '',
      endIpAddress: ''
    };
    setPGs(updatedPGs);
  };
  const removeFWRuleFromPG = (resourceIndex: number, fwRuleIndex: number) => {
    const updatedPGs = [...PGs];
    const {
      [`PG-${resourceIndex}-fwRule-${fwRuleIndex}`]: fwRuleToRemove,
      ...rest
    } = {
      ...updatedPGs[resourceIndex]['firewallRules']
    };
    updatedPGs[resourceIndex]['firewallRules'] = rest;
    setPGs(updatedPGs);
  };

  // Generic handlers
  const handleChange = (
    type: SupportedResourceTypes | 'Tag',
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // SA-0-name || SA-0-tagName-0 || SA-0-tagValue-0
    const belongsTo = event.target.id.split('-')[0];
    const index = Number(event.target.id.split('-')[1]);
    const input = event.target.id.split('-')[2];
    const { target } = event;
    const { value } = target;

    if (type === 'SA') {
      const updatedSAs = [...SAs];
      updatedSAs[index]['index'] = index;
      updatedSAs[index]['name'] = value;
      setSAs(updatedSAs);
    }

    if (type === 'FA') {
      const updatedFAs = [...FAs];
      updatedFAs[index]['index'] = index;
      if (input === 'name') {
        updatedFAs[index]['name'] = value;
      } else if (input === 'platform' && isASupportedPlatform(value)) {
        updatedFAs[index]['platform'] = value;
      } else if (input === 'sku' && isASupportedApplicationSku(value)) {
        updatedFAs[index]['skuName'] = value;
      } else if (input === 'monitor') {
        updatedFAs[index]['appInsights'] = !updatedFAs[index]['appInsights'];
      }
      setFAs(updatedFAs);
    }

    if (type === 'APS') {
      const updatedAPSs = [...APSs];
      updatedAPSs[index]['index'] = index;
      if (input === 'name') {
        updatedAPSs[index]['name'] = value;
      } else if (input === 'platform' && isASupportedPlatform(value)) {
        updatedAPSs[index]['platform'] = value;
      } else if (input === 'sku' && isASupportedApplicationSku(value)) {
        updatedAPSs[index]['skuName'] = value;
      } else if (input === 'monitor') {
        updatedAPSs[index]['appInsights'] = !updatedAPSs[index]['appInsights'];
      }
      setAPSs(updatedAPSs);
    }

    if (type === 'PG') {
      const updatedPGs = [...PGs];
      updatedPGs[index]['index'] = index;
      if (input === 'name') {
        updatedPGs[index]['name'] = value;
      } else if (input === 'dbName') {
        const dbNameIndex = Number(event.target.id.split('-')[3]);
        updatedPGs[index]['databaseNames'][
          `PG-${index}-dbName-${dbNameIndex}`
        ] = event.target.value;
      } else if (input === 'fwRule') {
        const fwRuleIndex = Number(event.target.id.split('-')[3]);
        const ruleProperty = event.target.id.split('-')[4];
        if (ruleProperty === 'name') {
          updatedPGs[index]['firewallRules'][
            `PG-${index}-fwRule-${fwRuleIndex}`
          ].name = event.target.value;
        } else if (ruleProperty === 'startIP') {
          updatedPGs[index]['firewallRules'][
            `PG-${index}-fwRule-${fwRuleIndex}`
          ].startIpAddress = event.target.value;
        } else if (ruleProperty === 'endIP') {
          updatedPGs[index]['firewallRules'][
            `PG-${index}-fwRule-${fwRuleIndex}`
          ].endIpAddress = event.target.value;
        }
      }
      setPGs(updatedPGs);
    }

    if (type === 'Tag') {
      const tagIndex = Number(event.target.id.split('-')[3]);
      const updatedTagList = tags[`${belongsTo}-${index}`].tagList; // [{name:'', value:''}, ...]
      if (input === 'tagName') {
        updatedTagList[tagIndex]['name'] = event.target.value;
      } else if (input === 'tagValue') {
        updatedTagList[tagIndex]['value'] = event.target.value;
      }

      setTags((prevState: any) => ({
        ...prevState,
        [`${belongsTo}-${index}`]: {
          comesFromExisting: false,
          tagList: updatedTagList
        }
      }));
    }
  };
  const handleCheck = (type: SupportedResourceTypes) => {
    if (type === 'SA') {
      if (!SAChecked) {
        setSAChecked(true);
        addSA(0);
      } else {
        setSAChecked(false);
        setSAs([]);
        removeTagGroup('SA', 0, true);
      }
    }

    if (type === 'FA') {
      if (!FAChecked) {
        setFAChecked(true);
        addFA(0);
      } else if (FAChecked) {
        setFAChecked(false);
        setFAs([]);
        removeTagGroup('FA', 0, true);
      }
    }

    if (type === 'APS') {
      if (!APSChecked) {
        setAPSChecked(true);
        addAPS(0);
      } else if (APSChecked) {
        setAPSChecked(false);
        setAPSs([]);
        removeTagGroup('APS', 0, true);
      }
    }

    if (type === 'PG') {
      if (!PGChecked) {
        setPGChecked(true);
        addPG(0);
      } else if (PGChecked) {
        setPGChecked(false);
        setPGs([]);
        removeTagGroup('PG', 0, true);
      }
    }
  };
  const clearInputs = () => {
    setOperation('');
    setOperationSelected(false);
    setExistingTemplate('');
    setCloudProvider('Azure');
    setSAChecked(false);
    setSAs([]);
    setFAChecked(false);
    setFAs([]);
    setAPSChecked(false);
    setAPSs([]);
    setPGChecked(false);
    setPGs([]);
    setTags({
      [`ALL-0`]: {
        comesFromExisting: false,
        tagList: [{ ...emptyTag }]
      }
    });
  };
  const submitForm = (event: React.MouseEvent<HTMLButtonElement>) => {
    // We don't want the enter key to submit our form
    event.preventDefault();

    // Call factory to define resources
    const response = defineResources({ tags, SAs, FAs, APSs, PGs });
    setContents(response);
    toggleModal();

    clearInputs();
  };
  const submitExistingTemplate = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    // We don't want the enter key to submit our form
    event.preventDefault();

    const templateJSON = JSON.parse(existingTemplate);
    const resources = templateJSON.resources;
    let SAcounter = 0;
    let FAcounter = 0;
    let APScounter = 0;
    let PGcounter = 0;
    let platform: SupportedPlatform = 'DotNet 7';
    let sku: SupportedApplicationSku = 'B1';
    let appInsights = false;
    let databaseNames: string[] = [];
    let fwRules: DatabaseFirewallRule[] = [];
    let tagsObject: ResourceTagGroups = {
      [`ALL-0`]: {
        comesFromExisting: false,
        tagList: [{ ...emptyTag }]
      }
    };

    function handleApplicationSubResources(resource: any) {
      if (resource.properties.siteConfig.linuxFxVersion === 'DOTNETCORE|7.0') {
        platform = 'DotNet 7';
      } else if (
        resource.properties.siteConfig.linuxFxVersion === 'DOTNET|6.0' ||
        'DOTNETCORE|6.0'
      ) {
        platform = 'DotNet 6';
      } else if (
        resource.properties.siteConfig.linuxFxVersion === 'NODE|18-lts'
      ) {
        platform = 'Node 18';
      } else if (
        resource.properties.siteConfig.linuxFxVersion === 'NODE|16-lts'
      ) {
        platform = 'Node 16';
      } else if (
        resource.properties.siteConfig.linuxFxVersion === 'PYTHON|3.9'
      ) {
        platform = 'Python 3.9';
      } else if (
        resource.properties.siteConfig.linuxFxVersion === 'PYTHON|3.8'
      ) {
        platform = 'Python 3.8';
      }

      // Loop again and find the associated 'serverfarms' type
      resources.forEach((subResource: any) => {
        if (
          subResource.type === 'Microsoft.Web/serverfarms' &&
          subResource.name === resource.name
        ) {
          sku = subResource.sku;
        }

        if (
          subResource.type === 'Microsoft.Insights/components' &&
          subResource.name === resource.name
        ) {
          appInsights = true;
        }
      });
    }

    resources.forEach((resource: any) => {
      if (resource.type === 'Microsoft.Storage/storageAccounts') {
        setSAChecked(true);
        addSA(SAcounter, resource.name);

        if (resource.tags) {
          let tagList: any = [];
          for (const [key, value] of Object.entries(resource.tags)) {
            tagList.push({ name: key, value: value });
          }
          tagsObject[`SA-${SAcounter}`] = {
            comesFromExisting: true,
            tagList
          };
        } else {
          tagsObject[`SA-${SAcounter}`] = {
            comesFromExisting: false,
            tagList: [{ ...emptyTag }]
          };
        }

        SAcounter++;
      } else if (
        resource.type === 'Microsoft.Web/sites' &&
        resource.kind === 'functionapp,linux'
      ) {
        setFAChecked(true);
        handleApplicationSubResources(resource);
        addFA(FAcounter, resource.name, platform, sku, appInsights);

        if (resource.tags) {
          let tagList: any = [];
          for (const [key, value] of Object.entries(resource.tags)) {
            tagList.push({ name: key, value: value });
          }
          tagsObject[`FA-${FAcounter}`] = {
            comesFromExisting: true,
            tagList
          };
        } else {
          tagsObject[`FA-${FAcounter}`] = {
            comesFromExisting: false,
            tagList: [{ ...emptyTag }]
          };
        }

        FAcounter++;
      } else if (
        resource.type === 'Microsoft.Web/sites' &&
        resource.kind === 'app,linux'
      ) {
        setAPSChecked(true);
        handleApplicationSubResources(resource);
        addAPS(APScounter, resource.name, platform, sku, appInsights);

        if (resource.tags) {
          let tagList: any = [];
          for (const [key, value] of Object.entries(resource.tags)) {
            tagList.push({ name: key, value: value });
          }
          tagsObject[`APS-${APScounter}`] = {
            comesFromExisting: true,
            tagList
          };
        } else {
          tagsObject[`APS-${APScounter}`] = {
            comesFromExisting: false,
            tagList: [{ ...emptyTag }]
          };
        }

        APScounter++;
      } else if (
        resource.type === 'Microsoft.DBforPostgreSQL/flexibleServers'
      ) {
        setPGChecked(true);
        // Loop again and find the associated 'serverfarms' type
        resources.forEach((subResource: any) => {
          if (
            subResource.type ===
            'Microsoft.DBforPostgreSQL/flexibleServers/databases'
          ) {
            const found = subResource.name
              .match(/\('(.*)'\)/)[1]
              .split("', '/");
            const foundResourceName = found[0];
            // Only add a DB if it should belong to *this* PG instance
            if (foundResourceName === resource.name) {
              const dbName = found[1];
              databaseNames.push(dbName);
            }
          } else if (
            subResource.type ===
            'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules'
          ) {
            const found = subResource.name
              .match(/\('(.*)'\)/)[1]
              .split("', '/");
            const foundResourceName = found[0];
            // Only add a firewall rule if it should belong to *this* PG instance
            if (foundResourceName === resource.name) {
              const fwRuleName = found[1];
              const fwRuleObj: DatabaseFirewallRule = {
                name: fwRuleName,
                startIpAddress: subResource.properties.startIpAddress,
                endIpAddress: subResource.properties.endIpAddress
              };
              fwRules.push(fwRuleObj);
            }
          }
        });
        addPG(PGcounter, resource.name, databaseNames, fwRules);

        if (resource.tags) {
          let tagList: any = [];
          for (const [key, value] of Object.entries(resource.tags)) {
            tagList.push({ name: key, value: value });
          }
          tagsObject[`PG-${PGcounter}`] = {
            comesFromExisting: true,
            tagList
          };
        } else {
          tagsObject[`PG-${PGcounter}`] = {
            comesFromExisting: false,
            tagList: [{ ...emptyTag }]
          };
        }

        PGcounter++;
      }
    });

    setTags(tagsObject);
    setOperation('new');
  };

  if (operation === 'new') {
    return (
      <div style={{ paddingTop: 50, paddingLeft: 30, paddingBottom: 30 }}>
        <Form>
          <Row>
            <h2>Metadata</h2>
            <br />
            <hr></hr>
          </Row>

          <Row>
            <Row>
              <Col>
                <FormGroup>
                  <Label className="h4">
                    <span style={{ color: 'red' }}>*</span> Cloud provider
                  </Label>
                  <Input
                    name="cloudProvider"
                    type="select"
                    style={{ width: 300 }}
                    value={cloudProvider}
                    onChange={(event) => setCloudProvider(event.target.value)}
                  >
                    <option>Azure</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col>
                <Row>
                  <FormGroup>
                    <Row>
                      <Label className="h4">Resource tags</Label>
                    </Row>
                    <ResourceTagInputs
                      resourceType="ALL"
                      resourceIndex={0}
                      resourceTagGroups={tags}
                      addTagToGroup={addTagToGroup}
                      removeTagFromGroup={removeTagFromGroup}
                      handleChange={handleChange}
                    />
                  </FormGroup>
                </Row>
              </Col>
            </Row>
          </Row>

          <Row>
            <h2>Resources</h2>
            <hr></hr>
            <br />
          </Row>

          <Row>
            <Row>
              <FormGroup>
                <Input
                  type="checkbox"
                  onChange={() => handleCheck('SA')}
                  checked={SAChecked}
                />{' '}
                <Label check className="h4">
                  Do you need a Storage Account?
                </Label>
              </FormGroup>
            </Row>
            <ResourceInputs
              resourceType="SA"
              resourceNeeded={SAChecked}
              toggleResourceNeeded={handleCheck}
              resourceList={SAs}
              handleChange={handleChange}
              addResource={addSA}
              removeResource={removeSA}
              resourceTagGroups={tags}
              addTagToGroup={addTagToGroup}
              removeTagFromGroup={removeTagFromGroup}
            />
          </Row>

          <Row>
            <Row>
              <FormGroup>
                <Input
                  type="checkbox"
                  onChange={() => handleCheck('FA')}
                  checked={FAChecked}
                />{' '}
                <Label check className="h4">
                  Do you need a Function App?
                </Label>
              </FormGroup>
            </Row>
            <ResourceInputs
              resourceType="FA"
              resourceNeeded={FAChecked}
              toggleResourceNeeded={handleCheck}
              resourceList={FAs}
              handleChange={handleChange}
              addResource={addFA}
              removeResource={removeFA}
              resourceTagGroups={tags}
              addTagToGroup={addTagToGroup}
              removeTagFromGroup={removeTagFromGroup}
            />
          </Row>

          <Row>
            <Row>
              <FormGroup>
                <Input
                  type="checkbox"
                  onChange={() => handleCheck('APS')}
                  checked={APSChecked}
                />{' '}
                <Label check className="h4">
                  Do you need an App Service?
                </Label>
              </FormGroup>
            </Row>
            <ResourceInputs
              resourceType="APS"
              resourceNeeded={APSChecked}
              toggleResourceNeeded={handleCheck}
              resourceList={APSs}
              handleChange={handleChange}
              addResource={addAPS}
              removeResource={removeAPS}
              resourceTagGroups={tags}
              addTagToGroup={addTagToGroup}
              removeTagFromGroup={removeTagFromGroup}
            />
          </Row>

          <Row>
            <Row>
              <FormGroup>
                <Input
                  type="checkbox"
                  onChange={() => handleCheck('PG')}
                  checked={PGChecked}
                />{' '}
                <Label check className="h4">
                  Do you need a PostgreSQL instance?
                </Label>
              </FormGroup>
            </Row>
            <ResourceInputs
              resourceType="PG"
              resourceNeeded={PGChecked}
              toggleResourceNeeded={handleCheck}
              resourceList={PGs}
              handleChange={handleChange}
              addResource={addPG}
              removeResource={removePG}
              resourceTagGroups={tags}
              addTagToGroup={addTagToGroup}
              removeTagFromGroup={removeTagFromGroup}
              addDBToPG={addDBToPG}
              removeDBFromPG={removeDBFromPG}
              addFWRuleToPG={addFWRuleToPG}
              removeFWRuleFromPG={removeFWRuleFromPG}
            />
          </Row>
        </Form>
        <br />
        <CustomButton
          color="primary"
          // Create a little spacing between the two buttons
          className="me-2"
          onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
            submitForm(event)
          }
        >
          Submit
        </CustomButton>
        <CustomButton color="secondary" onClick={clearInputs}>
          Start over
        </CustomButton>
      </div>
    );
  } else if (operation === 'existing') {
    return (
      <div style={{ paddingTop: 50, paddingLeft: 30, paddingBottom: 30 }}>
        <Form>
          <FormGroup>
            <Label className="h4">
              <span style={{ color: 'red' }}>*</span> Template JSON
            </Label>
            <p style={{ fontSize: 15 }}>
              <em>
                Only templates generated via this application are supported
              </em>
            </p>
            <Input
              style={{ height: 200 }}
              name="templateJSON"
              type="textarea"
              value={existingTemplate}
              onChange={(event) => setExistingTemplate(event.target.value)}
            />
          </FormGroup>
        </Form>
        <br />
        <CustomButton
          color="primary"
          // Create a little spacing between the two buttons
          className="me-2"
          onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
            submitExistingTemplate(event)
          }
        >
          Submit
        </CustomButton>
        <CustomButton color="secondary" onClick={clearInputs}>
          Start over
        </CustomButton>
      </div>
    );
  } else {
    return null;
  }
};
