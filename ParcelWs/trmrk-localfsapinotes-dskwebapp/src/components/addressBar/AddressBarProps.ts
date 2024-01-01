export interface AddressBarProps {
  address: string;
  isEditMode?: boolean | null | undefined;
  isEditable?: boolean | null | undefined;
  className: string;
  addressValidator: (newAddress: string) => string | null;
  onAddressChanged: (newAddress: string) => void;
}
