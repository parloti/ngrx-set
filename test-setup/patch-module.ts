export function patchModule() {
  ((defineProperty: typeof Object.defineProperty) => {
    Object.defineProperty = <TObject>(
      object: TObject,
      p: PropertyKey,
      attributes: PropertyDescriptor & ThisType<unknown>,
    ) => {
      const _attr = { ...attributes };
      if (
        Object.prototype.hasOwnProperty.call(attributes, 'value') ||
        Object.prototype.hasOwnProperty.call(attributes, 'writable')
      ) {
        _attr.writable = true;
      }
      _attr.configurable = true;
      try {
        return defineProperty(object, p, _attr);
      } catch {
        return defineProperty(object, p, attributes);
      }
    };
  })(Object.defineProperty);
}
