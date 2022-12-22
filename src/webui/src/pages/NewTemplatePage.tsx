import React, { useState } from 'react';
import {
  Alert,
  Row,
  Col,
  ButtonGroup,
  Form,
  FormGroup,
  Input,
  Label
} from 'reactstrap';

import { CustomButton } from '../components/genericHOCs/CustomButton';
import {
  SupportedCloudProviders,
  SupportedResourceTypes
} from '../types/Supported';
import { Tag, ResourceTagGroups, emptyTag } from '../types/Tag';
import { StorageAccount } from '../types/StorageAccount';
import { ResourceInputs } from '../components/newTemplate/ResourceInputs';

// This component handles all state for the form
// Reusable componentry exists in stateless form in ../components/newTemplate
// https://itnext.io/how-to-build-a-dynamic-controlled-form-with-react-hooks-2019-b39840f75c4f
export const NewTemplatePage: React.FC = () => {
  const [cloudProvider, setCloudProvider] =
    useState<SupportedCloudProviders>('Azure');

  // What resource types are requested for progressive disclosure
  const [SAChecked, setSAChecked] = useState(false);

  // The input values for each resource type
  const [SAs, setSAs] = useState<StorageAccount[]>([]);

  // List of tags keyed by which resource they belong to
  // {SA-0: [{name: '', value:''}, ...], SA-1: [{name: '', value:''}, ...]}
  const [tags, setTags] = useState<ResourceTagGroups>({});

  //console.log(SAs);
  //console.log(tags);

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
    resourceIndex: number
  ) => {
    const { [`${type}-${resourceIndex}`]: group, ...rest } = { ...tags };
    setTags((prevState: any) => rest);
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
    //setSAs([...SAs.filter((_: any, index: any) => index !== indexToRemove)]);
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

  // Generic handlers
  const handleChange = (
    type: SupportedResourceTypes | 'Tag',
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // SA-0-name || SA-0-tagName-0 || SA-0-tagValue-0
    const index = Number(event.target.id.split('-')[1]);
    const property = event.target.id.split('-')[2];

    if (type === 'SA') {
      const updatedSAs = [...SAs];
      updatedSAs[index]['index'] = index;
      updatedSAs[index]['name'] = event.target.value;
      setSAs(updatedSAs);
    }

    if (type === 'Tag') {
      const belongsTo = event.target.id.split('-')[0];
      const tagIndex = Number(event.target.id.split('-')[3]);
      const updatedTagList = tags[`${belongsTo}-${index}`]; // [{name:'', value:''}, ...]
      if (property === 'tagName') {
        updatedTagList[tagIndex]['name'] = event.target.value;
      } else if (property === 'tagValue') {
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
        setTags({});
      }
    }
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
                      // onChange={(event) => handleInputChange(event)}
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
                      <Row>
                        <Col>
                          <Input
                            id="tagName1"
                            name="tagName1"
                            placeholder="Enter tag name..."
                          />
                        </Col>
                        <Col>
                          <Input
                            id="tagValue1"
                            name="tagValue1"
                            placeholder="Enter a tag value..."
                          />
                        </Col>
                        <Col>
                          <ButtonGroup>
                            <CustomButton color="primary" outline>
                              + Another set
                            </CustomButton>
                            <CustomButton color="primary" outline>
                              - This set
                            </CustomButton>
                          </ButtonGroup>
                        </Col>
                      </Row>
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
                <Row>
                  <FormGroup>
                    <Input type="checkbox" />{' '}
                    <Label check className="h4">
                      Do you need a Function App?
                    </Label>
                  </FormGroup>
                </Row>
                {/* row for inputs */}
                {/* div for add another*/}
              </Row>
            </Row>

            <Row>
              <Row>
                <Row>
                  <FormGroup>
                    <Input type="checkbox" />{' '}
                    <Label check className="h4">
                      Do you need an App Service?
                    </Label>
                  </FormGroup>
                </Row>
                {/* row for inputs */}
                {/* div for add another*/}
              </Row>
            </Row>

            <Row>
              <Row>
                <Row>
                  <FormGroup>
                    <Input type="checkbox" />{' '}
                    <Label check className="h4">
                      Do you need a PostgreSQL Instance?
                    </Label>
                  </FormGroup>
                </Row>
                {/* row for inputs */}
                {/* div for add another*/}
              </Row>
            </Row>
          </Form>
          <br />
          <CustomButton
            color="primary"
            // Create a little spacing between the two buttons
            className="me-2"
            // onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
            //   submitForm(event)
            // }
          >
            Submit
          </CustomButton>
          <CustomButton color="secondary">Clear form inputs</CustomButton>
        </div>
      </Alert>
    </div>
  );
};
