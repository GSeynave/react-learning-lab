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

### Semester 5 — Lesson 2: React data flow and state design

#### State ownership

- Shared state should usually live in the nearest common parent.
- Keep one source of truth; avoid duplicated state across parent/child components.

#### Lifting state up

```text
Parent owns state
→ passes values down through props
→ passes callbacks down for child-triggered updates
```

#### Controlled inputs

```tsx
<input value={name} onChange={(e) => setName(e.target.value)} />
```

- React state is the source of truth.
- `value` controls what is displayed.
- `onChange` updates React state.

#### Child → parent communication

- Parent passes a function as a prop.
- Child calls that function to request a state change.

```tsx
<HeroList onHeroSelected={setSelectedHeroId} />
```

#### Derived state

Avoid storing values that can be calculated from existing state/props.

Prefer:

```tsx
const fullName = `${firstName} ${lastName}`;
```

over duplicated `fullName` state.

#### Object state updates

Treat React state as immutable.

Prefer:

```tsx
setForm((current) => ({
  ...current,
  name: "Jaina",
}));
```

Avoid:

```tsx
form.name = "Jaina";
setForm(form);
```

- `...current` copies fields into a new object.
- React state setters replace object state; they do not automatically merge it.

#### Props copied into state

```tsx
const [name, setName] = useState(hero.name);
```

- `hero.name` is only used as the initial state value.
- Later prop changes do not automatically reset local state.
- Copying props into state can create two sources of truth.

#### Resetting local state

Use `key={hero.id}` when changing entity means a new component identity:

```tsx
<HeroEditor key={hero.id} hero={hero} />
```

A changed key:

```text
old component unmounts
→ new component mounts
→ local state initializes again
```

Use explicit reset when the same component/entity should keep its identity.

#### Forms

```tsx
event.preventDefault();
```

- Prevents the browser's native form submission/navigation.
- Lets React handle submission logic itself.

#### Request state

Typical request-related state:

```text
form
→ user input

loading
→ request in progress

error
→ request failure

response data
→ state only if UI needs to retain/render it
```

#### `fetch`

```tsx
const response = await fetch(...);

if (!response.ok) {
    throw new Error(...);
}
```

- Network failure → Promise rejects.
- HTTP 4xx/5xx → Promise usually resolves.
- `response.ok` is true for successful 2xx responses.
