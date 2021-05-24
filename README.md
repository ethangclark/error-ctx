# error-ctx

Adds a .ctx field to promise errors that has context information

```js
import errorCtx from 'error-ctx'

// Make sure you call this at the very beginning of your program!
// It overrides default promise impl. to add error.ctx information.
// If it's called after references to Promise have been made, it won't work.
errorCtx.initialize()

/*
returns { message: string, stack: string[] }

If myError originated in a promise, the stack will contain information on where it originated
(unline the default promise stack trace impl)

call getErrorJson(myError, true) to include node_modules and other verbose stack lines in the stack
*/
const errorJson = errorCtx.getErrorJson(myError)
console.log(JSON.stringify(errorJson, null, 2))
```
