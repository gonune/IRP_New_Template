import { Row, Col, FormGroup, Input, Label } from 'reactstrap';

import { SupportedResourceTypes, Application } from '../../types/Resources';

interface ApplicationInputsProps {
  resourceType: SupportedResourceTypes;
  resourceList: any; // HACK
  resourceIndex: number;
  handleChange: Function;
}

export const ApplicationInputs: React.FC<ApplicationInputsProps> = ({
  resourceType,
  resourceList,
  resourceIndex,
  handleChange
}) => {
  if (resourceType !== 'FA' || 'APS') {
    return null;
  } else {
    return (
      <Row>
        <Col>
          <FormGroup>
            <Label className="h5">
              <span style={{ color: 'red' }}>*</span> Platform
            </Label>
            <Input
              id={`${resourceType}-${resourceIndex}-platform`}
              name={`${resourceType}-${resourceIndex}-platform`}
              type="select"
              placeholder="Choose a platform..."
              value={resourceList[resourceIndex].platform}
              onChange={(event) => handleChange(resourceType, event)}
            >
              <option>DotNet 7</option>
              <option>DotNet 6</option>
              <option>Node 18</option>
              <option>Node 16</option>
              <option>Python 3.9</option>
              <option>Python 3.8</option>
            </Input>
          </FormGroup>
        </Col>
        <Col>
          <FormGroup>
            <Label className="h5">
              <span style={{ color: 'red' }}>*</span> SKU
            </Label>
            <Input
              id={`${resourceType}-${resourceIndex}-sku`}
              name={`${resourceType}-${resourceIndex}-sku`}
              type="select"
              placeholder="Choose a SKU..."
              value={resourceList[resourceIndex].skuName}
              onChange={(event) => handleChange(resourceType, event)}
            >
              <option>B1</option>
              <option>B2</option>
              <option>B3</option>
              <option>S1</option>
              <option>S2</option>
              <option>S3</option>
              <option>P1V2</option>
              <option>P2V2</option>
              <option>P3V2</option>
              <option>P1V3</option>
              <option>P2V3</option>
              <option>P3V3</option>
            </Input>
          </FormGroup>
        </Col>
        <Col>
          <FormGroup>
            <br />
            <Input
              id={`${resourceType}-${resourceIndex}-monitor`}
              name={`${resourceType}-${resourceIndex}-monitor`}
              type="checkbox"
              onChange={(event) => handleChange(resourceType, event)}
              checked={resourceList[resourceIndex].appInsights ? true : false}
              className={'mt-3 ms-3 me-1'}
            />
            <Label className="h5 mt-3">
              Include monitoring<span style={{ color: 'red' }}>*</span>
            </Label>
          </FormGroup>
        </Col>
      </Row>
    );
  }
};
