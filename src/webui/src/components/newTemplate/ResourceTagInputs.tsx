import { Row, Col, ButtonGroup, Input } from 'reactstrap';

import { SupportedResourceTypes } from '../../types/Resources';
import { CustomButton } from '../genericHOCs/CustomButton';
import { Tag, ResourceTagGroups, emptyTag } from '../../types/Tag';

interface ResourceTagsProps {
  resourceType: SupportedResourceTypes;
  resourceIndex: number;
  resourceTagGroups: ResourceTagGroups;
  handleChange: Function;
  addTagToGroup: Function;
  removeTagFromGroup: Function;
}

export const ResourceTagInputs: React.FC<ResourceTagsProps> = ({
  resourceType,
  resourceIndex,
  resourceTagGroups,
  handleChange,
  addTagToGroup,
  removeTagFromGroup
}) => {
  // {SA-0: [{name: '', value:''}, ...], SA-1: [{name: '', value:''}, ...]}
  const tagGroupKey = `${resourceType}-${resourceIndex}`;
  const tagGroupList: Tag[] = resourceTagGroups[`${tagGroupKey}`];
  if (tagGroupList?.length === 0) {
    tagGroupList.push({ ...emptyTag });
  }
  return (
    <div>
      {tagGroupList?.map((obj: any, tagIndex: number) => (
        <Row key={`${resourceType}-${resourceIndex}-tagName-${tagIndex}`}>
          <Col>
            <Input
              id={`${resourceType}-${resourceIndex}-tagName-${tagIndex}`}
              name={`${resourceType}-${resourceIndex}-tagName-${tagIndex}`}
              type="text"
              placeholder="Enter a tag name..."
              value={tagGroupList[tagIndex].name}
              onChange={(event) => handleChange('Tag', event)}
            />
          </Col>
          <Col>
            <Input
              id={`${resourceType}-${resourceIndex}-tagValue-${tagIndex}`}
              name={`${resourceType}-${resourceIndex}-tagValue-${tagIndex}`}
              type="text"
              placeholder="Enter a tag value..."
              value={tagGroupList[tagIndex].value}
              onChange={(event) => handleChange('Tag', event)}
            />
          </Col>
          <Col>
            <CustomButton
              color="primary"
              outline
              onClick={() =>
                removeTagFromGroup(resourceType, resourceIndex, tagIndex)
              }
            >
              -
            </CustomButton>
          </Col>
        </Row>
      ))}
      <CustomButton
        color="primary"
        outline
        disabled={
          true
            ? tagGroupList[tagGroupList.length - 1].name === '' ||
              tagGroupList[tagGroupList.length - 1].value === ''
            : false
        }
        onClick={() => addTagToGroup(resourceType, resourceIndex)}
      >
        +
      </CustomButton>
    </div>
  );
};
