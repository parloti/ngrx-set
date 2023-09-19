/**
 * This is necessary for jasmine to be able to mock modules.
 */
(function patchDefineProperty() {
  ((defineProperty: typeof Object.defineProperty) => {
    Object.defineProperty = <TObject>(
      object: TObject,
      p: PropertyKey,
      attributes: PropertyDescriptor & ThisType<unknown>,
    ) => {
      if (
        Object.prototype.hasOwnProperty.call(attributes, 'value') ||
        Object.prototype.hasOwnProperty.call(attributes, 'writable')
      ) {
        attributes.writable = true;
      }
      attributes.configurable = true;

      return defineProperty(object, p, attributes);
    };
  })(Object.defineProperty.bind(Object.prototype));
})();
