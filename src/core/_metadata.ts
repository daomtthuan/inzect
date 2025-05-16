if (!Symbol.metadata) {
  const SymbolMetadata = Symbol('Symbol.metadata');
  Object.defineProperty(Symbol, 'metadata', {
    value: SymbolMetadata,
    enumerable: false,
    writable: false,
    configurable: false,
  });
}
