### Semester 5 — Lesson 1: TypeScript + React mental model

#### TypeScript runtime model

- TypeScript is transformed into JavaScript before browser execution.
- Type-only constructs such as `interface` are erased at runtime.
- JSX/TSX is transformed into JavaScript that creates React element descriptions.

#### React component model

- A function component is invoked again on each render.
- Components return React element descriptions, not DOM directly.
- `<Component />` creates a React-managed component boundary.
- Calling `Component()` directly is just a normal JavaScript function call.

#### Props

- Props flow from parent to child.
- Parent owns/provides prop values.
- Child treats props as input/read-only data.

#### Local variables vs state

```text
local variable
→ belongs to one render invocation
→ not preserved across rerenders

React state
→ preserved by React across renders
```

#### `useState`

```tsx
const [count, setCount] = useState(0);
```

- `count` = state snapshot for the current render.
- `setCount(...)` schedules a state update.
- State is not mutated immediately inside the current handler.

#### Functional state updates

```tsx
setCount(count + 1);
```

uses the current render snapshot.

```tsx
setCount((c) => c + 1);
```

uses the latest queued state value.

Use functional updates when the new state depends on previous state.

#### Render lifecycle

```text
event handler
→ schedule state update
→ handler finishes
→ render
→ DOM commit
→ effect
```

#### `useEffect`

- Used to synchronize React with external systems/state.
- Examples: browser APIs, timers, WebSockets, event listeners, external libraries, network side effects.
- Runs after render/commit.
- Avoid it for values directly derivable from existing props/state.

Prefer:

```tsx
const fullName = `${firstName} ${lastName}`;
```

over maintaining duplicated derived state with an effect.

#### Effect dependencies

- Dependency array controls when the effect runs again.
- It does not control whether React rerenders.
- `setState` may schedule rerendering.
- Repeatedly setting the same state value can let React bail out.

#### Component state isolation

- Each rendered component identity has its own state.
- Two `<Counter />` components do not share state unless state is lifted/shared explicitly.
