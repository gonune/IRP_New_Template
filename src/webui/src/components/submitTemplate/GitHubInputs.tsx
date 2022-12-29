import { FormGroup, Input, Label } from 'reactstrap';

interface GitHubInputsProps {
  visible: boolean;
  handleChange: Function;
  repoOwnerState: string;
  repoNameState: string;
}

export const GitHubInputs: React.FC<GitHubInputsProps> = ({
  visible,
  handleChange,
  repoOwnerState,
  repoNameState
}) => {
  if (!visible) {
    return null;
  } else {
    return (
      <FormGroup>
        <Label>
          <span style={{ color: 'red' }}>*</span> Repository owner
        </Label>
        <Input
          name="repo-owner"
          type="text"
          value={repoOwnerState}
          onChange={(event) => handleChange(event)}
        />
        <Label>
          <span style={{ color: 'red' }}>*</span> Repository name
        </Label>
        <Input
          name="repo-name"
          type="text"
          placeholder="Repository name..."
          value={repoNameState}
          onChange={(event) => handleChange(event)}
        />
      </FormGroup>
    );
  }
};
