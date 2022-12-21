import React, { useState } from 'react';
import {
  Alert,
  Row,
  Col,
  Form,
  FormText,
  FormGroup,
  Input,
  Label
} from 'reactstrap';

import { CustomButton } from '../components/HOCs/CustomButton';

export const NewTemplatePage: React.FC = () => {
  // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const { target } = event;
  //   const { name } = target;

  //   setRoleSelections([...roleSelections, name]);
  // };

  // const submitForm = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   // Prevents the submit button from refreshing the page
  //   event.preventDefault();
  //   // Update the user's roles in the state store
  //   updateRoles(roleSelections);
  //   // Make sure the tooltip gets shut
  //   setTooltipOpen(false);
  //   toggleModal();
  // };
  return (
    <div>
      <Alert
        color="secondary"
        isOpen={true}
        style={{
          marginTop: 50,
          margin: 'auto',
          width: '70%',
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
                      </Row>
                    </FormGroup>
                    <div>
                      <CustomButton color="primary" outline>
                        + Add another set
                      </CustomButton>
                    </div>
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
                  <Input type="checkbox" checked />{' '}
                  <Label check className="h4">
                    Do you need a Storage Account?
                  </Label>
                </FormGroup>
              </Row>
              <Row>
                <Col>
                  <FormGroup>
                    <Label className="h5">
                      <span style={{ color: 'red' }}>*</span> Name
                    </Label>
                    <Input id="sa1" name="sa1" placeholder="Enter a name..." />
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
                      </Row>
                    </FormGroup>
                    <div>
                      <CustomButton color="primary" outline>
                        + Add another set
                      </CustomButton>
                    </div>
                  </Row>
                </Col>
              </Row>
              <div className="text-center mt-4 mb-4">
                <CustomButton color="primary">+ Add another</CustomButton>
              </div>
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
