import { Row, Col, FormGroup, Input, Label, ButtonGroup } from 'reactstrap';

import { SupportedResourceTypes, Database } from '../../types/Resources';
import { CustomButton } from '../genericHOCs/CustomButton';

interface DatabaseInputsProps {
  resourceType: SupportedResourceTypes;
  resourceList: any; // HACK
  resourceIndex: number;
  handleChange: Function;
  addDBToPG?: Function;
  removeDBFromPG?: Function;
  addFWRuleToPG?: Function;
  removeFWRuleFromPG?: Function;
}

export const DatabaseInputs: React.FC<DatabaseInputsProps> = ({
  resourceType,
  resourceList,
  resourceIndex,
  handleChange,
  addDBToPG,
  removeDBFromPG,
  addFWRuleToPG,
  removeFWRuleFromPG
}) => {
  if (resourceType !== 'PG') {
    return null;
  } else {
    const dbNamesObj = resourceList[resourceIndex].databaseNames;
    let dbNamesList: any = [];
    for (const [key, value] of Object.entries(dbNamesObj)) {
      dbNamesList.push({ [`${key}`]: value });
    }

    const fwRulesObj = resourceList[resourceIndex].firewallRules;
    let fwRulesList: any = [];
    for (const [key, value] of Object.entries(fwRulesObj)) {
      fwRulesList.push({ [`${key}`]: value });
    }

    // HACK: We know that we will have it because we fed it as a prop
    // from ResourceInputs but TypeScript doesn't know that
    if (addDBToPG && removeDBFromPG && addFWRuleToPG && removeFWRuleFromPG) {
      return (
        <Row className="mt-3">
          <Col>
            <FormGroup>
              <Label className="h5">Databases</Label>
              <br />
              {dbNamesList.map((obj: any, index: number) => (
                <Row key={Object.keys(obj)[0]}>
                  <Col>
                    <Input
                      id={Object.keys(obj)[0]}
                      name={Object.keys(obj)[0]}
                      type="text"
                      placeholder="Enter a database name..."
                      value={
                        resourceList[resourceIndex].databaseNames[
                          `${Object.keys(obj)[0]}`
                        ]
                      }
                      onChange={(event) => handleChange('PG', event)}
                    />
                  </Col>
                  <Col>
                    <CustomButton
                      color="primary"
                      outline
                      onClick={() =>
                        removeDBFromPG(
                          resourceIndex,
                          Number(Object.keys(obj)[0].split('-')[3])
                        )
                      }
                    >
                      -
                    </CustomButton>
                  </Col>
                </Row>
              ))}
              <CustomButton
                className="mt-1"
                color="primary"
                outline
                disabled={
                  true
                    ? resourceList[resourceIndex].databaseNames[
                        `${Object.keys(dbNamesObj)[0]}`
                      ] === ''
                    : false
                }
                onClick={() => addDBToPG(resourceIndex)}
              >
                +
              </CustomButton>
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label className="h5">Firewall rules</Label>
              <br />
            </FormGroup>
            {fwRulesList.map((obj: any, index: number) => (
              <Row key={Object.keys(obj)[0]}>
                <Row></Row>
                <Col>
                  <Input
                    id={`${Object.keys(obj)[0]}-name`}
                    name={`${Object.keys(obj)[0]}-name`}
                    type="text"
                    placeholder="Name..."
                    value={
                      resourceList[resourceIndex].firewallRules[
                        `${Object.keys(obj)[0]}`
                      ].name
                    }
                    onChange={(event) => handleChange('PG', event)}
                  />
                </Col>
                <Col>
                  <Input
                    id={`${Object.keys(obj)[0]}-startIP`}
                    name={`${Object.keys(obj)[0]}-startIP`}
                    type="text"
                    placeholder="Starting IP..."
                    value={
                      resourceList[resourceIndex].firewallRules[
                        `${Object.keys(obj)[0]}`
                      ].startIpAddress
                    }
                    onChange={(event) => handleChange('PG', event)}
                  />
                </Col>
                <Col>
                  <Input
                    id={`${Object.keys(obj)[0]}-endIP`}
                    name={`${Object.keys(obj)[0]}-endIP`}
                    type="text"
                    placeholder="Ending IP..."
                    value={
                      resourceList[resourceIndex].firewallRules[
                        `${Object.keys(obj)[0]}`
                      ].endIpAddress
                    }
                    onChange={(event) => handleChange('PG', event)}
                  />
                </Col>
                <Col>
                  <CustomButton
                    color="primary"
                    outline
                    onClick={() =>
                      removeFWRuleFromPG(
                        resourceIndex,
                        Number(Object.keys(obj)[0].split('-')[3])
                      )
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
                  ? resourceList[resourceIndex].firewallRules &&
                    Object.keys(fwRulesObj).length > 0 &&
                    resourceList[resourceIndex].firewallRules[
                      `${Object.keys(fwRulesObj)[0]}`
                    ].name === ''
                  : false
              }
              onClick={() => addFWRuleToPG(resourceIndex)}
            >
              +
            </CustomButton>
          </Col>
        </Row>
      );
    }
  }

  return null;
};
