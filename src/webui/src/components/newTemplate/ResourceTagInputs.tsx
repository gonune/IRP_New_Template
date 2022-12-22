import { Row, Col, ButtonGroup, Input } from 'reactstrap';

import { SupportedResourceTypes } from '../../types/Supported';
import { CustomButton } from '../genericHOCs/CustomButton';
import { Tag, ResourceTagGroups, emptyTag } from '../../types/Tag';

interface ResourceTagsProps {
  resource: SupportedResourceTypes;
  resourceIndex: number;
  resourceTagGroups: ResourceTagGroups;
  handleChange: Function;
  addTagToGroup: Function;
  removeTagFromGroup: Function;
}

export const ResourceTagInputs: React.FC<ResourceTagsProps> = ({
  resource,
  resourceIndex,
  resourceTagGroups,
  handleChange,
  addTagToGroup,
  removeTagFromGroup
}) => {
  // {SA-0: [{name: '', value:''}, ...], SA-1: [{name: '', value:''}, ...]}
  const tagGroupKey = `${resource}-${resourceIndex}`;
  const tagGroupList: Tag[] = resourceTagGroups[`${tagGroupKey}`];
  if (tagGroupList?.length === 0) {
    tagGroupList.push({ ...emptyTag });
  }
  return (
    <div>
      {tagGroupList?.map((obj: any, tagIndex: number) => (
        <Row key={`${resource}-${resourceIndex}-tagName-${tagIndex}`}>
          <Col>
            <Input
              id={`${resource}-${resourceIndex}-tagName-${tagIndex}`}
              name={`${resource}-${resourceIndex}-tagName-${tagIndex}`}
              type="text"
              placeholder="Enter a tag name..."
              value={tagGroupList[tagIndex].name}
              onChange={(event) => handleChange('Tag', event)}
            />
          </Col>
          <Col>
            <Input
              id={`${resource}-${resourceIndex}-tagValue-${tagIndex}`}
              name={`${resource}-${resourceIndex}-tagValue-${tagIndex}`}
              type="text"
              placeholder="Enter a tag value..."
              value={tagGroupList[tagIndex].value}
              onChange={(event) => handleChange('Tag', event)}
            />
          </Col>
          <Col>
            <ButtonGroup>
              <CustomButton
                color="primary"
                outline
                onClick={() => addTagToGroup(resource, resourceIndex)}
              >
                + Another set
              </CustomButton>
              <CustomButton
                color="primary"
                outline
                onClick={() =>
                  removeTagFromGroup(resource, resourceIndex, tagIndex)
                }
              >
                - This set
              </CustomButton>
            </ButtonGroup>
          </Col>
        </Row>
      ))}
    </div>
  );
};
