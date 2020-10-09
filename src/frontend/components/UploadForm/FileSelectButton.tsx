import { ChangeEvent } from 'react';
import styled from 'styled-components';
import HashUtils from '@utils/HashUtils';
import { Theme } from '@components/ThemeProvider';

const ButtonWrapper = styled.label`
  position: relative;
  padding: 8px 16px;
  font-size: 18px;
  font-weight: 400;

  text-align: center;
  color: ${(props: Theme) => props.theme.uploadForm.fileSelect.text};
  background: ${(props: Theme) => props.theme.uploadForm.fileSelect.background.inactive};
  cursor: pointer;
  transition: background-color ${(props: Theme) => props.theme.transition};

  & > span {
    line-height: 32px;
  }

  &:hover {
    background: ${(props: Theme) => props.theme.uploadForm.fileSelect.background.active};
  }
`;

const Input = styled.input.attrs({ type: 'file' })`
  width: 0;
  height: 0;
  position: absolute;
`;

interface FileSelectButtonProps {
  children: string;
  accept: string;
  multiple: boolean;
  handler: (event: ChangeEvent<HTMLInputElement>) => void;
}

const FileSelectButton = ({ children, accept, multiple, handler }: FileSelectButtonProps) => {
  const id = HashUtils.genHash(children, 36);

  return (
    <ButtonWrapper htmlFor={id}>
      <span>{children}</span>
      <Input id={id} accept={accept} multiple={multiple} onChange={handler} />
    </ButtonWrapper>
  );
};

export default FileSelectButton;
