import React, { useState } from 'react';
import { Alert, Row, Col, Form, FormGroup, Input, Label } from 'reactstrap';

import { CustomButton } from '../components/genericHOCs/CustomButton';
import { Tag, ResourceTagGroups, emptyTag } from '../types/Tag';
import {
  SupportedResourceTypes,
  StorageAccount,
  Application,
  Database
} from '../types/Resources';
import { ResourceInputs } from '../components/newTemplate/ResourceInputs';
import { ResourceTagInputs } from '../components/newTemplate/ResourceTagInputs';

// This component handles all state for the form
// Reusable componentry exists in stateless form in ../components/newTemplate
// https://itnext.io/how-to-build-a-dynamic-controlled-form-with-react-hooks-2019-b39840f75c4f
export const NewTemplatePage: React.FC = () => {
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
    [`ALL-0`]: [{ ...emptyTag }]
  });

  // Resource tag handlers
  const addTagGroup = (type: SupportedResourceTypes, resourceIndex: number) => {
    setTags((prevState: any) => ({
      ...prevState,
      [`${type}-${resourceIndex}`]: [{ ...emptyTag }]
    }));
  };
  const addTagToGroup = (
    type: SupportedResourceTypes,
    resourceIndex: number
  ) => {
    const group = `${type}-${resourceIndex}`;
    const updatedTagList = tags[group];
    updatedTagList.push({ ...emptyTag });
    setTags((prevState: any) => ({
      ...prevState,
      [`${group}`]: updatedTagList
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
    const tagList = tags[group];
    const updatedTagList = tagList.filter(
      (tag: Tag, index: number) => index !== indexToRemove
    );
    setTags((prevState: any) => ({
      ...prevState,
      [`${group}`]: updatedTagList
    }));
  };

  // Resource handlers for each type
  const addSA = (resourceIndex: number) => {
    setSAs([
      ...SAs,
      {
        index: resourceIndex,
        visible: true,
        name: '',
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
  const addFA = (resourceIndex: number) => {
    setFAs([
      ...FAs,
      {
        index: resourceIndex,
        visible: true,
        name: '',
        tags: [],
        platform: 'DotNet 7',
        skuName: 'B1',
        appInsights: true
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
  const addAPS = (resourceIndex: number) => {
    setAPSs([
      ...APSs,
      {
        index: resourceIndex,
        visible: true,
        name: '',
        tags: [],
        platform: 'Node 18',
        skuName: 'B1',
        appInsights: true
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
  const addPG = (resourceIndex: number) => {
    setPGs([
      ...PGs,
      {
        index: resourceIndex,
        visible: true,
        name: '',
        tags: [],
        databaseNames: { [`PG-${resourceIndex}-dbName-0`]: '' },
        firewallRules: {
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
    let dbNameIndex = 0;
    if (keys.length > 0) {
      const lastKey = keys[keys.length - 1];
      dbNameIndex = Number(lastKey.split('-')[3]);
    }
    updatedPGs[resourceIndex]['databaseNames'][
      `PG-${resourceIndex}-dbName-${dbNameIndex + 1}`
    ] = '';
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
      } else if (input === 'platform') {
        updatedFAs[index]['platform'] = value;
      } else if (input === 'sku') {
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
      } else if (input === 'platform') {
        updatedAPSs[index]['platform'] = value;
      } else if (input === 'sku') {
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
      const updatedTagList = tags[`${belongsTo}-${index}`]; // [{name:'', value:''}, ...]
      if (input === 'tagName') {
        updatedTagList[tagIndex]['name'] = event.target.value;
      } else if (input === 'tagValue') {
        updatedTagList[tagIndex]['value'] = event.target.value;
      }

      setTags((prevState: any) => ({
        ...prevState,
        [`${belongsTo}-${index}`]: updatedTagList
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
    setCloudProvider('Azure');
    setSAChecked(false);
    setSAs([]);
    setFAChecked(false);
    setFAs([]);
    setAPSChecked(false);
    setAPSs([]);
    setPGChecked(false);
    setPGs([]);
    setTags({ [`ALL-0`]: [{ ...emptyTag }] });
  };
  const submitForm = (event: React.MouseEvent<HTMLButtonElement>) => {
    // We don't want the enter key to submit our form
    event.preventDefault();
    let resourceType = '';
    let tagIndex = 0;

    for (const [key, value] of Object.entries(tags)) {
      resourceType = key.split('-')[0]; //SA
      tagIndex = Number(key.split('-')[1]); //0

      if (resourceType === 'SA') {
        SAs.forEach((SA: StorageAccount, index: number) => {
          if (index === tagIndex) {
            value.forEach((tag: Tag) => {
              SA.tags.push(tag);
            });
          }
        });
      }

      if (resourceType === 'FA') {
        FAs.forEach((FA: Application, index: number) => {
          if (index === tagIndex) {
            value.forEach((tag: Tag) => {
              FA.tags.push(tag);
            });
          }
        });
      }

      if (resourceType === 'APS') {
        APSs.forEach((APS: Application, index: number) => {
          if (index === tagIndex) {
            value.forEach((tag: Tag) => {
              APS.tags.push(tag);
            });
          }
        });
      }

      if (resourceType === 'PG') {
        PGs.forEach((PG: Database, index: number) => {
          if (index === tagIndex) {
            value.forEach((tag: Tag) => {
              PG.tags.push(tag);
            });
          }
        });
      }

      if (resourceType === 'ALL') {
        SAs.forEach((SA: StorageAccount) => {
          value.forEach((tag: Tag) => {
            SA.tags.push(tag);
          });
        });

        FAs.forEach((FA: Application) => {
          value.forEach((tag: Tag) => {
            FA.tags.push(tag);
          });
        });

        APSs.forEach((APS: Application) => {
          value.forEach((tag: Tag) => {
            APS.tags.push(tag);
          });
        });

        PGs.forEach((PG: Database) => {
          value.forEach((tag: Tag) => {
            PG.tags.push(tag);
          });
        });
      }
    }

    // Call factory to define resources

    clearInputs();
  };

  return (
    <div>
      <Alert
        color="secondary"
        isOpen={true}
        style={{
          marginTop: 50,
          margin: 'auto',
          width: '90%',
          fontSize: 22
        }}
      >
        <br />
        <h1 className="text-center">Create a new resources template</h1>
        <h4 className="text-center">
          Use this form to create a new template of cloud resources
        </h4>
        <br />
        <div style={{ paddingLeft: 30, paddingBottom: 30 }}>
          <Form>
            <Row>
              <h2>Metadata</h2>
              <hr></hr>
              <br />
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
          <CustomButton color="secondary">Clear form inputs</CustomButton>
        </div>
      </Alert>
    </div>
  );
};
