import { SimpleChange, ViewContainerRef, ComponentRef } from '@angular/core';

export const refreshProps = (
  componentChange: SimpleChange | null,
  componentArgsChange: SimpleChange | null,
  container: ViewContainerRef | null | undefined
) => {
  let componentRef: ComponentRef<any> | null = null;

  if (
    container &&
    componentChange?.currentValue &&
    componentArgsChange?.currentValue
  ) {
    container.clear();
    componentRef = container.createComponent(
      componentChange.currentValue
    ) as ComponentRef<any>;

    if (componentArgsChange.currentValue && componentRef) {
      Object.keys(componentArgsChange.currentValue).forEach((key) => {
        componentRef!.instance[key] = componentArgsChange.currentValue[key];
      });
    }
  }

  return componentRef;
};
