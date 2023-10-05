(function () {
  const OriginalPromise = window.Promise;

  const contextStacks = new WeakMap();

  function TrackedPromise(executor) {
    // Capture the current stack trace or context
    const invocationContext = new Error("Promise was created in this context");

    function wrappedExecutor(resolve, reject) {
      return executor(
        (value) => {
          // You can do something with invocationContext here if needed
          return resolve(value);
        },
        (reason) => {
          console.error("Promise rejected:", invocationContext.stack);
          if (reason instanceof Error) {
            const stack = contextStacks.get(reason) || [];
            stack.push(invocationContext);
            contextStacks.set(reason, stack); // TODO: should we override error printing to include the extended stack? e.g. https://github.com/ethangclark/error-ctx/blob/main/index.js#L124 // OR maybe JUST override .stack?
          }
          return reject(reason);
        }
      );
    }

    return new OriginalPromise(wrappedExecutor);
  }

  // TODO: this is not all methods
  TrackedPromise.resolve = OriginalPromise.resolve;
  TrackedPromise.reject = OriginalPromise.reject;
  TrackedPromise.all = OriginalPromise.all;
  TrackedPromise.race = OriginalPromise.race;

  // Replace the native Promise with our wrapped version
  window.Promise = TrackedPromise;
})();

// TODO: setTimeout and setInterval support as well
