import React, { useState } from 'react';
import { Alert } from 'reactstrap';

import { CustomButton } from '../components/genericHOCs/CustomButton';
import { NewTemplateForm } from '../components/newTemplate/NewTemplateForm';
import { ResultModal } from '../components/submitTemplate/ResultModal';

interface OperationButtonsProps {
  handleOperationButtonClick: Function;
  operationSelected: boolean;
}

const OperationButtons: React.FC<OperationButtonsProps> = ({
  handleOperationButtonClick,
  operationSelected
}) => {
  if (!operationSelected) {
    return (
      <div className="text-center mt-5 mb-5">
        <CustomButton
          color="primary"
          className="me-3 pt-2"
          onClick={() => handleOperationButtonClick('new')}
        >
          <h4>Start from scratch</h4>
        </CustomButton>
        <CustomButton
          color="primary"
          className="pt-2"
          onClick={() => handleOperationButtonClick('existing')}
        >
          <h4>Start from an existing template</h4>
        </CustomButton>
      </div>
    );
  } else {
    return null;
  }
};

export const NewTemplatePage: React.FC = () => {
  const [operation, setOperation] = useState<'' | 'new' | 'existing'>('');
  const [operationSelected, setOperationSelected] = useState(false);
  const [resultModal, setResultModal] = useState(false);
  const toggleResultModal = () => setResultModal(!resultModal);
  const [results, setResults] = useState<any>(null);

  const handleOperationButtonClick = (operation: '' | 'new' | 'existing') => {
    setOperation(operation);
    if (operation === '') {
      setOperationSelected(false);
    } else {
      setOperationSelected(true);
    }
  };

  const handleStartOver = () => {};

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
        <h1 className="text-center">Create a new resource template</h1>
        <h4 className="text-center">
          Use this form to create a new, deployable template of cloud resources
        </h4>
        <NewTemplateForm
          toggleModal={toggleResultModal}
          setContents={setResults}
          operation={operation}
          setOperation={setOperation}
          setOperationSelected={setOperationSelected}
        />
        <OperationButtons
          handleOperationButtonClick={handleOperationButtonClick}
          operationSelected={operationSelected}
        />
      </Alert>
      <ResultModal
        modal={resultModal}
        toggleModal={toggleResultModal}
        contents={results}
      />
    </div>
  );
};
