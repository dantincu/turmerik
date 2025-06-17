import { SimpleChange, ViewContainerRef, ComponentRef } from '@angular/core';

export const refreshProps = (
  componentChange: SimpleChange | null,
  componentArgsChange: SimpleChange | null,
  container: ViewContainerRef,
  componentRef: ComponentRef<any> | null | undefined
) => {
  if (componentChange?.currentValue && componentArgsChange?.currentValue) {
    container.clear();
    componentRef = container.createComponent(componentChange.currentValue);

    if (componentArgsChange.currentValue && componentRef) {
      Object.keys(componentArgsChange.currentValue).forEach((key) => {
        componentRef!.instance[key] = componentArgsChange.currentValue[key];
      });
    }
  }
};
