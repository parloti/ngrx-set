export const updateState = <TState>(
  state: TState,
  update?: Partial<TState>,
) => ({
  ...state,
  ...update,
});
