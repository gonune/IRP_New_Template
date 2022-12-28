import { Row, Col, FormGroup, Input, Label } from 'reactstrap';

import { CustomButton } from '../genericHOCs/CustomButton';
import { ResourceTagGroups } from '../../types/Tag';
import {
  SupportedResourceTypes,
  StorageAccount,
  Application
} from '../../types/Resources';
import { ResourceTagInputs } from './ResourceTagInputs';
import { ApplicationInputs } from './ApplicationInputs';
import { DatabaseInputs } from './DatabaseInputs';

interface ResourceInputsProps {
  resourceType: SupportedResourceTypes;
  resourceNeeded: boolean;
  toggleResourceNeeded: Function;
  resourceList: StorageAccount[] | Application[];
  handleChange: Function;
  addResource: Function;
  removeResource: Function;
  resourceTagGroups: ResourceTagGroups;
  addTagToGroup: Function;
  removeTagFromGroup: Function;
  addDBToPG?: Function;
  removeDBFromPG?: Function;
  addFWRuleToPG?: Function;
  removeFWRuleFromPG?: Function;
}

export const ResourceInputs: React.FC<ResourceInputsProps> = ({
  resourceType,
  resourceNeeded,
  toggleResourceNeeded,
  resourceList,
  handleChange,
  addResource,
  removeResource,
  resourceTagGroups,
  addTagToGroup,
  removeTagFromGroup,
  addDBToPG,
  removeDBFromPG,
  addFWRuleToPG,
  removeFWRuleFromPG
}) => {
  type Resource = typeof resourceList[0];

  let visibleResourceList = resourceList.filter(
    (resource: Resource, index: number) => resource.visible === true
  );

  let lastVisibleIndex = resourceList
    .map((resource) => resource.visible)
    .lastIndexOf(true);

  if (!resourceNeeded) {
    return null;
  }

  return (
    <div>
      {resourceList.map((obj: Resource, index: number) => {
        if (resourceList[index]['visible'] === false) {
          return null;
        } else {
          return (
            <Row key={`${resourceType}-${index}`}>
              <Col>
                <FormGroup>
                  <Label className="h5">
                    <span style={{ color: 'red' }}>*</span> Name
                  </Label>
                  <Input
                    id={`${resourceType}-${index}-name`}
                    name={`${resourceType}-${index}-name`}
                    type="text"
                    placeholder="Enter a name..."
                    value={resourceList[index].name}
                    onChange={(event) => handleChange(resourceType, event)}
                  />
                </FormGroup>
              </Col>
              <Col>
                <Row>
                  <FormGroup>
                    <Row>
                      <Label className="h5">
                        Additional tags for this resource
                      </Label>
                    </Row>
                    <ResourceTagInputs
                      resourceType={resourceType}
                      resourceIndex={index}
                      resourceTagGroups={resourceTagGroups}
                      handleChange={handleChange}
                      addTagToGroup={addTagToGroup}
                      removeTagFromGroup={removeTagFromGroup}
                    />
                  </FormGroup>
                </Row>
              </Col>
              <ApplicationInputs
                resourceType={resourceType}
                resourceList={resourceList}
                resourceIndex={index}
                handleChange={handleChange}
              />
              <DatabaseInputs
                resourceType={resourceType}
                resourceList={resourceList}
                resourceIndex={index}
                handleChange={handleChange}
                addDBToPG={addDBToPG}
                removeDBFromPG={removeDBFromPG}
                addFWRuleToPG={addFWRuleToPG}
                removeFWRuleFromPG={removeFWRuleFromPG}
              />
              <div className="text-center mt-4 mb-4">
                <CustomButton
                  id={`${resourceType}-${index}-addResourceBtn`}
                  color="primary"
                  onClick={() => addResource(resourceList.length)}
                  className="me-2"
                  disabled={
                    lastVisibleIndex === index &&
                    resourceList[index].name !== ''
                      ? false
                      : true
                  }
                >
                  + Add another
                </CustomButton>
                <CustomButton
                  id={`${resourceType}-${index}-removeResourceBtn`}
                  color="secondary"
                  onClick={() => {
                    removeResource(index);
                    // At the time this runs there will be one left in the list,
                    // the one we're removing, so we need to uncheck the resource's box
                    if (visibleResourceList.length === 1) {
                      toggleResourceNeeded(resourceType);
                    }
                  }}
                >
                  - Remove this resource
                </CustomButton>
              </div>
            </Row>
          );
        }
      })}
    </div>
  );
};
