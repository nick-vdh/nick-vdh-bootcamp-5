# Discovered Code Patterns

Accumulate verified, reusable patterns here. Prefer guidance that applies to multiple changes over one-off implementation details. Update or remove entries when the codebase or its conventions change.

## Pattern Template

### [Pattern name]
- **Context:** Where or when this pattern applies.
- **Problem:** The issue or ambiguity it addresses.
- **Solution:** The recommended approach and its rationale.
- **Example:** A short code example or a concrete reference to existing code.
- **Related files:** Paths to relevant implementation and tests.

## Service initialization: empty array vs. null

- **Context:** Initializing a service property that represents a collection, such as an in-memory list of todos.
- **Problem:** Using `null` for a collection that is ready but currently has no items forces callers to handle an extra state and can cause errors when they iterate or call collection methods.
- **Solution:** Initialize an available collection to an empty array (`[]`). Reserve `null` for a meaningful distinct state, such as data that has not been loaded or a value that is intentionally absent. Keep the state model consistent with the service contract.
- **Example:**

  ```js
  class TodoService {
    constructor() {
      this.todos = [];
    }
  }
  ```

- **Related files:** Add the owning service and its tests here when applying or confirming this pattern in the codebase.
