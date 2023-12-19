import React, { useEffect, useState, useRef } from "react";

import Paper from "@mui/material/Paper";
import Popover from '@mui/material/Popover';
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CancelIcon from '@mui/icons-material/Cancel';
import ClearIcon from '@mui/icons-material/Clear';
import SubmitIcon from '@mui/icons-material/ArrowForwardIos';

import { AddressBarProps } from "./AddressBarProps";

const EditableAddressBar = ({
    address,
    addressValidator,
    onAddressChanged,
    onEditCanceled
  }: {
    address: string,
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
  const textInput = useRef<HTMLInputElement>(null);

  const onTextChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateText(e.target.value);
  };

  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Enter":
        if (!hasError) {
          onAddressChanged((e.target as HTMLInputElement).value);
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
    textInput.current?.select();
  }, []);

  return (<div className="trmrk-edtbl">
      <IconButton onClick={onEditCanceled}><CancelIcon /></IconButton>
      <Popover
        open={hasError}
        anchorEl={textInput.current}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Typography sx={{ color: "red" }}>{validationErr}</Typography>
      </Popover>
      <input type="text" value={editedAddress} onChange={onTextChanged} ref={textInput} onKeyUp={onKeyUp} />
      <IconButton onClick={onClearText}><ClearIcon /></IconButton>
      <IconButton onClick={onSubmit} disabled={hasError}><SubmitIcon /></IconButton>
    </div>);
}

const ReadonlyAddressBar = ({
    address,
    onEditRequested
  }: {
    address: string,
    onEditRequested: () => void
  }) => {

  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Enter":
        onEditRequested();
        break;
    }
  }
  return (<div className="trmrk-rdnl"><input type="text" onClick={onEditRequested} value={address} readOnly={true} onKeyUp={onKeyUp} /></div>);
}

export default function AddressBar (props: AddressBarProps) {
  const [ isEditMode, setIsEditMode ] = useState(props.isEditMode ?? false);
  const [ address, setAddress ] = useState(props.address);

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

  return (
    <div className={["trmrk-address-bar", props.className].join(" ")}>
      <label>{props.label}</label> {
      isEditMode ?
        <EditableAddressBar
          address={address}
          addressValidator={props.addressValidator}
          onAddressChanged={onAddressChanged}
          onEditCanceled={onEditCanceled} /> : 
        <ReadonlyAddressBar
          address={address}
          onEditRequested={onEditRequested} />
      } </div>);
};
