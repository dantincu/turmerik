import React, { useEffect, useState } from "react";

import Popper from '@mui/material/Popper';
import Box from '@mui/material/Box';
import IconButton from "@mui/material/IconButton";
import CancelIcon from '@mui/icons-material/Cancel';
import ClearIcon from '@mui/icons-material/Clear';
import SubmitIcon from '@mui/icons-material/ArrowForwardIos';
import Input from '@mui/material/Input';

import './styles.scss';

import { AddressBarProps } from "./AddressBarProps";

const EditableAddressBar = ({
    address,
    className,
    addressValidator,
    onAddressChanged,
    onEditCanceled
  }: {
    address: string,
    className: string,
    addressValidator: (newAddress: string) => string | null,
    onAddressChanged: (newAddress: string) => void,
    onEditCanceled: () => void
  }) => {
  const [ editedAddress, setEditedAddress ] = useState(address);
  const [ validationErr, setValidationErr ] = useState<string | null>(null);

  const updateText = (newValue: string) => {
    setEditedAddress(newValue);
    const validationErrMsg = addressValidator(newValue);

    if (validationErrMsg !== validationErr) {
      setValidationErr(validationErrMsg);
    }
  }

  const hasError = typeof validationErr === "string";
  let textInputRef = React.useRef<HTMLInputElement>();

  const onTextChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateText(e.target.value);
  };

  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Enter":
        if (!hasError) {
          onAddressChanged((e.currentTarget).value);
        }
        break;
      case "Escape":
        onEditCanceled();
        break;
    }
  }

  const onSubmit = () => {
    onAddressChanged(editedAddress);
  }

  const onClearText = () => {
    updateText("");
  }

  useEffect(() => {
    textInputRef.current?.select();
  }, []);

  return (<div className={["trmrk-address-bar", "trmrk-edtbl", className].join(" ")}>
      <IconButton onClick={onEditCanceled} sx={{ position: "absolute", left: "0em", top: "-0.4em" }}><CancelIcon /></IconButton>
      <Popper
        open={hasError}
        anchorEl={textInputRef.current}
      >
        <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper', color: "red" }}>{validationErr}</Box>
      </Popper>
      <Input type="text" className="trmrk-text-box" value={editedAddress} onChange={onTextChanged} onKeyUp={onKeyUp} inputRef={textInputRef} />
      <IconButton onClick={onClearText} sx={{ position: "absolute", left: "1.5em", top: "-0.4em" }}><ClearIcon /></IconButton>
      <IconButton onClick={onSubmit} disabled={hasError} sx={{ position: "absolute", right: "0px", top: "-0.4em" }}><SubmitIcon /></IconButton>
    </div>);
}

const ReadonlyAddressBar = ({
    address,
    className,
    onEditRequested
  }: {
    address: string,
    className: string,
    onEditRequested: () => void
  }) => {

  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Enter":
        onEditRequested();
        break;
    }
  }
  return (<div className={["trmrk-address-bar", "trmrk-rdnl", className].join(" ")}>
    <Input type="text" readOnly={true} value={address} className="trmrk-text-box" onClick={onEditRequested} onKeyUp={onKeyUp} /></div>);
}

export default function AddressBar (props: AddressBarProps) {
  const [ isEditMode, setIsEditMode ] = useState(props.isEditMode ?? false);
  const [ address, setAddress ] = useState(props.address);
  
  useEffect(() => {
    if (address !== props.address) {
      setAddress(props.address);
      setIsEditMode(false);
    }
  }, [ props ]);

  const onEditRequested = () => {
    if (props.isEditable ?? true) {
      setIsEditMode(true);
    }
  }

  const onEditCanceled = () => {
    setIsEditMode(false);
  }

  const onAddressChanged = (newAddress: string) => {
    setAddress(newAddress);
    setIsEditMode(false);
    props.onAddressChanged(newAddress);
  }

  if (isEditMode) {
    return (<EditableAddressBar
      address={address}
      className={props.className}
      addressValidator={props.addressValidator}
      onAddressChanged={onAddressChanged}
      onEditCanceled={onEditCanceled} />);
  } else {
    return (<ReadonlyAddressBar
      address={address}
      className={props.className}
      onEditRequested={onEditRequested} />);
  }
};
